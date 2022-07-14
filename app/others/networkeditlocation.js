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
 Platform
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl } from "../utility/constants";
import { MapView } from "react-native";
import CheckBox from "react-native-checkbox";
import  ToastAndroid from 'react-native-simple-toast';
class Networkeditlocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      details: "",
      phone: "",
      email: "",
      addto_desk: "",
      location_name: "",
      desk_status: 2,
      user_id:'',
      location_id:'',
      network_id:'',
      paramsdata:'',
      
    };
  }
  componentWillMount(){
 
  let params= this.props.navigation.state.params.data;
   // console.log('PARAMS',this.props.navigation.state.params.type);
   this.setState({ paramsdata:params});
  //let dataedit = params ? params.data : null;

   //console.log(this.state.paramsdata);

    this.setState({
                  location_name: this.props.navigation.state.params.data.name,
                  address:  this.props.navigation.state.params.data.address,
                  phone:  this.props.navigation.state.params.data.phone,
                  details:  this.props.navigation.state.params.data.details,
                  email: this.props.navigation.state.params.data.email,
                  location_id:this.props.navigation.state.params.data._id,
                  network_id:this.props.navigation.state.params.network_id,
                });

                //console.log('network id of edit',this.state.network_id)

   AsyncStorage.getItem("user_data").then(value => {
          let temp = JSON.parse(value);
          let user_id = temp._id;
        this.setState({ user_id: user_id});
   });

   
     
  }
  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  savesetting() {
    if (
      this.state.location_name == "" ||
      this.state.location_name.trim() == ""
    ) {
      ToastAndroid.showWithGravity(
        "Please Enter Name",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (this.state.address == "" || this.state.address.trim() == "") {
      ToastAndroid.showWithGravity(
        "Please Enter Address",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (this.state.details == "" || this.state.details.trim() == "") {
      ToastAndroid.showWithGravity(
        "Please Enter Details",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (this.state.phone == "" || this.state.phone.trim() == "") {
      ToastAndroid.showWithGravity(
        "Please Enter Phone Number",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (isNaN(this.state.phone)) {
      ToastAndroid.showWithGravity(
        "Please Enter Valid Phone Number",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (this.state.phone.length < 10) {
      ToastAndroid.showWithGravity(
        "Please Enter 10 Digit Phone Number",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (!this.validateEmail(this.state.email)) {
      ToastAndroid.showWithGravity(
        "Please Enter Valid Email",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      this.setState({ flag: 1 });

      //this.delete_location(this.state.location_id);
     if(this.props.navigation.state.params.type){

      AsyncStorage.getItem("netwrok_data").then(value => {
        let temp = JSON.parse(value);
        var net_id = temp._id;

        let url = loginUrl + "network/updateLocation";
        let method = "POST";

        let body = JSON.stringify({
          //network_id: net_id,
          updatedeskLocation: true,
          name: this.state.location_name,
          address: this.state.address,
          details: this.state.details,
          phone: this.state.phone,
          email: this.state.email,
          //isaddTodesk: this.state.desk_status,
          user_id:this.state.user_id,
          location_id:this.state.location_id
        });
         
        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
           // console.log('response of desk location',responseJson)
            this.setState({ flag: 2 });
            if (responseJson.status == "true") {
              AsyncStorage.setItem(
                "location_data",
                JSON.stringify(responseJson.data)
              );
              this.props.dispatch({
                type: "networkData",
                payLoad: responseJson.data
              });
              ToastAndroid.showWithGravity(
                "Location update successfully.",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            } else {
              ToastAndroid.showWithGravity(
                "Error in add location.",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            }
          })
          .catch(error => {});
      }); 
     }else{
      AsyncStorage.getItem("netwrok_data").then(value => {
        let temp = JSON.parse(value);
        var net_id = temp._id;

        let url = loginUrl + "network/updateLocation";
        let method = "POST";

        let body = JSON.stringify({

          network_id: this.state.network_id,
          updateNetworkLocation: true,
          name: this.state.location_name,
          address: this.state.address,
          details: this.state.details,
          phone: this.state.phone,
          email: this.state.email,
          //isaddTodesk: this.state.desk_status,
          user_id:this.state.user_id,
          location_id:this.state.location_id
        });


         
        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
           console.log('response of network location',responseJson)
            this.setState({ flag: 2 });
            if (responseJson.status == "true") {
              // AsyncStorage.setItem(
              //   "location_data",
              //   JSON.stringify(responseJson.data)
              // );
              // this.props.dispatch({
              //   type: "networkData",
              //   payLoad: responseJson.data
              // });
              ToastAndroid.showWithGravity(
                "Location update successfully.",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            } else {
              ToastAndroid.showWithGravity(
                "Error in add location.",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            }
          })
          .catch(error => {});
      });
    }
    }
  }
  golocation(){
    if(this.props.navigation.state.params.type){
      this.props.navigation.navigate("Desklocation");
    }
    else{
      this.props.navigation.navigate("Location");
    }
     
  }
  toggleCheckbox(value) {
    if (value == false) {
      this.setState({
        desk_status: 1
      });
    }else{
      this.setState({
        desk_status: 2
      });
    }
  }

   delete_location(delete_id){

    var network_id = this.state.network_id;
  
    var delete_id = delete_id;
   // console.log(delete_id);
   //  console.log(network_id);
    let url = loginUrl + "network/deleteLocation";
    let method = "POST";
    let body = JSON.stringify({
      _id: network_id,
      file_id: delete_id
    });

    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
        if (responseJson.status == "true") {
         
          
        } else {
         
        }
      })
      .catch(error => {
        
      });
  }
  render() {

    // const { params } = this.props.navigation.state;
   // const dataedit = params ? params.data : null;
    //console.log(dataedit);
// console.log('state of edit location',this.state);
//   this.setState({ location_name: this.state.paramsdata.name});
//   this.setState({ address: this.state.paramsdata.address });
//  this.setState({ details: this.state.paramsdata.details });
//  this.setState({ phone: this.state.paramsdata.phone });
   // let dt=this.state.paramsdata;
  //console.log(this.state);
    
    if (this.state.flag == 1) {
      return (
        <ActivityIndicator
          style={styles.indicator}
          animating={this.state.loader}
          size="large"
        />
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        <ScrollView>
          <View style={styles.settingswrapper}>
            {/* <TouchableOpacity
              style={styles.pagetitlebar}
              onPress={() => this.props.navigation.goBack()}
            > */}
               <TouchableOpacity
              style={styles.pagetitlebar}
              onPress={() => this.golocation()}
            >
              <Image
                style={styles.closeicon}
                source={require("../assets/img/close.png")}
              />
              <Text style={styles.pagetitle}> Edit Location </Text>
            </TouchableOpacity>
            <View style={styles.formbody}>
              <View style={styles.bodyinner}>
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Name </Text>
                  <TextInput
                 
                    placeholder=" Random Plac"
                     value={this.state.location_name}
                    style={styles.inputcontrol}
                    onChangeText={text => this.setState({ location_name: text })}
                  />
                </View>
 
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Address </Text>
                  <TextInput 
                   
                     placeholder="123 abc st."
                    value={this.state.address}
                    style={styles.inputcontrol}
                    onChangeText={text => this.setState({ address: text })}
                  />
                  <Image
                    style={styles.redicon}
                    source={require("../assets/img/mapmark_red.png")}
                  />
                </View>
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Detail </Text>
                  <TextInput
                  
                    placeholder=" Short description"
                     value={this.state.details}
                    style={styles.inputcontrol}
                    onChangeText={text => this.setState({ details: text })}
                  />
                </View>
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Phone </Text>
                  <TextInput
                  
                    placeholder="+19234 5834 23"
                    value={this.state.phone}
                    style={styles.inputcontrol}
                    keyboardType="numeric"
                    onChangeText={text => this.setState({ phone: text })}
                  />
                </View>
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Email </Text>
                  <TextInput
                   
                    placeholder="dave@example.com"
                     value={this.state.email}
                    style={styles.inputcontrol}
                    onChangeText={text => this.setState({ email: text })}
                  />
                </View>   
              </View>
            </View> 

            <View style={styles.bodyfooter}>
              <View style={styles.footLft}>
                <CheckBox
                  label="Add To Desk"
                  center
                  title="Add To Desk"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={this.state.checked}
                  onChange={this.toggleCheckbox.bind(this)}
                />
              </View>
              <TouchableOpacity style={styles.btnwrapper}>
                <Text style={styles.savebtn} onPress={() => this.savesetting()}>
                 Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    verified_status: state.otpstatus.verified_status,
    locationdata: state.networksteps.fullnetworkdetails,
user_id: state.user.id,
  };
}
export default connect(mapStateToProps)(Networkeditlocation);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  settingswrapper: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 50,
    marginRight: 10,
    marginLeft: 10
  },

  pagetitlebar: { justifyContent: "center", alignItems: "center" },

  closeicon: {
    width: 15,
    height: 15,
    position: "absolute",
    right: 15,
    top: 10
  },

  pagetitle: { fontSize: 20, fontWeight: "700", marginTop: 30 },

  formbody: {},

  grouptitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    marginTop: 15
  },

  formfieldcontainer: { borderBottomWidth: 2 },

  lableControl: { width: 80, marginTop: 20 },

  inputcontrol: { width: 230, height: 45,borderBottomWidth:Platform.OS=='ios'?1:0 ,padding:10,borderColor:"#C0C0C0" },

  formfieldcontainer: { flexDirection: "row" },

  checkicon: { width: 20, height: 20, marginRight: 5 },

  bodyinner: {
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 15
  },

  bodyfooter: {
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 15,
    flexDirection: "row"
  },

  btnwrapper: {
    backgroundColor: "#2980b9",
    alignItems: "center",
    borderRadius: 5
  },

  savebtn: {
    color: "#ffffff",
    padding: 10,
    fontSize: 18,
    width: 115,
    justifyContent: "center",
    textAlign: "center"
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  },

  footLft: {
    width: 160,
    flexDirection: "row",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#dbdbdb",
    marginRight: 30
  },

  redicon: { position: "absolute", right: 0, top: 6 },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  }
});
