import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../components/styles';
import MonthViewCalendar from 'react-native-month-view-calendar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';


const Home = (props) => {
  const eventsForCalendar = [
  	{
  	  title: '10',
  	  date: new Date(),
  	},
  ];

  return (
    <SafeAreaView>
    </SafeAreaView>
  );
}

export default Home;