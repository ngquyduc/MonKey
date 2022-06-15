import React, {useState} from 'react';
import { Button, StyleSheet, Text, TouchableHighlight, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const CustomDatePicker = () => {
  // const [currentDate, setCurrentDate] = useState('')
  // useEffect(() => {
  let day = new Date()
  //   let month = new Date().getMonth()+1
  //   let year = new Date().getFullYear()
  //   setCurrentDate(date + '-' + month + '-' + year)
  // }, [])
  //const [day,setDay] =useState(moment())
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [text, setText] = useState('Empty');
  const showMode = (currenMode) => {
    setShow(true);
    setMode(currenMode);
  } 
  let fDate = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate)

    let tempDate = new Date(currentDate);
    let formatDate = tempDate.getDate() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getFullYear();
    setText(formatDate+'\n')
    console.log(formatDate)
  }
  return (
    <View  style={{backgroundColor:'#394872modal'}}>
      <Text style={{fontWeight:'bold',fontSize:20}}>{text}</Text>
      <View style={{margin:20}}>
        <Button title={fDate} onPress={()=>showMode('date')}/>
      </View>
      {show && (
        <DateTimePicker
          testID='dateTimePicker'
          value={date}
          mode={mode}
          is24Hour={true}
          display='spinner'
          onChange ={onChange}
          minimumDate={new Date(moment().subtract(50, 'years').format('YYYY-MM-DD'))}
          maximumDate={new Date(moment().format('YYYY-MM-DD'))}/>
      )}
    </View>
    // <TouchableHighlight
    //   activeOpacity={0}
    //   onPress={() => console.log('open datepicker')}
    // >
    //   <View>
    //     <Text>{day.format('MMMM Do, YYYY')}</Text> 
    //     <Modal
    //       transparent={true}
    //       animationType='slide'
    //       visible={show}
    //       supportedOrientations={['portrait']}
    //       onRequestClose={() =>setShow(false)}>
    //         <View style={{flex:1}}>
    //           <TouchableHighlight
    //             style={{
    //               flex:1,
    //               alignItems:'flex-end',
    //               flexDirection:'row',
    //             }}
    //             activeOpacity={1}
    //             visible={show}
    //             onPress={()=>setShow(false)}>
    //             <TouchableHighlight
    //               underlayColor={'#fff'}
    //               style={{
    //                 flex:1,
    //                 borderTopColor: '#E9E9E9',
    //                 borderTopWidth:1,
    //               }}
    //               onPress={()=>console.log('datepicker clicked')}>
    //               <View style={{
    //                 backgroundColor:'#fff',
    //                 height:256,
    //                 overflow:'hidden'
    //               }}>
    //                 <View style ={{marginTop:20}}>
    //                   <DateTimePicker
    //                     timeZoneOffsetInMinutes={0}
    //                     value={new Date(day)}
    //                     mode='date'
    //                     minimumDate={new Date(moment().subtract(50, 'years').format('YYYY-MM-DD'))}
    //                     maximumDate={new Date(moment().format('YYYY-MM-DD'))}
    //                     onChange={onChange}
    //                   />
    //                 </View>
    //               </View>
    //             </TouchableHighlight>
    //           </TouchableHighlight>
    //         </View>
    //     </Modal>
    //   </View>
    // </TouchableHighlight>
  )
}

const styles = StyleSheet.create({

})

export default CustomDatePicker;