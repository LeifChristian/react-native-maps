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
//var Contacts = require("react-native-contacts");
import  ToastAndroid from 'react-native-simple-toast';
export default class newnetworkStepThird extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_data: [],
      flag: 0,
      loader: true,
      contactNumber: [],
      user_id: "",
      network_id: "",
      user_email1:"",
      user_email12:'',
      user_email3:'',
      user_email4:'',
      email:'',
    };
  }
  componentWillMount() {
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      var user_id = temp._id;
       var user_email = temp.user_email;
      this.setState({ user_id: user_id,email:user_email });
    });
    AsyncStorage.getItem("netwrok_data").then(value1 => {
      let temp = JSON.parse(value1);
      var networkid = temp._id;
      this.setState({ network_id: networkid });
    });
  }

  InviteNetwork() {
    this.setState({ flag: 1 });
    let url = loginUrl + "invite";
    let method = "POST";
    let userid = this.state.user_id;
    let networkid = this.state.network_id;
    var number = this.props.SelectPhoneFrnds;
    var userNumbers=this.props.SelectedUser;
    var FbFrnds = this.props.SelectFbFrnds;
    var user_email1=this.state.user_email1;
    var user_email2=this.state.user_email2;
    var user_email3=this.state.user_email3;
    var user_email4=this.state.user_email4;
    var EmailList='';
    if(user_email1!='')
      {
        
        EmailList+=user_email1;
      }
    if(user_email2!='')
      {
        if(EmailList!='')
          {
              EmailList+=','+user_email2;
          }else{
            EmailList+=user_email2;
          }
        
      }
      if(user_email3!='')
      {
        if(EmailList!='')
          {
              EmailList+=','+user_email3;
          }else{
            EmailList+=user_email3;
          }
       
      }
      if(user_email4!='')
      {
         if(EmailList!='')
          {
              EmailList+=','+user_email4;
          }else{
            EmailList+=user_email4;
          }
       
      }
       if(EmailList==='undefined')
        {
           var EmailList='';
        }
        userNumbers.map(function(val) {
          val.email?EmailList+=','+val.email:null;
      })
    var result = number
      .map(function(val) {
        return val.phone;
      })
      .join(",");
      result += userNumbers
      .map(function(val) {
        return val.phone;
      })
      .join(",");
      
      var fb1 = FbFrnds
      .map(function(val1) {
        return val1.social_id;
      })
      .join(",");
    let body = JSON.stringify({
      invite_from: userid,
      network_id: networkid,
      invite_from_email:this.state.email,
      phone: result,
      email:EmailList,
      social_id: fb1
    });
   dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        console.log('response of invite network==== ',responseJson)
        this.setState({ flag: 2 });
        if (responseJson.status == "true") {
          this.props.dispatch({
            type: "clearConatcNumber",
            payLoad: responseJson.status
          });
           this.props.dispatch({
            type: "clearFacebookFrnds",
            payLoad: responseJson.status
          });
          this.props.dispatch({
            type: "clear_network_file_data",
            payLoad: responseJson.status
          });
          this.props.navigation.navigate("NewNetworkSucess");
          
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
    var contact_Number = this.props.SelectPhoneFrnds;
    if (contact_Number) {
      var row2 = contact_Number.map((data12, index1) => {
        return (
          <View style={styles.sourceContainer}>
            <TouchableOpacity style={styles.userblock}>
              <Image
                style={styles.avatar}
                source={require("../assets/img/user_small_thumbnil_01.jpg")}
              />
              <Text style={styles.avatartxt}>{data12.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userblock}>
              <Text style={styles.avatartxt}>{data12.phone}</Text>
            </TouchableOpacity>
          </View>
        );
      });
    } else {
      var row2 = <Text style={styles.avatartxt} />;
    }
    
     var FbFrnds = this.props.SelectFbFrnds;
    if (FbFrnds) {
      
      var row3 = FbFrnds.map((data123, index12) => {
        return (
          <View style={styles.sourceContainer}>
 
              <TouchableOpacity style={styles.userblock1}>
              <Image
                style={styles.avatar}
                source={require("../assets/img/user_small_thumbnil_01.jpg")}
              />
              <Text style={styles.avatartxt}>{data123.username}</Text>
               
            </TouchableOpacity>
            
           
          </View>
        );
      });
    } else {
      var row4 = <Text style={styles.avatartxt} />;
    }
    var Users = this.props.SelectedUser;
    if (Users) {
      
      var row4 = Users.map((data123, index12) => {
       // console.log('user data : ',data123)
        return (
          <View style={styles.sourceContainer}>
 
              <TouchableOpacity style={styles.userblock1}>
              <Image
                style={styles.avatar}
                source={require("../assets/img/user2.png") }
              />
              <Text style={styles.avatartxt}>{data123.username}</Text>
               
            </TouchableOpacity>
            
           
          </View>
        );
      });
    } else {
      var row4 = <Text style={styles.avatartxt} />;
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerleft}
            onPress={() => this.props.navigation.navigate("NewNetworkStepSecond")}
          >
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}> NEW NETWORK </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollcontainer}>
          <View style={styles.stepheader}>
            <View style={styles.stepindicator}>
              <Text style={styles.bluetxt}>Step 3</Text>
              <Text style={styles.graytxt}> of 3 </Text>
            </View>
            <View style={styles.fullflot}>
              <Text style={styles.stepname}> Invite Users</Text>
            </View>
          </View>

          <View style={styles.invitationBox}>
            <View style={styles.TitleBox}>
              <Text style={styles.invitationTitle}> Search User </Text>
              <TouchableOpacity
                style={styles.add}
                onPress={() =>
                  this.props.navigation.navigate("addInviteUsers")}>
                <Image
                  style={styles.add_icon}
                  source={require("../assets/img/wt_plus.png")}
                />
              </TouchableOpacity>
            </View>
            {row4}
          </View>

          <View style={styles.invitationBox}>
            <View style={styles.TitleBox}>
              <Text style={styles.invitationTitle}> Facebook </Text>
              <TouchableOpacity
                style={styles.add}
                onPress={() =>
                  this.props.navigation.navigate("addInviteFacebook")}
              >
                <Image
                  style={styles.add_icon}
                  source={require("../assets/img/wt_plus.png")}
                />
              </TouchableOpacity>
            </View>
            {row3}
         
          </View>
          <View style={styles.invitationBox}>
            <View style={styles.TitleBox}>
              <Text style={styles.invitationTitle}> Phone </Text>
              <TouchableOpacity
                style={styles.add}
                onPress={() => this.props.navigation.navigate("AddInvitePhone")}
              >
                <Image
                  style={styles.add_icon}
                  source={require("../assets/img/wt_plus.png")}
                />
              </TouchableOpacity>
            </View>
            {row2}
          </View>

          <View style={styles.invitationBox}>
            <View style={styles.TitleBox}>
              <Text style={styles.invitationTitle}> Email </Text>
              <TouchableOpacity style={styles.add}>
                <Image
                  style={styles.add_icon}
                  source={require("../assets/img/wt_plus.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.sourceContainer}>
              <TouchableOpacity style={styles.userblock}>
                <TextInput
                  style={styles.input}
                  placeholder="James@max.com"
                  placeholderTextColor="#cdcdcd"
                  value={this.state.user_email1}
                  onChangeText={text => this.setState({ user_email1: text })}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.userblock}>
                <TextInput
                  style={styles.input}
                  placeholder="James@max.com"
                  placeholderTextColor="#cdcdcd"
                  value={this.state.user_email2}
                  onChangeText={text => this.setState({ user_email2: text })}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.userblock}>
                <TextInput
                  style={styles.input}
                  placeholder="James@max.com"
                  placeholderTextColor="#cdcdcd"
                  value={this.state.user_email3}
                  onChangeText={text => this.setState({ user_email3: text })}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.userblock}>
                <TextInput
                  style={styles.input}
                  placeholder="James@max.com"
                  placeholderTextColor="#cdcdcd"
                  value={this.state.user_email4}
                  onChangeText={text => this.setState({ user_email4: text })}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles} onPress={() => this.InviteNetwork()}>
            <Text style={styles.footjumbotxt}> Launch My Network</Text>
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
     SelectedUser:state.networksteps.SelectedUsers,
  };
}
module.exports = connect(mapStateToProps)(newnetworkStepThird);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  /* Header CSS*/
  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

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

  avatartxt: { fontSize: 13, marginLeft:8, },

  input: { width:150, height:40 },

  add: {
    backgroundColor: "#2980b9",
    width:25,
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
