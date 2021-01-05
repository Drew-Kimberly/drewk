import React from 'react';
import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import { MenuOutlined } from '@material-ui/icons';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';

import BrandedAppHome from '../branded-app-home/branded-app-home';

export interface NavbarProps {
  appName?: string;
  leftMenuConfig?: boolean;
  onHomeClick(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      color: theme.palette.primary.main,
      marginRight: theme.spacing(2),
    },
    toolbar: {
      maxHeight: 64,
    },
  })
);

export function Navbar(props: NavbarProps) {
  const classes = useStyles();

  return (
    <AppBar position="static" color="transparent">
      <Toolbar className={classes.toolbar}>
        {props.leftMenuConfig && (
          <IconButton
            edge="start"
            className={classes.menuButton}
            aria-label="menu"
          >
            <MenuOutlined />
          </IconButton>
        )}
        <BrandedAppHome appName={props.appName} onClick={props.onHomeClick} />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
