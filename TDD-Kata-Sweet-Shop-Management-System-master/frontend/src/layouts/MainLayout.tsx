import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, IconButton, Badge } from '@mui/material';
import { ShoppingCart, AccountCircle } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const isAuthenticated = false; // This will be replaced with actual auth state
  const cartItemCount = 0; // This will be replaced with actual cart state

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Sweet Shop
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              <Button
                component={RouterLink}
                to="/sweets"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Sweets
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <IconButton component={RouterLink} to="/cart" color="inherit">
                <Badge badgeContent={cartItemCount} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              
              {isAuthenticated ? (
                <IconButton component={RouterLink} to="/profile" color="inherit">
                  <AccountCircle />
                </IconButton>
              ) : (
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{ color: 'white', ml: 1 }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 3, backgroundColor: (theme) => theme.palette.grey[200], mt: 'auto' }}>
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Sweet Shop. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
