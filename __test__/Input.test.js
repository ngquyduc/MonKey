import React from 'react';
import {create} from 'react-test-renderer'
import Input from '../screens/Input';

const tree = create(<Input/>);

test('snapshot Input', () => {
  expect(tree).toMatchSnapshot();
});
