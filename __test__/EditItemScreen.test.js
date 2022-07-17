import React from 'react';
import {create} from 'react-test-renderer'
import EditItemScreen from '../screens/EditItemScreen';

const tree = create(<EditItemScreen/>);

test('snapshot EditItemScreen', () => {
  expect(tree).toMatchSnapshot();
});
