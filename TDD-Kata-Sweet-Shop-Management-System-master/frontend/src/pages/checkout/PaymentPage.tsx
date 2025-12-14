import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Card,
  CardContent,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress
} from '@mui/material';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { RootState } from '../../store/store';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import { createOrder } from '../../store/actions/orderActions';

export interface OrderData {
  orderItems: Array<{
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

const PaymentPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, shippingAddress, paymentMethod: paymentMethodFromStore } = useSelector(
    (state: RootState) => state.cart
  );
  const { userInfo } = useSelector((state: RootState) => state.auth);
  
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodFromStore || 'PayPal');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  
  if (!shippingAddress) {
    navigate('/shipping');
  }
  
  if (cartItems.length === 0) {
    navigate('/cart');
  }
  
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  
  const orderData: OrderData = {
    orderItems: cartItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item._id,
    })),
    shippingAddress: shippingAddress!,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
  
  const handlePaymentSuccess = async (paymentResult: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Here you would typically dispatch the createOrder action
      // and handle the response
      // await dispatch(createOrder({ ...orderData, paymentResult }));
      
      setSucceeded(true);
      setLoading(false);
      
      // Clear cart and redirect to order success page
      // dispatch(clearCart());
      navigate(`/order/${'orderId'}`); // Replace with actual order ID
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing payment');
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle manual payment method submission if needed
  };

  return (
    <Box maxWidth="md" sx={{ mx: 'auto', p: 3 }}>
      <CheckoutSteps activeStep={2} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Payment Method
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <form onSubmit={handleSubmit}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Select Payment Method</FormLabel>
                <RadioGroup 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel 
                    value="PayPal" 
                    control={<Radio />} 
                    label="PayPal or Credit Card" 
                  />
                  <FormControlLabel 
                    value="Stripe" 
                    control={<Radio />} 
                    label="Stripe" 
                  />
                </RadioGroup>
              </FormControl>
              
              {paymentMethod === 'PayPal' && (
                <Box sx={{ mt: 3 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  
                  {loading && <CircularProgress />}
                  
                  {!succeeded && !loading && (
                    <PayPalScriptProvider options={{ 'client-id': 'your-paypal-client-id' }}>
                      <PayPalButtons
                        style={{ layout: 'vertical' }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: totalPrice.toString(),
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          const details = await actions.order!.capture();
                          handlePaymentSuccess(details);
                        }}
                        onError={(err: any) => {
                          setError(err.message || 'Something went wrong with PayPal');
                        }}
                      />
                    </PayPalScriptProvider>
                  )}
                </Box>
              )}
              
              {paymentMethod === 'Stripe' && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    margin="normal"
                    placeholder="1234 5678 9012 3456"
                  />
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                    />
                    <TextField
                      fullWidth
                      label="CVC"
                      placeholder="123"
                    />
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </Button>
                </Box>
              )}
            </form>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <List disablePadding>
                {cartItems.map((item) => (
                  <ListItem key={item._id} sx={{ py: 1, px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 16 }}
                      />
                      <Typography variant="body2">
                        {item.name} × {item.qty}
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 'auto' }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Subtotal" />
                  <Typography>${itemsPrice.toFixed(2)}</Typography>
                </ListItem>
                
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Shipping" />
                  <Typography>${shippingPrice.toFixed(2)}</Typography>
                </ListItem>
                
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Tax (15%)" />
                  <Typography>${taxPrice.toFixed(2)}</Typography>
                </ListItem>
                
                <Divider sx={{ my: 2 }} />
                
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary={
                      <Typography variant="h6" color="primary">
                        Total
                      </Typography>
                    } 
                  />
                  <Typography variant="h6" color="primary">
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentPage;
