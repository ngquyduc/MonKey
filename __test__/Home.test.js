import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Home from '../screens/Home';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <NavigationContainer>
        <Home/>
      </NavigationContainer>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});