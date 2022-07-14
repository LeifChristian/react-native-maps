import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  AsyncStorage
} from "react-native";
const FBSDK = require("react-native-fbsdk");
import * as dataLayer from "../utility/dataLayer";
import { parseUrl } from "../utility/constants";
const { LoginManager } = FBSDK;
import  ToastAndroid from 'react-native-simple-toast';
export default class Logout extends Component {
  
  componentWillMount() {
    AsyncStorage.getItem("ParseUser").then(value => {
      if(value==null)
        {
         // console.log("Enter");
          AsyncStorage.clear();
       LoginManager.logOut();
    this.props.navigation.navigate("Signup");
        }
      let temp = JSON.parse(value);
      let sessionToken = temp.sessionToken;
      let url = parseUrl + "logout";
      let method='post';
       AsyncStorage.clear();
       LoginManager.logOut();
      dataLayer
        .logoutParseData(url, method, sessionToken)
        .then(response => response.json())
        .then(responseJson => {
        //  console.log("in");
           this.props.navigation.navigate("Signup");
        })
        .catch(error => {
        //  console.log("error");
           this.props.navigation.navigate("Signup");
          ToastAndroid.showWithGravity(
            "Error in connect to server",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        });
    });
   
  }

  render() {
    return <View />;
  }
}
