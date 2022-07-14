/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
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
  BackHandler,
  Platform,
  Animated
} from "react-native";

 const FBSDK = require("react-native-fbsdk");
 const { LoginButton, LoginManager, AccessToken } = FBSDK;
//import { connect } from "react-redux"
import { Button, Picker, Item,Icon } from "native-base";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, parseUrl } from "../utility/constants";
import { connect } from "react-redux";
import * as _ from "lodash";
import  ToastAndroid from 'react-native-simple-toast';
// import { Select, Option } from 'react-native-select-list';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      selectedCountry:'Afghanistan',
    Phone_number: "", country: [], user_pass: "", flag: 0, loader: true, country_data: [], country_code: '+93' };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    console.log('@@@@@@', this.props.navigation.state.routeName)
  }
 
  componentWillMount() {
    {
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
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM
            );
          }
        })
        .catch(error => { });
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    
  }
  
  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  // }
  handleBackButtonClick() {

   //console.log('@@@@@@', this.props.navigation.state.routeName)
   if(this.props.navigation.state.routeName == "Login"){
    this.props.navigation.navigate('Signup')
    return true
     //this.back()
    }
  }
  
  // back(){
    
  //   setTimeout(() => {
  //           this.signupBack = true
  //           this.isBackPressed = false;
  //         }, 3000);
      
  //         ToastAndroid.showWithGravity(
  //           'Press again to exit App',
  //           ToastAndroid.SHORT,
  //           ToastAndroid.BOTTOM
  //         );
  //         if (this.isBackPressed) {
  //                 BackHandler.exitApp();
  //                 return true;
                  
  //               } else {
  //                 this.isBackPressed = true;
  //                 return true;
  //               }
  // }
  

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
    } else if (this.state.country_code == "") {
     
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
    } else if (this.state.user_pass == "") {
      
      ToastAndroid.showWithGravity(
        "Please Enter Valid Password",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      this.setState({ flag: 1 });
      let url = loginUrl + "user/login";
      let method = "POST";
      let countryCode='';
      this.state.country.map(item=>{
        if(item.country_name==this.state.selectedCountry)
          countryCode=item.country_code
      })
      let body = JSON.stringify({
        mobile_no: countryCode + this.state.Phone_number,
        user_pass: this.state.user_pass
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
            AsyncStorage.setItem(
              "user_data",
              JSON.stringify(responseJson.data)
            );
            this.props.navigation.navigate("Home")
            // this.parseLogin(responseJson.data._id);
          
            ToastAndroid.showWithGravity(
              responseJson.message,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
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
  _facebookSignUp() {
    LoginManager.logInWithReadPermissions(['public_profile','email'])
        .then(result => {
            if (result.isCancelled) {
                alert('Login cancelled');
            }
            else {
              console.log("inside Login")
                AccessToken.getCurrentAccessToken().then((data) => {
                    console.log('DATA',data)
                    let token = data.accessToken;
                    console.log(token)
                    fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
                        .then((resp) => resp.json())
                        .then((result) => {
                            console.log('facebook', result)
                            username = result.name;
                            userid = result.id;
                            useremail =result.email?result.email:null;

                            let url = loginUrl + "user/socialLogin";
                            let method = "POST";
                            let body = JSON.stringify({
                              social_id: userid,
                              user_loginType: 2,
                              user_email: useremail,
                              user_name: username
                            })
                            dataLayer
                              .postData(url, method, body)
                              .then(response => response.json())
                              .then(responseJson => {
                                console.log("datta : ",responseJson)
                                if (responseJson.status == "true") {
                                  this.props.dispatch({
                                    type: "Set_user",
                                    payLoad: responseJson.data
                                  });
                                  AsyncStorage.setItem(
                                    "user_data",
                                    JSON.stringify(responseJson.data)
                                  );
                                  AsyncStorage.setItem(
                                    "fb_user_data",
                                    JSON.stringify(result)
                                  );
                                  this.props.dispatch({ type: "user_data", payLoad: responseJson.data });
                                  this.props.dispatch({ type: "fb_user_data", payLoad: result.friends });
                                  let userId = responseJson.data._id;
                                  AsyncStorage.getItem(
                                    "ParseInstallation",
                                    value => {
                                      let temp = JSON.parse(value);
                                      console.log("================>",temp)
                                      var objectId = temp ? temp.objectId : null;
                                      let url1 = parseUrl + "users";
                                      let body1 = JSON.stringify({
                                        username: responseJson.data._id,
                                        password: "123456",
                                        installation: objectId
                                      });
                                      dataLayer
                                        .sendParseData(url1, method, body1)
                                        .then(response => response.json())
                                        .then(responseJson => {
                                         console.log('response=== >',responseJson);
                                          if (typeof responseJson.sessionToken == 'undefined') {
                                            this.parseLogin(userId);
                                          } else {
                                            AsyncStorage.setItem(
                                              "ParseUser",
                                              JSON.stringify(responseJson)
                                            );
                                          }
                                        })
                                        // .catch(error => {
                                        //    console.log("error =  > ")
                                        //   ToastAndroid.showWithGravity(
                                        //     "Error in connect to server post",
                                        //     ToastAndroid.SHORT,
                                        //     ToastAndroid.BOTTOM
                                        //   );
                                        // });
                                    }
                                  );

                                  ToastAndroid.showWithGravity(
                                    responseJson.message,
                                    ToastAndroid.SHORT,
                                    ToastAndroid.BOTTOM,
                                  );
                                  this.props.navigation.navigate("Home");
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
                           
                          })
                          .catch(() => {
                            reject("ERROR GETTING DATA FROM FACEBOOK");
                          });
                        })
            }
        })
     
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

                {/* <Dropdown style={styles.drdown} 
               data={this.state.country}
               
             placeholder='+91'
             label='Country Code'
             onChangeText={this.countryCode.bind(this)}/> */}
              </View>
              <TextInput
                multiline={true}
                style={styles.inputph}
                keyboardType="numeric"
                onChangeText={text => this.setState({ Phone_number: text })}
              />
            </View>

            <Text style={styles.numtxt}> PASSWORD </Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              onChangeText={text => this.setState({ user_pass: text })}
            />

            <View style={styles.btnrow}>
              <View style={styles.buttoncontainer}>
                  <TouchableOpacity
                   style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                   onPress={()=>this._facebookSignUp()}>
                      <Icon name='facebook' type='Entypo' style={{fontSize:25,color:'white',marginRight:10}} />
                      <Text style={{color:'white',fontWeight:'bold'}}>FACEBOOK</Text>
                  </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.buttoncontainerblk}
                onPress={() => this.onlogin()}
              >
                <Text style={styles.btntext}>Proceed</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Checknumber")}>
              <Text style={{ alignSelf: 'center', textDecorationLine: 'underline', fontWeight: 'bold' }}>
                Reset your Password
           </Text>
            </TouchableOpacity>
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
module.exports = connect(mapStateToProps)(Login);

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

  numtxt: { color: '#acacac',marginTop:Platform.OS?10:5 },

  inputph: { borderColor: '#2980b9',  width: '65%', height: 40,borderBottomWidth:Platform.OS=='ios'?1:0 , marginTop: 5 },
  input: { borderColor: "#2980b9", width: '100%', height: 40,borderBottomWidth:Platform.OS=='ios'?1:0, },
  btnrow: { flexDirection: 'row', marginTop: 50 },

  buttoncontainer: {
    backgroundColor: '#4267B2',
    padding: 10,
    width: '62%',
    height: 50,
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 10
  },

  buttoncontainerblk: {
    backgroundColor: '#464646',
    padding: 10,
    width: '33%',
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

  // inputgroup: { flexDirection: 'row', },

  // countrycode: { width: '30%', marginTop: -55, }
  inputgroup: { flexDirection: "row", width: '100%',justifyContent:'space-between'},

  countrycode: { width: '30%', marginTop:Platform.OS=='ios'?-30:-55 }
});
