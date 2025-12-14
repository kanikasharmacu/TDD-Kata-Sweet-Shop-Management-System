import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Divider, 
  Grid, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  TextField, 
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import { addToCart, removeFromCart, calculatePrices } from '../../store/slices/cartSlice';
import { Sweet } from '../../types/sweet';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(calculatePrices());
  }, [dispatch, cartItems]);

  const addToCartHandler = (product: Sweet, qty: number) => {
    dispatch(addToCart({ item: product, qty }));
  };

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      
      {cartItems.length === 0 ? (
        <Box textAlign="center" py={5}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/"
            sx={{ mt: 2 }}
          >
            Go Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 16 }} 
                              />
                              <Typography variant="body1">{item.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <IconButton 
                                size="small" 
                                onClick={() => addToCartHandler(item, -1)}
                                disabled={item.qty <= 1}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <TextField
                                size="small"
                                value={item.qty}
                                inputProps={{ 
                                  style: { textAlign: 'center', width: 40 },
                                  readOnly: true
                                }}
                                variant="outlined"
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => addToCartHandler(item, 1)}
                                disabled={item.qty >= item.countInStock}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            ${(item.price * item.qty).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              color="error" 
                              onClick={() => removeFromCartHandler(item._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <List disablePadding>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="subtitle1">
                      ${cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Shipping" />
                    <Typography variant="subtitle1">
                      ${(cartItems.length > 0 ? 10 : 0).toFixed(2)}
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Tax (15%)" />
                    <Typography variant="subtitle1">
                      ${(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) * 0.15).toFixed(2)}
                    </Typography>
                  </ListItem>
                  <Divider sx={{ my: 2 }} />
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="h6" color="primary">
                      ${(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) * 1.15 + (cartItems.length > 0 ? 10 : 0)).toFixed(2)}
                    </Typography>
                  </ListItem>
                </List>
                
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                  sx={{ mt: 3 }}
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/"
                  sx={{ mt: 2 }}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Cart;
