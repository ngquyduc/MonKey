import React from 'react';
import CalendarScreen from '../screens/CalendarScreen';
import { NavigationContainer } from '@react-navigation/native';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <NavigationContainer>
        <CalendarScreen/>
      </NavigationContainer>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});