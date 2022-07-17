import React from 'react';
import {create} from 'react-test-renderer'
import AboutUs from '../screens/AboutUs';

const tree = create(<AboutUs/>);

test('snapshot AboutUs', () => {
  expect(tree).toMatchSnapshot();
});
