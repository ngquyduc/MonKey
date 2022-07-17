import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {create} from 'react-test-renderer'
import Home from '../screens/Home';

const tree = create(
  <NavigationContainer>
    <Home/>
  </NavigationContainer>);

test('snapshot Home', () => {
  expect(tree).toMatchSnapshot();
});
