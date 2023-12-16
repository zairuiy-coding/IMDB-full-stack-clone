import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h6'}
      noWrap
      sx={{
        marginRight: '40px',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 600,
        letterSpacing: '.1rem',
        color: '#ffffff',
        '& a': {
          color: 'inherit',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          '&:hover': {
            color: '#ff0000',
          },
        },
      }}
    >
      <NavLink to={href}>{text}</NavLink>
    </Typography>
  );
}
// '#2196f3' #27ae60
export default function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor:'#000000' , borderBottom: '2px solid #000000' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h4" sx={{ flexGrow: 1, fontFamily: 'Pacifico, cursive', color: '#ffffff' }}>
            PMDB
          </Typography>
          <NavText href="/movie" text="Movies" />
          <NavText href="/short" text="Shorts" />
          <NavText href="/TVSeries" text="TV Series" />
          <NavText href="/search_productions" text="Search Productions" />
          <NavText href="/search_people" text="Search People" />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
