import React from 'react';
import Signup from '../screens/Signup';
import renderer from 'react-test-renderer';
it('renders correctly', () => {
  const tree = renderer
    .create(<Signup/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});