import React from 'react';
import { Typography } from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';

import { DrewkLogoIcon } from '@drewk/react-ui/icons';

export interface BrandedAppHomeProps {
  appName?: string;
  onClick(): void;
}

const maxHeightPx = 48;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer',
      display: 'inline-flex',
      maxHeight: `${maxHeightPx}px`,
    },
    title: {
      alignSelf: 'center',
      color: theme.palette.primary.main,
      flexGrow: 1,
      fontWeight: 'bold',
      maxWidth: `50vw`,
      overflow: 'hidden',
      paddingLeft: theme.spacing(1.5),
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      },
    },
  })
);

export function BrandedAppHome({ appName, onClick }: BrandedAppHomeProps) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div onClick={onClick} className={classes.root} data-testid="home">
      <DrewkLogoIcon color={theme.palette.primary.main} size={maxHeightPx} />
      {appName && (
        <Typography variant="h4" className={classes.title}>
          {appName}
        </Typography>
      )}
    </div>
  );
}

export default BrandedAppHome;
