import React from 'react';
import {create} from 'react-test-renderer'
import CalendarScreen from '../screens/CalendarScreen';
import { NavigationContainer } from '@react-navigation/native';

const tree = create(
  <NavigationContainer>
    <CalendarScreen/>
  </NavigationContainer>);

test('snapshot CalendarScreen', () => {
  expect(tree).toMatchSnapshot();
});
