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
  ToastAndroid
} from "react-native";
import { connect } from "react-redux";
import CheckBox from "react-native-checkbox";

export default class AssignTaskUser extends Component {
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
  
    let{networkMembers,network_adminID}=this.props.navigation.state.params
    console.log("props",networkMembers)
    this.setState({
      Members:networkMembers?networkMembers: this.props.networkMembers,
      network_id: networkMembers?networkMembers[0].network_id:this.props.networkMembers[0].network_id,
      network_adminID: network_adminID?network_adminID:this.props.network_adminID
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
          var users = this.state.selectedFbFrnds.filter(function(array) {
            return array.social_id != newFacebookRecord.social_id;
          });
          this.setState({ selectedFbFrnds: users });
          break;
        }
      }

      
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
  
  DoneContactNumber() {
     var Storedarr = this.state.selectedFbFrnds; 
     //console.log(Storedarr);
     this.props.dispatch({
       type: "AssignTaskUser",
       payLoad: Storedarr
   });
    this.props.navigation.navigate("newtask");
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
    var Members = this.state.Members;
    if (Members) {
      var row2 = Members.map((data12, index1) => {
        var member_id = data12.userinfo._id;
        var admin_id = this.props.network_adminID;
        var network_id = data12.network_id;

        if (
          data12.userinfo.user_name != "" &&
          data12.userinfo.user_name != undefined
        ) {
          var name = data12.userinfo.user_name;
        } else if (
          data12.userinfo.user_email != "" &&
          data12.userinfo.user_email != undefined
        ) {
          var name = data12.userinfo.user_email;
        } else {
          var name = data12.userinfo.user_phone;
        }

        if (admin_id != member_id) {
          return (
            <View style={styles.frnd_lst_wrap}>
              <View style={styles.checkbox}>
                <CheckBox
                  onChange={this.toggleCheckbox.bind(this, member_id,name)}
                  label={name}
                />
              </View>
            </View>
          );
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
            <Text style={styles.header_title}> Add Members </Text>
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
    networkMembers: state.Allmebers.allnetwrokmembers,
    network_adminID: state.Allmebers.netwrok_admin_id
  };
}
module.exports = connect(mapStateToProps)(AssignTaskUser);
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

  footjumbotxt: { color: "#fff", fontSize: 18, fontWeight: "700" },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    backgroundColor: "rgba(255,255,255,0.5)"
  }
});
