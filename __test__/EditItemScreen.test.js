import React from 'react';
import EditItemScreen from '../screens/EditItemScreen';
import { NavigationContainer } from '@react-navigation/native';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <NavigationContainer>
        <EditItemScreen/>
      </NavigationContainer>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
