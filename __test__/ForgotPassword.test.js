import React from 'react';
import {create} from 'react-test-renderer'
import ForgotPassword from '../screens/ForgotPassword';

const tree = create(<ForgotPassword/>);

test('snapshot ForgotPassword', () => {
  expect(tree).toMatchSnapshot();
});
