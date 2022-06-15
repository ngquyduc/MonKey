import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Platform, Button, TextInput, TouchableWithoutFeedback, Keyboard} from 'react-native';
import styles from '../../components/styles';
import { colors } from '../../components/colors';
import CustomDatePicker from '../../components/Containers/CustomDatePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo } from '@expo/vector-icons'
import moment from 'moment';
const { lightYellow, beige, lightBlue,darkBlue } = colors

const Expense = ({ navigation }) => {
  const [expense, setExpense] = useState(0);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const showMode = (currenMode) => {
    setShow(true);
    setMode(currenMode);
  } 
  let fDate = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(Platform.OS === 'ios');
    setDate(currentDate)

    let tempDate = new Date(currentDate);
    let formatDate = tempDate.getDate() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getFullYear();
    console.log(formatDate)
  }
  return (
    <>
      <StatusBar style='dark'/>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
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
            paddingTop:15,
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
          <View style={{
            flexDirection:'row',
            paddingBottom:8,
            paddingTop:8,
            paddingLeft:4,
            borderBottomColor: '#E9E9E9',
            borderTopColor: '#E9E9E9',
            borderBottomWidth:1,
            borderTopWidth:1,            
            height:60
          }}>
            <View style={{
              flex:20,
              alignItems:'center',
              justifyContent:'center'
            }}>
              <Text style={styles.dateText}>Date</Text>
            </View>
            <View style={{
              flex:15,
              alignItems:'center',
              justifyContent:'center'
            }}>
              {/************ Add function for these 2 buttons *************/}
              <TouchableOpacity style={{position: 'absolute'}}>
                <Entypo name='chevron-left' size={28} color={darkBlue}/>
              </TouchableOpacity>
            </View>
            <View style={{
              flex:55,
              alignItems:'center',
              justifyContent:'center',
              backgroundColor:'#FDEE87',
              borderRadius:10
            }}>
              <TouchableOpacity onPress={()=>setShow(true)}>
                <View>
                  <Text style={styles.dateText}>{fDate}</Text>
                </View>
              </TouchableOpacity>

              {/* <Button title={fDate} onPress={()=>showMode('date')}/> */}
            </View>
            <View style={{
              flex:15,
              alignItems:'center',
              justifyContent:'center'
            }}>
              {/************ Add function for these 2 buttons *************/}
              <TouchableOpacity style={{position: 'absolute'}}>
                <Entypo name='chevron-right' size={28} color={darkBlue}/>
              </TouchableOpacity>
            </View>
          </View>
          {show && (
            <>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', paddingTop:10, paddingLeft:20, paddingRight:20}}>
                <View style={{flex:5}}>
                  <TouchableOpacity onPress={()=> {setShow(false), setDate(new Date())}}>
                    <View>
                      <Text style={styles.datePickerOffText}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex:5, alignItems:'flex-end'}}>
                  <TouchableOpacity onPress={()=> setShow(false)}>
                    <View>
                      <Text style={styles.datePickerOffText}>Done</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <DateTimePicker
                value={date}
                mode={mode}
                is24Hour={true}
                display='spinner'
                onChange ={onChange}
                minimumDate={new Date(moment().subtract(50, 'years').format('YYYY-MM-DD'))}
                maximumDate={new Date(moment().format('YYYY-MM-DD'))}/>
            </>
          )}
          <View style={{
            flexDirection:'row',
            paddingBottom:4,
            paddingTop:4,
            paddingLeft:4,
            borderBottomColor: '#E9E9E9',
            borderTopColor: '#E9E9E9',
            borderBottomWidth:1,       
            height:60
          }}>
            <View style={{
              flex:20,
              alignItems:'center',
              justifyContent:'center'
              }}>
              <Text style={styles.dateText}>Note</Text>
            </View>
            <View style={{
              flex:80,
              alignItems:'center',
              justifyContent:'center'
            }}>
            </View>
          </View>
          <View style={{
            flexDirection:'row',
            paddingBottom:4,
            paddingTop:4,
            paddingLeft:5,
            borderBottomColor: '#E9E9E9',
            borderTopColor: '#E9E9E9',
            borderBottomWidth:1,       
            height:60
          }}>
            <View style={{
              flex:20,
              alignItems:'center',
              justifyContent:'center'
              }}>
              <Text style={styles.dateText}>Expense</Text>
            </View>
            <View style={{
              flex:80,
              alignItems:'center',
              justifyContent:'center'
            }}>
              <TextInput
                style={{
                  fontSize: 20,
                  fontWeight:'600',
                }}
                placeholder='0.00'
                placeholderTextColor={lightBlue}
                keyboardType='decimal-pad'
                value={expense}
                onChange={setExpense}
                />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

export default Expense;