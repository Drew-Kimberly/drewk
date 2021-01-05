import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Navbar, { NavbarProps } from './navbar';

describe('<Navbar />', () => {
  let defaultProps: NavbarProps;

  beforeEach(() => {
    defaultProps = {
      onHomeClick: jest.fn(),
      appName: 'Default App',
      leftMenuConfig: false,
    };
  });

  describe('Branded App Home section', () => {
    it('should display the provided app name', () => {
      // Arrange
      const props: NavbarProps = {
        ...defaultProps,
        appName: 'Foo App',
      };

      // Act
      const { getByText } = render(<Navbar {...props} />);

      // Assert
      expect(getByText(props.appName)).toBeDefined();
    });

    it('should invoke the onHomeClick callback', async () => {
      // Arrange
      const { getByTestId } = render(<Navbar {...defaultProps} />);

      // Act
      await fireEvent.click(getByTestId('home'));

      // Assert
      expect(defaultProps.onHomeClick).toHaveBeenCalled();
    });
  });
});
