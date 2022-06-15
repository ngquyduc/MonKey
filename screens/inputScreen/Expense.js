import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../components/styles';
import { colors } from '../../components/colors';
import CustomDatePicker from '../../components/Containers/CustomDatePicker';
import moment from 'moment';
const { lightYellow, beige, lightBlue,darkBlue } = colors

const Expense = ({ navigation }) => {
  
  return (
    <>
      <StatusBar style='dark'/>
      <View style={styles.mainContainerInnerScreen}>
        <View style={{
          alignItems:'center', 
          backgroundColor:beige,
          borderBottomColor:'#808080',
          borderBottomWidth:1, 
        }}>
          <Text style={styles.boldBlueHeaderText}>Input</Text>
        </View>
        <View style={{
          flexDirection:'row',
          height:70,
          paddingTop:20,
          paddingLeft:40,
          paddingRight:40
        }}>
          <View style={{flex:0.5}}>
            <TouchableOpacity 
              style={[styles.inputButton, {borderBottomLeftRadius:10, borderTopLeftRadius:10, backgroundColor:darkBlue}]} 
              onPress={() => navigation.navigate('Expense')}>
              <Text style={styles.inputText}>Expense</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex:0.5}}>
            <TouchableOpacity 
              style={[styles.inputButton, {borderBottomRightRadius:10, borderTopRightRadius:10, backgroundColor:lightBlue}]} 
              onPress={() => navigation.navigate('Income')}>
              <Text style={styles.inputText}>Income</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </>
  );
}

export default Expense;