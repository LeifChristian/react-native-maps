import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Platform,
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
  Picker
} from "react-native";
import { DatePickerDialog } from "react-native-datepicker-dialog";
import TimePicker from "react-native-simple-time-picker";
import moment from "moment";
import { Footer, FooterTab } from "native-base";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import  ToastAndroid from 'react-native-simple-toast';
// import { Select, Option } from "react-native-select-list";

export default class newtask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task_title: "",
      task_details: "",
      userdetails: [],
      flag: 0,
      loader: true,
      dobText: 0,
      dobDate: null,
      selectedHours: 0,
      selectedMinutes: 0,
      selectedItems: [],
      assignuserID: "",
      assignuerName: "",
      userID: "",
      network_adminID:''
    };
  }
  componentWillMount() {
   
    var quotedIds = '';
    var quotednames = '';
    for (var i = 0; i < this.props.assignUser.length; ++i) {
      ids=this.props.assignUser[i]["social_id"];
    
      quotedIds+=ids+',';
    //  quotedIds = quotedIds.join(", ");
      quotednames+=this.props.assignUser[i]["username"]+',';
     // quotednames = quotednames.join(", ");
    }
  var lastChar = quotednames.slice(-1);
  if (lastChar == ',') {
    quotednames = quotednames.slice(0, -1);
  }
     var lastid = quotedIds.slice(-1);
  if (lastid == ',') {
    quotedIds = quotedIds.slice(0, -1);
  }

    var date = new Date().toLocaleString();
    this.setState({
      dobText: moment(date).format("DD-MMM-YYYY"),
      dobDate: moment(date).format("YYYY-MM-DD"),
      assignuserID: quotedIds,
      assignuerName: quotednames,
      task_title: this.props.taskTitle,
      task_details: this.props.taskDesc
    });
    AsyncStorage.getItem("netwrok_member").then(value => {
      let temp = JSON.parse(value);
      console.log('temp : ',temp)
      var adminId=''
      temp.map(item=>{
        if(item.is_user_admin== "1"){
          adminId=item.userinfo._id
        }
      })
      this.setState({ network_Members: temp,network_adminID:adminId});
    });
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      let userid = temp._id;
      this.setState({
        userID: temp._id
      });
    });
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  onDOBDatePicked(date) {
    this.setState({
      dobDate: date,
      dobText: moment(date).format("DD-MMM-YYYY")
    });
  }
  onDOBPress() {
    let dobDate1 = this.state.dobDate;

    if (!dobDate1 || dobDate1 == null) {
      dobDate1 = new Date();
      this.setState({
        dobDate: dobDate1
      });
    }

    //To open the dialog
   this.refs.dobDialog.open({
    date: new Date(),
    minDate: new Date() //To restirct future date
     });
  };
  addUser() {
    console.log("state ",this.state.network_Members)
    console.log("state ",this.state.network_adminID)
    this.props.dispatch({
      type: "add_task_title",
      payLoad: this.state.task_title
    });
    this.props.dispatch({
      type: "add_task_description",
      payLoad: this.state.task_details
    });
    this.props.navigation.navigate("AddTaskUser",{networkMembers:this.state.network_Members,network_adminID:this.state.network_adminID});
  }
  savesetting() {
    if (this.state.task_title == "" || this.state.task_title.trim() == "") {
      ToastAndroid.showWithGravity(
        "Please Enter Title",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (
      this.state.task_details == "" ||
      this.state.task_details.trim() == ""
    ) {
      ToastAndroid.showWithGravity(
        "Please Enter Description",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (
      this.state.assignuserID == "" ||
      this.state.assignuserID.trim() == ""
    ) {
      ToastAndroid.showWithGravity(
        "Please Assign user for task",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (this.state.dobDate == "null") {
      ToastAndroid.showWithGravity(
        "Please Select Date",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (
      this.state.selectedHours == 0 ||
      this.state.selectedMinutes == 0
    ) {
      ToastAndroid.showWithGravity(
        "Please Select Time",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      this.setState({ flag: 1 });
      let url = loginUrl + "task/addTask";
      let method = "POST";
      let date1 = moment(this.state.dobDate).format("YYYY-MM-DD");
      let datetime =
        date1 +
        " " +
        this.state.selectedHours +
        ":" +
        this.state.selectedMinutes +
        ":00";
      let body1 = JSON.stringify({
        task_userId: this.state.userID,
        task_networkId: this.props.Detailsnetwork._id,
        task_title: this.state.task_title,
        task_discription: this.state.task_details,
        user_id: this.state.assignuserID,
        task_dueDate: datetime,
        task_dueTime: datetime
      });
      dataLayer
        .postData(url, method, body1)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ flag: 2 });
          if (responseJson.status == "true") {
            this.props.dispatch({
              type: "clearAssignTaskUser",
              payLoad: responseJson.data
            });
            this.setState({
              dobDate: "",
              assignuserID: "",
              assignuerName: "",
              task_title: "",
              task_details: ""
            });
            ToastAndroid.showWithGravity(
              responseJson.message,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
          } else {
            ToastAndroid.showWithGravity(
              "Error in add task.",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
          }
        })
        .catch(error => {});
    }
  }
  render() {
    var assignname = this.state.assignuerName;
    const { selectedHours, selectedMinutes } = this.state;
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
              onPress={() => this.props.navigation.navigate("Tasks")}
            >
              <Image
                style={styles.closeicon}
                source={require("../assets/img/close.png")}
              />
              <Text style={styles.pagetitle}> New Task </Text>
            </TouchableOpacity>
            <View style={styles.formbody}>
              <View style={styles.bodyinner}>
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Title </Text>
                  <TextInput
                    style={styles.inputcontrol}
                    value={this.state.task_title}
                    onChangeText={text => this.setState({ task_title: text })}
                  />
                </View>
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Detail </Text>
                  <TextInput
                    style={styles.inputcontrol}
                    value={this.state.task_details}
                    onChangeText={text => this.setState({ task_details: text })}
                  />
                </View>
              </View>
              <View style={styles.bodyinner}>
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Assign To </Text>

                  <TextInput style={styles.searchcontrol} value={assignname} />
                  <TouchableOpacity onPress={()=>this.addUser()}>
                    <Image
                      style={styles.assi_avatar}
                      source={require("../assets/img/add-person.png")}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.duewrapper}>
              <View style={styles.duebox}>
                <View onPress={this.onDOBPress.bind(this)}>
                  <Text style={styles.boxtitle}> Due Date </Text>
                </View>
                <TouchableOpacity onPress={this.onDOBPress.bind(this)} style={styles.skin}>
                  <Text style={styles.sss}>{this.state.dobText}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.duebox}>
                <Text style={styles.boxtitle}> Due Time(H:M) </Text>

                <TimePicker
                  selectedHours={selectedHours}
                  selectedMinutes={selectedMinutes}
                  onChange={(hours, minutes) =>
                    this.setState({
                      selectedHours: hours,
                      selectedMinutes: minutes
                    })}
                />
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
        <DatePickerDialog
          ref="dobDialog"
          okLabel='OK'
          cancelLabel='Cancel'
          onDatePicked={this.onDOBDatePicked.bind(this)}
        />
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    assignUser: state.AssignTaskUser.assignmembers,
    taskTitle: state.AssignTaskUser.task_title,
    taskDesc: state.AssignTaskUser.task_desc,
    Detailsnetwork: state.networksteps.fullnetworkdetails
  };
}
module.exports = connect(mapStateToProps)(newtask);
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

  formfieldcontainer: { borderBottomWidth: 2 },

  lableControl: { width: 80 },

  inputcontrol: { width: 230, height: 45,borderBottomWidth:Platform.OS=='ios'?1:0 },

  searchcontrol: { width: 150, height: 40 ,borderBottomWidth:Platform.OS=='ios'?1:0 },

  formfieldcontainer: { flexDirection: "row",alignItems:'center'},

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

  assi_avatar: { width:30, height: 30, borderRadius: 10, marginRight: 5,tintColor:'#2980b9' },

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

  duebox: { width: 150 },

  boxtitle: { fontSize: 18, width: 150, textAlign: "center" },

  skin: {
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    width: 140,
    borderRadius: 3,
    marginTop: 10,
    height: 40,
    padding: 8,
    justifyContent: "center",
    alignItems: "center"
  },

  pikstyle: { height: 30, fontSize: 9 },

  skin_half: {
    width: 75,
    marginTop: 10,
    borderColor: "#dbdbdb",
    borderWidth: 1,
    borderRadius: 3
  },

  skin_col: { flexDirection: "row" }
});
