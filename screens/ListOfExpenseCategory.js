import React, {useState} from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { colors } from '../components/colors';
import { StatusBarHeight } from '../components/constants';
import ExpenseCategory from '../CategoriesList/ExpenseCategory';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

const ListOfExpenseCategory = () => {

  const [listCategories, setListCategories] = useState(
    ExpenseCategory.map((ExpenseCategoryItem, index) => ({
      key: `${index}`,
      title: ExpenseCategoryItem.name,
    }))
  )

  const editRow = (rowMap, rowKey) => {

  }

  const deleteRow = (rowMap, rowKey) => {

  }

  const HiddenItemWithActions = props => {
    const {onClose, onDelete} = props;
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonLeft]}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonRight]}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const VisibleItem = props => {
    const {data} = props;
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
        onDelete={()=>deleteRow(rowMap,data.item.key)}
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
      />
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems:'center', 
    justifyContent:'flex-end',
    backgroundColor:lightYellow,
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
    borderRadius:5,
    height:60,
    margin:5,
    marginBottom:15,
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
    alignItems:'flex-end',
    justifyContent:'center',
    position:'absolute',
    top:0,
    width:75,
    paddingRight:17,
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
    marginRight:7,
  },
  title: {
    fontSize:14,
    fontWeight:'bold',
    marginBottom:5,
    color:'#666',
  },
  details: {
    fontSize:12,
    color:'#999',
  },
})
export default ListOfExpenseCategory;