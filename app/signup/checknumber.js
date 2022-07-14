/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  ActivityIndicator,
  NetInfo,
} from "react-native";
var SharedPreferences = require("react-native-shared-preferences");
import  ToastAndroid from 'react-native-simple-toast';
const FBSDK = require("react-native-fbsdk");
const { LoginButton, LoginManager, AccessToken } = FBSDK;
import ModalDropdown from 'react-native-modal-dropdown';
import { Dropdown } from 'react-native-material-dropdown';
//import { connect } from "react-redux"
import { Button, Picker, Item, } from "native-base";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, parseUrl } from "../utility/constants";
import { connect } from "react-redux";
import * as _ from "lodash";

// import { Select, Option } from 'react-native-select-list';
export default class Checknumber extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedCountry:'Afghanistan',Phone_number: "", country: [], user_pass: "", flag: 0, loader: true, country_data: [], country_code: '',user_id:'' };
  }
  componentWillMount() {
    let url1 = loginUrl + "user/getCountry";
    let method = "POST";
    let body = JSON.stringify({});
    let country_array = []
    dataLayer
      .postData(url1, method, body)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "true") {
          if (responseJson.data) {
            var row2 = responseJson.data.map((data12, index1) => {
              let name = data12.name
              let value = data12.dial_code;
              // console.log('GHT >>',value)
              let item = {
                country_name: name,
                country_code: value
              };


              // this.state.country.push(item);


              country_array.push(item)

            });
            this.setState({ country: country_array })
          }
        } else {
          ToastAndroid.showWithGravity(
            responseJson.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      })
      .catch(error => { });
  }
  parseLogin(userId) {
    let url1 = parseUrl + "login?username=" + userId + "&password=123456";
    dataLayer
      .getParseData(url1, "get")
      .then(response => response.json())
      .then(responseJson => {
        AsyncStorage.setItem("ParseUser", JSON.stringify(responseJson));
      })
      .catch(error => {
        // console.log('parse parselogin Error =>',error)
        ToastAndroid.showWithGravity(
          "Error in connect to parse server parselogin",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      });
  }
  onlogin() {
    if (this.state.Phone_number == "") {
      ToastAndroid.showWithGravity(
        "Please Enter Phone Number",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (this.state.selectedCountry == "") {
      ToastAndroid.showWithGravity(
        "Please Select Country Code",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (isNaN(this.state.Phone_number)) {
      ToastAndroid.showWithGravity(
        "Please Enter Valid Phone Number",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      this.setState({ flag: 1 });
      let url = loginUrl + "user/forgotPasswordSendOtp";
      let method = "POST";
      let countryCode='';
      this.state.country.map(item=>{
        if(item.country_name==this.state.selectedCountry)
          countryCode=item.country_code
      })
      let body = JSON.stringify({
        user_phone: countryCode + this.state.Phone_number,
        //user_pass: this.state.user_pass
      });
      
      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
          console.log('res========',responseJson)
          this.setState({ flag: 2 });
          if (responseJson.status == "true") {
            this.props.navigation.navigate("CheckOtp",{user_id:responseJson.user_id});
           //this.setState({user_id:responseJson.user_id}) 
            // this.props.dispatch({
            //   type: "Set_user",
            //   payLoad: responseJson.data
            // });
            // AsyncStorage.setItem(
            //   "user_data",
            //   JSON.stringify(responseJson.data)
            // );
            // ToastAndroid.showWithGravity(
            //   responseJson.message,
            //   ToastAndroid.SHORT,
            //   ToastAndroid.BOTTOM
            // );
            // this.setState({ flag: 2 });
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
  }
  countryCode(value) {
    this.setState({
      country_code: +91
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
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollcontainer}>
          <View style={styles.logocontainer}>
            <Image
              style={styles.logo}
              source={require("../assets/img/pocket.png")}
            />

            <Text style={styles.apptitle}>
              Pocket <Text style={{ color: "#2980b9" }}>Desk</Text>
            </Text>

            <Text style={styles.apppunchline}>
              Organize your content. Organize your life
            </Text>
          </View>
          <View style={styles.formcontainer}>
            <Text style={styles.numtxt}> PHONE NUMBER </Text>
            <View style={styles.inputgroup}>
              <View style={styles.countrycode}>
              {this.state.country.length !== 0 ? <Picker
                  mode='dropdown'
                  style={Platform.OS=='ios'?{borderBottomWidth:1,borderColor:'#2980b9',top: 30, width: 100,}:{ top: 30, width: 100, }}
                  selectedValue={this.state.selectedCountry}
                  onValueChange={(itemValue, itemIndex) =>{
                    this.setState({ selectedCountry:itemValue})
                  }
               }> 
                  {
                    _.map(this.state.country, d =>
                      <Picker.Item key={d.country_code} label={d.country_name} value={d.country_name} />
                    )
                  }
                </Picker> :
                  <ActivityIndicator
                    style={{ bottom:Platform.OS=='ios'?-40: -70, width: 100 }}
                    animating={this.state.loader}
                    color='#2980b9'
                    size="small"
                  />}
              </View>
              <TextInput
                style={styles.inputph}
                keyboardType="numeric"
                onChangeText={text => this.setState({ Phone_number: text })}
              />
            </View>

            <View style={styles.btnrow}>
              <TouchableOpacity
                style={styles.buttoncontainerblk}
                onPress={() => this.onlogin()}
              >
                <Text style={styles.btntext}>Next</Text>
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
    id: state.user.id,
    countrycode: state.user.CountryCode,
  };
}
module.exports = connect(mapStateToProps)(Checknumber);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 10,
    borderColor: "#2980b9",
    backgroundColor: "#fff"
  },

  logocontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },

  logo: {
    width: 60,
    height: 60
  },

  apptitle: {
    color: "#333333",
    textAlign: 'center',
    fontSize: 35,
  },

  apppunchline: {
    width: 150,
    textAlign: 'center',
    marginTop: 15
  },

  formcontainer: {
    paddingTop: 100,
    paddingLeft: 15,
    paddingRight: 15,

  },

  numtxt: { color: '#acacac' },

  inputph: { borderColor: '#2980b9', width: '65%', height: 40, marginTop: 5,borderBottomWidth:Platform.OS=='ios'?1:0, },

 input: { borderColor: '#2980b9', width: '100%', height: 40, },

  btnrow: { flexDirection: 'row', marginTop: 50,alignSelf: 'center',justifyContent: 'center', },

  buttoncontainer: {
    backgroundColor: '#4267B2',
    padding: 10,
    width: '60%',
    height: 50,
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 10
  },

  buttoncontainerblk: {
    backgroundColor: '#4267B2',
    padding: 10,
    width: '35%',
    height: 50,
    borderRadius: 5,
    marginBottom: 30
  },

  btntext: {
    textAlign: 'center',
    color: '#fff',
    paddingTop: 5,
    fontSize: 16,
    alignItems: 'flex-end'
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },

  codeselect: { width: 300, marginTop: 25, height: 30, borderBottomWidth: 1, borderColor: '#888' },

  fullwidth: { width: 250, backgroundColor: '#ff9900', },

  inputgroup: { flexDirection: 'row',width:'100%',justifyContent:'space-between' },

  countrycode: { width: '30%', marginTop:Platform.OS=='ios'?-30:-55, }
});
