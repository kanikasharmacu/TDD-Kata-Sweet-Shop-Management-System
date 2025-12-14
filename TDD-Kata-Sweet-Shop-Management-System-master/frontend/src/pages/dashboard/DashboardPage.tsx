import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../../store/slices/authSlice';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ShoppingCart,
  Store,
  People,
  Receipt,
  Logout,
  MenuBook,
} from '@mui/icons-material';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);

  const handleLogout = () => {
    // @ts-ignore - We'll fix the type issue after installing dependencies
    dispatch(logout());
    navigate('/login');
  };

  const features = [
    {
      title: 'Sweets Catalog',
      description: 'Browse and manage our delicious selection of sweets',
      icon: <MenuBook fontSize="large" color="primary" />,
      path: '/sweets',
      roles: ['admin', 'customer'],
    },
    {
      title: 'Orders',
      description: 'View and manage your orders',
      icon: <Receipt fontSize="large" color="primary" />,
      path: '/orders',
      roles: ['admin', 'customer'],
    },
    {
      title: 'Manage Sweets',
      description: 'Add, edit, or remove sweets from the catalog',
      icon: <Store fontSize="large" color="primary" />,
      path: '/admin/sweets',
      roles: ['admin'],
    },
    {
      title: 'Manage Users',
      description: 'Manage user accounts and permissions',
      icon: <People fontSize="large" color="primary" />,
      path: '/admin/users',
      roles: ['admin'],
    },
  ];

  const userFeatures = features.filter((feature) =>
    feature.roles.includes(user?.role || '')
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user?.role === 'admin' ? 'Administrator Dashboard' : 'Customer Dashboard'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" component="h2" gutterBottom>
        Quick Access
      </Typography>

      <Grid container spacing={3} mt={2}>
        {userFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => navigate(feature.path)}
              style={{ cursor: 'pointer' }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" component="h3">
                    {feature.title}
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Go to {feature.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={6}>
        <Typography variant="h5" component="h2" gutterBottom>
          Recent Activity
        </Typography>
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Your recent activities will appear here.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DashboardPage;
