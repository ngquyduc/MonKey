import React from 'react';
import {create} from 'react-test-renderer'
import Stats from '../screens/Stats';

const tree = create(<Stats/>);

test('snapshot Stats', () => {
  expect(tree).toMatchSnapshot();
});
