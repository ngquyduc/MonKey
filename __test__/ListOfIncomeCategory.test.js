import React from 'react';
import {create} from 'react-test-renderer'
import ListOfIncomeCategory from '../screens/ListOfIncomeCategory';
import { NavigationContainer } from '@react-navigation/native';

const tree = create(
  <NavigationContainer>
    <ListOfIncomeCategory/>
  </NavigationContainer>);

test('snapshot ListOfIncomeCategory', () => {
  expect(tree).toMatchSnapshot();
});
