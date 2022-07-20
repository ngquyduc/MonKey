import React from 'react';
import Input from '../screens/Input';
import { NavigationContainer } from '@react-navigation/native';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <NavigationContainer>
        <Input/>
      </NavigationContainer>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
