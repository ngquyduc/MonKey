import React from 'react';
import {create} from 'react-test-renderer'
import EditLimitScreen from '../screens/EditLimitScreen';
import { NavigationContainer } from '@react-navigation/native';

const tree = create(
  <NavigationContainer>
    <EditLimitScreen/>
  </NavigationContainer>);

test('snapshot EditLimitScreen', () => {
  expect(tree).toMatchSnapshot();
});
