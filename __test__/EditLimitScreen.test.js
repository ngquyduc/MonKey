import React from 'react';
import EditLimitScreen from '../screens/EditLimitScreen';
import { NavigationContainer } from '@react-navigation/native';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <NavigationContainer>
        <EditLimitScreen/>
      </NavigationContainer>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});