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
  AsyncStorage,ActivityIndicator,
  Platform
} from "react-native";
import  ToastAndroid from 'react-native-simple-toast';
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, parseUrl, network_img } from "../utility/constants";
export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_Members: [],
      network_data: [],
      network_fullmember: [],
      user_id: "",
      search_txt: "",
      network_group: [],
       flag: 0,
    };
  }
getGroupData(network_id)
  {
   
   let url = loginUrl + "networkGroup/getNetworkGroup";
      let method = "POST";
      let body = JSON.stringify({
        network_id: network_id
      });
       dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
          console.log('response of message page ===',responseJson)
          this.setState({ flag: 2 });
          if (responseJson.status == "true") {
          this.setState({ network_group: responseJson.groupData });

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
  }
  componentWillMount() {
    
     this.setState({ flag: 1 });
    AsyncStorage.getItem("netwrok_member").then(value => {
      let temp = JSON.parse(value);
      this.setState({ network_Members: temp, network_fullmember: temp });
      this.props.dispatch({ type: "Set_AllNetworkMembers", payLoad: temp });
    });
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      var user_id = temp._id;
      this.setState({ user_id: user_id });
      this.props.dispatch({ type: "user_admin_id", payLoad: user_id });
    });
    AsyncStorage.getItem("netwrok_data").then(value1 => {
      let temp1 = JSON.parse(value1);
       this.getGroupData(temp1._id);
      this.setState({ network_data: temp1, network_id: temp1._id });
    });
    
  }
  chat(frnd_id, name, chatType,img) {
    var network_id = this.state.network_id;
    if (chatType == 1) {
      AsyncStorage.setItem(
        "frnd_id",
        JSON.stringify({
          frndid: frnd_id,
          frndname: name,
          network_id: network_id,
          frnd_img:img
        })
      );
      this.props.navigation.navigate("Chat");
    }else if(chatType==2)
    {
      AsyncStorage.setItem(
        "group_id",
        JSON.stringify({
          group_id: frnd_id,
          frndname: name,
          network_id: network_id,
          frnd_img:img
        })
      );
      this.props.navigation.navigate("GroupChat");
    }
  }
  searchFilter() {
    let text = this.state.search_txt;
    let fullList = this.state.network_fullmember;
    let filteredList = fullList.filter(item => {
      if (item.name.toLowerCase().match(text)) return item;
    });

    if (!text || text === "") {
      this.setState({
        network_Members: fullList
      });
    } else if (Array.isArray(filteredList)) {
      this.setState({
        network_Members: filteredList
      });
    }
  }
  checktext(text) {
    if (text == "") {
      var Data = this.state.network_fullmember;
      this.setState({
        network_Members: Data,
        search_txt: text
      });
    } else {
      let fullList = this.state.network_fullmember;
      let filteredList = fullList.filter(item => {
        if (item.userinfo.user_name != undefined) {
          if (item.userinfo.user_name.toLowerCase().match(text)) return item;
        }
      });
      if (!text || text === "") {
        this.setState({
          network_Members: fullList,
          search_txt: text
        });
      } else if (Array.isArray(filteredList)) {
        this.setState({
          network_Members: filteredList,
          search_txt: text
        });
      }
    }
  }
  render() {
     if (this.state.flag == 1) {
      return (
        <ActivityIndicator
          style={styles.indicator}
          animating={this.state.loader}
          size="large"
        />
      );
    }
    var networkMembers = this.state.network_Members;
    var network_group = this.state.network_group;
    var networkMembers111 = networkMembers.concat(network_group);

    if (networkMembers111) {
      var members = networkMembers111.map((data321, index123) => {
        var img = network_img + "default_img.png";

        if (
          (data321.userinfo != undefined) &&
          (this.state.user_id != data321.userinfo._id)
        ) {
          if (
            data321.userinfo.user_pic != "" &&
            data321.userinfo.user_pic != undefined
          ) {
            var img = network_img + data321.userinfo.user_pic;
          } else {
            var img = network_img + "default_img.png";
          }
          var chatuser_id = data321.userinfo._id;
          if (
            data321.userinfo.user_name != "" &&
            data321.userinfo.user_name != undefined
          ) {
            var name = data321.userinfo.user_name;
          } else if (
            data321.userinfo.user_email != "" &&
            data321.userinfo.user_name != undefined
          ) {
            var name = data321.userinfo.user_email;
          } else {
            var name = data321.userinfo.user_phone;
          }
          var chatType = "1";
        } else {
          var name = data321.groupName;
          var chatType = "2";
          var chatuser_id = data321._id;
        }
        if(name){
        return (
          <View style={styles.msglistwrapper}>
            <TouchableOpacity
              style={styles.msglist_tr}
              onPress={() => this.chat(chatuser_id, name, chatType,img)}
            >
              <Image style={styles.msgavatar} source={{ uri: img }} />
              <View style={styles.msgContent}>
                <View style={styles.sdf}>
                  <Text style={styles.txtBig}> {name} </Text>
                  {/* <Text style={styles.day}> TUE </Text> */}
                </View>
                {/* <Text style={styles.txtsmall}> Lorem Ipsum dolor sit amet, Consectetur adipi...</Text>  */}
              </View>
            </TouchableOpacity>
          </View>
        );
        }
      });
    } else {
      var members = <Text style={styles.avatartxt} />;
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            transparent
            style={styles.headerleft}
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}>
              {" "}
              {this.state.network_data.networkName}{" "}
            </Text>
            <Text style={styles.header_subtitle}> MESSAGES </Text>
          </View>

          <View style={styles.headerright}>
            <TouchableOpacity
              transparent
              style={styles.headerleft}
              onPress={() => this.props.navigation.navigate("AddGroupMembers")}
            >
              <Image
                style={styles.baricon}
                source={require("../assets/img/circal_plus.png")}
              />
            </TouchableOpacity>
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
        <ScrollView>{members}</ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    networkMembers: state.network_details.netwrok_member
  };
}
module.exports = connect(mapStateToProps)(Messages);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },

  headercenter: { width: 295 },

  headerright: { width: 20 },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  header_subtitle: { color: "#FFF", fontSize: 13, textAlign: "center" },

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

  input: { marginLeft: 15, width: '85%' },

  msglistwrapper: {
    backgroundColor: "#fff",
    margin: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 4
  },

  msglist_tr: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#dbdbdb"
  },

  msgavatar: { width: 45, height: 45, borderRadius: 24.5, marginRight: 10 },

  sdf: { flexDirection: "row" },

  txtBig: { color: "#000", marginBottom: 3 },

  txtsmall: { fontSize: 12 },

  day: {
    position: "absolute",
    right: 5,
    fontSize: 12,
    fontWeight: "700",
    color: "#dbdbdb"
  },

  footer: { height: 70, color: "#333", padding: 10, flexDirection: "row" },

  footcol: {
    width: 70,
    textAlign: "right",
    alignItems: "center",
    justifyContent: "center"
  },

  footicon: { width: 35, height: 32 },

  footcol_caption: { color: "#fff", fontSize: 10, marginTop: 5 },
   indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  }
});
