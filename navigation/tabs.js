import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Calendar from '../screens/Calendar';
import Home from '../screens/Home';
import Input from '../screens/Input';
import Stats from '../screens/Stats';
import Other from '../screens/Other';
import * as Animatable from 'react-native-animatable';
import { colors } from '../components/colors';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { beige, darkYellow } = colors;


const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} 
        options={{
          headerShown:false,
          tabBarLabel: "Home",
          tabBarIcon: ({focused, color}) => {
            <Ionicons name={'home'} size ={14} color={darkYellow}/>
          }
        }}/>
      <Tab.Screen name="Calendar" component={Calendar} 
        options={{
          headerShown:false,
          tabBarLabel: "Calendar",
          tabBarIcon: ({focused, color}) => {
            <Ionicons name={'home'} size ={14} color={darkYellow}/>
          }
        }}/>
      <Tab.Screen name="Input" component={Input} 
        options={{
          headerShown:false,
          tabBarLabel: "Input",
          tabBarIcon: ({focused, color}) => {
            <Ionicons name={'home'} size ={14} color={darkYellow}/>
          }
        }}/>
      <Tab.Screen name="Stats" component={Stats} 
        options={{
          headerShown:false,
          tabBarLabel: "Stats",
          tabBarIcon: ({focused, color}) => {
            <Ionicons name='home' size ={14} color={darkYellow}/>
          }
        }}/>
      <Tab.Screen name="Other" component={Other} 
        options={{
          headerShown:false,
          tabBarLabel: "Other",
          tabBarIcon: ({focused, color}) => {
            <View>
            <Ionicons name='home' size ={14} color={darkYellow}/>
            </View>
          }
        }}/>
    </Tab.Navigator>
  );
}

export default Tabs;

