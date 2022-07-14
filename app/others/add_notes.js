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
  AsyncStorage,Keyboard
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, parseUrl } from "../utility/constants";
const Timestamp = require("react-timestamp");
import PTRView from "react-native-pull-to-refresh";
export default class Add_Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: "",
      chat_hostory: "",
      sender_id: "",
      reciver_id: "",
      frnd_name:'',
      network_id:''
    };

  } 
 
  render() {
    
    return (
     <View style={styles.container}>
     <View style={styles.header}> 
         <Text style={styles.headlabel}> New Note </Text>  
          <TouchableOpacity>
              <Image
                  style={styles.smalllthumb}
                  source={require("../assets/img/close.png")}
                />
            </TouchableOpacity>
     </View>
      <View style={ styles.title_bar}> 
          <Text style={ styles.title}> Title </Text>
      </View>
      <ScrollView style={styles.notecontent}> 
         <TextInput multiline={true} placeholder="Write your note here" style={styles.input} />         
      </ScrollView>
      <View style={styles.footer}> 
        <TouchableOpacity>
              <Image
                  style={styles.smalllthumb}
                  source={require("../assets/img/right_icon.png")}
                />
      </TouchableOpacity>

      </View>
     </View>
     
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor:'#fff', paddingTop: 0 },

  header: {
    height:65, 
    color:'#333', 
    padding:20, 
    flexDirection:'row',
    backgroundColor:'#fff', borderBottomWidth:1, borderColor:'#e1e1e1'},

    headlabel:{ color:'#b4b4b4', fontSize:22, width:285,},

    title_bar:{ padding:20,},

    title:{ fontSize:26, color:'#333'},

    notecontent:{paddingTop:5, paddingLeft:20, paddingRight:20,},

    input:{ height:400, },
    footer:{ backgroundColor:'#1b6da5', height:55,textAlign: "right",
    alignItems: "center",
    justifyContent: "center"},
 });
