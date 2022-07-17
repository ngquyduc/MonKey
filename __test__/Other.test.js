import React from 'react';
import {create} from 'react-test-renderer'
import Other from '../screens/Other';
import { NavigationContainer } from '@react-navigation/native';

const tree = create(
  <NavigationContainer>
    <Other/>
  </NavigationContainer>);

test('snapshot Other', () => {
  expect(tree).toMatchSnapshot();
});
