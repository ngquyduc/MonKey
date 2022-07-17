import React from 'react';
import {create} from 'react-test-renderer'
import EditItemScreen from '../screens/EditItemScreen';
import { NavigationContainer } from '@react-navigation/native';

const tree = create(
  <NavigationContainer>
    <EditItemScreen/>
  </NavigationContainer>);

test('snapshot EditItemScreen', () => {
  expect(tree).toMatchSnapshot();
});
