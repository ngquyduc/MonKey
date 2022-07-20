import React from 'react';
import RateScreen from '../screens/RateScreen';
import renderer from 'react-test-renderer';
it('renders correctly', () => {
  const tree = renderer
    .create(<RateScreen/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});