/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
  ToastAndroid,
  ActivityIndicator,
  NetInfo,
  Animated,
  Easing
} from "react-native";
import { connect } from "react-redux";
import CheckBox from "react-native-checkbox";
//var Contacts = require("react-native-contacts");
//import SelectMultiple from 'react-native-select-multiple'
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import { Icon } from "native-base";
export default class addInviteUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_data: [],
      flag: 0,
      loader: true,
      Users: [],
      alldata: [],
      checked: false,
      selectedUsers: [],
      searchData: [],
      visible: false,
      index: '',
      keyword: ''
    };
    this.search = this.search.bind(this);
    this.animatedValue = new Animated.Value(0)
  }
  componentDidMount() {
    let url = loginUrl + "user/totalUser";
    let method = "POST";
    dataLayer
      .postData(url, method)
      .then(response => response.json())
      .then(responseJson => {
        // console.log("member=>",responseJson )
        this.setState({ Users: responseJson.data, alldata: responseJson.data })
      })
      //console.log('!!!!!!',this.state.Users)
  }
  search(text) {
    searchText = text
    data = [];
    // this.state.Users.map((item,i)=>{
    //    data[i]=item.user_name
    // })
    // console.log('search Data',searchText);
    searchText = searchText.trim().toLowerCase();
    l = searchText.length
    data = this.state.alldata.filter(item => {
      return item.user_name ? item.user_name.toLowerCase().slice(0, l) == searchText : false

    });
    // console.log("data=> ",data)
    this.setState({ Users: data })
  }
  toggleCheckbox(userID, userName, phone, email) {
    var newUsersRecord = {};
    newUsersRecord = { username: userName, user_id: userID, phone: phone, email: email };
    var CheckRecord = this.add(userID);
    if (CheckRecord == true) {
      this.setState({ selectedUsers: this.state.selectedUsers.concat(newUsersRecord) });
    } else {
      var array = this.state.selectedUsers;
      for (let i in array) {
        if (array[i].user_id == userID) {
          var users = this.state.selectedUsers.filter(function (selectedUsers) {
            return selectedUsers.user_id != newUsersRecord.user_id;
          });
          this.setState({ selectedUsers: users });
          break;
        }
      }
      // this.setState({PhoneArr: array });
    }
  }
  match(userID) {
    var found = this.state.selectedUsers.some(function (el) {
      return el.user_id === userID;
    });
    if (found) {
      return true;
    } else {
      return false;
    }

  }
  clickSearch() {

    this.setState({ visible: !this.state.visible })
    if (!this.state.visible) {
      //this.animatedValue.setValue(1)
      setTimeout(() => {
        this.animatedValue.setValue(1)
      }, 10);
      setTimeout(() => {
        this.animatedValue.setValue(2)
      }, 15);
      setTimeout(() => {
        this.animatedValue.setValue(3)
      }, 20);
      setTimeout(() => {
        this.animatedValue.setValue(5)
      }, 25);
    }
    else {
      this.animatedValue.setValue(0)

    }

  }
  add(userID) {
    var id = this.state.selectedUsers.length + 1;
    var found = this.state.selectedUsers.some(function (el) {
      return el.user_id === userID;
    });
    if (!found) {
      return true;
    } else {
      return false;
    }
  }
  DonefbFrnds() {
    var Storedarr = this.state.selectedUsers;
    this.props.dispatch({
      type: "StoredUsers",
      payLoad: Storedarr
    });

    this.props.navigation.goBack();
  }

  dynamicSort(property) {
    var sortOrder = 1;

    return function (a, b) {
      return a[property].localeCompare(b[property]);
      console.log()
    }
    
  }

  render() {
    // this.state.Users.map((item, index) => {
    //   var sorted = this.state.Users.sort(this.dynamicSort('user_name'))
    //   console.log('Sorted Data', sorted)
    // })
    var addInviteUsers = this.state.Users
    console.log('users===== ',addInviteUsers)

    if (addInviteUsers) {
      var i = 0;
      addInviteUsers.sort()
      var row2 = addInviteUsers.map((data12, index1) => {
        i++;
        console.log('row 2=====',row2)
       
        //addInviteUsers.sort(this.dynamicSort('user_name'))
        //addInviteUsers.sort()
        console.log('data===', data12)
        if (data12.user_name)
          return (
            <View style={styles.frnd_lst_wrap}>
              <View style={styles.checkbox}>
                <CheckBox
                  checked={this.match(data12._id)}
                  label={data12.user_name}
                  onChange={this.toggleCheckbox.bind(this, data12._id, data12.user_name, data12.user_phone, data12.user_email)}
                />
              </View>
              {/* <Text style={styles.cont_no}>{data12.user_name} </Text> */}
            </View>
          );
      });
    } else {
      var row2 = <Text style={styles.avatartxt} />;
    }
    const width = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 260],
      extrapolate: 'clamp'
    })
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerleft}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={[styles.searchView, { justifyContent: 'flex-end', flexDirection: 'row' }]}>
            <TouchableOpacity onPress={() => this.clickSearch()}>
              <Icon name='search' style={{ color: 'white', marginRight: 10 }} />
            </TouchableOpacity>
            {/* {
              this.state.visible? */}
            <Animated.View style={{ width: width }}>
              <TextInput style={{ borderBottomWidth: 2, borderBottomColor: 'white', width: '100%', color: 'white', opacity: this.state.visible ? 1 : 0 }} underlineColorAndroid='transparent'
                onChangeText={(value) => this.search(value)} />
            </Animated.View>
            {/* :null
            }  */}

            {/* <Text style={styles.header_title}> INVITE Users </Text> */}
          </View >
          <TouchableOpacity
            style={styles.headerright}
            onPress={() => this.DonefbFrnds()}
          >
            <Text style={styles.btnsm}> Done </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollcontainer}>{row2}</ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    users: state.loginReducer.user_data
  };
}
module.exports = connect(mapStateToProps)(addInviteUsers);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  /* Header CSS*/
  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },
  activeSearchView: {
    paddingLeft: 20,
    flexDirection: 'row',
    width: '82%',
  },
  searchView: {
    width: '82%',
    paddingRight: 5
  },
  headerleft: { width: 20 },

  headercenter: { width: 270, textAlign: "center" },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  btnsm: {
    color: "#fff",
    backgroundColor: "#2a90b9",
    padding: 4,
    borderRadius: 5
  },

  /****************/

  scrollcontainer: { backgroundColor: "#fff", margin: 10, borderRadius: 4 },

  frnd_lst_wrap: { flexDirection: "row", padding: 5 },

  checkbox: { flex: 1, padding: 5, width: 105 },

  cont_no: { padding: 5 },

  /*  Footer CSS*/
  footer: {
    height: 55,
    color: "#333",
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#145d8d",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },

  footjumbotxt: { color: "#fff", fontSize: 18, fontWeight: "700" }
});
