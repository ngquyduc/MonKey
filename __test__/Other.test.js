import React from 'react';
import Other from '../screens/Other';
import { NavigationContainer } from '@react-navigation/native';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <NavigationContainer>
        <Other/>
      </NavigationContainer>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});