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
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import CheckBox from "react-native-checkbox";
import  ToastAndroid from 'react-native-simple-toast';
export default class networkAddAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_data: [],
      flag: 0,
      loader: true,
      userMember: [],
      user_id: "",
      network_id: "",
      PhoneArr: [],
    };
  }
  componentWillMount() {
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      var user_id = temp._id;
      var user_email = temp.user_email;
      this.setState({ user_id: user_id, email: user_email });
    });
    AsyncStorage.getItem("netwrok_member").then(value1 => {
      let temp = JSON.parse(value1);
      this.setState({ userMember: temp, network_id: temp[0].network_id })
    });
  }
  toggleCheckbox(name, memberId) {
    var newPhoneRecord = {};
    newPhoneRecord = { username: name, member_id: memberId };
   // console.log(newPhoneRecord)
    var CheckRecord = this.add(memberId);
    if (CheckRecord == true) {
      this.setState({ PhoneArr: this.state.PhoneArr.concat(newPhoneRecord) });
    } else {
      var array = this.state.PhoneArr;
      for (let i in array) {
        if (array[i].member_id == memberId) {
          var users = this.state.PhoneArr.filter(function (PhoneArr) {
            return PhoneArr.member_id != newPhoneRecord.member_id;
          });
          this.setState({ PhoneArr: users });
          break;
        }
      }

      // this.setState({PhoneArr: array });
    }
  }
  add(memberId) {
    var id = this.state.PhoneArr.length + 1;
    var found = this.state.PhoneArr.some(function (el) {
      return el.member_id === memberId;
    });
    if (!found) {
      return true;
    } else {
      return false;
    }
  }
  InviteNetwork() {
    this.setState({ flag: 1 });
    let url = loginUrl + "network/makeNetworkAdmin";
    let method = "POST";
    var res = this.state.PhoneArr;
    var result = res
      .map(function (val) {
        return val.member_id;
      })
      .join(",");
    let body = JSON.stringify({
      _id: result,
      network_id: this.state.network_id
    });
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
      //  console.log('ADD ADMIN==',responseJson)
        if (responseJson.status == "true") {
          AsyncStorage.setItem(
            "netwrok_member",
            JSON.stringify(responseJson.joinedUser)
          );

          this.props.navigation.navigate("NetworkSettings");

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
        // ToastAndroid.showWithGravity(
        //   "Error in connect to server",
        //   ToastAndroid.SHORT,
        //   ToastAndroid.BOTTOM
        // );
      });
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
    var members = this.state.userMember;
    if (members) {
      var row2 = members.map((data12, index1) => {
        let userInfo = data12.userinfo;
        if (userInfo.user_name != '' && userInfo.user_name != undefined) {
          var name = userInfo.user_name;
        } else if (userInfo.user_email != '' && userInfo.user_email != undefined) {
          var name = userInfo.user_email;
        } else {
          var name = userInfo.user_phone;
        }
        return (<View style={styles.frnd_lst_wrap}>
          <View style={styles.checkbox}>
            <CheckBox
              onChange={this.toggleCheckbox.bind(this, userInfo.user_name, data12._id)}
              label={name}
            />
          </View>
          <Text style={styles.cont_no}>{} </Text>
        </View>);
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
            <Text style={styles.header_title}> Add Admin </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollcontainer}>
          {row2}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles} onPress={() => this.InviteNetwork()}>
            <Text style={styles.footjumbotxt}> Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    SelectPhoneFrnds: state.networksteps.SelectdContactNumber,
    SelectFbFrnds: state.networksteps.SelectdFacebookFrnds,
  };
}
module.exports = connect(mapStateToProps)(networkAddAdmin);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  /* Header CSS*/
  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },
  frnd_lst_wrap: { flexDirection: "row", padding: 15 },
  headerleft: { width: 20 },

  headercenter: { width: 295 },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  /****************/

  scrollcontainer: { backgroundColor: "#fff", margin: 10, borderRadius: 4 },

  stepheader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#2980b9"
  },

  stepindicator: {
    flexDirection: "row",
    borderRightWidth: 1,
    borderColor: "#2980b9",
    padding: 10
  },

  bluetxt: { color: "#2980b9", fontWeight: "700" },

  graytxt: { color: "#cdcdcd", fontWeight: "700" },

  fullflot: { marginLeft: 145, paddingTop: 5 },

  stepname: { color: "#2980b9", fontWeight: "700", alignSelf: "flex-end" },

  invitationBox: { padding: 10 },

  TitleBox: { flexDirection: "row", marginBottom: 15 },

  invitationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    width: 285
  },

  sourceContainer: { flexDirection: "row", flexWrap: "wrap", width: 450 },

  userblock1: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#c1c1c1",
    borderRadius: 3,
    marginRight: 10,
    marginBottom: 15,
    alignItems: "center",
    width: 313,
    height: 30
  },


  userblock: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#a1a1a1",
    borderRadius: 3,
    marginRight: 10,
    marginBottom: 15,
    alignItems: "center",
    width: 153,
    height: 30
  },

  avatar: {
    width: 30,
    height: 30,
    borderBottomLeftRadius: 3,
    borderTopLeftRadius: 3
  },

  avatartxt: { fontSize: 13, marginLeft: 8, },

  input: { width: 150, height: 40 },

  add: {
    backgroundColor: "#2980b9",
    width: 25,
    height: 25,
    borderRadius: 5,
    padding: 5
  },

  add_icon: { width: 15, height: 15 },

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

  footjumbotxt: { color: "#fff", fontSize: 18, fontWeight: "700" },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    backgroundColor: "rgba(255,255,255,0.5)"
  }
});
