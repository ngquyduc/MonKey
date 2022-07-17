import React from 'react';
import {create} from 'react-test-renderer'
import EditUsernameScreen from '../screens/EditUsernameScreen';

const tree = create(<EditUsernameScreen/>);

test('snapshot EditUsernameScreen', () => {
  expect(tree).toMatchSnapshot();
});
