import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export type IconProps = React.AllHTMLAttributes<HTMLSpanElement> & {
  color?: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
  },
  svg: {
    display: 'block',
    pointerEvents: 'none',
    fill: (props: IconProps) => props.color || theme.palette.primary.main,
  },
}));

export function createIcon(
  displayName: string,
  content: (
    title: string
  ) => React.ReactElement<React.SVGProps<React.ReactSVGElement>>
) {
  const Icon: React.FunctionComponent<IconProps> = ({
    size = null,
    alt,
    width = null,
    height = null,
    as,
    ...spanProps
  }) => {
    const classes = useStyles(spanProps);

    const svgProps: React.SVGProps<React.ReactSVGElement> = {
      role: 'img',
    };

    if (size != null) {
      svgProps.width = size;
      svgProps.height = size;
    }

    if (width) {
      svgProps.width = width;
    }
    if (height) {
      svgProps.height = height;
    }

    return (
      <span {...spanProps} className={classes.root}>
        {React.cloneElement(content(alt || displayName), {
          ...svgProps,
          className: classes.svg,
        })}
      </span>
    );
  };

  Icon.displayName = displayName;
  return Icon;
}
