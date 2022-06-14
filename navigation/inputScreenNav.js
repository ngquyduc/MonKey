import Income from '../screens/inputScreen/Income';
import Expense from '../screens/inputScreen/Expense';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const InputScreenNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Expense">
        <Stack.Screen name="Income" component={Income} options={{headerShown:false}}/>
        <Stack.Screen name="Expense" component={Expense} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default InputScreenNav;