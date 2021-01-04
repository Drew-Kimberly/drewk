import { AppBar, Toolbar } from '@material-ui/core';
import React from 'react';

/* eslint-disable-next-line */
export interface NavbarProps {}

export function Navbar(props: NavbarProps) {
  return (
    <AppBar position="static">
      <Toolbar></Toolbar>
    </AppBar>
  );
}

export default Navbar;
