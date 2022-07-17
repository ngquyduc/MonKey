import React from 'react';
import {create} from 'react-test-renderer'
import RateScreen from '../screens/RateScreen';

const tree = create(<RateScreen/>);

test('snapshot RateScreen', () => {
  expect(tree).toMatchSnapshot();
});
