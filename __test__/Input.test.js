import React from 'react';
import {create} from 'react-test-renderer'
import Input from '../screens/Input';
import { NavigationContainer } from '@react-navigation/native';

const tree = create(
  <NavigationContainer>
    <Input/>
  </NavigationContainer>);

test('snapshot Input', () => {
  expect(tree).toMatchSnapshot();
});
