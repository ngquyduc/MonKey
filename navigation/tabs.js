import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Calendar from '../screens/Calendar';
import Home from '../screens/Home';
import Input from '../screens/Input';
import Stats from '../screens/Stats';
import Other from '../screens/Other';
import { colors } from '../components/colors';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Animation } from 'react-native-animatable';
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

const CustomInputButton = ({children, onPress}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        top:-20,
        justifyContent:'center',
        alignItems:'center',
        ...styles.shadow,
      }}>
        <View style={{
          width:66,
          height:66,
          borderRadius:33,
          alignItems:'center',
          justifyContent:'center',
          backgroundColor:lightBlue,
        }}>
          <Entypo name="plus" size ={36} color={beige}/>
        </View>
    </TouchableOpacity>
  )
}

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home}  
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarLabel: "Home",
          tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', justifyContent:'center', top:8}}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size ={28} color={focused ? darkBlue : lightBlue}/>
              <Text style={{fontSize:11, fontWeight:'600', color:focused ? darkBlue : lightBlue}}>Home</Text>
            </View>
          )
        }}/>
      <Tab.Screen name="Calendar" component={Calendar} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarLabel: "Calendar",
          tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', justifyContent:'center', top:8}}>
              <Ionicons name={focused ? "calendar" : "calendar-outline"} size ={28} color={focused ? darkBlue : lightBlue}/>
              <Text style={{fontSize:11, fontWeight:'600', color:focused ? darkBlue : lightBlue}}>Calendar</Text>
            </View>
          )
        }}/>
      <Tab.Screen name="Input" component={Input} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarLabel: "Input",
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
          )
        }}/>
      <Tab.Screen name="Stats" component={Stats} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarLabel: "Stats",
          tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', justifyContent:'center', top:8}}>
              <Ionicons name={focused ? "bar-chart" : "bar-chart-outline"} size ={28} color={focused ? darkBlue : lightBlue}/>
              <Text style={{fontSize:11, fontWeight:'600', color:focused ? darkBlue : lightBlue}}>Stats</Text>
            </View>
          ),
          
        }}/>
      <Tab.Screen name="Other" component={Other} 
        options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarLabel: "Other",
          tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', justifyContent:'center', top:8}}>
              <Ionicons name={focused ? "ellipsis-horizontal-sharp" : "ellipsis-horizontal-outline"} size={28} color={focused ? darkBlue : lightBlue} />
              <Text style={{fontSize:11, fontWeight:'600', color:focused ? darkBlue : lightBlue}}>Other</Text>
            </View>
          )
        }}/>
    </Tab.Navigator>
  );
}

export default Tabs;

