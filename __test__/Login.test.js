import React from 'react';
import {create} from 'react-test-renderer'
import Login from '../screens/Login';

const tree = create(<Login/>);

test('snapshot Login', () => {
  expect(tree).toMatchSnapshot();
});
