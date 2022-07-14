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
  NetInfo,
  ignoredYellowBox,
  AsyncStorage,
  Platform, 
  BackHandler,
  SafeAreaView
} from "react-native";

import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  NavigationActions,
  StackActions,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";
import { connect } from "react-redux";
import Signup from "./signup/signup";
import Checknumber from "./signup/checknumber";
import CheckOtp from "./signup/checkOtp";
import Login from "./login/login";
import FbLogin from "./others/fblogin";
import Otp from "./otp/otp";
import Home from "./home/home";
import NetworkWall from "./others/network";
import Location from "./others/location";
import Media from "./others/media";
import AddMedia from "./others/addMedia";
import ImageMedia from "./others/Imagesmedia";
import MusicMedia from "./others/Musicmedia";
import Videomedia from "./others/Videomedia";
import Videopage from "./others/Videopage";
import Documentmedia from "./others/Documentmedia";
import Calendar from "./others/AddCalendar";
import Messages from "./others/messages";
import GroupChat from "./others/groupchat";
import Chat from "./others/chat";
import Tasks from "./others/tasks";
import TasksDetails from "./others/taskDetails";
import AddTasks from "./others/add_notes";
import Profile from "./others/profile";
import Settings from "./others/settings";
import NetworkSettings from "./others/networksettings";
import NewNetworkStepFirst from "./others/newnetworkstepfirst";
import NewNetworkStepSecond from "./others/newnetworkstepsecond";
import NewNetworkStepThird from "./others/newnetworkstepthird";
import NewNetworkSucess from "./others/newnetworksucess";

import About from "./others/about";
import Addon from "./others/addon";
import Networkaddlocation from "./others/networkaddlocation";
import Networkeditlocation from "./others/networkeditlocation";
import Desklocation from './others/desklocation';
import Resetpassword from "./others/resetpassword";

import newtask from "./others/newtask";
import AddTaskUser from "./others/assignTaskUser";
import addInvitePhone from "./others/addInvitephone";
import networkcalender from "./others/networkcalender";
import addInviteUsers from "./others/addInviteUsers";
import addInviteFacebook from "./others/addInvitefacebook";
import networkAddMembers from "./others/networkAddMembers";
import networkAddAdmin from "./others/networkAddAdmin";
import networkagenda from "./others/networkagenda";
import Tutorial from "./others/tutorial";
import Logout from "./others/logout";
import Desk from "./others/desk";
import EditDeskPost from './others/edit_desk_post';
import EditNetworkPost from './others/edit_network_post'
import add_notes from "./others/add_notes";
import Networknote from "./others/notes";
import AddGroupMembers from "./others/addGroupmembers";

import networkcalenderdetail from "./others/networkcalenderdetail";

import * as dataLayer from "./utility/dataLayer";
import { parseUrl, loginUrl } from "./utility/constants";

var PushNotification = require("react-native-push-notification");
// var SharedPreferences = require('react-native-shared-preferences');
import  ToastAndroid from 'react-native-simple-toast';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },
  footicon: { width: 35, height: 32 },
  tab: {
    padding: 0
  },
  indicator: {
    width: 0,
    height: 0
  },
  label: {
    fontSize: 8.5
  },
  icon: {
    width: 35,
    height: 32,
    backgroundColor: "#2980b9"
  },
  tabBar: {
    backgroundColor: "#2980b9"
  }
});


