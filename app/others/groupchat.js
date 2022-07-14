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
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, parseUrl, network_img } from "../utility/constants";
import  ToastAndroid from 'react-native-simple-toast';
const Timestamp = require("react-timestamp");
import PTRView from "react-native-pull-to-refresh";
export default class Groupchat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: "",
      chat_hostory: "",
      sender_id: "",
      group_id: "",
      group_name: "",
      network_id: "",
      intervalId: "",
      chat_full_history: [],
      search_txt: "",
      reciever_img: "",
      sender_img: "",
      group_members: []
    };
    this._refresh = this._refresh.bind(this);
  }
  searchFilter() {
    let text = this.state.search_txt;
    let fullList = this.state.chat_full_history;
    let filteredList = fullList.filter(item => {
      if (item.message.toLowerCase().match(text)) return item;
    });

    if (!text || text === "") {
      this.setState({
        chat_hostory: fullList
      });
    } else if (Array.isArray(filteredList)) {
      this.setState({
        chat_hostory: filteredList
      });
    }
  }
  checktext(text) {
    if (text == "") {
      var Data = this.state.chat_full_history;
      this.setState({
        chat_hostory: Data,
        search_txt: text
      });
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
      }
    }
  }
  getChat() {
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      let userid = temp._id;
      var group_id = this.state.group_id;
      var network_id = this.state.network_id;
      let url =
        parseUrl +
        'classes/GroupChatActivity?where={"$or":[{"group":"' +
        group_id +
        '"}]}&order=createdAt';

      let method = "GET";

      dataLayer
        .getParseData(url, method)
        .then(response => response.json())
        .then(responseJson => {
         // console.log(responseJson);
          this.setState({
            chat_hostory: responseJson.results,
            chat_full_history: responseJson.results
          });
        })
        .catch(error => {
          this.setState({ flag: 2 });
        });
    });
  }

  componentWillMount() {
    AsyncStorage.getItem("group_id").then(value1 => {
      let temp1 = JSON.parse(value1);
      var group_id = temp1.group_id;
      let url = loginUrl + "networkGroup/getNetworkGroupDetail";
      let method = "POST";
      let body = JSON.stringify({
        network_id: temp1.network_id,
        group_id: temp1.group_id
      });
      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ flag: 2 });
          if (responseJson.status == "true") {
         //   console.log(responseJson.groupData);
            this.setState({ group_members: responseJson.groupData });
          } else {
            ToastAndroid.showWithGravity(
              responseJson.message,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
          }
        })
        .catch(error => {
          this.setState({ flag: 2 });
        });
      var frndname = temp1.frndname;
      var network_id = temp1.network_id;
      // var reciverimg=temp1.frnd_img;
      this.setState({
        group_id: group_id,
        group_name: frndname,
        network_id: network_id
       
      });
    });
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      let userid = temp._id;
      if (temp.user_pic != "" && temp.user_pic != undefined) {
        var senderimg = network_img + temp.user_pic;
      } else {
        var senderimg = network_img + "default_img.png";
      }
      this.setState({ sender_id: userid, sender_img: senderimg });
      this.getChat();
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

  componentDidMount() {
     intervalId = setInterval(() => this.getChat(), 10000);
     this.setState({ intervalId: intervalId });
   }
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }
  onBack() {
    clearInterval(this.state.intervalId);
  }
  sendChat() {
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      var user_id = temp._id;
      var group_id = this.state.group_id;
      let url = parseUrl + "classes/GroupChatActivity";
      let method = "POST";
      let body = JSON.stringify({
        sender: user_id,
        group: group_id,
        message: this.state.chat
      });

      dataLayer
        .sendParseData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ chat: "" });
          this.getChat();
          Keyboard.dismiss();
        })
        .catch(error => {
          //console.error(error);
        });
    });
  }
  onBack() {
    this.props.navigation.navigate("Messages");
  }
  filter_record(sender_id) {
   
    var data=this.state.group_members; 
    
   for (let i in data) {
     

      if (data[i].id == sender_id) {
     
      return data[i].pc;
      }
    }
  }

  render() {
    var chat_hostory = this.state.chat_hostory;

    if (chat_hostory) {
      var reciever_msg = "";
      var sendeer_msg = "";
      var chatrecords = chat_hostory.map((data321, index123) => {
     
            
        if (data321.sender == this.state.sender_id) {
          var sendeer_msg = data321.message;
        } else {
          var reciever_msg = data321.message;
           var res = this.filter_record(data321.sender);
        
        if(res!='' && res !=undefined)
          {
           // console.log(res);
            var reciever_img=network_img + res;
          }else{
              var reciever_img=network_img + "default_img.png";
          }
        }
        return (
          <View style={styles.datewise_box}>
            {/* <Text style={styles.date}> 24JUN 2017 </Text> */}
            <View style={styles.chatbox}>
              {reciever_msg ? (
                <View style={styles.jecket}>
                  {
                    <Image
                      style={styles.recieverimg}
                      source={{ uri: reciever_img }}
                    />
                  }
                  <View style={styles.lft_chatcontent}>
                    <Text style={styles.contentTxt}>{reciever_msg}</Text>
                    <View style={styles.chat_time}>
                      <Text style={styles.sendingTime}>
                        <Timestamp time={data321.createdAt} component={Text} />
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
              {sendeer_msg ? (
                <View style={styles.right_chatcontent}>
                  <Text style={styles.contentTxt}>{sendeer_msg} </Text>
                  <View style={styles.chat_time}>
                    <Text style={styles.sendingTime}>
                      <Timestamp time={data321.createdAt} component={Text} />
                    </Text>
                    {
                      <Image
                        style={styles.senderimg}
                        source={{ uri: this.state.sender_img }}
                      />
                    }
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        );
      });
    } else {
      var chatrecords = <Text style={styles.avatartxt} />;
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            transparent
            style={styles.headerleft}
            onPress={() => this.onBack()}
          >
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}>{this.state.group_name} </Text>
          </View>

          <View style={styles.headerright}>
            <Image
              style={styles.baricon}
              source={require("../assets/img/videocam.png")}
            />
          </View>
        </View>
        <View style={styles.searchbar}>
          <TextInput
            placeholder="SEARCH"
            style={styles.input}
            onChangeText={text => this.checktext(text)}
          />
          <TouchableOpacity onPress={() => this.searchFilter()}>
            <Image
              style={styles.searchicon}
              source={require("../assets/img/searchicon.png")}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          ref="scrollView"
          onContentSizeChange={(width, height) =>
            this.refs.scrollView.scrollTo({ y: height })}
        >
          <PTRView onRefresh={this._refresh}>
            <View style={styles.chat_wrapper}>{chatrecords}</View>
          </PTRView>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.footlft}>
            <View style={styles.msgtypingbox}>
              <TextInput
                placeholder="Your Message"
                style={styles.input}
                value={this.state.chat}
                onChangeText={text => this.setState({ chat: text })}
              />
            </View>
            <View style={styles.msgtoolbox}>
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
              <TouchableOpacity>
                <Image
                  style={styles.toolicon}
                  source={require("../assets/img/yellowsmily.png")}
                />
              </TouchableOpacity>
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
    );
  }
}

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

  chat_wrapper: { margin: 10, paddingLeft: 5, paddingRight: 5 },

  date: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#0f5787",
    fontSize: 20,
    marginBottom: 30,
    marginTop: 20
  },

  jecket: { flexDirection: "row" },

  lft_chatcontent: { width: 265, padding: 8 },

  right_chatcontent: {
    width: 265,
    borderRadius: 15,
    marginLeft: 65,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: "#f1f1f1"
  },

  chat_time: { flexDirection: "row" },

  senderimg: { borderRadius: 30, width: 30, height: 30, marginTop: 2 },

  recieverimg: { borderRadius: 30, width: 30, height: 30, marginTop: 18 },

  contentTxt: {
    padding: 12,
    lineHeight: 24,
    fontSize: 18,
    backgroundColor: "#fff",
    borderRadius: 15,
    minHeight: 40
  },

  sendingTime: {
    textAlign: "right",
    width: 230,
    color: "#bcbcbe",
    fontWeight: "bold",
    padding: 5
  },

  sendername: { textAlign: "left", padding: 5, width: 90 },

  recTime: {
    textAlign: "right",
    width: 250,
    color: "#bcbcbe",
    fontWeight: "bold",
    padding: 5
  },

  checkicon: { marginTop: 9 },

  footer: {
    height: 70,
    backgroundColor: "#fff",
    color: "#333",
    padding: 10,
    flexDirection: "row"
  },

  footlft: { width: 290, flexDirection: "row" },

  msgtoolbox: { flexDirection: "row" },

  msgtypingbox: { width: 130 },

  footrit: {
    borderLeftWidth: 1,
    borderColor: "#a1a1a1",
    paddingLeft: 10,
    paddingTop: 10
  },

  luncher: {},

  toolicon: { marginRight: 5, marginLeft: 5, marginTop: 15 },
  searchbar: {
    backgroundColor: "#fff",
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3,
    flexDirection: "row",
    marginBottom: 15
  },

  searchicon: { width: 20, height: 20, marginTop: 14 },

  input: { marginLeft: 15, width: 290 }
});
