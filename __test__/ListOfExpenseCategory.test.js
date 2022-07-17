import React from 'react';
import {create} from 'react-test-renderer'
import ListOfExpenseCategory from '../screens/ListOfExpenseCategory';

const tree = create(<ListOfExpenseCategory/>);

test('snapshot ListOfExpenseCategory', () => {
  expect(tree).toMatchSnapshot();
});
