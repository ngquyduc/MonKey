import React from 'react';
import {create} from 'react-test-renderer'
import Other from '../screens/Other';

const tree = create(<Other/>);

test('snapshot Other', () => {
  expect(tree).toMatchSnapshot();
});
