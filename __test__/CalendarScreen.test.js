import React from 'react';
import {create} from 'react-test-renderer'
import CalendarScreen from '../screens/CalendarScreen';

const tree = create(<CalendarScreen/>);

test('snapshot CalendarScreen', () => {
  expect(tree).toMatchSnapshot();
});
