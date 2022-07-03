import React, {useState} from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity, Animated, ScrollView, Alert, Modal } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { colors } from '../colors';
import { StatusBarHeight } from '../constants';
import { Feather, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import IconList from '../../CategoriesList/IconList';
import ColorList from '../../CategoriesList/ColorList';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

const CustomModal = (props) => {
  return (
    <>
      {/*********** Header with cancel button ***********/}
      <View style={[styles.header, {flexDirection:'row'}]}>
        <View style={{flex:4}}>
          <Text></Text>
        </View>
        <View style={{flex:8}}>
          <Text style={styles.boldBlueHeaderText}>{props.header}</Text>
        </View>
        <View style={{flex:4, alignItems:'center', justifyContent:'center', marginBottom:10}}>
          <TouchableOpacity 
            style={{alignItems:'center', justifyContent:'center',backgroundColor:darkYellow,height:30,width:65, borderRadius:5}}
            onPress={props.closeModal}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/*********** Category name ***********/}
      <View style={styles.propertyContainer}>
        <View style={{
          flex:22,
          paddingLeft:12,
          justifyContent:'center'
          }}>
          <Text style={styles.categoryText}>Category</Text>
        </View>
        <View style={{
            flex:80,
            alignItems:'center',
            justifyContent:'center',
            borderBottomColor:darkYellow,
          }}>
            {props.children}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems:'flex-end', 
    justifyContent:'center',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    height: StatusBarHeight + 48,
  },
  boldBlueHeaderText: {
    fontSize: 30,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize:18,
    color:'#fff',
    fontWeight:'400',
  },
  propertyContainer: {
    flexDirection:'row',
    paddingBottom:4,
    paddingTop:4,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',  
    borderTopWidth:1,      
    //borderBottomWidth:1,    
    height:48
  },
  categoryText: {
    fontSize: 19,
    fontWeight: '600',
    color: darkBlue,
  },
})
export default CustomModal;