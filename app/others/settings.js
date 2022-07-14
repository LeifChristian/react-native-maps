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
  Field,
  AsyncStorage,
  ActivityIndicator,
  NetInfo
} from "react-native";

import { Footer, FooterTab } from "native-base";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import ImagePicker from "react-native-image-picker";
import  ToastAndroid from 'react-native-simple-toast';
const profile= require('../../../img/default_pro.png')

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: "",
      user_email: "",
      user_pass: "",
      userdetails: [],
      flag: 0,
      loader: true,
      imgresponse: "",
      avatarSource: "",
      user_id: "",
      user_pic2: "",
      user_pic:""
    };
   // alert('setting')
  }
  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  selectPhotoTapped() {
    const options = {
      quality: 1.0,

      maxWidth: 500,

      maxHeight: 500,

      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, response => {
     // console.log("Response = ", response);

      if (response.didCancel) {
     //   console.log("User cancelled photo picker");
      } else if (response.error) {
     //   console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
      //  console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        this.setState({
          user_pic2: response.uri ,

          imgresponse: response
        });
      }
    });
  }
  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected == false) {
        ToastAndroid.showWithGravity(
          "No Internet Connection Available",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      } else {
         this.setState({ flag: 1 });
        AsyncStorage.getItem("user_data").then(value => {
          let temp = JSON.parse(value);
          let user_id = temp._id;
          let url = loginUrl + "user/getuserprofile";
          let method = "POST";
          let body = JSON.stringify({ user_id: user_id });
          dataLayer
            .postData(url, method, body)
            .then(response => response.json())
            .then(responseJson => {
              console.log('res===',responseJson)
               this.setState({ flag: 2 });
              if (responseJson.status == "true") {
                this.setState({
                  user_name: responseJson.data.user_name,
                  user_email: responseJson.data.user_email,
                  user_id: responseJson.data._id,
                  user_pass: responseJson.data.user_password,
                  user_pic: responseJson.data.user_pic ? responseJson.data.user_pic:null
                });
                //console.log('user_pic====',this.state.user_pic)
              } else {
                ToastAndroid.showWithGravity(
                  responseJson.message,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              }
            })
            .catch(error => {
              
            });
        });
      }
    });
  }
  savesetting() {
    if (this.state.user_name == "") {
      ToastAndroid.showWithGravity(
        "Please Enter Name",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if ((this.state.user_email == "") || (!this.validateEmail(this.state.user_email))) {
      ToastAndroid.showWithGravity(
        "Please Enter Valid Email",
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
           var passwordFlag='1';
          if (this.state.user_pass != "") {
            if (this.state.user_pass.length < 6) {
              var passwordFlag='2';
              ToastAndroid.showWithGravity(
                "Password Atleast 6 digit / character",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            }
          }
          if(passwordFlag=='1')
            {
           this.setState({ flag: 1 });
          let url = loginUrl + "user/userUpdateProfile";
          let method = "POST";
          var PicturePath = this.state.imgresponse.uri;
          var fileName = this.state.imgresponse.fileName;
          var fileType = this.state.imgresponse.type;
          var data12 = new FormData();
          if (PicturePath) {
            data12.append("coverphotoImage", {
              uri: PicturePath,
              name: fileName,
              type: fileType
            });
          }
          //data12.append("coverphotoImage",this.state.imgresponse);
          data12.append("_id", this.state.user_id);
          data12.append("user_email", this.state.user_email);
          data12.append("user_name", this.state.user_name);
          data12.append("user_password", this.state.user_pass);
          dataLayer
            .postImageData(url, method, data12)
            .then(response => response.json())
            .then(responseJson => {
              
              this.setState({ flag: 2 });
             
              if (responseJson.status == "true") {
                this.setState({
                  user_pic: responseJson.data.user_pic
                });
                AsyncStorage.setItem(
                  "user_data",
                  JSON.stringify(responseJson.data)
                );
                this.props.navigation.navigate("Profile");
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
              ToastAndroid.showWithGravity(
                "Error in connect to server",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            });
        }
        }
      });
    }
  }
  render() {
    var pic 
//    if(this.state.user_pic){
//       pic =  network_img + this.state.user_pic
//    }
// console.log(pic)
    // }
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
            <TouchableOpacity
              style={styles.pagetitlebar}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={styles.closeicon}
                source={require("../assets/img/close.png")}
              />
              <Text style={styles.pagetitle}> SETTINGS </Text>
            </TouchableOpacity>
            
            <View style={styles.formbody}>
              <View style={styles.bodyinner}>
                <Text style={styles.grouptitle}>Profile Information</Text>
             <TouchableOpacity
                  style={styles.porfileimagebox}
                  onPress={this.selectPhotoTapped.bind(this)}>
                  
                  <View style={[styles.avatar, styles.avatarContainer]}>
                  
                     {
                      this.state.user_pic ? 
                      <Image style={styles.thumb} source={{uri:this.state.user_pic2?this.state.user_pic2:network_img+this.state.user_pic}}/> :
                      <Image style={styles.thumb} source={this.state.user_pic2?{uri:this.state.user_pic2}:profile} />

                    }
                  </View>
                </TouchableOpacity>
              
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Name </Text>
                  <TextInput
                    style={styles.inputcontrol}
                    value={this.state.user_name}
                    onChangeText={text => this.setState({ user_name: text })}
                  />
                </View>
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Email </Text>
                  <TextInput
                    style={styles.inputcontrol}
                    value={this.state.user_email}
                    onChangeText={text => this.setState({ user_email: text })}
                  />
                </View>
              </View>
              <View style={styles.bodyinner}>
                <Text style={styles.grouptitle}>Change your Password</Text>
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Password </Text>
                  <TextInput
                    secureTextEntry={true}
                    style={styles.inputcontrol}
                    onChangeText={text => this.setState({ user_pass: text })}
                  />
                </View>
              </View>
            </View>
            <View style={styles.bodyinner}>
              <Text style={styles.grouptitle}>Notifications</Text>
              <View style={styles.formfieldcontainer}>
                <Image
                  style={styles.checkicon}
                  source={require("../assets/img/check_green.png")}
                />
                <Text style={styles}>
               
                  I Want to keep recieving notification
                </Text>
              </View>
            </View>
            <View style={styles.bodyinner}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  settingswrapper: { backgroundColor: "#fff", borderRadius: 5, margin: 10 },

  pagetitlebar: { justifyContent: "center", alignItems: "center" },

  closeicon: {
    width: 15,
    height: 15,
    position: "absolute",
    right: 15,
    top: 10
  },

  pagetitle: { fontSize: 20, fontWeight: "700", marginTop: 30,  },

  formbody: {},

  grouptitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    marginTop: 15
  },

  formfieldcontainer: { borderBottomWidth: 2 },

  lableControl: { width: 80 },

  inputcontrol: { width: 230, height: 45 },

  formfieldcontainer: { flexDirection: "row" },

  checkicon: { width: 20, height: 20, marginRight: 5 },

  bodyinner: {
    borderBottomWidth: 1,
    borderColor: "#3c8bbf",
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 15
  },

  btnwrapper: {
    backgroundColor: "#2980b9",
    alignItems: "center",
    borderRadius: 5
  },

  savebtn: { color: "#ffffff", padding: 10, fontSize: 18 },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  },
  roundedthumbnil: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff9900",
    textAlign: "center"
  },

  thumb: { width: 80, height: 80, borderRadius: 40 },
  porfileimagebox: { alignItems: "center", marginBottom: 15 },
  profileimage: { borderRadius: 50 },
  avatarContainer: {
    borderColor: "#9B9B9B",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    borderRadius: 50,
    width: 80,
    height: 80
  }
});
