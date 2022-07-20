import React, {useState, useMemo, useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Animated, Keyboard, Alert, Modal, Pressable } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { colors } from '../components/colors';
import { StatusBarHeight } from '../components/constants';
import { Feather, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import IconList from '../CategoriesList/IconList'
import ColorList from '../CategoriesList/ColorList'
import CustomModal from '../components/Containers/CustomModal';
import { AddExpenseCategory, db, ExpenseCategoryRef } from '../utils/db';
import { query, where, onSnapshot, collection, orderBy, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { getUserID } from '../utils/authentication';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

const ListOfExpenseCategory = ({navigation}) => {
  /*************** Modifying category ***************/
  const [fromCategory, setFromCategory] = useState('')
  const [fromIcon, setFromIcon] = useState('')
  const [fromColor, setFromColor] = useState('')
  const [inprogressCategory, setInprogressCategory] = useState('');
  const [inprogressIcon, setInprogressIcon] = useState('');
  const [inprogressColor, setInprogressColor] = useState('#767676');
  const [inprogressId, setInprogressId] = useState('')
  
  /*************** Visibility of snackbar ***************/
  const [visible, setVisible] = useState(false);

  /*************** Visibility of add modal ***************/
  const [visibleAdd, setVisibleAdd] = useState(false);

  /*************** Visibility of edit modal ***************/
  const [visibleEdit, setVisibleEdit] = useState(false);
  
  const [listCategories, setListCategories] = useState([])

  /*************** Function to close row ***************/
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }

  /*************** Edit/delete button ***************/
  const HiddenItemWithActions = props => {
    const {swipeAnimatedValue, onEdit, onDelete} = props;
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonLeft, {height:55}]} onPress={onEdit}>
          <Feather name="edit-3" size={25} color="#fff"/>  
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonRight,{height:55}]} onPress={onDelete}>
          <Animated.View style={[styles.trash, {
            transform: [
              {
                scale:swipeAnimatedValue.interpolate({
                  inputRange: [-90,-45],
                  outputRange:[1,0],
                  extrapolate:'clamp',
                }),
              },
            ],
          }]}>
            <Octicons name="trash" size={24} color="#fff"/>
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  }

  const VisibleItem = props => {
    const {data} = props;
    return (
      <View style={styles.rowFront}>
        <View style={{alignItems:'center', justifyContent:'center', width:50}}>
          <MaterialCommunityIcons name={data.item.icon} size={24} color={data.item.color}/>
        </View>
        <Text style={styles.title}>{data.item.title}</Text>
      </View>
    )
  }

  const renderItem = (data, rowMap) => {
    return <VisibleItem data={data}/>
  }

  const renderHiddenItem = (data, rowMap) => {
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        onEdit={()=>{
          setVisibleEdit(true) 
          setInprogressId(data.item.id)
          setInprogressCategory(data.item.title)
          setInprogressIcon(data.item.icon)
          setInprogressColor(data.item.color)
          
          setFromCategory(data.item.title)
          setFromIcon(data.item.icon)
          setFromColor(data.item.color)
          
        }}
        onDelete={()=>alertDelete(rowMap, data.item.key, data.item.id, data.item.title)}
      />
    )
  }

  /*************** Function to close modal ***************/
  const closeAddModal = () => {
    setInprogressCategory('')
    setInprogressColor('#767676')
    setInprogressIcon('')
    setVisibleAdd(false)
  }
  const closeEditModal = () => {
    setInprogressCategory('')
    setInprogressColor('#767676')
    setInprogressIcon('')
    setVisibleEdit(false)
  }
  /*************** Function when submitting new/edit category ***************/
  const onSubmitAdd = async (name, icon, color) => {
    const existedcategories = []
    listCategories.forEach((cat) => existedcategories.push(cat.title))
    if (name == '' || name == null) {
      Alert.alert("Alert", "Invalid category name. Please choose another name.", [
        {text: 'OK', onPress: () => console.log('Alert closed')}
      ]);
    }
    else if (name == 'Edit' || name == "Deleted Category") {
      Alert.alert("Alert", "You cannot choose this name. Please choose another name.", [
        {text: 'OK', onPress: () => console.log('Alert closed')}
      ]);
    }
    else if (icon == '') {
      Alert.alert("Alert", "No icon selected. Please choose an icon.", [
        {text: 'OK', onPress: () => console.log('Alert closed')}
      ]);
    }
    else if (color == '') {
      Alert.alert("Alert", "No color selected yet. Please choose a color.", [
        {text: 'OK', onPress: () => console.log('Alert closed')}
      ]);
    }
    else if (existedcategories.includes(name)) {
      Alert.alert("Alert", "This category is already existed. Please choose another name.", [
        {text: 'OK', onPress: () => console.log('Alert closed')}
      ]);
    } else {
      AddExpenseCategory(name, icon, color)
      setInprogressCategory('')
      setInprogressColor('#767676')
      setInprogressIcon('')
      setVisibleAdd(false)
    } 
  }
  const onSubmitEdit = (id, name, icon, color) => {
    const existedcategories = []
    listCategories.forEach((cat) => existedcategories.push(cat.title))
    if (name == '' || name == null) {
      Alert.alert("Alert", "Invalid category name. Please choose another name.", [
        {text: 'OK', onPress: () => console.log('Alert closed')}
      ]);
    }
    else if (name == 'Edit' || name == "Deleted Category") {
      Alert.alert("Alert", "You cannot choose this name. Please choose another name.", [
        {text: 'OK', onPress: () => console.log('Alert closed')}
      ]);
    }
    else {
      const index = existedcategories.indexOf(name)
      if (index > -1) { // only splice array when item is found
        existedcategories.splice(index, 1); // 2nd parameter means remove one item only
      }
      if (existedcategories.includes(name)) {
        Alert.alert("Alert", "This category is already existed. Please choose another name.", [
          {text: 'OK', onPress: () => console.log('Alert closed')}
        ]);
      } else {
        editRow(id, name, icon, color)
        setInprogressId('')
        setInprogressCategory('')
        setInprogressColor('#767676')
        setInprogressIcon('')
        setVisibleEdit(false)
        const colRef = collection(db, 'Finance/' + getUserID() + '/Expense')
        const queryE = query(colRef, where('category', '==', fromCategory))
        onSnapshot(queryE, (snapShot) => {
          snapShot.forEach((ex) => updateDoc(doc(db, 'Finance/' + getUserID() + '/Expense', ex.id), {category: name, categoryIcon: icon, categoryColor: color}))
        })
      } 
    }
    
    
  }

  /*************** Function to alert when deleting ***************/
  const alertDelete = (rowMap, rowKey, id, name) => {
    Alert.alert("Delete this category?","", [
      {text: 'Cancel', onPress: () => {closeRow(rowMap, rowKey)}},
      {text: 'Delete', onPress: () => {deleteRow(id, name)}}
    ]);
  }

  /*************** Function to delete category ***************/
  const deleteRow = (id, name) => {
    const cat = doc(db, 'Input Category/Expense/' + getUserID(), id)
    deleteDoc(cat)
    const colRef = collection(db, 'Finance/' + getUserID() + '/Expense')
    const queryE = query(colRef, where('category', '==', name))
    onSnapshot(queryE, (snapShot) => {
      snapShot.forEach((ex) => updateDoc(doc(db, 'Finance/' + getUserID() + '/Expense', ex.id), {category: 'Deleted Category', categoryIcon: 'delete-forever', categoryColor: '#767676'}))
    })
  }
  /*************** Function to edit category ***************/
  const editRow = (id, name, icon, color) => {
      const path = 'Input Category/Expense/' + getUserID()
      const catRef = doc(db, path, id)
      updateDoc(catRef, {
        name: name,
        icon: icon,
        color: color,
      })
  }

  useFocusEffect(
    React.useCallback(() => {
      const ExpenseCategoryRef = collection(db, 'Input Category/Expense/' + getUserID())
      const q = query(ExpenseCategoryRef, orderBy('name', 'asc'))
      const unsub = onSnapshot(q, (snapShot) => {
          const list = []
          snapShot.forEach((cat) => {
            if (cat.data().name != 'Edit' && cat.data().name != 'Deleted Category') {
              list.push(({
                key: `${cat.data().name}`,
                title: cat.data().name,
                isEdit: false,
                id: cat.id,
                icon: cat.data().icon,
                color: cat.data().color
              }))
              
            }
          })
          setListCategories(list)
      })
      return () => {
        unsub()
      }
    }, [])
  );

  
  return (
    <>
      <StatusBar style='dark'/>
      {/*************** Header ***************/}
      <View style={styles.header}>
        <View style={{flex:2, paddingLeft:5, paddingBottom:7}}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <MaterialCommunityIcons name='chevron-left' size={44} color={darkBlue}/>
          </TouchableOpacity>
        </View>
        <View style={{flex:8,alignItems:'center',justifyContent:'center'}}>
          <Text style={styles.boldBlueHeaderText}>Expense</Text>
        </View>
        <View style={{flex:2}}></View>
      </View>
      {/*************** Add category ***************/}
      <View style={styles.rowFront}>
        <TouchableOpacity 
          onPress={() => setVisibleAdd(true)}
          style={{height:60, alignItems:'center', width:380, flexDirection:'row'}}>
          <View style={{alignItems:'center', justifyContent:'center', width:50}}>
            <MaterialCommunityIcons name='pencil-plus' size={24} color={darkYellow}/>
          </View>
          <Text style={[styles.title, {color:darkYellow}]}>Add expense category</Text>
        </TouchableOpacity>
      </View>
      {/*************** Edit/delete category ***************/}
      <View style={{alignItems:'center', paddingBottom:6}}>
        <Text style={{fontStyle:'italic'}}>Swipe left to edit or delete the category</Text>
      </View>
      <SwipeListView
        data={listCategories}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-150}
        disableRightSwipe
        showsVerticalScrollIndicator={true}
      />
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: 'Close',
          onPress: () => {},
        }}>
        {"You just delete a category"}
      </Snackbar>

      {/*************** Modal to add category ***************/}
      <Modal 
        visible={visibleAdd} 
        animationType='slide'
      >
        <Pressable onPress={Keyboard.dismiss}>
          {/*********** Category name ***********/}
          <CustomModal
            header='New category'
            closeModal={closeAddModal}
          >
            <TextInput
              style={[styles.inputContainer, {textAlign:'left'}]}
              placeholder='Category'
              placeholderTextColor={lightBlue}
              value={inprogressCategory}
              onChangeText={(value) => setInprogressCategory(value)}
            />
          </CustomModal>
          {/*********** Category icon ***********/}
          <View style={styles.propertyContainer}>
            <View style={{
              flex:22,
              paddingLeft:12,
              justifyContent:'center'
              }}>
              <Text style={styles.propertyText}>Icon</Text>
            </View>
            <View style={{
                flex:80,
                alignItems:'center',
                justifyContent:'center',
              }}>
              <MaterialCommunityIcons name={inprogressIcon} size={32} color={inprogressColor}/>  
            </View>
          </View>
          <View style={{height:240}}>
            <FlatList
              contentContainerStyle={{alignSelf:'center'}}
              numColumns={5}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
              data={IconList}
              renderItem={({item}) => {
                return (
                  <View style={styles.itemView}>
                    <TouchableOpacity 
                      style={[styles.itemButton, {backgroundColor:'#fff', borderWidth:1, borderColor:'#b2b2b2'}]}
                      onPress={() => {setInprogressIcon(item.name)}}>
                      <MaterialCommunityIcons name={item.name} size={27} color='#767676'/>
                    </TouchableOpacity>
                  </View>
                )
            }}/>
          </View>
          {/*********** Category color ***********/}
          <View style={styles.propertyContainer}>
            <View style={{
              flex:22,
              paddingLeft:12,
              justifyContent:'center'
              }}>
              <Text style={styles.propertyText}>Color</Text>
            </View>
            <View style={{
                flex:80,
                alignItems:'center',
                justifyContent:'center',
                borderBottomColor:darkYellow,
              }}>
              <View style={[styles.itemButton, {backgroundColor:inprogressColor, borderWidth:1, borderColor:'#b2b2b2'}]}/>
            </View>
          </View>
          <View style={{height:240}}>
            <FlatList
              contentContainerStyle={{alignSelf:'center'}}
              numColumns={5}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
              data={ColorList}
              renderItem={({item}) => {
                return (
                  <View style={styles.itemView}>
                    <TouchableOpacity 
                      style={[styles.itemButton, {backgroundColor:item.color, borderWidth:1, borderColor:'#b2b2b2'}]}
                      onPress={() => {setInprogressColor(item.color)}}>
                    </TouchableOpacity>
                  </View>
                )
            }}/>
          </View>
          <View style={{alignItems:'center',justifyContent:'center', marginTop:15}}>
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={() => {onSubmitAdd(inprogressCategory, inprogressIcon, inprogressColor)}}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>


      {/*************** Modal to edit category ***************/}
      <Modal 
        visible={visibleEdit} 
        animationType='slide'
      >
        <Pressable onPress={Keyboard.dismiss}>
          {/*********** Category name ***********/}
          <CustomModal
            header='Edit'
            closeModal={closeEditModal}
          >
            <TextInput
              style={[styles.inputContainer, {textAlign:'left'}]}
              placeholder='Category'
              placeholderTextColor={lightBlue}
              value={inprogressCategory}
              onChangeText={(value) => setInprogressCategory(value)}
            />
          </CustomModal>
          {/*********** Category icon ***********/}
          <View style={styles.propertyContainer}>
            <View style={{
              flex:22,
              paddingLeft:12,
              justifyContent:'center'
              }}>
              <Text style={styles.propertyText}>Icon</Text>
            </View>
            <View style={{
                flex:80,
                alignItems:'center',
                justifyContent:'center',
            }}>
              <MaterialCommunityIcons name={inprogressIcon} size={32} color={inprogressColor}/>  
            </View>
          </View>
          <View style={{height:240}}>
            <FlatList
              contentContainerStyle={{alignSelf:'center'}}
              numColumns={5}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
              data={IconList}
              renderItem={({item}) => {
                return (
                  <View style={styles.itemView}>
                    <TouchableOpacity 
                      style={[styles.itemButton, {backgroundColor:'#fff', borderWidth:1, borderColor:'#b2b2b2'}]}
                      onPress={() => {setInprogressIcon(item.name)}}>
                      <MaterialCommunityIcons name={item.name} size={27} color='#767676'/>
                    </TouchableOpacity>
                  </View>
                )
            }}/>
          </View>
          {/*********** Category color ***********/}
          <View style={styles.propertyContainer}>
            <View style={{
              flex:22,
              paddingLeft:12,
              justifyContent:'center'
              }}>
              <Text style={styles.propertyText}>Color</Text>
            </View>
            <View style={{
                flex:80,
                alignItems:'center',
                justifyContent:'center',
                borderBottomColor:darkYellow,
              }}>
              <View style={[styles.itemButton, {backgroundColor:inprogressColor, borderWidth:1, borderColor:'#b2b2b2'}]}/>
            </View>
          </View>
          <View style={{height:240}}>
            <FlatList
              contentContainerStyle={{alignSelf:'center'}}
              numColumns={5}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
              data={ColorList}
              renderItem={({item}) => {
                return (
                  <View style={styles.itemView}>
                    <TouchableOpacity 
                      style={[styles.itemButton, {backgroundColor:item.color, borderWidth:1, borderColor:'#b2b2b2'}]}
                      onPress={() => {setInprogressColor(item.color)}}>
                    </TouchableOpacity>
                  </View>
                )
            }}/>
          </View>
          <View style={{alignItems:'center',justifyContent:'center', marginTop:15}}>
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={() => onSubmitEdit(inprogressId, inprogressCategory, inprogressIcon, inprogressColor)}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
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
  rowFront: {
    flexDirection:'row',
    backgroundColor: '#fff',
    alignItems:'center',
    borderRadius:5,
    height:55,
    margin:5,
    marginBottom:10,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
  },
  rowFrontVisible: {
    backgroundColor:'#fff',
    borderRadius:5,
    height:55,
    padding:10,
    marginBottom:15,
  },
  rowBack: {
    alignItems:'center',
    backgroundColor:'#DDD',
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingLeft:15,
    margin:5,
    marginBottom:15,
    borderRadius:5,
  },
  backRightButton: {
    bottom:0,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    top:0,
    width:75, 
  },
  backRightButtonLeft: {
    backgroundColor:'#1f65ff',
    right:75,
  },
  backRightButtonRight: {
    backgroundColor:'red',
    right:0,
    borderTopRightRadius:5,
    borderBottomRightRadius:5,
  },
  trash: {
    height:25,
    width:25,
  },
  title: {
    fontSize:18,
    fontWeight:'bold',
    color:'#666',
  },
  details: {
    fontSize:12,
    color:'#999',
  },
  itemView: {
    alignItems:'center',
    justifyContent:'center',
    height: 38,
    width:70,
    margin:5, 
  },
  itemButton: {
    flexDirection: 'row',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius:10, 
    borderBottomRightRadius:10,
    borderTopLeftRadius:10, 
    borderTopRightRadius:10, 
    backgroundColor:lightYellow,
    width:70
  },
  inputContainer: {
    color:darkBlue,
    borderColor: darkBlue,
    paddingRight: 12,
    width:210,
    borderRadius: 10,
    borderBottomWidth:1,
    fontSize: 17,
    fontWeight:'400',
    height: 36,
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
  propertyText: {
    fontSize: 19,
    fontWeight: '600',
    color: darkBlue,
  },
  submitButton: {
    alignItems:'center', 
    justifyContent:'center',
    backgroundColor:darkYellow,
    height:40,
    width:100, 
    borderRadius:5
  },
  submitText: {
    fontSize:20,
    color:'#fff',
    fontWeight:'600',
  },
})
export default ListOfExpenseCategory;