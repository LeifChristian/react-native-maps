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
  ActivityIndicator,
  PermissionsAndroid,
} from "react-native";
import { connect } from "react-redux";
import CheckBox from "react-native-checkbox";
import Contacts from 'react-native-contacts';
export default class addInvitephone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_data: [],

      loader: true,
      contactNumber: [],
      PhoneArr: [],
      flag: 2,
      loader: true,
      timePassed: false,
      index: '',
      keyword: ''
    };
  }

  componentWillMount() {
    //  setTimeout(()=>{this.setState({flag: 1})}, 10000);
    //   var Storedarr=this.state.PhoneArr;
    //   // this.props.dispatch({
    //   //         type: "clearConatcNumber",
    //   //         payLoad: Storedarr
    //   //       });
    // Contacts.getAll((err, contacts) => {
    //   console.log('CONTACTS',contacts)
    //  // this.setState({ contactNumber: contacts });
    // });

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then((premission) => {
        if (premission == 'granted') {
          Contacts.getAll((err, contacts) => {
            // console.log('CONTACTS',contacts)
            this.setState({ contactNumber: contacts })
          })
        }
        else {
          // console.log("Contact permission denied")
        }
      })
  }

  toggleCheckbox(mobileNo, name) {
    var newPhoneRecord = {};
    newPhoneRecord = { username: name, phone: mobileNo };
    var CheckRecord = this.add(mobileNo);
    if (CheckRecord == true) {
      this.setState({ PhoneArr: this.state.PhoneArr.concat(newPhoneRecord) });
    } else {
      var array = this.state.PhoneArr;
      for (let i in array) {
        if (array[i].phone == mobileNo) {
          var users = this.state.PhoneArr.filter(function (PhoneArr) {
            return PhoneArr.phone != newPhoneRecord.phone;
          });
          this.setState({ PhoneArr: users });
          break;
        }
      }

      // this.setState({PhoneArr: array });
    }
  }
  add(mobileNo) {
    var id = this.state.PhoneArr.length + 1;
    var found = this.state.PhoneArr.some(function (el) {
      return el.phone === mobileNo;
    });
    if (!found) {
      return true;
    } else {
      return false;
    }
  }
  DoneContactNumber() {
    var Storedarr = this.state.PhoneArr;
    this.props.dispatch({
      type: "StoredConatcNumber",
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
    if (this.state.flag == 0) {
      return (
        <ActivityIndicator
          style={styles.indicator}
          animating={this.state.loader}
          size="large"
        />
      );
    }
    //console.log(this.state.PhoneArr);
    this.state.contactNumber.map((item, index) => {
      var sorted = this.state.contactNumber.sort(this.dynamicSort('givenName'))
      console.log('Sorted Data', sorted)
    })
    var contact_Number = this.state.contactNumber;
    //console.log('contact number===', contact_Number)
    if (contact_Number) {
      var row2 = contact_Number.map((data12, index1) => {
        // console.log('data 0f contact number === ', data12)
        
        contact_Number.sort(this.dynamicSort('givenName'))
        if (data12.phoneNumbers[0]) {
          if (data12.phoneNumbers[0].label == "mobile") {
            var mobile = data12.phoneNumbers[0].number;
            var name = data12.givenName;
            //console.log('name in invite list ===',name)

            return (
              <View style={styles.frnd_lst_wrap}>
                <View style={styles.checkbox}>
                  <CheckBox
                    onChange={this.toggleCheckbox.bind(this, mobile, name)}
                    label={name}
                  />
                </View>
                <Text style={styles.cont_no}>{mobile} </Text>
              </View>
            );
          }

        }
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
            <Text style={styles.header_title}> INVITE FRIENDS </Text>
          </View>
          <TouchableOpacity
            style={styles.headerright}
            onPress={() => this.DoneContactNumber()}
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
    SelectPhoneFrnds: state.networksteps.SelectdContactNumber,
  };
}
module.exports = connect(mapStateToProps)(addInvitephone);
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
  ,
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    backgroundColor: "rgba(255,255,255,0.5)"
  }
});
