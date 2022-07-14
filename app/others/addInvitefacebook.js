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
  ActivityIndicator,
  NetInfo
} from "react-native";
import { connect } from "react-redux";
import CheckBox from "react-native-checkbox";
//var Contacts = require("react-native-contacts");
//import SelectMultiple from 'react-native-select-multiple'
export default class addInvitefacebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_data: [],
      flag: 0,
      loader: true,
      facebook_frnds: [],
      checked: false,
      selectedFbFrnds:[],
    };
  }
  componentWillMount() {
    AsyncStorage.getItem("fb_user_data").then(value => {
      if (value != null) {
        let temp = JSON.parse(value);
        //console.log("facebook data ==> ",temp)
        var fb_frnds = temp.friends.data;
        this.setState({ facebook_frnds: fb_frnds });
      }
    });
  }
  toggleCheckbox(socialID, SocialName) {
    var newFacebookRecord = {};
    newFacebookRecord = { username: SocialName, social_id: socialID };
    var CheckRecord = this.add(socialID);
    if (CheckRecord == true) {
      this.setState({ selectedFbFrnds: this.state.selectedFbFrnds.concat(newFacebookRecord) });
    } else {
      var array = this.state.selectedFbFrnds;
      for (let i in array) {
        if (array[i].social_id == socialID) {
          var users = this.state.selectedFbFrnds.filter(function(selectedFbFrnds) {
            return selectedFbFrnds.social_id != newFacebookRecord.social_id;
          });
          this.setState({ selectedFbFrnds: users });
          break;
        }
      }

      // this.setState({PhoneArr: array });
    }
  }
  add(socialID) {
    var id = this.state.selectedFbFrnds.length + 1;
    var found = this.state.selectedFbFrnds.some(function(el) {
      return el.social_id === socialID;
    });
    if (!found) {
      return true;
    } else {
      return false;
    }
  }
  DonefbFrnds() {
    var Storedarr = this.state.selectedFbFrnds;
  
    this.props.dispatch({
      type: "StoredFacebookFrnds",
      payLoad: Storedarr
    });

    this.props.navigation.goBack();
  }
  render() {
    var addInviteFacebook = this.state.facebook_frnds;
   
    if (addInviteFacebook) {
      var i = 0;
      var row2 = addInviteFacebook.map((data12, index1) => {
        i++;
        return (
          <View style={styles.frnd_lst_wrap}>
            <View style={styles.checkbox}>
              <CheckBox
                label={data12.name}
                onChange={this.toggleCheckbox.bind(this, data12.id, data12.name)}
              />
            </View>
            {/* <Text style={styles.cont_no}>{data12.id} </Text> */}
          </View>
        );
      });
    } else {
      var row2 = <Text style={styles.avatartxt} />;
    }
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
          <View style={styles.headercenter}>
            <Text style={styles.header_title}> INVITE FB FRIENDS </Text>
          </View>
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
    fbfrnds: state.loginReducer.fb_data
  };
}
module.exports = connect(mapStateToProps)(addInvitefacebook);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  /* Header CSS*/
  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

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
