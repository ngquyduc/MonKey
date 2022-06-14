import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Calendar from '../screens/Calendar';
import Home from '../screens/Home';
import Expense from '../screens/inputScreen/Expense';
import Stats from '../screens/Stats';
import Other from '../screens/Other';
import { colors } from '../components/colors';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
const Tab = createBottomTabNavigator();
const { beige, darkBlue, lightBlue } = colors;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: lightBlue,
    shadowOffset: {
      width:0,
      height:8,
    },
    shadowRadius:3.5,
    elevation:5
  }
})

const Tabs = () => {

  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen name="Home" component={Home}  
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', justifyContent:'center', top:8}}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size ={28} color={focused ? darkBlue : lightBlue}/>
              <Text style={{fontSize:11, fontWeight:'600', color:focused ? darkBlue : lightBlue}}>Home</Text>
            </View>
          ),
          tabBarActiveBackgroundColor: beige,
          tabBarInactiveBackgroundColor: beige,
        }}/>
      <Tab.Screen name="Calendar" component={Calendar} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', justifyContent:'center', top:8}}>
              <Ionicons name={focused ? "calendar" : "calendar-outline"} size ={28} color={focused ? darkBlue : lightBlue}/>
              <Text style={{fontSize:11, fontWeight:'600', color:focused ? darkBlue : lightBlue}}>Calendar</Text>
            </View>
          ),
          tabBarActiveBackgroundColor: beige,
          tabBarInactiveBackgroundColor: beige,
        }}/>
      <Tab.Screen name="Input" component={Expense} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarIcon: ({focused}) => (
            <View style={{
              top:-20,
              width:66,
              height:66,
              borderRadius:33,
              alignItems:'center',
              justifyContent:'center',
              backgroundColor: focused ? darkBlue : lightBlue,
            }}>
              <Entypo name="plus" size ={36} color={beige}/>
            </View>
          ),
          tabBarButton: props => (
            <TouchableOpacity {...props} />
          ),
          tabBarActiveBackgroundColor: beige,
          tabBarInactiveBackgroundColor: beige,
        }}/>
      <Tab.Screen name="Stats" component={Stats} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', justifyContent:'center', top:8}}>
              <Ionicons name={focused ? "bar-chart" : "bar-chart-outline"} size ={28} color={focused ? darkBlue : lightBlue}/>
              <Text style={{fontSize:11, fontWeight:'600', color:focused ? darkBlue : lightBlue}}>Stats</Text>
            </View>
          ),
          tabBarActiveBackgroundColor: beige,
          tabBarInactiveBackgroundColor: beige,
        }}/>
      <Tab.Screen name="Other" component={Other} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', justifyContent:'center', top:8}}>
              <Ionicons name={focused ? "ellipsis-horizontal-sharp" : "ellipsis-horizontal-outline"} size={28} color={focused ? darkBlue : lightBlue} />
              <Text style={{fontSize:11, fontWeight:'600', color:focused ? darkBlue : lightBlue}}>Other</Text>
            </View>
          ),
          tabBarActiveBackgroundColor: beige,
          tabBarInactiveBackgroundColor: beige,
        }}/>
    </Tab.Navigator>
  );
}

export default Tabs;

