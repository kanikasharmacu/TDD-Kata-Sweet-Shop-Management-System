import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order, { IOrder, IOrderItem } from '../models/order.model';
import Sweet from '../models/sweet.model';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req: Request, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // Verify all items are in stock
    for (const item of orderItems) {
      const sweet = await Sweet.findById(item.sweet);
      if (!sweet || sweet.stock < item.qty) {
        res.status(400);
        throw new Error(`Insufficient stock for ${sweet?.name || 'item'}`);
      }
    }

    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((x: IOrderItem) => ({
        ...x,
        sweet: x.sweet,
        price: x.price,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Update stock levels
    for (const item of orderItems) {
      const sweet = await Sweet.findById(item.sweet);
      if (sweet) {
        sweet.stock -= item.qty;
        await sweet.save();
      }
    }

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Restore stock if order is deleted
    if (!order.isPaid) {
      for (const item of order.orderItems) {
        const sweet = await Sweet.findById(item.sweet);
        if (sweet) {
          sweet.stock += item.qty;
          await sweet.save();
        }
      }
    }
    
    await order.remove();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get monthly income (for admin dashboard)
// @route   GET /api/orders/income
// @access  Private/Admin
export const getMonthlyIncome = asyncHandler(async (req: Request, res: Response) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const income = await Order.aggregate([
    { $match: { createdAt: { $gte: lastYear }, isPaid: true } },
    {
      $project: {
        month: { $month: "$createdAt" },
        sales: "$totalPrice",
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ]);

  res.json(income);
});
