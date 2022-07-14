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
  AsyncStorage, 
  Clipboard,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import firebase from '../Firebase'
import FCM, { FCMEvent, NotificationType, WillPresentNotificationResult, RemoteNotificationResult } from 'react-native-fcm';
let url
let method
let body
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, parseUrl, network_img } from "../utility/constants";
const Timestamp = require("react-timestamp");
import PTRView from "react-native-pull-to-refresh";
import Emoticons from 'react-native-emoticons';
const triangle = require('../assets/img/triangle.png')
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: "",
      chatData:[],
      chat_hostory: "",
      sender_id: "",
      reciver_id: "",
      frnd_name: '',
      network_id: '',
      intervalId: '',
      chat_full_history: [],
      search_txt: '',
      reciever_img: '',
      sender_img: '',
      showEmoticons:false
    };
    this._refresh = this._refresh.bind(this);
  }

  searchFilter() {
    let text = this.state.search_txt;
    let fullList = this.state.chatData;
    let filteredList = fullList.filter(item => {
      if (item.text.toLowerCase().match(text)) return item;
    });

    if (!text || text === "") {
      this.setState({
        chat_hostory: fullList
      });
      this.startSetInterval();
    } else if (Array.isArray(filteredList)) {
      this.setState({
        chat_hostory: filteredList
      });
      clearInterval(this.state.intervalId);
    }
  }
  checktext(text) {
    if (text == "") {
      var Data = this.state.chat_full_history;
      this.setState({
        chat_hostory: Data,
        search_txt: text
      });
      this.startSetInterval();
    } else {
      let fullList = this.state.chat_full_history;
      let filteredList = fullList.filter(item => {
        if (item.message != undefined) {
          if (item.message.toLowerCase().match(text)) return item;
        }
      });
      if (!text || text === "") {
        this.setState({
          chat_hostory: fullList,
          search_txt: text
        });
      } else if (Array.isArray(filteredList)) {
        this.setState({
          chat_hostory: filteredList,
          search_txt: text
        });
        clearInterval(this.state.intervalId);
      }
    }
  }

  getChat() {
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      let userid = temp._id;
      var frnd_id = this.state.reciver_id;
      var network_id = this.state.network_id;
      allMessages = []
      console.log('userid : ', userid)
      console.log('frd_id  : ', frnd_id)
      chatRef.on("value", snap => {
        // get children as an array
        console.log('rsnap from user=', snap)
        snap.forEach(child => {
            let item = child.val();
            item.key = child.key;
            allMessages.push({
                senderId:child
                .val()
                .uid,
                _id: child
                    .val()
                    .createdAt,
                text: child
                    .val()
                    .text,
                createdAt: new Date(child.val().createdAt),
                key:item.key,
                user: {
                    _id: child
                        .val()
                        .uid
                    //avatar: avatar
                }
            });
        });
        //dispatch(addMessage(allMessages))
        this.props.dispatch({
          type: "addMessage",
          payLoad: allMessages
        });
        this.setState({chatData:allMessages})
        allMessages = []
        console.log('received data from user=', allMessages)
    });
    });
  }
  componentDidMount() {
    AsyncStorage.getItem("frnd_id").then(value1 => {
      let temp1 = JSON.parse(value1);
      var id_frnd = temp1.frndid;
      var frndname = temp1.frndname;
      var network_id = temp1.network_id;
      var reciverimg = temp1.frnd_img;
      this.setState({ reciver_id: id_frnd, frnd_name: frndname, network_id: network_id, reciever_img: reciverimg });

      AsyncStorage.getItem("user_data").then(value => {
        let temp = JSON.parse(value);
        let userid = temp._id;
        console.log(' data : ', temp)
        console.log('use data : ', userid)
        console.log('frd data : ', id_frnd )
        if (temp.user_pic != '' && temp.user_pic != undefined) {
          var senderimg = network_img + temp.user_pic;
        } else {
          var senderimg = network_img + "default_img.png";
        }
        user = firebase
        .auth()
        .currentUser;
      chatRef = firebase
        .database()
        .ref()
        .child("chat/" + (userid > id_frnd
          ? `${userid}-${id_frnd}-${this.state.network_id}`
          : `${id_frnd}-${userid}-${this.state.network_id}`));
      console.log("User:" + chatRef);
      this.chatRefData = firebase
        .database()
        .ref()
        .orderByChild("order");
        this.setState({ sender_id: userid, sender_img: senderimg });
        this.getChat();
  
      });
    });
    
   
  }
  // pull to Refersh
  _refresh() {

    this.getChat();
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }
  // componentDidMount() {
  //   intervalId = setInterval(
  //     () => this.getChat(),
  //     10000
  //   );
  //   this.setState({ intervalId: intervalId });
  // }
  // startSetInterval() {
  //   intervalId = setInterval(
  //     () => this.getChat(),
  //     3000
  //   );
  //   this.setState({ intervalId: intervalId });
  // }
  // componentWillUnmount() {
  //   clearInterval(this.state.intervalId);
  // }

  sendChat() {
    if (this.state.chat) {
      this.setState({ chat: "" });
      var user_id = this.state.sender_id;
      var frnd_id = this.state.reciver_id;

      var now = new Date().getTime();
      chatRef.push({
        _id: now,
        text: this.state.chat,
        createdAt: now,
        uid: user_id,
        fuid: frnd_id,
    });
      // console.log('body===', body)
      // dataLayer
      //   .sendParseData(url, method, body)
      //   .then(response => response.json())
      //   .then(responseJson => {
      //     console.log('send chat === ', responseJson)
      //     this.setState({ chat: "" });
      //     this.getChat();
      //     //Keyboard.dismiss()
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    }
  }
  render() {
    console.log('chat data : ',this.state.chatData)
    console.log('sender id ---: ',this.state.sender_id)
    console.log('reciver id ---: ',this.state.reciver_id)
   
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS=='ios'?'padding':null}>
        <View style={styles.header}>
          <TouchableOpacity
            transparent
            style={styles.headerleft}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}> {this.state.frnd_name} </Text>
          </View>

          {/* <View style={styles.headerright}>
            <Image
              style={styles.baricon}
              source={require("../assets/img/videocam.png")}
            />
          </View> */}

        </View>
        <View style={styles.searchbar}>
          <TextInput
            placeholder="SEARCH"
            style={[styles.input,{width:'85%'}]}
            onChangeText={text => this.checktext(text)}
          />
          <TouchableOpacity onPress={() => this.searchFilter()}>
            <Image
              style={styles.searchicon}
              source={require("../assets/img/searchicon.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={{flex:1}}>
        <ScrollView ref="scrollView"
          onContentSizeChange={(width, height) => this.refs.scrollView.scrollToEnd()}>
          <PTRView onRefresh={this._refresh}>
            <View style={styles.chat_wrapper}>
              {
                this.state.chatData?
                 this.state.chatData.map((data321, index123) =>
                 data321.senderId === this.state.reciver_id?
                <View style={styles.jecket}>
              
                {/* {<Image
                  style={styles.recieverimg}
                  source={{ uri: this.state.reciever_img }} />} */}

                  <View style={{flexDirection:'row',marginBottom:10}}>
                      <View  style={{backgroundColor:'white',padding:12,borderRadius:20,marginLeft:5,borderBottomLeftRadius:0,borderTopLeftRadius:20}}>
                      <Text selectable={true}>
                      {data321.text} 
                      </Text>
                      </View>
                  </View>
              </View>
              :
            //   <View style={styles.right_chatcontent}>
            //   <Text style={styles.contentTxt}>{data321.text} </Text>
            //   <View style={styles.chat_time}>
            //     <Text style={styles.sendingTime}>
            //     30
            //       {/* <Timestamp time={data321.updatedAt} component={Text} /> */}
            //     </Text>
            //     {<Image
            //       style={styles.senderimg}
            //       source={{ uri: this.state.sender_img }} />}
            //   </View>
            // </View>
            <View style={[styles.jecket,{alignSelf:'flex-end',alignItems:'flex-end',flexDirection:null}]}>
              <View style={{marginBottom:10}}>
                  <View style={{backgroundColor:'white',padding:12,borderRadius:20,marginLeft:5,borderBottomRightRadius:0,borderTopRightRadius:20}}>
                    <Text selectable={true}>
                    {data321.text} 
                    </Text>
                  </View>
              </View>
          </View>
            ):null
              }
            </View>
          </PTRView>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.footlft}>
            {/* <View style={styles.msgtoolbox}>
              <TouchableOpacity>
                <Image
                  style={styles.toolicon}
                  source={require("../assets/img/redmap_pin.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  style={styles.toolicon}
                  source={require("../assets/img/grycamera.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  style={styles.toolicon}
                  source={require("../assets/img/picture_icon.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  style={styles.toolicon}
                  source={require("../assets/img/paperpin.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.setState({showEmoticons:!this.state.showEmoticons})}>
                <Image
                  style={styles.toolicon}
                  source={require("../assets/img/yellowsmily.png")}
                />
              </TouchableOpacity>
            </View> */}
            <View style={styles.msgtypingbox}>
              <TextInput
                placeholder="Your Message"
                style={styles.input}
                value={this.state.chat}
                multiline={true}
                onChangeText={text => this.setState({ chat: text })}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.footrit}
            onPress={() => this.sendChat()}
          >
            <Image
              style={styles.luncher}
              source={require("../assets/img/luncher.png")}
            />
          </TouchableOpacity>
        </View>
        </View>
      
      </KeyboardAvoidingView>
    );
  }
}
function mapStateToProps(state) {
  return {
    chatData: state.chatData
  };
}
module.exports = connect(mapStateToProps)(Chat)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },

  headercenter: { width: 285 },

  headerright: { width: 90 },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 35, height: 22, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  chat_wrapper: { margin:5, paddingRight: 5},

  date: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#0f5787",
    fontSize: 20,
    marginBottom: 30,
    marginTop: 20
  },

  jecket: { flexDirection: 'row',alignItems:'center',width:'80%' },

  lft_chatcontent: { padding: 8,borderWidth:1},

  right_chatcontent: {
   // width: 265,
    borderRadius: 15,
    marginLeft: 65,
    borderRadius: 15,
    marginBottom: 10,
   // backgroundColor: '#f1f1f1',
  },

  senderimg: { borderRadius: 30,width: 30, height: 30,  },

  recieverimg: { borderRadius: 30, width: 40, height: 40,  },

  chat_time: { flexDirection: "row" },

  contentTxt: {
    padding: 12,
   // lineHeight: 24,
    fontSize: 18,
    backgroundColor: "#fff",
    borderRadius: 15,
   // minHeight: 40,
    borderWidth:1
  },

  sendingTime: {
    textAlign: "right",
    width: 230,
    color: "#bcbcbe",
    fontWeight: "bold",
    padding: 8
  },

  checkicon: { marginTop: 9 },

  footer: {
    height: 70,
    backgroundColor: "#fff",
    //color: "#333",
    padding: 10,
    flexDirection: "row",
    //marginBottom:20
  },

  footlft: { width:'90%', flexDirection: "row",},

  msgtoolbox: { flexDirection: "row" },

  msgtypingbox: { width:'95%' },

  footrit: {
    width:'10%',
    //borderLeftWidth: 1,
    borderColor: "#a1a1a1",
    //paddingLeft: 10,
    alignItems:'flex-end',
    //borderWidth:1,
    paddingTop: 10
  },

  luncher: { width:25,height:25,marginTop:-5},

  toolicon: { marginRight: 5, marginLeft: 5, marginTop: 15 },
  searchbar: {
    backgroundColor: "#fff",
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3,
    flexDirection: "row",
    padding:Platform.OS=='ios'?10:0,
    alignItems:'center',
    marginBottom: 15,
    width:'95%',
  },

  searchicon: { width: 20, height: 20,  },

  input: { marginLeft: 15, width:'100%' },
});
