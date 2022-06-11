import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Calendar from '../screens/Calendar';
import Home from '../screens/Home';
import Input from '../screens/Input';
import Stats from '../screens/Stats';
import Other from '../screens/Other';
import { colors } from '../components/colors';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();
const { beige, darkBlue, lightBlue } = colors;

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarLabel: "Home",
          tabBarIcon: ({focused}) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size ={28} color={focused ? darkBlue : lightBlue}/>
          )
        }}/>
      <Tab.Screen name="Calendar" component={Calendar} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarLabel: "Calendar",
          tabBarIcon: ({focused}) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size ={28} color={focused ? darkBlue : lightBlue}/>
          )
        }}/>
      <Tab.Screen name="Input" component={Input} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarLabel: "Input",
          tabBarIcon: ({focused}) => (
            <FontAwesome name={focused ? "plus-square" : "plus-square-o"} size ={28} color={focused ? darkBlue : lightBlue}/>
          )
        }}/>
      <Tab.Screen name="Stats" component={Stats} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarLabel: "Stats",
          tabBarIcon: ({focused}) => (
            <Ionicons name={focused ? "bar-chart" : "bar-chart-outline"} size ={28} color={focused ? darkBlue : lightBlue}/>
          ),
          
        }}/>
      <Tab.Screen name="Other" component={Other} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarLabel: "Other",
          tabBarIcon: ({focused}) => (
            <Ionicons name={focused ? "ellipsis-horizontal-sharp" : "ellipsis-horizontal-outline"} size={28} color={focused ? darkBlue : lightBlue} />
          )
        }}/>
    </Tab.Navigator>
  );
}

export default Tabs;

