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
  TouchableOpacity,
  ScrollView,
  Platform,
  AsyncStorage,
  ActivityIndicator,
  ignoredYellowBox,
  NetInfo,
  BackHandler
} from "react-native";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, parseUrl } from "../utility/constants";
import { Button, Picker, Item } from "native-base";
import { connect } from "react-redux";
// import DeviceInfo from "react-native-device-info";
// import { Dropdown } from "react-native-material-dropdown";
import * as _ from "lodash";
import  ToastAndroid from 'react-native-simple-toast';
// var SharedPreferences = require("react-native-shared-preferences");
// import { Select, Option } from "react-native-select-list";
class Signup extends Component {
  isBackPressed = false;
  constructor(props) {
    super(props);
    this.state = {
      Phone_number: "",
      flag: 0,
      loader: true,
      network_status: false,
      progress: 0,
      indeterminate: true,
      country_data: [],
      country_code: "+93",
      country: [],
      selectedCountry:'Afghanistan',
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    console.disableYellowBox = true;
    console.log('!!!!!!!', this.props.navigation.state.routeName)
    
  }

  componentWillMount() {
    this.get_country_list();
    AsyncStorage.getItem("otp_data").then(value => {
      let temp = JSON.parse(value);
      var userotpStatus = temp ? temp.user_otpStatus : null;
      if (userotpStatus == 1) {
        this.props.navigation.navigate("Home");
      }
    });
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      // console.log('tem : - > ',temp)
      var user_otpStatus = temp ? temp.user_otpStatus : null;
      if (user_otpStatus == 1) {
        this.props.navigation.navigate("Home");
      }
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

  }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  // }
  handleBackButtonClick() {
    //BackHandler.exitApp()
    // if (this.props.navigation.state.routeName == "Signup") {

      setTimeout(() => {

        this.isBackPressed = true;
      }, 3000);

      ToastAndroid.showWithGravity(
        'Press again to exit App',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
      if (this.isBackPressed) {
        BackHandler.exitApp();
        return false;
        
       
      } else {
        this.isBackPressed = true;
        return true;
      }

    // }
  }

  get_country_list() {
    let url1 = loginUrl + "user/getCountry";
    let method = "POST";
    let body = JSON.stringify({});
    var county_array = []
    dataLayer
      .postData(url1, method, body)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "true") {
          if (responseJson.data) {
            var row2 = responseJson.data.map((data12, index1) => {

              //console.log(data12)
              let name = data12.name
              let value = data12.dial_code;
              // console.log('GHT >>',value)
              let item = {
                country_name: name,
                country_code: value
              };


              // this.state.country.push(item);


              county_array.push(item)

            });
            this.setState({ country: county_array })
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
  onSignup() {
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
    } else if (this.state.Phone_number.length < 10) {
      ToastAndroid.showWithGravity(
        "Please Enter 10 Digit Phone Number",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected == false) {
          ToastAndroid.showWithGravity(
            "No Internet Connection Available",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          this.setState({ flag: 1 });
          var secretkey = "ApiReal0903";
          var device_id = "9876543210";
          var device_type = "1";
          var timestamp = "1002589635";
          var createtoken = device_id + device_type + timestamp + secretkey;
          let url = loginUrl + "user/sendOtp";
          let method = "POST";
          var countryCode=''
          this.state.country.map(item=>{
            if(item.country_name==this.state.selectedCountry)
              countryCode=item.country_code
          })
          let body = JSON.stringify({
            user_phone: countryCode + this.state.Phone_number,
            user_device_id: device_id,
            user_device_token: "blm.ypsilon@gmail.com",
            user_device_type: device_type,
            timestamp: timestamp
          });
          dataLayer
            .postData(url, method, body)
            .then(response => response.json())
            .then(responseJson => {
              this.setState({ flag: 2 });
              if (responseJson.status == "true") {
                this.props.dispatch({
                  type: "Set_user",
                  payLoad: responseJson.data
                });

                AsyncStorage.getItem("ParseInstallation", value => {
                  //  console.log('value: ',value)
                  let temp = JSON.parse(value);
                  var objectId = temp ? temp.objectId : null;
                  let url1 = parseUrl + "users";
                  let body1 = JSON.stringify({
                    username: responseJson.data._id,
                    password: "123456",
                    phone: this.state.Phone_number,
                    installation: objectId
                  });
                  dataLayer
                    .sendParseData(url1, method, body1)
                    .then(response => response.json())
                    .then(responseJson => {
                      AsyncStorage.setItem(
                        "ParseUser",
                        JSON.stringify(responseJson)
                      );
                    })
                    .catch(error => { });
                });
                this.props.navigation.navigate("Otp");
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
      });
    }
  }
  countryCode(value) {
    this.setState({
      country_code: value
    });
  }
  render() {


    {
      //  console.log(this.state.country)
    }
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
                  this.setState({ selectedCountry:itemValue})}}>
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

                {/* <Dropdown
                  placeholder="+91"
                  default="+91"
                
                  label="Country Code"
                  data={this.state.country}
                  onChangeText={this.countryCode.bind(this)}
                /> */}
              </View>

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={text => this.setState({ Phone_number: text })}
              />
            </View>

            <View style={styles.btnrow}>
              <TouchableOpacity
                style={styles.buttoncontainer}
                onPress={() => this.onSignup()}
              >
                <Text style={styles.btntext}>SIGN UP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttoncontainerblk}
                onPress={() => this.props.navigation.navigate("Login")}
              >
                <Text style={styles.btntext}>LOG IN</Text>
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
    countrycode: state.user.CountryCode
  };
}
module.exports = connect(mapStateToProps)(Signup);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 10,
    borderColor: "#2980b9",
    backgroundColor: "#fff"
  },

  scrollcontainer: {},
  logocontainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50
  },

  logo: {
    width: 60,
    height: 60
  },

  apptitle: {
    color: "#333333",
    textAlign: "center",
    fontSize: 35
  },

  apppunchline: {
    width: 200,
    textAlign: "center",
    marginTop: 15
  },

  formcontainer: {
    paddingTop: 150,
    paddingLeft: 15,
    paddingRight: 15
  },

  numtxt: { color: "#acacac" },

  input: { borderColor: "#2980b9", width: '65%', height: 40,borderBottomWidth:Platform.OS=='ios'?1:0 },

  btnrow: { flexDirection: "row", marginTop: 50 },

  buttoncontainer: {
    backgroundColor: "#2980b9",
    padding: 10,
    width: 140,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 10
  },

  buttoncontainerblk: {
    backgroundColor: "#464646",
    padding: 10,
    width: 140,
    height: 50,
    borderRadius: 5,
    marginBottom: 30
  },

  btntext: {
    textAlign: "center",
    color: "#fff",
    paddingTop: 5,
    fontSize: 16,
    alignItems: "flex-end"
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  },
  indicator: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputgroup: { flexDirection: "row", width: '100%',justifyContent:'space-between'},

  countrycode: { width: '30%', marginTop:Platform.OS=='ios'?-35:-55 }
});