export const DeskNavigator = TabNavigator(
  {
    Desk: {
      screen: Desk,
      navigationOptions: ({ navigation }) => ({
        title: "FEED",
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={styles.footicon}
            source={require("./assets/img/mappoint_1.png")}
          />
        )
      })
    },
    Desklocation: {
      screen: Desklocation,
      navigationOptions: ({ navigation }) => ({

        title: "LOCATION",
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={styles.footicon}
            source={require("./assets/img/mappoint_1.png")}
          />
        )
      })
    },
    DeskMedia: {
      screen: props => <Media {...props} type='DeskMedia' />,
      navigationOptions: ({ navigation }) => ({
        title: "MEDIA",
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={styles.footicon}
            source={require("./assets/img/media_icon.png")}
          />
        )
      })
    },
  },
  {
    tabBarPosition: "bottom",
    swipeEnabled: true,
    animationEnabled: true,
    lazy: true,
    tabBarOptions: {
      activeTintColor: "#FFFFFF",
      inactiveTintColor: "#FFFFFF",
      showLabel: true,
      showIcon: true,
      pressColor: "#444444",
      scrollEnabled: false,
      tabStyle: styles.tab,
      indicatorStyle: styles.indicator,
      labelStyle: styles.label,
      iconStyle: styles.icon,
      style: styles.tabBar
    }
  }
)
export const NetworkNavigator = TabNavigator(
  {
    NetworkWall: {
      screen: NetworkWall,
      navigationOptions: ({ navigation }) => ({
        title: "FEED",
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={styles.footicon}
            source={require("./assets/img/mappoint_1.png")}
          />
        )
      })
    },
    Location: {
      screen: Location,

      navigationOptions: ({ navigation }) => ({
        title: "LOCATION",
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={styles.footicon}
            source={require("./assets/img/mappoint_1.png")}
          />
        )
      })
    },
    Media: {
      screen: Media,
      navigationOptions: ({ navigation }) => ({
        title: "MEDIA",
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={styles.footicon}
            source={require("./assets/img/media_icon.png")}
          />
        )
      })
    },
    Calendar: {
      screen: Calendar,
      navigationOptions: ({ navigation }) => ({
        title: "CALENDAR",
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={styles.footicon}
            source={require("./assets/img/calendar.png")}
          />
        )
      })
    },
    Messages: {
      screen: Messages,
      navigationOptions: ({ navigation }) => ({
        title: "MESSAGES",
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={styles.footicon}
            source={require("./assets/img/messages.png")}
          />
        )
      })
    },
    Tasks: {
      screen: Tasks,
      navigationOptions: ({ navigation }) => ({
        title: "TASKS",
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={styles.footicon}
            source={require("./assets/img/tasks.png")}
          />
        )
      })
    }
  },
  {
    tabBarPosition: "bottom",
    swipeEnabled: true,
    animationEnabled: true,
    lazy: true,
    tabBarOptions: {
      activeTintColor: "#FFFFFF",
      inactiveTintColor: "#FFFFFF",
      showLabel: true,
      showIcon: true,
      pressColor: "#444444",
      scrollEnabled: false,
      tabStyle: styles.tab,
      indicatorStyle: styles.indicator,
      labelStyle: styles.label,
      iconStyle: styles.icon,
      style: styles.tabBar
    }
  }
);

const HomeNavigator = StackNavigator(
  {
    Home: { screen: Home },
    Network: { screen: NetworkNavigator },
    Profile: { screen: Profile },
    Settings: { screen: Settings },
    NetworkSettings: { screen: NetworkSettings },
    NewNetworkStepFirst: { screen: NewNetworkStepFirst },
    NewNetworkStepSecond: { screen: NewNetworkStepSecond },
    NewNetworkStepThird: { screen: NewNetworkStepThird },
    NewNetworkSucess: { screen: NewNetworkSucess },
    addnetworklocation: { screen: Networkaddlocation },
    editnetworklocation: { screen: Networkeditlocation },
    newtask: { screen: newtask },
    NetworkCalender: { screen: networkcalender },
    networkcalenderdetail: { screen: networkcalenderdetail },
    NetworkAgenda: { screen: networkagenda },
    AddInvitePhone: { screen: addInvitePhone },
    addInviteFacebook: { screen: addInviteFacebook },
    addMembers: { screen: networkAddMembers },
    addAdmin: { screen: networkAddAdmin },
    Chat: { screen: Chat },
    GroupChat: { screen: GroupChat },
    Desk: { screen: DeskNavigator },
    EditDeskPost: { screen: EditDeskPost },
    EditNetworkPost: { screen: EditNetworkPost },
    add_notes: { screen: add_notes },
    Networknote: { screen: Networknote },
    AddGroupMembers: { screen: AddGroupMembers },
    AddTaskUser: { screen: AddTaskUser },
    AddMedia: { screen: AddMedia },
    ImageMedia: { screen: ImageMedia },
    MusicMedia: { screen: MusicMedia },
    Videomedia: { screen: Videomedia },
    Videopage: { screen: Videopage },
    Documentmedia: { screen: Documentmedia },
    TasksDetails: { screen: TasksDetails },
    addInviteUsers: { screen: addInviteUsers },

  },
  {

    headerMode: "none"
  }
);

