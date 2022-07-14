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
  AsyncStorage,
} from "react-native";
import { Button } from "native-base";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl } from "../utility/constants";
import { connect } from "react-redux";
import  ToastAndroid from 'react-native-simple-toast';
class CheckOtp extends Component {
  constructor(props) {
    super(props);
    this.state = { otp1: "", otp2: "", ot3: "", otp4: "", otp5: "", otp6: "",user_id:this.props.navigation.state.params.user_id };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    console.log('user_id======',this.props.navigation.state.params.user_id)
  }
 focusNextField(id) {
    this.inputs[id].focus();
}
  otp_verificatoin() {
    let url = loginUrl + "user/forgotPasswordMatchOtp";
    let method = "POST";
    let otpnumber =
      this.state.otp1 +
      this.state.otp2 +
      this.state.otp3 +
      this.state.otp4 +
      this.state.otp5 +
      this.state.otp6;

    ToastAndroid.showWithGravity(
      "Please Wait...",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
    let body = JSON.stringify({
      otp: otpnumber,
      //_id: this.props.userDetails._id,
      _id:this.props.navigation.state.params.user_id
      //mobile: this.props.userDetails.user_phone
    });
    console.log('body of otp===',body)
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
          console.log('response json=========',responseJson)
        if (responseJson.status == "true") {
            this.props.navigation.navigate("Resetpassword",{user_id:responseJson.user_id});
          // ToastAndroid.showWithGravity(
          //   responseJson.message,
          //   ToastAndroid.SHORT,
          //   ToastAndroid.BOTTOM
          // );
        }
        else{
            ToastAndroid.showWithGravity(
                responseJson.message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
        }
      })
      .catch(error => {
        //console.error(error);
      });
    /*AsyncStorage.getItem('user_data').then((value)=> {console.log(value)
            let temp = JSON.parse(value);
            let user_id = temp._id;
            alert(user_id);
            
        });*/
  }
    _firstfocusNextField(text) {
      if(text!='')
        {
         this.refs[2].focus()
        }
         this.setState({ otp1: text })
         
    }
       _secondfocusNextField(text) {
        
        if(text!='')
        {
         this.refs[3].focus()
        }else{
          this.refs[1].focus()
        }
          this.setState({ otp2: text })
    }
       _thirdfocusNextField(text) {
        if(text!='')
        {
         this.refs[4].focus()
        }else{
          this.refs[2].focus()
        }
         this.setState({ otp3: text })
       
    }
       _fourthfocusNextField(text) {
          if(text!='')
        {
         this.refs[5].focus()
        }else{
          this.refs[3].focus()
        }
         this.setState({ otp4: text })
       
    }
       _fivefocusNextField(text) {
        if(text!='')
        {
         this.refs[6].focus()
        }else{
          this.refs[4].focus()
        }
         this.setState({ otp5: text })
        
    }
       _sixfocusNextField(text) {
          if(text=='')
        {
         this.refs[5].focus()
        }
         this.setState({ otp6: text })
        
    }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logocontainer}>
          <Image
            style={styles.logo}
            source={require("../assets/img/small_white.png")}
          />
        </View>
        <View style={styles.verification_box}>
          <Text style={styles.title}>
            {" "}
            We texted you a 6 digit verification code.{" "}
          </Text>
          <View style={styles.formcontainer}>
            <View style={styles.inputcontainer}>
              <TextInput
               ref='1'
                style={styles.input}
                keyboardType="numeric"
                returnKeyType='next'
                blurOnSubmit={false}
                maxLength={1}
                onChangeText={text => this._firstfocusNextField(text)}
                 
                
              />
              <TextInput
               ref='2'
                style={styles.input}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={text => this.setState({ otp2: text })}
                returnKeyType='next'
                blurOnSubmit={false}
                onChangeText={text => this._secondfocusNextField(text)}
              />
              <TextInput
               ref='3'
                style={styles.input}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={text => this.setState({ otp3: text })}
                returnKeyType='next'
                blurOnSubmit={false}
                onChangeText={text => this._thirdfocusNextField(text)}
              />
              <TextInput
               ref='4'
                style={styles.input}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={text => this.setState({ otp4: text })}
                returnKeyType='next'
                blurOnSubmit={false}
                onChangeText={text => this._fourthfocusNextField(text)}
              />
              <TextInput
               ref='5'
                style={styles.input}
                keyboardType="numeric"
                maxLength={1}
                returnKeyType='next'
                blurOnSubmit={false}
                onChangeText={text => this._fivefocusNextField(text)}
              />
              <TextInput
               ref='6'
                style={styles.input}
                keyboardType="numeric"
                maxLength={1}
               onChangeText={text => this._sixfocusNextField(text)}
              />
            </View>

            <Text style={styles.capstxt}> RESEND CODE </Text>

            <View style={styles.btnrow}>
              <TouchableOpacity
                style={styles.buttoncontainer}
                onPress={() => this.otp_verificatoin()}
              >
                <Text style={styles.btntext}>CONTINUE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    userDetails: state.user.userdata
  };
}
module.exports = connect(mapStateToProps)(CheckOtp);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2980b9"
  },

  logocontainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50
  },

  logo: {
    width: 45,
    height: 45
  },

  verification_box: {
    textAlign: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#fff",
    width: 320,
    marginTop: 50,
    marginRight: "auto",
    marginLeft: "auto",
    borderRadius: 5
  },

  title: {
    fontSize: 20,
    textAlign: "center",
    width: 210,
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
    marginRight: "auto",
    marginLeft: "auto",
    color: "#000"
  },

  capstxt: {
    textAlign: "center",
    marginTop: 15,
    marginBottom: 15,
    color: "#2980b9",
    letterSpacing: 15
  },

  inputcontainer: {
    justifyContent:'space-between',
    flexDirection: "row",
    marginBottom: 30
    
  },

  input: {
    borderColor: "#000",
    width:Platform.OS=='ios'?40:48,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    borderBottomWidth:Platform.OS=='ios'?1:0,
  },

  btnrow: { marginTop: 10 },

  buttoncontainer: {
    backgroundColor: "#2980b9",
    padding: 10,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 10
  },

  btntext: {
    textAlign: "center",
    color: "#fff",
    paddingTop: 5,
    fontSize: 16,
    alignItems: "flex-end"
  }
});
