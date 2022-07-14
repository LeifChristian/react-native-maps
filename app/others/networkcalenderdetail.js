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
  ToastAndroid,
  ActivityIndicator,
  NetInfo,
  Picker,
  Alert
} from "react-native";

import { Footer, FooterTab } from "native-base";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
// import { Select, Option } from "react-native-select-list";
import DatePicker from "react-native-datepicker";
export class networkcalenderdetail extends Component {

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
      calendar_id_get: "",
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
      error: null,
      network_data1: [],

    };
  }
  getCurrentLocation() {
    // this.setState({ latitude: "22.44455" });
    // this.setState({ longitude: "75.44455" });
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


    // console.log('dsd_array');
    // console.log(this.props.navigation.state.params.networkdata_pass);
    // let  calender_date_array=this.props.navigation.state.params.networkdata_pass;
    //  console.log('mount detail');
    var networkdata_pass = this.props.navigation.state.params.networkdata_pass;
    var calendar_id = this.props.navigation.state.params.calendar_id;
    this.setState({ calendar_id_get: calendar_id });
    // console.log(this.props.navigation.state.params.networkdata_pass);

  }
  goback() {
    this.props.navigation.goBack();
  }

  delete_calendar(id) {
    // console.log(this.state.calendar_id_get);
    var calendar_id = id;

    var delete_id = this.state.calendar_id_get;
    // console.log(calendar_id);
    //  console.log(delete_id);
    let url = loginUrl + "network/deleteCalendar";
    let method = "POST";
    let body = JSON.stringify({
      _id: delete_id,
      calendar_id: calendar_id
    });

    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
        // console.log('RESPONSE OF DELETE====',responseJson);
        if (responseJson.status == "true") {
          //  this.props.navigation.goBack();
          //this.setState({ network_data1:'' });
          this.props.navigation.navigate("Calendar");

          //this.props.navigation.navigate("networkcalenderdetail");
          // ToastAndroid.showWithGravity(
          //   responseJson.message,
          //   ToastAndroid.SHORT,
          //   ToastAndroid.BOTTOM
          // );

        } else {
          // ToastAndroid.showWithGravity(
          //   responseJson.message,
          //   ToastAndroid.SHORT,
          //   ToastAndroid.BOTTOM
          // );
        }
      })
      .catch(error => {
        this.setState({ flag: 2 });
      });
  }
  delete_alert(delete_id) {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this event?.',
      [

        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.delete_calendar(delete_id) },
      ],
      { cancelable: false }
    )
  }

  render() {

    var row3 = this.props.navigation.state.params.networkdata_pass.map((calender_date_array_prev, index123) => {


      return (
        <View>

          <View style={styles.eventwrap}>

            <View style={styles.titlegroup}>
              <Text style={styles.eventTitle}>{calender_date_array_prev.calendar_title}</Text>

              <TouchableOpacity
                style={styles.binbox}
                //onPress={() => this.props.navigation.goBack()}
                onPress={() => {
                  this.delete_alert(calender_date_array_prev._id);
                }}
              >
                <Image
                  style={styles.closeicon}
                  source={require("../assets/img/bin.png")}
                />

              </TouchableOpacity>
            </View>

            <View style={styles.eventInof}>
              <Text style={styles.info_lft} >Date {calender_date_array_prev.date} </Text>
              <Text style={styles.infot_rgt}>Time {calender_date_array_prev.time} </Text>
            </View>


            <View>

            </View>
          </View>
        </View>
      );
    });

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
              onPress={() => {
                this.goback();
              }}
            >


              <Image
                style={styles.closeicon}
                source={require("../assets/img/close.png")}
              />


              <Text style={styles.pagetitle}>  Calendar Detail </Text>
            </TouchableOpacity>

            <View style={styles.formbody}>
              <View style={styles.bodyinner}>

                <View style={styles.formfieldcontainer}>

                  {row3}

                </View>

              </View>

            </View>



          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect(null)(networkcalenderdetail);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  taskwrapper: { backgroundColor: "#fff", borderRadius: 5, margin: 10 },

  pagetitlebar: { justifyContent: "center", alignItems: "center" },

  closeicon: { width: 15, height: 15, position: "absolute", right: 15, top: 10 },

  pagetitle: { fontSize: 20, fontWeight: "700", marginTop: 30 },

  bodyinner: { paddingTop: 15, paddingLeft: 20, paddingRight: 20, paddingBottom: 15, },

  eventwrap: { borderBottomWidth: 1, borderColor: "#dbdbdb", paddingBottom: 15, marginBottom: 15, },

  eventTitle: {
    fontSize: 24, textAlign: "left", marginBottom: 15, color: '#2980b9',
    width: 250,
  },

  eventInof: { flexDirection: 'row' },

  info_lft: { fontWeight: '700', width: 150, },

  infot_rgt: { fontWeight: '700', width: 150, textAlign: 'right' },


  titlegroup: { flexDirection: 'row', width: 250, },

  binbox: { height: 50, width: 50, textAlign: 'right' },
});
