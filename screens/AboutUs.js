import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWidth } from '../components/constants';
import { StatusBarHeight } from '../components/constants';
import { colors } from '../components/colors';
import { ScrollView } from 'react-native';
const { darkBlue, darkYellow } = colors

const AboutUs = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flex:2, paddingLeft:5, paddingBottom:7}}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <MaterialCommunityIcons name='chevron-left' size={44} color={darkBlue}/>
          </TouchableOpacity>
        </View>
        <View style={{flex:8,alignItems:'center',justifyContent:'center'}}>
          <Text style={styles.boldBlueHeaderText}>About</Text>
        </View>
        <View style={{flex:2}}></View>
      </View>
      <ScrollView style={{paddingHorizontal:15}}>
        <Text style={{fontSize:30, color: '#494949', paddingTop:20, paddingBottom:15, paddingHorizontal:15, fontWeight:'700'}}>Monkey</Text>
        <Text style={{fontSize:17, color: '#494949', fontWeight:'400'}}>
          To know more out MonKey, please refer to:
        </Text>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Octicons name='dot-fill' size={14} color='#494949'/>
          <Text style={{fontSize:17, color:darkBlue}} onPress={() => Linking.openURL('http://google.com')}>   Documentation</Text>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Octicons name='dot-fill' size={14} color='#494949'/>
          <Text style={{fontSize:17, color:darkBlue}} onPress={() => Linking.openURL(' https://github.com/ngquyduc/MonKey')}>   Github repo</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems:'flex-end', 
    justifyContent:'center',
    flexDirection:'row',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    height: StatusBarHeight + 48,
  },
  boldBlueHeaderText: {
    fontSize: 34,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  ratingView: {
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#fff',
    borderRadius:25,
    marginBottom:15,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
    marginHorizontal:20,
    paddingVertical:30,
    marginTop:20,
  },
  feedbackView: {
    flexDirection:'column',
    alignItems:'center',
    backgroundColor: '#fff',
    borderRadius:25,
    marginBottom:10,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
    marginHorizontal:20,
    height:300,
    padding:10
  },
  noteView: {
    borderRadius:20,
    backgroundColor:'#f1fbfd',
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:-3,
    height:243,
    width:ScreenWidth-70
  },
  submitButtonView: {
    marginTop: 10, 
    alignItems:'center',
    justifyContent:'center',
    paddingBottom:4,
    paddingTop:4,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',     
    height:48
  },
  cancelText: {
    fontSize:18,
    color:'#fff',
    fontWeight:'500',
  },
  inputButton: {
    padding: 5,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    backgroundColor:darkYellow,
    width:120
  },
})
export default AboutUs;