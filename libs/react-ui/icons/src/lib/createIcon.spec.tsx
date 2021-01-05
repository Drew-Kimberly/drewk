import React from 'react';
import { render } from '@testing-library/react';

import { createIcon, IconProps } from './createIcon';

const testId = 'test-svg';
let Icon: React.FunctionComponent<IconProps>;

beforeEach(() => {
  Icon = createIcon('SomeIcon', () => <svg data-testid={testId} />);
});

it('should set svg width and height to size', () => {
  const view = render(<Icon size={12} />);
  const svgEl = view.queryByTestId(testId);
  expect(svgEl.getAttribute('height')).toEqual(String(12));
  expect(svgEl.getAttribute('width')).toEqual(String(12));
});

it('should set svg width and height independently', () => {
  const view = render(<Icon width={5} height={10} />);
  const svgEl = view.queryByTestId(testId);
  expect(svgEl.getAttribute('height')).toEqual(String(10));
  expect(svgEl.getAttribute('width')).toEqual(String(5));
});
