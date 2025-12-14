import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Button, 
  Paper, 
  Step, 
  StepLabel, 
  Stepper, 
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { saveShippingAddress, savePaymentMethod } from '../../store/slices/cartSlice';
import { RootState } from '../../store/store';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';

const ShippingPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { shippingAddress } = useSelector((state: RootState) => state.cart);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/payment');
  };

  return (
    <Box maxWidth="md" sx={{ mx: 'auto', p: 3 }}>
      <CheckoutSteps activeStep={0} />
      
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Shipping
        </Typography>
        
        <Box component="form" onSubmit={submitHandler} sx={{ mt: 3 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          
          <TextField
            required
            fullWidth
            margin="normal"
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          
          <TextField
            required
            fullWidth
            margin="normal"
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          
          <TextField
            required
            fullWidth
            margin="normal"
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Payment Method</FormLabel>
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
          </Box>
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            Continue
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ShippingPage;
