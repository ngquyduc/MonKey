import React from 'react';
import ForgotPassword from '../screens/ForgotPassword';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<ForgotPassword/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});