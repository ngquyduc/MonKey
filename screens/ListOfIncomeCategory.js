import React, {useState, useMemo} from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Animated, Keyboard, Alert, Modal, Pressable } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { colors } from '../components/colors';
import { StatusBarHeight } from '../components/constants';
import IncomeCategory from '../CategoriesList/IncomeCategory';
import { Feather, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import IconList from '../CategoriesList/IconList'
import ColorList from '../CategoriesList/ColorList'
import CustomModal from '../components/Containers/CustomModal';
import { AddIncomeCategory } from '../api/db';
import { getUserID } from '../api/authentication';
import { collection, orderBy, query, onSnapshot } from 'firebase/firestore';
import { db } from '../api/db';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

/* Things to do
 * Make onSubmitAdd() function (line 133)
 * Make onSubmitEdit() function (line 139)
 * Make restoreRow() function (line 50)
 * Modify deleteRow() function (line 155)
 * Create a income category list on database
 */

const ListOfIncomeCategory = ({navigation}) => {
  /*************** Modifying category ***************/
  const [inprogressCategory, setInprogressCategory] = useState('');
  const [inprogressIcon, setInprogressIcon] = useState('');
  const [inprogressColor, setInprogressColor] = useState('#767676');
  
  /*************** Visibility of snackbar ***************/
  const [visible, setVisible] = useState(false);

  /*************** Visibility of add modal ***************/
  const [visibleAdd, setVisibleAdd] = useState(false);

  /*************** Visibility of edit modal ***************/
  const [visibleEdit, setVisibleEdit] = useState(false);
  
  const [listCategories, setListCategories] = useState([])
  /*************** Function to edit category ***************/
  const editRow = (rowMap, rowKey) => {
    //to be implemented
  }

  /******** Function to restore category after being deleted ********/
  const restoreRow = (rowMap, rowKey) => {
    //to be implemented
  }

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
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonRight, {height:55}]} onPress={onDelete}>
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
    if (data.item.isEdit) {
      return null;
    }
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
        onEdit={()=>{setVisibleEdit(true), setInprogressCategory(data.item.title)}}
        onDelete={()=>alertDelete(rowMap,data.item.key,data.item.title)}
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
    setVisibleEdit('false')
  }
  /*************** Function when submitting new/edit category ***************/
  const onSubmitAdd = (n, i, c) => {
    AddIncomeCategory(n, i, c)
    setInprogressCategory('')
    setInprogressColor('#767676')
    setInprogressIcon('')
    setVisibleAdd(false)
  }
  const onSubmitEdit = () => {
    setInprogressCategory('')
    setInprogressColor('#767676')
    setInprogressIcon('')
    setVisibleEdit(false)
  }

  /*************** Function to alert when deleting ***************/
  const alertDelete = (rowMap, rowKey, rowTitle) => {
    Alert.alert("Delete this category?","", [
      {text: 'Cancel', onPress: () => {closeRow(rowMap, rowKey)}},
      {text: 'Delete', onPress: () => {deleteRow(rowMap, rowKey, rowTitle)}}
    ]);
  }

  /*************** Function to delete category ***************/
  const deleteRow = (rowMap, rowKey, rowTitle) => {
    const newData = [...listCategories];
    const prevIndex = listCategories.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex,1);
    setListCategories(newData);
    setVisible(true);
  }

  useMemo(() => {
    const IncomeCategoryRef = collection(db, 'Input Category/Income/' + getUserID())
    const q = query(IncomeCategoryRef, orderBy('name', 'asc'))
    onSnapshot(q,
      (snapShot) => {
        const list = []
        snapShot.forEach((IncomeCategoryItem) => {
          list.push(({
            key: `${IncomeCategoryItem.data().name}`,
            title: IncomeCategoryItem.data().name,
            isEdit: false,
            id: IncomeCategoryItem.id,
            icon: IncomeCategoryItem.data().icon,
            color: IncomeCategoryItem.data().color
          }))
        })
        setListCategories(list)
      }
    )
    
  }, [])

  return (
    <>
      {/*************** Header ***************/}
      <View style={styles.header}>
        <View style={{flex:2, paddingLeft:5, paddingBottom:7}}>
          <TouchableOpacity onPress={()=>navigation.navigate('Input')}>
            <MaterialCommunityIcons name='chevron-left' size={44} color={darkBlue}/>
          </TouchableOpacity>
        </View>
        <View style={{flex:8,alignItems:'center',justifyContent:'center'}}>
          <Text style={styles.boldBlueHeaderText}>Income</Text>
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
          <Text style={[styles.title, {color:darkYellow}]}>Add income category</Text>
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
          label: 'Undo',
          onPress: () => {restoreRow
            // Retore the category that just deleted
          },
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
              <Text style={styles.onSubmitNew}>Submit</Text>
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
              onPress={() => {onSubmitEdit}}>
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
    height: StatusBarHeight + 48,
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
export default ListOfIncomeCategory;