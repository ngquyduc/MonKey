import React from 'react';
import {create} from 'react-test-renderer'
import ListOfExpenseCategory from '../screens/ListOfExpenseCategory';
import { NavigationContainer } from '@react-navigation/native';

const tree = create(
  <NavigationContainer>
    <ListOfExpenseCategory/>
  </NavigationContainer>);

test('snapshot ListOfExpenseCategory', () => {
  expect(tree).toMatchSnapshot();
});