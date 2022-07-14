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
  NetInfo,
  Picker,
  Platform
} from "react-native";

import { Footer, FooterTab } from "native-base";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
// import { Select, Option } from "react-native-select-list";
import DatePicker from "react-native-datepicker";
import  ToastAndroid from 'react-native-simple-toast';
export class networkcalender extends Component {
  constructor(props) {
    super(props);
    var today = new Date(),
      Todaydate =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
    this.state = {
      calenderTitle: "",
      user_email: "",
      user_pass: "",
      userdetails: [],
      flag: 0,
      loader: true,
      date: Todaydate,
      time: "",
      latitude: null,
      longitude: null,
      error: null
    };
    //console.log('add calender =====',this.props.navigation.state.params)
  }
  getCurrentLocation() {
    //this.setState({ latitude: "22.44455" });
    //this.setState({ longitude: "75.44455" });
    //this.setState()
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log('hey you are got me', position);
        this.setState({ latitude: position.coords.latitude });
        this.setState({ longitude: position.coords.longitude });
        (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
      }
    );
  }
  componentWillMount() {

    //console.log(new Date().toLocaleString());
  }

  goback() {
    this.setState({ network_data1: '' });

    //this.props.navigation.goBack();

    //  this.setState({
    //         calendar_dates: []
    //       });
    if (this.props.navigation.state.params.type == "network_cal") {
      this.props.navigation.navigate("Calendar");
    }
    else {
      this.props.navigation.navigate("NewNetworkStepSecond");
    }


  }

  saveCalenderDetails() {
    if (this.state.calenderTitle == "") {
      ToastAndroid.showWithGravity(
        "Please Enter Calender Title",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      this.setState({ flag: 1 });
      AsyncStorage.getItem("netwrok_data").then(value => {
        let temp = JSON.parse(value);
        var net_id = temp._id;

        let url = loginUrl + "network/addCalendar";
        let method = "POST";

        let body = JSON.stringify({
          network_id: net_id,
          calendar_title: this.state.calenderTitle,
          time: this.state.time,
          date: this.state.date,
          lat: this.state.latitude,
          lng: this.state.longitude
        });

        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
            this.setState({ flag: 2 });
            // console.log('Calender response',responseJson)
            if (responseJson.status == "true") {
              //this.props.navigation.navigate("Calendar");
              {
                this.props.navigation.state.params.type == "network_cal" ?
                  this.props.navigation.navigate("Calendar")
                  :
                  this.props.navigation.navigate("NewNetworkStepSecond")
              }
              this.props.dispatch({
                type: "calender_data",
                payLoad: responseJson.data
              });
              ToastAndroid.showWithGravity(
                responseJson.message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            } else {
              ToastAndroid.showWithGravity(
                responseJson.message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            }
          })
          .catch(error => {
            // ToastAndroid.showWithGravity(
            //   "Error in to connect to server.",
            //   ToastAndroid.SHORT,
            //   ToastAndroid.BOTTOM
            // );
          });
      });
    }
  }
  render() {

    //const {navigate} = this.props.navigation;
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
          <View style={styles.taskwrapper}>
            <TouchableOpacity
              style={styles.pagetitlebar}
              //onPress={() => this.props.navigation.goBack()}
              onPress={this.goback.bind(this)}

            >


              <Image
                style={styles.closeicon}
                source={require("../assets/img/close.png")}
              />


              <Text style={styles.pagetitle}> New Calender Entry </Text>
            </TouchableOpacity>
            <View style={styles.formbody}>
              <View style={styles.bodyinner}>
                <View style={{flexDirection:'row',width:'100%',alignItems:'center'}}>
                  <Text style={styles.lableControl}> Title </Text>
                  <TextInput
                    style={styles.inputcontrol}
                    value={this.state.user_name}
                    onChangeText={text =>
                      this.setState({ calenderTitle: text })}
                  />
                </View>
              </View>
            </View>
            <View style={styles.duewrapper}>
              <View style={styles.duebox}>
                <Text style={styles.boxtitle}> Time </Text>
                <View style={styles.skin}>
                  <DatePicker
                    style={{ width: 140 }}
                    date={this.state.time}
                    mode="time"
                    placeholder="select time"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 36
                      }
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={date => {
                      this.setState({ time: date });
                    }}
                  />
                </View>
              </View>
              <View style={styles.duebox}>
                <Text style={styles.boxtitle}> Date </Text>

                <View style={styles.skin_col}>
                  <DatePicker
                    style={{ width: 140 }}
                    date={this.state.date}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    minDate={this.state.Todaydate}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 36
                      }
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={date => {
                      this.setState({ date: date });
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.addlocationbox}>
              <Text style={styles.labletitle}> Add Location </Text>
              <View style={styles.outskin}>
                <View style={styles.skinA}>
                  <Image
                    style={styles.skinicon}
                    source={require("../assets/img/mapmark_2.png")}
                  />
                  <View style={styles.skintxtbox}>
                    <Text style={styles.smtxt}> Select From </Text>
                    <Text style={styles.lgtxt}> MAP</Text>
                  </View>
                </View>

                <View style={styles.skinB}>
                  <Image
                    style={styles.skinicon}
                    source={require("../assets/img/target_icon.png")}
                  />
                  <TouchableOpacity
                    style={styles.skintxtbox}
                    onPress={() => this.getCurrentLocation()}
                  >
                    <Text style={styles.smtxt}> Use </Text>
                    <Text style={styles.lgtxt}> Current</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.bodyinner}>
              <TouchableOpacity style={styles.btnwrapper}>
                <Text
                  style={styles.savebtn}
                  onPress={() => this.saveCalenderDetails()}
                >
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

