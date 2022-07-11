import React, {useState, useEffect, useMemo} from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Animated, Modal, Keyboard, TextInput } from 'react-native';
import { db } from '../api/db';
import { collection, onSnapshot, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { getUserID } from '../api/authentication';
import { Calendar } from 'react-native-calendars';
import { StatusBarHeight } from '../components/constants';
import moment from 'moment';
import { colors } from '../components/colors';
import { SwipeListView } from 'react-native-swipe-list-view';
import PressableText from '../components/Containers/PressableText';
import { Octicons, Entypo, Feather, MaterialCommunityIcons,  Foundation } from '@expo/vector-icons'
const {beige, brown, darkBlue, lightBlue, darkYellow,lighterBlue} = colors;


const CalendarScreen = (props) => {
  const [curDate, setCurDate] = useState(moment().format('YYYY-MM-DD'))
  const [curMonth, setCurMonth] = useState(moment().format('YYYY-MM-DD').substring(0, 7))
  const [finances, setFinances] = useState([])
  const [financesMonth, setFinancesMonth] = useState([])
  const [income, setIncome] = useState(0)
  const [incomeMonth, setMonthIncome] = useState(0)
  const [incomeDays, setIncomeDays] = useState([])
  const [expense, setExpense] = useState(0)
  const [expenseMonth, setExpenseMonth] = useState(0)
  const [total, setTotal] = useState(0)
  const [balanceDay, setBalanceDay] = useState(0)
  const [expenseDays, setExpenseDays] = useState([])
  const [list, setList] = useState([]);
  useEffect(() => {
    const financePath = 'Finance/' + getUserID() + '/' + curDate.substring(0, 4)
    const financeRef = collection(db, financePath)
    const dayFinanceQuery = query(financeRef, where('date', '==', curDate.substring(8, 10)), where('month', '==', curMonth.substring(5, 7)))
    onSnapshot(dayFinanceQuery, (snapShot) => {
      const finances = []
      const expenses = []
      const incomes = []
      snapShot.forEach((doc) => {
        finances.push({ 
          date: doc.data().year + '-' + doc.data().month + '-' + doc.data().date,
          amount: doc.data().amount,
          note: doc.data().note,
          category: doc.data().category,
          notedAt: doc.data().notedAt,
          type: doc.data().type
        })
        if (doc.data().type == 'expense') { 
          expenses.push(doc.data().amount)
        } else { 
          incomes.push(doc.data().amount)
        }
      })
      finances.sort((a, b) => a.notedAt < b.notedAt ? 1 : -1)
      setFinances(finances)
      const totalIncome = incomes.reduce((total, current) => total = total + current, 0);
      setIncome(totalIncome)
      const totalExpense = expenses.reduce((total, current) => total = total + current, 0);
      setExpense(totalExpense)
    })
    const monthFinanceQuery = query(financeRef, where('month', "==", curMonth.substring(5, 7)))
    onSnapshot(monthFinanceQuery, (snapShot) => {
      const expensesMonth = []
      const incomesMonth = []
      const expenseDays = []
      const incomeDays = []
      snapShot.forEach((doc) => {
        if (doc.data().type == 'expense') {
          expensesMonth.push(doc.data().amount)
          expenseDays.push(curDate.substring(0, 4) + '-' + doc.data().month + '-' + doc.data().date)
        } else {
          incomesMonth.push(doc.data().amount)
          incomeDays.push(curDate.substring(0, 4) + '-' + doc.data().month + '-' + doc.data().date)
        }
      })
      console.log(incomesMonth)
      console.log(expenseDays)
      const totalIncomeMonth = incomesMonth.reduce((total, current) => total = total + current, 0);
      setMonthIncome(totalIncomeMonth)
      setIncomeDays(incomeDays)
      setExpenseDays(expenseDays)
      const totalExpenseMonth = expensesMonth.reduce((total, current) => total = total + current, 0);
      setExpenseMonth(totalExpenseMonth)
      setTotal(totalIncomeMonth - totalExpenseMonth)
      })
  }, [curDate, curMonth])
  /*********** Calendar marked dots config ***********/
  const exp = {color:'red'}
  const inc = {color:'green'}

  const marked = useMemo(() => {
    const result = {}
    result[curDate] = {
      selected: true,
      disableTouchEvent: true,
    }
    incomeDays.forEach((day) => {
      if (result[day]) {
        result[day].dots = [inc]
      } else {
        result[day] = {dots: [inc]}
      }
    }
    )
    expenseDays.forEach((day) => {
      if (result[day]) {
        if (result[day].dots) {
          if (result[day].dots.includes(exp)) {
            // do not add
          } else {
            result[day].dots.push(exp)
          }
        }
        else {
          result[day].dots = [exp]
        }
      } else {
        result[day] = {dots: [exp]}
      }
    }
    )
    return result
  }, [curDate, curMonth, incomeDays, expenseDays]);

  /*************** Function to alert when deleting ***************/
  const alertDelete = (rowMap, rowKey, id) => {
    Alert.alert("Delete this record?","", [
      {text: 'Cancel', onPress: (modal) => {closeRow(rowMap, rowKey)}},
      {text: 'Delete', onPress: () => {deleteRow(id)}}
    ]);
  }
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }
  /*************** Function to delete record ***************/
  const deleteRow = (id) => {
    const cat = doc(db, 'Finance/' + getUserID() + '/' + curDate.substring(0, 4), id)
    deleteDoc(cat)
  }
  /*************** Function to edit record ***************/
  const editRow = (id) => {
    const path = 'Input Category/Expense/' + getUserID()
    const catRef = doc(db, path, id)
    updateDoc(catRef, {
      name: inprogressCategory,
      color: inprogressColor,
      icon: inprogressIcon,
    })
  }
  const renderItem = (data, rowMap) => {
    return <VisibleItem data={data}/>
  }

  const VisibleItem = props => {
    const {data} = props;
    return (
      <View style={[styles.rowFront, {backgroundColor: data.item.type == 'income' ? '#e2f5e2' : '#fdddcf'}]}>
        <View style={{flex:3, paddingLeft:15, flexDirection:'column'}}>
          <View style={{flexDirection:'row', marginBottom:3}}>
            <View style={{marginRight:10}}>
              <MaterialCommunityIcons name={data.item.icon} color={data.item.color} size={20}/>
            </View>
            <Text style={styles.categoryText}>{data.item.category}</Text>
            {/* <Text>{' (' + data.item.date + '-' + data.item.month + '-' + curDate.substring(0,4) + ')'}</Text> */}
          </View>
          {data.item.note != '' && 
          <View>
            <Text style={styles.noteText}>{data.item.note}</Text>
          </View>}
        </View>
        <View style={{flex:1.5, alignItems:'flex-end', justifyContent:'center', paddingRight:15}}>
          <Text style={[styles.amountText, {color: data.item.type == 'income' ? '#26b522' : '#ef5011'}]}>{data.item.type == 'income' ? '$' + data.item.amount : '-$' +data.item.amount}</Text>
        </View>
      </View>
    )
  }

  const renderHiddenItem = (data, rowMap) => {
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        onEdit={()=>{
          setVisibleEdit(true) 
          setInprogressCategory(data.item.category)
          setInprogressNote(data.item.note)
          setInprogressAmount(data.item.amount)
          setInprogressDate(moment(data.item.date, 'YYYY-MM-DD'))
          setInprogressId(data.item.amount)  
          setInprogressType(data.item.type)
        }}
        onDelete={()=>alertDelete(rowMap, data.item.key, data.item.id)}
      />
    )
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
  /*********** Variables to be set when editing ***********/
  const [inprogressAmount, setInprogressAmount] = useState(0);
  const [inprogressNote, setInprogressNote] = useState('');
  const [inprogressCategory, setInprogressCategory]= useState('');
  let [inprogressDate, setInprogressDate] = useState(moment());
  const [inprogressId, setInprogressId] = useState('');
  const [inprogressType, setInprogressType] = useState('')
  const [colorC, setColor] = useState('')
  const [visibleEdit, setVisibleEdit] = useState(false);
  const switchType = () => {
    if (inprogressType == 'income') {
      setInprogressType('expense')
    } else {
      setInprogressType('income')
    }
  }
  /********** Date Picker Variables **********/
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    setInprogressDate(moment(selectedDate))
  }

  const addOneDay = () => {
    inprogressDate = setInprogressDate(moment(inprogressDate).add(1, 'day'));
  }

  const subtractOneDay = () => {
    inprogressDate = setInprogressDate(moment(inprogressDate).subtract(1, 'day'));
  }
  /*************** Function to edit record ***************/
  const closeEditModal = () => {
    setInprogressCategory('')
    setInprogressNote('')
    setInprogressAmount(0)
    setInprogressDate(moment())
    setInprogressId('')  
    setInprogressType('')
    setShow(false)
    setVisibleEdit(false)
  }
  const onSubmitEdit = () => {
    editRow(inprogressId)
    setInprogressCategory('')
    setInprogressNote('')
    setInprogressAmount(0)
    setInprogressDate(moment())
    setInprogressId('')
    setInprogressType('')
    setShow(false)
    setVisibleEdit(false)
  }
  return (
    <>
      <View style={styles.container}>
        <View style={[styles.header, {marginBottom:5}]}>
          <Text style={styles.boldBlueHeaderText}>Calendar</Text>
        </View>
        <View style={[styles.calendarView, {borderRadius:10,backgroundColor:'#fffffd'}]}>
          <View style={{marginVertical:3,marginHorizontal:5}}>
            <Calendar
              theme={{    
                calendarBackground: '#fffffd'
              }}
              onDayPress={day => {
                  setCurDate(day.dateString)
                  setCurMonth(day.dateString.substring(0, 7))
                }
              }
              disableMonthChange={false}
              hideArrows={false}
              firstDay={1}
              markedDates = {marked}
              markingType = "multi-dot"
              onMonthChange={month => {setCurMonth(month.dateString.substring(0,7))}}
              enableSwipeMonths={true}
            />
          </View>
          <View style={{flexDirection:'row',marginHorizontal:5}}>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#e2f5e2',marginHorizontal:3}]}>
              <Text style={{color:'#26b522', fontSize:14, fontWeight:'500'}}>{" Income: $" + incomeMonth}</Text>
            </View>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#fdddcf',marginHorizontal:3}]}>
              <Text style={{color:'#ef5011', fontSize:14, fontWeight:'500'}}>{" Expense: $" + expenseMonth}</Text>
            </View>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#e6e6e6',marginHorizontal:3}]}>
              <Text style={{color:'#494949', fontSize:14, fontWeight:'500'}}>{" Balance: $" + total}</Text>
            </View>
          </View>
        </View>

        
        <View style={{alignItems:'center', justifyContent:'center', paddingBottom:7}}>
          <Text style={{fontSize:16, fontWeight:'700', color:darkBlue}}>{"Date: " + curDate.split('-').reverse().join('-')}</Text>
        </View>
        <View>
          <View style={{flexDirection:'row', marginHorizontal:10, marginBottom:10}}>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#e2f5e2'}]}>
              <Text style={{color:'#26b522', fontSize:14, fontWeight:'500'}}>{" Income: $" + income}</Text>
            </View>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#fdddcf'}]}>
              <Text style={{color:'#ef5011', fontSize:14, fontWeight:'500'}}>{" Expense: $" + expense}</Text>
            </View>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#e6e6e6'}]}>
              <Text style={{color: '#494949', fontSize:14, fontWeight:'500'}}>{" Balance: $" + balanceDay}</Text>
            </View>
          </View>
        </View>
        {/************ List ************/}
        <View style={{height: 260}}>
          <SwipeListView 
            data={finances}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-150}
            disableRightSwipe
            showsVerticalScrollIndicator={true}
          />
        </View>
      </View>


      {/*************** Modal to edit category ***************/}
      <Modal 
        visible={visibleEdit} 
        animationType='slide'
      >
        <Pressable onPress={Keyboard.dismiss}>
          {/*********** Header ***********/}
          <View style={[styles.headerModal, {flexDirection:'row'}]}>
            <View style={{flex:4}}>
              <Text></Text>
            </View>
            <View style={{flex:8, alignItems:'center',justifyContent:'center'}}>
              <Text style={styles.boldBlueHeaderText}>Edit</Text>
            </View>
            <View style={{flex:4, alignItems:'center', justifyContent:'center', marginBottom:10}}>
              <TouchableOpacity 
                style={{alignItems:'center', justifyContent:'center',backgroundColor:darkYellow,height:30,width:65, borderRadius:5}}
                onPress={closeEditModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*********** Type ***********/}
          <View style={styles.noteView}>
            <View style={{
              flex:20,
              paddingLeft:12,
              justifyContent:'center'
              }}>
              <Text style={styles.dateText}>Type</Text>
            </View>
            <View style={{
              flex:80,
              alignItems:'center',
              justifyContent:'center',
              borderBottomColor:darkYellow,
            }}>
              <TouchableOpacity 
                style={{alignItems:'center',justifyContent:'center', backgroundColor:inprogressType=='income' ? '#e2f5e2' : '#fdddcf', width:210, height:34, borderRadius:20}}
                onPress={switchType}>
                <Text style={{color: inprogressType=='income' ? '#26b522' : '#ef5011', fontSize:18, fontWeight:'500'}}>
                  {inprogressType=='income' ? 'Income' : 'Expense'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*********** Date ***********/}
          <View style={styles.dateView}>
            <View style={{
              flex:20,
              paddingLeft:12,
              justifyContent:'center'
            }}>
              <Text style={styles.dateText}>Date</Text>
            </View>
            <View style={{
              flex:15,
              alignItems:'center',
              justifyContent:'center'
            }}>
              <TouchableOpacity style={{position: 'absolute'}} onPress={subtractOneDay}>
                <Entypo name='chevron-left' size={28} color={darkBlue}/>
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerView}>
              <TouchableOpacity onPress={()=>setShow(true)}>
                <View>
                  <Text style={styles.dateText}>{inprogressDate.format('MMMM Do, YYYY')}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{
              flex:15,
              alignItems:'center',
              justifyContent:'center'
            }}>
              <TouchableOpacity style={{position: 'absolute'}} onPress={addOneDay}>
                <Entypo name='chevron-right' size={28} color={darkBlue}/>
              </TouchableOpacity>
            </View>
          </View>
          {show && (
            <>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', paddingTop:10, paddingLeft:20, paddingRight:20}}>
                <View style={{flex:5}}>
                  <TouchableOpacity onPress={()=> {setShow(false), setInprogressDate(moment())}}>
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
                  value={new Date(inprogressDate)}
                  display='spinner'
                  textColor={darkBlue}
                  onChange ={onChange}
                  minimumDate={new Date(moment().subtract(50, 'years').format('YYYY-MM-DD'))}
                  maximumDate={new Date(moment().add(50, 'years').format('YYYY-MM-DD'))}
                />
            </>
          )}

          {/*********** Amount ***********/}
          <View style={styles.dateView}>
            <View style={{
              flex:30,
              paddingLeft:12,
              justifyContent:'center'
              }}>
              <Text style={styles.dateText}>Income</Text>
            </View>
            <View style={{flex:5}}></View>
            <View style={styles.datePickerView}>
              <TextInput
                style={[styles.inputContainer, {textAlign:'right'}]}
                maxLength={10}
                placeholder='0.00'
                placeholderTextColor={lightBlue}
                keyboardType='decimal-pad'
                value={inprogressAmount}
                onChangeText={(value) => setInprogressAmount(value)}
              />
            </View>
            <View style={{
              flex:15, 
              justifyContent:'center',
              alignItems:'center'
              }}>
                <Foundation name='dollar' size={34} color={darkBlue}/>
            </View>
          </View>
          {/*********** Note ***********/}
          <View style={styles.noteView}>
            <View style={{
              flex:20,
              paddingLeft:12,
              justifyContent:'center'
              }}>
              <Text style={styles.dateText}>Note</Text>
            </View>
            <View style={{
              flex:80,
              alignItems:'center',
              justifyContent:'center',
              borderBottomColor:darkYellow,
            }}>
              <TextInput
                style={[styles.noteInputContainer, {textAlign:'left'}]}
                placeholder='Note'
                placeholderTextColor={lightBlue}
                value={inprogressNote}
                onChangeText={(value) => setInprogressNote(value)}
              />
            </View>
          </View>
          {/*********** Category ***********/}
          <View style={styles.noteView}>
            <View style={{
              flex:22,
              paddingLeft:12,
              justifyContent:'center'
              }}>
              <Text style={styles.dateText}>Category</Text>
            </View>
            <View style={{
                flex:80,
                alignItems:'center',
                justifyContent:'center',
                borderBottomColor:darkYellow,
              }}>
                <Text style={[styles.categoryText, {color:colorC}]}>{inprogressCategory}</Text>
            </View>
          </View>
          <View style={{height:160}}>
            <FlatList
              scrollEnabled={true}
              contentContainerStyle={{alignSelf: 'flex-start'}}
              numColumns={3}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
              data={inprogressType == 'income' ? list : list} //Change this to category list (income or expense)
              renderItem={({item}) => {
                if (!item.isEdit) {
                  return (
                    <View style={styles.itemView}>
                      <TouchableOpacity 
                        style={styles.itemButton}
                        onPress={() => {setChosenCategory(item.name); setColor(item.color)}}>
                        <MaterialCommunityIcons name={item.icon} size={20} color={item.color}/>
                        <Text style={[styles.categoryButtonText, {color:item.color}]}>{' ' + item.name}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                }
                return null
              }}
            />
          </View>
          {/*********** Submit button ***********/}
          <View style={[styles.submitButtonView, {alignItems:'center', justifyContent:'center', }]}>
            <TouchableOpacity 
            style={[styles.inputButton, {borderBottomLeftRadius:10, borderTopLeftRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10, backgroundColor:darkYellow,width:120}]} 
            onPress={() => {onSubmitEdit}}>
              <Text style={styles.cancelText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
  },
  calendarView: {
    marginVertical:8,
    marginHorizontal:10,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:3,
    elevation:5,
  },
  header: {
    alignItems:'center', 
    justifyContent:'flex-end',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:0,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    paddingTop:3,
    height: StatusBarHeight + 42,
    backgroundColor: lighterBlue,
    shadowColor:darkBlue,
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:3,
  },
  footer: {
    flex:3.7,
    backgroundColor:'#fff',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    paddingHorizontal:15,
    paddingVertical:18,
  },
  boldBlueHeaderText: {
    fontSize: 35,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  ringView: {
    flexDirection:'column',
    backgroundColor: '#fff',
    borderRadius:25,
    height:193,
    margin:5,
    marginBottom:10,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
    paddingLeft:10
  },
  incomeexpenseView: {
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    marginHorizontal:7,
    marginBottom:9,
    height:40,
  
    shadowRadius:2,
  },
  rowFront: {
    flexDirection:'row',
    backgroundColor: '#fff',
    alignItems:'center',
    borderRadius:10,
    height:60,
    marginHorizontal: 5, 
    marginVertical:5,
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
    marginHorizontal:5,
    marginVertical:10,
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
    height:60, 
    marginTop:-5
  },
  backRightButtonRight: {
    backgroundColor:'red',
    right:0,
    borderTopRightRadius:11,
    borderBottomRightRadius:11,
    height:60, 
    marginTop:-5
  },
  categoryText: {
    fontSize:20,
    fontWeight:'bold'
  },
  noteText: {
    fontSize:15,
    fontWeight:'400'
  },
  amountText: {
    fontSize:24,
    fontWeight:'bold'
  },
  headerModal: {
    alignItems:'flex-end', 
    justifyContent:'center',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    height: StatusBarHeight + 48,
  },
  cancelText: {
    fontSize:18,
    color:'#fff',
    fontWeight:'500',
  },
  submitButtonView: {
    alignItems:'center',
    justifyContent:'center',
    paddingBottom:4,
    paddingTop:4,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',     
    height:48
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
  propertiesView: {
    flexDirection:'row',
    paddingBottom:7,
    paddingTop:7,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',
    borderTopWidth:1,            
    height:48
  },
  dateView: {
    flexDirection:'row',
    paddingBottom:7,
    paddingTop:7,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',
    borderTopWidth:1,            
    height:48
  },
  dateText: {
    fontSize: 19,
    fontWeight: '600',
    color: darkBlue,
  },
  datePickerOffText: {
    fontSize: 18,
    fontWeight: '400',
    color: lightBlue,
  },
  datePickerView: {
    flex:55,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FDEE87',
    borderRadius:20
  },
  inputContainer: {
    backgroundColor: '#FDEE87',
    color: darkBlue,
    borderColor: darkBlue,
    paddingRight: 12,
    width:200,
    borderRadius: 10,
    fontSize: 20,
    fontWeight:'600',
    height: 36,
  },
  noteView: {
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
  noteInputContainer: {
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
  categoryText: {
    fontSize: 18,
    fontWeight: '500',
  },
  itemView: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    height: 50,
    width:138, 
  },
  itemButton: {
    flexDirection: 'column',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    backgroundColor:'#fff',
    width:128,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  }
})
export default CalendarScreen;
