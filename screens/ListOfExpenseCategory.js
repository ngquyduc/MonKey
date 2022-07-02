import React, {useState} from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity, Animated } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { colors } from '../components/colors';
import { StatusBarHeight } from '../components/constants';
import ExpenseCategory from '../CategoriesList/ExpenseCategory';
import { Feather, Octicons, Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

const ListOfExpenseCategory = () => {
  const [visible, setVisible] = useState(false);

  const [recentDelete, setRecentDelete] = useState('');

  const onDismissSnackBar = () => setVisible(false);
  
  const [listCategories, setListCategories] = useState(
    ExpenseCategory.map((ExpenseCategoryItem, index) => ({
      key: `${ExpenseCategoryItem.name}`,
      title: ExpenseCategoryItem.name,
      isEdit: ExpenseCategoryItem.isEdit
    }))
  )

  const editRow = (rowMap, rowKey) => {
    
  }

  const deleteRow = (rowMap, rowKey, rowTitle) => {
    const newData = [...listCategories];
    const prevIndex = listCategories.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex,1);
    setListCategories(newData);
    setVisible(true);
  }

  const HiddenItemWithActions = props => {
    const {swipeAnimatedValue, onEdit, onDelete} = props;
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonLeft]} onPress={onEdit}>
          <Feather name="edit-3" size={25} color="#fff"/>  
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonRight]} onPress={onDelete}>
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
        <TouchableOpacity style={styles.rowFrontVisible}>
          <View>
            <Text style={styles.title}>{data.item.title}</Text>
          </View>
        </TouchableOpacity>
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
        onEdit={()=>editRow(rowMap,data.item.key)}
        onDelete={()=>deleteRow(rowMap,data.item.key,data.item.title)}
      />
    )
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.boldBlueHeaderText}>Edit category</Text>
      </View>
      <View style={{alignItems:'center'}}>
        <Text style={{fontStyle:'italic'}}>Swipe left to edit or delete the category</Text>
      </View>
      <SwipeListView
        data={listCategories}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-150}
        disableRightSwipe
        showsVerticalScrollIndicator={false}
      />
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Undo',
          onPress: () => {
            // Retore the category that just deleted
          },
        }}>
        {"You just delete a category"}
      </Snackbar>

    </>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems:'center', 
    justifyContent:'flex-end',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    paddingTop:3,
    height: StatusBarHeight + 48,
  },
  boldBlueHeaderText: {
    fontSize: 34,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  rowFront: {
    backgroundColor: '#fff',
    //justifyContent:'center',
    borderRadius:5,
    height:60,
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
    height:60,
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
    //marginBottom:5,
    color:'#666',
  },
  details: {
    fontSize:12,
    color:'#999',
  },
})
export default ListOfExpenseCategory;