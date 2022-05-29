import { StyleSheet } from "react-native";
import { StatusBarHeight } from "./constants";
import { colors } from "./colors";
const {beige, brown, darkBlue, lightBlue, darkYellow} = colors;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 25,
    paddingTop: StatusBarHeight + 30,
    backgroundColor: beige,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  appName: {
    fontSize: 70,
    fontWeight: 'bold',
    color: darkYellow,
    textShadowOffset: {
      height: 2,
      width: 2,
    },
    textShadowColor: darkBlue,
    textShadowRadius:5,
    marginBottom: 25,
  },
  boldBlueText: {
    fontSize: 42,
    fontWeight: '300',
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  italicText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: brown,
  },
  brownRegularText: {
    fontSize: 18,
    fontWeight: '400',
    color: brown,
  },
  blueRegularText: {
    fontSize: 18,
    fontWeight: '400',
    color: darkBlue,
  },
  inputContainer: {
    backgroundColor: beige,
    color: darkBlue,
    borderColor: darkBlue,
    padding: 15,
    paddingLeft: 60,
    paddingRight: 55,
    borderRadius: 8,
    borderWidth: 2,
    fontSize: 18,
    height: 60,
    marginTop: 3,
    marginBottom: 25
  },
  leftIconContainer: {
    position: 'absolute',
    top: 40,
    left: 13,
    zIndex: 1,
    borderRightWidth:2,
    borderRightColor: darkBlue,
    paddingRight: 8
  },
  rightIconContainer: {
    position: 'absolute',
    top: 40,
    right: 13,
    zIndex: 1,
  },
  signInUpButton: {
    padding: 15,
    backgroundColor: darkBlue,
    flexDirection: 'row',
    flex: 1,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loginText: {
    fontSize: 21,
    fontWeight: '500',
    color: beige,
  }
});

export default styles;