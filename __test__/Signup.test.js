import React from 'react';
import {create} from 'react-test-renderer'
import Signup from '../screens/Signup';

const tree = create(<Signup/>);

test('snapshot Signup', () => {
  expect(tree).toMatchSnapshot();
});
