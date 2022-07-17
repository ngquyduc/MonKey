import React from 'react';
import {create} from 'react-test-renderer'
import Stats from '../screens/Stats';
import { NavigationContainer } from '@react-navigation/native';

const tree = create(
  <NavigationContainer>
    <Stats/>
  </NavigationContainer>);

test('snapshot Stats', () => {
  expect(tree).toMatchSnapshot();
});
