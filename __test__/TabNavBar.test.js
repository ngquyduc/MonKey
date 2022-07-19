import React from 'react';
import Other from '../screens/Other';
import { render, screen, fireEvent } from '@testing-library/react-native';

describe('Testing navigation bar', () => {
  test('Testing render Othe screen', async () => {
    const component = (<Other/>);

    render(component);

    const header = await screen.findByText('Other');
    const personalize = await screen.findByText('Personalize');
    const monkey = await screen.findByText('MonKey');
    const feedback = await screen.findByText('Feedback');
    const signout = await screen.findByText('Sign out');
    expect(header).toBeTruthy();
    expect(personalize).toBeTruthy();
    expect(monkey).toBeTruthy();
    expect(feedback).toBeTruthy();
    expect(signout).toBeTruthy();
  });

  // test('Clicking on Calendar takes you to the Calendar screen', async () => {
  //   const component = (
  //     <NavigationContainer>
  //       <Tabs />
  //     </NavigationContainer>
  //   );

  //   render(component);
  //   const toClick = await screen.findByText('Calendar');

  //   fireEvent(toClick, 'press');
  //   const newHeader = await screen.findByText('Calendar');
  //   const innerItem = await screen.findByText('No records!');

  //   expect(newHeader).toBeTruthy();
  //   expect(innerItem).toBeTruthy();
  // });
});