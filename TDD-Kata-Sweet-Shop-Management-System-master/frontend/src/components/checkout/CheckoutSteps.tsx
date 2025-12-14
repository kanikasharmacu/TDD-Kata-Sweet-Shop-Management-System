import React from 'react';
import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

interface CheckoutStepsProps {
  activeStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ activeStep = 0 }) => {
  const steps = ['Login', 'Shipping', 'Payment', 'Place Order'];

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step} completed={activeStep > index}>
            <StepLabel 
              StepIconProps={{
                icon: activeStep > index ? <CheckIcon /> : index + 1,
              }}
            >
              <Typography 
                variant="body2" 
                color={activeStep >= index ? 'primary' : 'textSecondary'}
                sx={{ 
                  fontWeight: activeStep === index ? 'bold' : 'normal',
                  textDecoration: activeStep > index ? 'line-through' : 'none'
                }}
              >
                {step}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CheckoutSteps;
