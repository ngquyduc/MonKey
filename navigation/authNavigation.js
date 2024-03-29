import Login from '../screens/Login';
import SignUp from '../screens/Signup';
import Other from '../screens/Other';
import ForgotPassword from '../screens/ForgotPassword';
import InnerScreenNav from './innerScreensNav';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown:false}}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
        <Stack.Screen name="InnerScreenNav" component={InnerScreenNav} options={{headerShown:false}}/>
        <Stack.Screen name="Other" component={Other} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AuthNavigation;
    