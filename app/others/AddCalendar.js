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
  AsyncStorage
} from "react-native";
// import RNCalendarEvents from "react-native-fetch-calendar-events";
import moment from "moment";
import { loginUrl, network_img } from "../utility/constants";
import * as dataLayer from "../utility/dataLayer";
import { Calendar } from "react-native-calendars";
const workout = { key: "workout", color: "green" };
import  ToastAndroid from 'react-native-simple-toast';
var datearray_detail = []
export default class AddCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "",
      calendar_id: "",
      calenderlist: {},
      calendar_dates: [],
      network_data1: [],

    };
    this.onDayPress = this.onDayPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    console.log('calendar State-------',this.props.navigation.state.params)
  }
  handleChange(event) {
    // console.log('handle');
    this.setState({ calendar_dates: [] });
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });

    var date_list = this.state.calendar_dates;
    //console.log('SELECTED====',date_list)
    datearray_detail = [];
    date_list.map((date_list_res, index1) => {
      if (date_list_res.date == day.dateString) {
        datearray_detail.push(date_list_res);

      }

    });
    console.log('data array ===', datearray_detail);
    if (datearray_detail.length > 0) {
      this.props.navigation.navigate("networkcalenderdetail", { networkdata_pass: datearray_detail, calendar_id: this.state.calendar_id });
      datearray_detail = []
    }
  }


  // componentWillUpdate(){
  //   console.log(12);
  //    AsyncStorage.getItem("netwrok_data1").then(value => {
  //       let temp = JSON.parse(value);
  //       //const  datearray=[];
  //       this.setState({
  //         calendar_dates: temp.calendar
  //       });
  //     // var  tempdata=temp.calendar;
  //        this.setState({
  //         tempdata: temp.calendar
  //       });
  //     });
  // }

  componentDidMount() {
    //console.log('response of tempdata == ',this.state.tempdata)
    // this.handleChange = this.handleChange.bind(this);
    //this.props.data.refetch();
    // console.log('mount will');
    //  AsyncStorage.setItem(
    //           "netwrok_data1",
    //           ''
    //         );
    // AsyncStorage.getItem("netwrok_data").then(value => {
    //   let temp = JSON.parse(value);

    //   //const  datearray=[];
    //   this.setState({
    //     calendar_dates: temp.calendar
    //   });
    // });

    AsyncStorage.getItem("netwrok_details").then(value => {
      let temp = JSON.parse(value);
      // console.log(value);
      let url = loginUrl + "network/networkDetail";
      let method = "POST";
      let body = JSON.stringify({
        _id: temp.network_id,
        user_id: this.state.user_id
      });
      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
           console.log('response of did mount ----',responseJson)
          this.setState({ flag: 2 });
          if (responseJson.status == "true") {
            // this.setState({ network_id: temp.network_id });
            // console.log(responseJson);
            // console.log('uu');
            this.setState({ network_data1: responseJson.data });

            this.setState({ calendar_id: responseJson.data._id });
            // this.setState({ post_Data: responseJson.post });
            this.setState({calendar_dates:responseJson.data.calendar})

            AsyncStorage.setItem(
              "netwrok_data1",
              JSON.stringify(responseJson.data)
            );
            //       let temp = JSON.parse(responseJson.data);
            //       this.setState({
            //   calendar_dates: temp.calendar
            // });

            this.setState({
              tempdata: responseJson.data.calendar
            });
            this.props.dispatch({
              type: "netwrok_data1",
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
          this.setState({ flag: 2 });

        });
    });

    AsyncStorage.getItem("netwrok_data1").then(value => {
      let temp = JSON.parse(value);


      // this.setState({
      //   calendar_dates: temp.calendar
      // });

      //  this.setState({
      //   tempdata: temp.calendar
      // });
    });
  }


  addCalender() {
    this.props.navigation.navigate("NetworkCalender", { type: 'network_cal' });
    datearray_detail = []
    //this.refresh();
  }
  render() {

    var calender = this.state.tempdata;
    //console.log(calender);
    // var calender = this.state.calendar_dates;
    var String_3 = "";
    var mark = [];
    var datearray = [];
    let obj_mark = {};
    // var datearray_date=[];
    // console.log(calender);
    // console.log('calenderdata');

    if (calender) {

      var row2 = calender.map((data12, index1) => {
        //  console.log('Data of calender ',data12)
        var date1 = data12.date;
        // datearray_date=date1

        var date2 = '"' + date1 + '"';
        datearray.push(date1);
        String_3 += date2.concat("", ":{selected: true},");
        //  String_3='"2018-01-12": {selected: true},';
        // this.state.acessos.push("{"+date1+": {selected: true}}")
        //this.state.acessos.push(date1: {selected: true});

        //      mark= {
        // 	[date1]: {selected: true}
        //  };




      });


      datearray.forEach((key) => {
        obj_mark[key] = { selected: true };
      });

      // this.setState({
      //         obj_mark_array: obj_mark
      //       });





      // console.log('markjson');  

      //       var row2223 = datearray_date.map((data121, index1) => {
      //       var date1 = data121;
      //     mark = {
      // 	[date1]: {selected: true}
      // };



      //     });


      //mark=datearray;
      String_3 = '{{' + String_3.substr(0, String_3.length - 1) + '}}';


    }

    //   console.log(String_3);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            transparent
            style={styles.headerleft}
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}> Calendar </Text>
          </View>

          <TouchableOpacity
            style={styles.headerright}
            onPress={() => this.addCalender()}
          >
            <Image
              style={styles.baricon}
              source={require("../assets/img/circal_plus.png")}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container}>
          {/* {console.log(String_3)}
           {console.log(datearray)}
           {console.log('ds')} */}

          <Calendar
            onDayPress={this.onDayPress}
            style={styles.calendar}
            //  markedDates={{ ["2018-01-20","2018-01-20"]: { selected: true } }}
            // markedDates={{"2018-01-20": {selected: true}},{"2018-01-25": {selected: true}}}
            // markedDates={String_3}

            //markedDates={{'2018-01-16': {selected: true},'2018-01-21': {selected: true}}}
            markedDates={obj_mark}

            markingType={"multi-dot"}

          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },

  headercenter: { width: 295 },

  headerright: { width: 20 },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  header_subtitle: { color: "#FFF", fontSize: 13, textAlign: "center" },

  mediagallerywrapper: { backgroundColor: "#fff", borderRadius: 5, margin: 10 },

  galleryrow: { flexDirection: "row" },

  docs: {
    width: 170,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cde2ef",
    borderBottomWidth: 1,
    borderRightWidth: 1
  },
  photos: {
    width: 170,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cde2ef",
    borderBottomWidth: 1
  },
  videos: {
    width: 170,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cde2ef",
    borderRightWidth: 1
  },
  music: {
    width: 170,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cde2ef"
  },

  galicon: { alignItems: "center" },

  centertxt: { fontSize: 16, color: "#2980b9", marginTop: 10 },

  Filemanagewrap: {
    backgroundColor: "#fff",
    borderRadius: 5,
    margin: 10,
    padding: 15
  },

  heading: {
    fontSize: 18,
    color: "#828282",
    fontWeight: "700",
    marginBottom: 30
  },

  listrow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },

  folder: { flexDirection: "row", width: 200 },

  foldername: { fontSize: 16, paddingTop: 5, marginLeft: 8 },

  smalltxt: { fontSize: 10, color: "#C0C0C0" },

  bold: { fontWeight: "bold", fontSize: 12 },

  footer: { height: 70, color: "#333", padding: 10, flexDirection: "row" },

  footcol: {
    width: 70,
    textAlign: "right",
    alignItems: "center",
    justifyContent: "center"
  },

  footicon: { width: 35, height: 32 },

  footcol_caption: { color: "#fff", fontSize: 10, marginTop: 5 }
});
