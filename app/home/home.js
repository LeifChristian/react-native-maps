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
  NetInfo,
  Alert
} from "react-native";
import { Platform, BackHandler } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import PTRView from "react-native-pull-to-refresh";
const netprofile = require('../../../img/undefined.png')
import  ToastAndroid from 'react-native-simple-toast';
BackHandler.addEventListener("hardwareBackPress", function() {
  return false;
});
var PushNotification = require('react-native-push-notification');
export default class Home extends Component {
  isBackPressed = false;
  constructor(props) {
    super(props);
    this.state = {
      networkdata: [],
      flag: 0,
      loader: true,
      joinedNetwork: [],
      invitedNetwork: [],
      user_id: "",
      backbuttonstatus: 1,
      showAlert: false
    };
   // alert('home')
    this._refresh = this._refresh.bind(this);
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.onBackPress.bind(this)
    );
   // console.disableYellowBox = true;
  }
  onBackPress() {
    //console.log("from home");
    setTimeout(() => {
      this.isBackPressed = false;
    }, 3000);

    ToastAndroid.showWithGravity(
      "Press again to exit App",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
    if (this.isBackPressed) {
      BackHandler.exitApp();
    } else {
      this.isBackPressed = true;
      return true;
    }

    // BackHandler.exitApp();
  }

  componentDidMount() {
    console.log("hi this is home page..!")
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
          console.log('USER DATA===',value)
          let temp = JSON.parse(value);
          let user_id = temp._id;
          let url = loginUrl + "network";
          let method = "POST";
          let body = JSON.stringify({ user_id: user_id });
          dataLayer
            .postData(url, method, body)
            .then(response => response.json())
            .then(responseJson => {
             console.log('res@@@@',responseJson)
              this.setState({ flag: 2 });
              if (responseJson.status == "true") {
                this.setState({
                  networkdata: responseJson.data,
                  joinedNetwork: responseJson.getjoinedNetwork,
                  invitedNetwork: responseJson.inviteNetwork,
                  user_id: user_id
                });
                console.log('network data====',this.state.networkdata)
                AsyncStorage.setItem(
                  "myNetwork",
                  JSON.stringify(responseJson.data)
                );
                this.props.dispatch({
                  type: "clear_network_file_data",
                  payLoad: responseJson.data
                });
              } else {
                ToastAndroid.showWithGravity(
                  responseJson.message,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              }
            })
            .catch(error => {
              console.log("error  ",error)
              //this.setState({ flag: 2 });
            });
        });
      }
    });
  }
  networkdetails(networkid, status,networkName) {
    AsyncStorage.setItem(
      "netwrok_details",
      JSON.stringify({ network_id: networkid })
    );
    AsyncStorage.setItem(
      "network_craeted_status",
      JSON.stringify({ network_craeted_status: status })
    );
    this.props.navigation.navigate("Network");
  }
  confirmjoin(network_id, status) {
    var user_id = this.state.user_id;
    this.setState({ flag: 1 });
    var network_id = network_id;
    var invitation_status = status;
    let url = loginUrl + "network/responseOnInvitation";
    let method = "POST";
    let body = JSON.stringify({
      _id: network_id,
      status: invitation_status,
      user_id: user_id
    });

    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
        if (responseJson.status == "true") {
          this.setState({
            networkdata: responseJson.data,
            joinedNetwork: responseJson.getjoinedNetwork,
            invitedNetwork: responseJson.inviteNetwork
          });
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
  _refresh() {
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      let user_id = temp._id;
      let url = loginUrl + "network";
      let method = "POST";
      let body = JSON.stringify({ user_id: user_id });
      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ flag: 2 });

          if (responseJson.status == "true") {
            this.setState({
              networkdata: responseJson.data,
              joinedNetwork: responseJson.getjoinedNetwork,
              invitedNetwork: responseJson.inviteNetwork
            });
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
    });

    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }
  showAlert() {
    this.setState({
      showAlert: true
    });
  }

  hideAlert() {
    this.setState({
      showAlert: false
    });
  }
  render() {
    if (this.state.showAlert == true) {
      return (
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Go Pro Membership"
          message="Are You Want To Upgrade Account!"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Cancel"
          confirmText="Yes"
          cancelButtonColor="#2980b9"
          confirmButtonColor="#2980b9"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      );
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
   
    var row = this.state.networkdata.map((data11111, index) => {
      // if(data11111.coverPhoto != undefined || data11111.coverPhoto != null || data11111.coverPhoto !=""){
      //   var img = network_img + data11111.coverPhoto;
      // }
      // else{
      //   var img = network_img + data11111
      //   //var img = netprofile
      // }
      var img = data11111.coverPhoto?network_img + data11111.coverPhoto:null;
     
      //console.log('NETWORK IMAGE',data11111.coverPhoto == undefined);

      //console.log('DATATATATATATATATA',data11111);
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.networkdetails(data11111._id, 1,data11111.networkName)}
        >
          {/* <View style={styles.roundedthumbnil}>
            <Image style={styles.thumb} source={{ uri: img }} />
          </View>  */}
          {
            img ?
            <View style={styles.roundedthumbnil}>
            <Image style={styles.thumb} source={{ uri: img }} />
            </View> :

            <View style={styles.roundedthumbnil}>
            <Image style={styles.thumb} source={netprofile} />
            </View>
          } 
          <Text style={styles.contenttxt}> {data11111.networkName} </Text>
        </TouchableOpacity>
      );
    });
  
    if (this.state.joinedNetwork != "" || this.state.joinedNetwork != undefined) {
      var row1 = this.state.joinedNetwork.map((data2222, index) => {
        let img = data2222.networkinfo.coverPhoto?network_img + data2222.networkinfo.coverPhoto:null;
        //  console.log(data2222);
       // console.log('joined network',data2222.networkinfo.coverPhoto)
        return (
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              this.networkdetails(
                data2222.networkinfo._id,
                data2222.is_user_admin
              )}
          >
            {/* <View style={styles.roundedthumbnil}>
              <Image style={styles.thumb} source={{ uri: img }} />
            </View> */}

            {
            img ?
            <View style={styles.roundedthumbnil}>
            <Image style={styles.thumb} source={{ uri: img }} />
            </View> :

            <View style={styles.roundedthumbnil}>
            <Image style={styles.thumb} source={netprofile} />
            </View>
          }
            <Text style={styles.contenttxt}>
              {data2222.networkinfo.networkName}
            </Text>
          </TouchableOpacity>
        );
      });
    } else {
      var row1 = <Text style={styles.avatartxt} />;
    }
    if (this.state.invitedNetwork != "") {
      var row2 = this.state.invitedNetwork.map((data1, index1) => {
        let img = data1.networkinfo.coverPhoto?network_img + data1.networkinfo.coverPhoto:null;
        return (
          <TouchableOpacity style={styles.row}>
            {/* <View style={styles.roundedthumbnil}>
              <Image style={styles.thumb} source={{ uri: img }} />
            </View> */}

            {
            img ?
            <View style={styles.roundedthumbnil}>
            <Image style={styles.thumb} source={{ uri: img }} />
            </View> :

            <View style={styles.roundedthumbnil}>
            <Image style={styles.thumb} source={netprofile} />
            </View>
          }
            <Text style={styles.contenttxt}>
              {data1.networkinfo.networkName}
            </Text>
            <View style={styles.btnbar}>
              <TouchableOpacity
                style={styles.btn_squre_box}
                onPress={() => this.confirmjoin(data1._id, 1)}
              >
              <Image
              style={styles.btn_yes}
              source={require("../assets/img/green_yes.png")}
            />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn_squre_box}
                onPress={() => this.confirmjoin(data1._id, 0)}
              >
                <Image
              style={styles.btn_no}
              source={require("../assets/img/rad_no.png")}
            />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      });
    } else {
      var row2 = <Text style={styles.avatartxt} />;
    }
    return (
      <View style={styles.container}>
        <View style={styles.togglewrapper}>
          <TouchableOpacity
            style={styles.squerbox}
            onPress={() => this.props.navigation.navigate("Desk")}
          >
            <Image
              style={styles.squerbox_icon1}
              source={require("../assets/img/lamp.png")}
            />
            <Text style={styles.squerbox_txt}> DESK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.showAlert();
            }}
            style={styles.squerbox}
          >
            <Image
              style={styles.squerbox_icon2}
              source={require("../assets/img/award.png")}
            />
            <Text style={styles.squerbox_txt}> GO PRO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.squerbox}
            onPress={() => this.props.navigation.navigate("Settings")}
          >
            <Image
              style={styles.squerbox_icon3}
              source={require("../assets/img/gear.png")}
            />
            <Text style={styles.squerbox_txt}> SETTINGS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.squerbox}
            onPress={() => this.props.navigation.navigate("Profile")}
          >
            <Image
              style={styles.squerbox_icon4}
              source={require("../assets/img/customer.png")}
            />
            <Text style={styles.squerbox_txt}> PROFILE</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerleft}
            onPress={() => this.props.navigation.navigate("DrawerOpen")}
          >
            <Image
              style={styles.baricon}
              source={require("../assets/img/bar_icon.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Image
              style={styles.logo}
              source={require("../assets/img/pocket.png")}
            />
          </View>
          <TouchableOpacity
            style={styles.headerright}
            onPress={() =>
              this.props.navigation.navigate("NewNetworkStepFirst")}
          >
            <Image
              style={styles.plus}
              source={require("../assets/img/plus.png")}
            />
          </TouchableOpacity>
        </View>
        <PTRView onRefresh={this._refresh}>
          <ScrollView style={styles.scrollcontainer}>
            <View style={styles.mynetwork}>
              <Text style={styles.heading}> MY NETWORKS </Text>
              {row}
            </View>
            <View style={styles.separators} />
            <View style={styles.mynetwork}>
              <Text style={styles.heading}> JOINED NETWORKS</Text>
              {row1}
            </View>
            <View style={styles.separators} />

            <View style={styles.mynetwork}>
              <Text style={styles.heading}> INVITES</Text>
              {row2}
            </View>
          </ScrollView>
        </PTRView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    networks1: state.networksteps,
    internet_connection: state.networkconnection.netstatus,
    fbfrnds: state.loginReducer.fb_data
  };
}
module.exports = connect(mapStateToProps)(Home);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  togglewrapper: {
    padding: 10,
    backgroundColor: "#2980b9",
    flexDirection: "row"
  },

  squerbox: {
    width: 77,
    height: 75,
    marginRight: 10,
    backgroundColor: "#125f92",
    justifyContent: "center",
    alignItems: "center"
  },

  squerbox_icon1: { width: 32, height: 32 },
  squerbox_icon2: { width: 25, height: 32 },
  squerbox_icon3: { width: 32, height: 32 },
  squerbox_icon4: { width: 30, height: 32 },

  squerbox_txt: { fontSize: 12, color: "#fff", marginTop: 10 },

  header: {
    backgroundColor: "#fff",
    height: 55,
    padding: 10,
    flexDirection: "row"
  },

  headerleft: { width: 155 },
  headercenter: { width: 155 },
  headerright: { width: 150 },

  baricon: {
    width: 25,
    height: 20,
    marginTop: 5
  },

  logo: {
    width: 30,
    height: 30,
   // textAlign: "center"
  },

  plus: {
    width: 20,
    height: 20,
    marginTop: 5
  },

  scrollcontainer: {
    paddingTop: 20
  },

  mynetwork: {
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20
  },

  heading: {
    color: "#2980b9",
    fontSize: 18,
    fontWeight: "700"
  },

  row: { flexDirection: "row", marginTop: 15 },

  roundedthumbnil: {
    width: 40,
    height: 40,
    borderRadius: 20,
    //backgroundColor: "#ff9900",
  },

  
  roundview:{
    width: 40,
    height: 40,
    borderRadius: 6,
    //backgroundColor: "#ff9900",
    textAlign: "center"
  },

  thumb: {
    width: 40,
    height: 40,
    borderRadius: 20
  },

  contenttxt: {
    padding: 10,
    fontSize: 16,
    width:205,
  },

  separators: {
    width: 180,
    height: 1,
    backgroundColor: "#acacac",
    marginTop: 15,
    marginBottom: 15
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    backgroundColor: "rgba(255,255,255,0.5)"
  },

  btnbar: { flexDirection: "row" },
  btn_btnsmall: {
    backgroundColor: "#b3e8ff",
    fontSize: 10,
    margin: 3,
    paddingTop: 5,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
    fontSize: 10
  },
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: "#AEDEF4"
  },
  text: {
    color: "#fff",
    fontSize: 15
  },
  btn_squre_box:{margin:3,
    paddingTop: 5,
   
    fontSize: 10},

   btn_yes:{ width: 32, height: 32 },
  btn_no:{ width: 32, height: 32 },
});
