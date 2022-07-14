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
  NetInfo
} from "react-native";
import ImagePicker from "react-native-image-picker";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl } from "../utility/constants";
import CheckBox from "react-native-check-box";
import  ToastAndroid from 'react-native-simple-toast';
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import moment from 'moment';
export default class newnetworkStepFirst extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Natwork_name: "",
      imgresponse: "",
      videoresponse: "",
      avatarSource: "",
      videoSource: "",
      flag: 0,
      loader: true
    };
  }

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
      //console.log("Response = ", response);

      if (response.didCancel) {
       // console.log("User cancelled photo picker");
      } else if (response.error) {
      //  console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
       // console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:

        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,

          imgresponse: response
        });
      }
    });
  }

  selectVideoTapped() {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        this.setState({ videoresponse: res });
      }
    );
  }

  onStepfirst() {
    if ((this.state.Natwork_name == "") || (this.state.Natwork_name.trim() == "")) {
      ToastAndroid.showWithGravity(
        "Please Enter Network Name",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected == false) {
          ToastAndroid.showWithGravity(
            "No Internet Connection Avalible",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          this.setState({ flag: 1 });
          AsyncStorage.getItem("user_data").then(value => {
            let temp = JSON.parse(value);
            var user_id = temp._id;
            let network_name = this.state.Natwork_name.trim();
            var PicturePath = this.state.imgresponse.uri;
            var fileName = this.state.imgresponse.fileName;
            var fileType = this.state.imgresponse.type;
            var VideoPath = this.state.videoresponse.uri;
            var videofileName = this.state.videoresponse.fileName;
            var videofileType = this.state.videoresponse.type;
            let url = loginUrl + "network/addNetwork";
            let method = "POST";
            var data12 = new FormData();
            if (PicturePath) {
              data12.append("coverPhoto", {
                uri: PicturePath,
                name: fileName,
                type: fileType
              });
            }
            if (VideoPath) {
              data12.append("inviteVideo", {
                uri: VideoPath,
                name: videofileName,
                type: videofileType
              });
            }

            data12.append("user_id", user_id);
            data12.append("networkName", network_name);
            dataLayer
              .postImageData(url, method, data12)
              .then(response => response.json())
              .then(responseJson => {
                console.log('response====',responseJson)
                this.setState({ flag: 2 });
                if (responseJson.status == "true") {
                  AsyncStorage.setItem(
                    "netwrok_data",
                    JSON.stringify(responseJson.data)
                  );
                  this.props.dispatch({type:"clear_location_data",payLoad:responseJson.data});
                  ToastAndroid.showWithGravity(
                    "Network Step 1st done.",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                  );
                this.props.navigation.navigate("NewNetworkStepSecond");
                
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
                //   "Error in connect to server",
                //   ToastAndroid.SHORT,
                //   ToastAndroid.BOTTOM
                // );
              });
          });
        }
      });
    }
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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerleft}
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}> NEW NETWORK </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollcontainer}>
          <View style={styles.stepheader}>
            <View style={styles.stepindicator}>
              <Text style={styles.bluetxt}>Step 1</Text>
              <Text style={styles.graytxt}> of 3 </Text>
            </View>
            <View style={styles.fullflot}>
              <Text style={styles.stepname}> Network Details</Text>
            </View>
          </View>
          <View style={styles.stepbody}>
            <View style={styles.stepbodyTop}>
              <View style={styles.stepsection}>
                <Text style={styles.sectiontitle}> Name Your network </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. European Vacation "
                  placeholderTextColor="#cdcdcd"
                  onChangeText={text => this.setState({ Natwork_name: text })}
                />
              </View>
              <View style={styles.stepsection}>
                <Text style={styles.sectiontitle}> Share an invite video </Text>
                <View style={styles.btnswrapper}>
                  <TouchableOpacity
                    style={styles.recordbtn}
                    onPress={this.selectVideoTapped.bind(this)}
                  >
                    <Image
                      style={styles.icon}
                      source={require("../assets/img/recording.png")}
                    />
                    <Text style={styles.redtxt}> Record </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.uploadbtn}>
                    <Image
                      style={styles.icon}
                      source={require("../assets/img/upload.png")}
                    />
                    <Text style={styles.blutxt}> Upload </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.skipbtn}>
                    <Text style={styles.graytxt}> Skip </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.stepbodyBottom}>
              <Text style={styles.sectiontitle}> Upload a Cover Photo </Text>
              <TouchableOpacity
                style={styles.fileuploadbtn}
                onPress={this.selectPhotoTapped.bind(this)}
              >
                <Image
                  style={styles}
                  source={require("../assets/img/ch_upload.png")}
                />
                <Text style={styles.wttxt}> Choose file to upload </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.enagblebox}>
              <View style={styles.enab_lft}>
                <Text style={styles.bigtxt}> Enable Task </Text>
                <Text style={styles.smltxt}>
                  Takes help improve collaboration between team member
                </Text>
              </View>
              <View style={styles.enab_rtl}>
                <Image
                  style={styles}
                  source={require("../assets/img/checked.png")}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footlft}>
            <Text style={styles.wttxt}> Step 2</Text>
          </View>
          <TouchableOpacity
            style={styles.footrtl}
            onPress={() => this.onStepfirst()}
          >
            <Text style={styles.rtltxt}> Add Media</Text>
            <Image
              style={styles.footicon}
              source={require("../assets/img/right_angle.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

 module.exports = connect(null)(newnetworkStepFirst);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  /* Header CSS*/
  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },

  headercenter: { width: 295 },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  /****************/

  scrollcontainer: { backgroundColor: "#fff", margin: 10, borderRadius: 4 },

  stepheader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#2980b9"
  },

  stepindicator: {
    flexDirection: "row",
    borderRightWidth: 1,
    borderColor: "#2980b9",
    padding: 10
  },

  bluetxt: { color: "#2980b9", fontWeight: "700" },

  graytxt: { color: "#cdcdcd", fontWeight: "700" },

  fullflot: { marginLeft: 100, paddingTop: 6 },

  stepname: { color: "#2980b9", fontWeight: "700", alignSelf: "flex-end" },

  stepbody: { paddingTop: 30 },

  stepbodyTop: { padding: 15 },

  stepsection: { marginBottom: 50 },

  sectiontitle: { fontSize: 18, color: "#000" },

  btnswrapper: { flexDirection: "row", marginTop: 25 },

  recordbtn: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#e60000",
    width: 120,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center"
  },

  uploadbtn: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#2980b9",
    width: 120,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center"
  },

  redtxt: { color: "#e60000" },

  blutxt: { color: "#2980b9" },

  skipbtn: {
    borderWidth: 2,
    borderColor: "#cdcdcd",
    width: 50,
    borderRadius: 5,
    padding: 5,
    alignItems: "center"
  },

  icon: { width: 20, height: 15 },

  stepbodyBottom: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#2980b9",
    paddingTop: 15,
    paddingBottom: 15
  },

  fileuploadbtn: {
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15
  },

  wttxt: { color: "#fff", fontSize: 16, marginLeft: 10 },

  /*  Footer CSS*/
  footer: {
    height: 70,
    color: "#333",
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#145d8d",
    justifyContent: "center",
    alignItems: "center"
  },

  footrtl: { flexDirection: "row", marginLeft: 150 },

  rtltxt: { fontSize: 16, fontWeight: "700", color: "#fff" },

  footicon: { width: 24, height: 26 },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  },

  enagblebox: { flexDirection: "row", padding: 15, borderTopWidth: 1 },

  enab_lft: { width: 260 },

  bigtxt: { fontSize: 18, fontWeight: "600" },

  enab_rtl: { marginTop: 30 }
});
