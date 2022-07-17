import React from 'react';
import {create} from 'react-test-renderer'
import EditUsernameScreen from '../screens/EditUsernameScreen';
import { NavigationContainer } from '@react-navigation/native';

const tree = create(
  <NavigationContainer>
    <EditUsernameScreen/>
  </NavigationContainer>);

test('snapshot EditUsernameScreen', () => {
  expect(tree).toMatchSnapshot();
});
