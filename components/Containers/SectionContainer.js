import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons'

const SectionContainer = (props) => {
  const { onPress, title } = props;
  return (
    <View style={styles.sectionView}>
      <TouchableOpacity onPress={onPress}>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:8, justifyContent:'center', alignItems:'flex-start'}}>
            <Text style={{fontSize:16}}>{title}</Text>
            {props.children}
          </View>
          <View style={{flex:2, flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}}>
            <Entypo name='chevron-thin-right' size={20} color='#b2b2b2'/>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionView: {
    justifyContent:'center',
    paddingBottom:4,
    paddingTop:4,
    paddingHorizontal:20,
    borderTopColor: '#E9E9E9',  
    borderTopWidth:1,     
    height:48,
  },
})

export default SectionContainer;