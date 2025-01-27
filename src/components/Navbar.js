import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CssBaseline,
  Box,
} from '@mui/material';
import { Menu, Home, Group } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

const NAV_ITEMS = [
  { title: 'Bosh sahifa', icon: <Home />, path: '/' },
  { title: 'employes', icon: <Group />, path: '/employes' },
  { title: 'Sorovnomalar', icon: <RequestQuoteIcon />, path: '/requests' },
];

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const router = useRouter();

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap>
            <span className="select-none">Admin panel</span>
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={isDrawerOpen}
        sx={{
          width: isDrawerOpen ? 240 : 70,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isDrawerOpen ? 240 : 70,
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <List>
          {NAV_ITEMS.map((item, index) => (
            <ListItem
              component="div"
              key={index}
              onClick={() => handleNavigate(item.path)}
              sx={{
                display: 'flex',
                justifyContent: isDrawerOpen ? 'flex-start' : 'center',
                paddingTop: '10px 16px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ justifyContent: 'center' }}>{item.icon}</ListItemIcon>
              {isDrawerOpen && <ListItemText primary={item.title} />}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Navbar;
