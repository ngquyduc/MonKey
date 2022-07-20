import React from 'react';
import Stats from '../screens/Stats';
import { NavigationContainer } from '@react-navigation/native';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(  
    <NavigationContainer>
      <Stats/>
    </NavigationContainer>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});