export default connect(null)(networkcalender);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  taskwrapper: { backgroundColor: "#fff", borderRadius: 5, margin: 10 },

  pagetitlebar: { justifyContent: "center", alignItems: "center" },

  closeicon: {
    width: 15,
    height: 15,
    position: "absolute",
    right: 15,
    top: 10
  },

  pagetitle: { fontSize: 20, fontWeight: "700", marginTop: 30 },

  formfieldcontainer: {borderWidth:1,flexDirection:'row'},

  lableControl: { width:'20%',alignItems:'center' },

  inputcontrol: { width: '80%', height: 45 ,borderColor:"#C0C0C0",borderBottomWidth:Platform.OS=='ios'?1:0 ,marginBottom:10},

  searchcontrol: { width: 150, height: 40 },

  formfieldcontainer: { flexDirection: "row" },

  checkicon: { width: 20, height: 20, marginRight: 5 },

  bodyinner: {
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 15
  },

  btnwrapper: {
    alignItems: "center",
    justifyContent: "center"
  },

  savebtn: {
    color: "#ffffff",
    padding: 10,
    fontSize: 18,
    backgroundColor: "#2980b9",
    borderRadius: 5,
    width: 100,
    justifyContent: "center",
    textAlign: "center"
  },

  assi_avatar: { width: 28, height: 28, borderRadius: 30, marginRight: 5 },

  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  },

  duewrapper: {
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 15,
    flexDirection: "row"
  },

  duebox: { width: 150, justifyContent: "center", alignItems: "center" },

  boxtitle: {
    fontSize: 18,
    width: 160,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },

  skin: {
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#dbdbdb",
    width: 140,
    borderRadius: 3,
    marginTop: 10
  },

  pikstyle: { height: 30, fontSize: 9 },

  skin_half: {
    width: 75,
    marginTop: 10,
    borderColor: "#dbdbdb",
    borderWidth: 1,
    borderRadius: 3
  },

  skin_col: { flexDirection: "row" },

  addlocationbox: { flexDirection: "row", marginTop: 20, marginBottom: 20 },

  labletitle: {
    fontSize: 16,
    width: 115,
    marginLeft: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8
  },

  outskin: {
    flexDirection: "row",
    backgroundColor: "#ebebeb",
    padding: 8,
    borderRadius: 3
  },

  skinA: {
    flexDirection: "row",
    marginRight: 5,
    borderRightWidth: 1,
    borderColor: "#ccc",
    paddingRight: 5,
    alignItems: "center"
  },

  skinB: { flexDirection: "row", marginRight: 5, alignItems: "center" },

  skinicon: { marginRight: 5, width: 18, height: 18 },

  smtxt: { fontSize: 10 },

  lgtxt: { color: "#2980b9" }
});
