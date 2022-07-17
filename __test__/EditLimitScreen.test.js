import React from 'react';
import {create} from 'react-test-renderer'
import EditLimitScreen from '../screens/EditLimitScreen';

const tree = create(<EditLimitScreen/>);

test('snapshot EditLimitScreen', () => {
  expect(tree).toMatchSnapshot();
});
