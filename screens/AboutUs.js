import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWidth } from '../components/constants';
import { StatusBarHeight } from '../components/constants';
import { colors } from '../components/colors';
import { ScrollView } from 'react-native';
import { Avatar } from 'react-native-paper';
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
        <Text style={{fontSize:17, color: '#494949', fontWeight:'400', paddingBottom:10, paddingHorizontal:5}}>
          MonKey is a mobile application providing a big-picture view of your finances, which easily help you to keep track of your money flow.
        </Text>
        <Text style={{fontSize:17, color: '#494949', fontWeight:'400', paddingHorizontal:5}}>
          To know more about MonKey, please refer to:
        </Text>
        <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:5}}>
          <Octicons name='dot-fill' size={14} color='#494949'/>
          <Text style={{fontSize:17, color:darkBlue}} onPress={() => Linking.openURL('https://docs.google.com/document/d/1OaEqTwu-V71DpezJAVhlfatpFLixf8X80C3NXoi8cdU/edit?usp=sharing')}>   Documentation</Text>
        </View>
        <View style={{flexDirection:'row', alignItems:'center',paddingHorizontal:5}}>
          <Octicons name='dot-fill' size={14} color='#494949'/>
          <Text style={{fontSize:17, color:darkBlue}} onPress={() => Linking.openURL('https://github.com/ngquyduc/MonKey')}>   Github repo</Text>
        </View>
        <Text style={{fontSize:30, color: '#494949', paddingTop:20, paddingBottom:15, paddingHorizontal:15, fontWeight:'700'}}>Developers</Text>

        {/* Bui Duc Thanh */}
        <View style={styles.developerView}>
          <View style={{flexDirection:'row',borderBottomColor:'#e9e9e9',borderBottomWidth:1,paddingBottom:10, marginBottom:10}}>
            <View style={{flex:4}}>
              <Text style={{fontSize:18, fontWeight:'600',color:'#494949', paddingBottom:6}}>Bui Duc Thanh</Text>
              <Text style={{fontSize:15, fontWeight:'300', color:'#979797'}}>National University of Singapore</Text>
            </View>
            <View style={{flex:1, alignItems:'flex-end'}}>
              <Avatar.Image source={require('../assets/bdt.png')} size={50}/>
            </View>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', paddingBottom:10}}>
            <MaterialCommunityIcons name='email' size={18} color='#494949' style={{paddingRight:10}}/>
            <Text style={{fontSize:17, color:'#494949'}} onPress={() => Linking.openURL('mailto:bdthanh@u.nus.edu')}>bdthanh@u.nus.edu</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', paddingBottom:10}}>
            <MaterialCommunityIcons name='github' size={18} color='#494949' style={{paddingRight:10}}/>
            <Text style={{fontSize:17, color:'#494949'}} onPress={() => Linking.openURL('https://github.com/bdthanh')}>bdthanh</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <MaterialCommunityIcons name='linkedin' size={18} color='#494949' style={{paddingRight:10}}/>
            <Text style={{fontSize:17, color:'#494949'}} onPress={() => Linking.openURL('https://www.linkedin.com/in/buiducthanh2003/')}>buiducthanh2003</Text>
          </View>
        </View>

        {/* Nguyen Quy Duc */}
        <View style={styles.developerView}>
          <View style={{flexDirection:'row',borderBottomColor:'#e9e9e9',borderBottomWidth:1,paddingBottom:10, marginBottom:10}}>
            <View style={{flex:4}}>
              <Text style={{fontSize:18, fontWeight:'600',color:'#494949', paddingBottom:6}}>Nguyen Quy Duc</Text>
              <Text style={{fontSize:15, fontWeight:'300', color:'#979797'}}>National University of Singapore</Text>
            </View>
            <View style={{flex:1, alignItems:'flex-end'}}>
              <Avatar.Image source={require('../assets/nqd.png')} size={50}/>
            </View>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', paddingBottom:10}}>
            <MaterialCommunityIcons name='email' size={18} color='#494949' style={{paddingRight:10}}/>
            <Text style={{fontSize:17, color:'#494949'}} onPress={() => Linking.openURL('mailto:quyduc@u.nus.edu')}>quyduc@u.nus.edu</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', paddingBottom:10}}>
            <MaterialCommunityIcons name='github' size={18} color='#494949' style={{paddingRight:10}}/>
            <Text style={{fontSize:17, color:'#494949'}} onPress={() => Linking.openURL('https://github.com/ngquyduc')}>ngquyduc</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <MaterialCommunityIcons name='linkedin' size={18} color='#494949' style={{paddingRight:10}}/>
            <Text style={{fontSize:17, color:'#494949'}} onPress={() => Linking.openURL('https://www.linkedin.com/in/quyduc/')}>quyduc</Text>
          </View>
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
    height: StatusBarHeight + 42,
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
  developerView: {
    flexDirection:'column',
    backgroundColor: '#fff',
    borderRadius:25,
    marginBottom:15,
    shadowColor:'#999',
    shadowOffset: {width:0,height:2},
    shadowOpacity:0.7,
    shadowRadius:4,
    elevation:5,
    padding:15
  },
})
export default AboutUs;