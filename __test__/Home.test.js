import React from 'react';
import {create} from 'react-test-renderer'
import Home from '../screens/Home';

const tree = create(<Home/>);

test('snapshot Home', () => {
  expect(tree).toMatchSnapshot();
});