const SideNavigator = DrawerNavigator({
  Home: { screen: HomeNavigator },
  Myprofile: { screen: Profile },
  About: { screen: About },
  Addon: { screen: Addon },
  Tutorial: { screen: Tutorial },
  Logout: { screen: Logout }
});

const AppNavigator = StackNavigator(
  {
    Signup: { screen: Signup },
    Checknumber: { screen: Checknumber },
    CheckOtp: { screen: CheckOtp },
    Login: { screen: Login },
    FbLogin: { screen: FbLogin },
    Otp: { screen: Otp },
    SideNavigator: { screen: SideNavigator },
    Resetpassword: { screen: Resetpassword }
  },
  {
    initialRouteName: "Signup",
    headerMode: "none"
  },
);

class MyApp extends Component {
  isBackPressed = false;
  constructor(props) {
    super(props);

    this.state = { flag: false };
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(
      this
    );
    //BackHandler.addEventListener('hardwareBackPress', this.onBackPress.bind(this));
    console.disableYellowBox = true;
  }
  // componentWillUnMount() {
  //   console.log("unmounting index");
  // }

  // onBackPress() {

  //   setTimeout(() => {

  //     this.isBackPressed = false;
  //   }, 3000);

  //   ToastAndroid.showWithGravity(
  //     'Press again to exit App',
  //     ToastAndroid.SHORT,
  //     ToastAndroid.BOTTOM
  //   );
  //   if (this.isBackPressed) {
  //     BackHandler.exitApp();
  //     return false;
      
  //   } else {
  //     this.isBackPressed = true;
  //     return true;
  //   }

  // }
  handleFirstConnectivityChange(isConnected) {
    this.props.dispatch({
      type: "Network_status",
      payLoad: { status: isConnected }
    });
    if (isConnected) {
      this.setState({ flag: false });
    } else {
      this.setState({ flag: true });
    }
  }

  taskOnFirstLaunch() {
    PushNotification.configure({
      onRegister: function (token) {
        //console.log("token : ",token)
        AsyncStorage.setItem("device_token", token);
        let url = parseUrl + "installations";
        let method = "POST";

        let body = JSON.stringify({
          deviceType: token.os,
          pushType: "gcm",
          deviceToken: token.token,
          GCMSenderId: "917040334473",
          channels: [""]
        });
        dataLayer
          .sendParseData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
            AsyncStorage.setItem("ParseInstallation", JSON.stringify(responseJson));

          })
          .catch(error => {
            ToastAndroid.showWithGravity(
              "Error in connect to server",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
          });
      },

      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },

      senderID: "917040334473",

      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      popInitialNotification: true,
      requestPermissions: true
    });

    //  this.parseInstallation(token);
  }
  componentWillMount() {
    NetInfo.isConnected.addEventListener(
      "change",
      this.handleFirstConnectivityChange
    );

    // AsyncStorage.getItem("alreadyLaunched").then(value => {
      AsyncStorage.getItem("status", value => {
      if (value == null) {
        AsyncStorage.setItem("status", 'true');
        // AsyncStorage.setItem("alreadyLaunched",  JSON.stringify(true));
        this.taskOnFirstLaunch();
        console.log("First Time");
      } else {
        console.log("Next Time");
      }
    });

    //  this.setState({ fistLaunch: null });
  }

  getApp() {
    if (this.state.flag) {
      return ToastAndroid.showWithGravity(
        "No Internet Connection avalible",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
    
  }
  render() {

    return (
 
      <SafeAreaView style={styles.container}>
        {this.getApp()}
        <AppNavigator />
      </ SafeAreaView>
    );
  }
}
function mapStateToProps(state) {
  return {
    internet_connection: state.networkconnection.Connection
  };
}
module.exports = connect(mapStateToProps)(MyApp);
export default () => <MyApp />;
