import React from 'react';
import {create} from 'react-test-renderer'
import EditItemScreen from '../screens/EditItemScreen';
import { NavigationContainer } from '@react-navigation/native';

const tree = create(<EditItemScreen/>);

test('snapshot EditItemScreen', () => {
  expect(tree).toMatchSnapshot();
});
