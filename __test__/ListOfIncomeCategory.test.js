import React from 'react';
import {create} from 'react-test-renderer'
import ListOfIncomeCategory from '../screens/ListOfIncomeCategory';

const tree = create(<ListOfIncomeCategory/>);

test('snapshot ListOfIncomeCategory', () => {
  expect(tree).toMatchSnapshot();
});
