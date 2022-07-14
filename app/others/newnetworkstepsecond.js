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
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl } from "../utility/constants";
import  ToastAndroid from 'react-native-simple-toast';
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
var net_id
export default class newnetworkStepSecond extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [],
      flag: 0,
      loader: true,
      filenames: [],
      selectedFile: [],
      location_name: [],
      flag: 0,
      loader: true,
      videoresponse: "",
      network:"",
      
    };
  }

  componentWillMount() {

    // if (this.props.network_name) {
    //   this.setState({ location_name: this.props.locationName });
    // }
  }

  deleteFile(_id,networkMedia_networkId) {
    this.setState({ flag: 1 });
    //let url = loginUrl + "network/deleteFile";
    let url = loginUrl + "networkMedia/networkMediaActions"
    let method = "POST";

    let body = JSON.stringify({
      _id: _id,
      action:'delete',
      networkMedia_networkId:networkMedia_networkId
      //file_id: file_id
    });
   // console.log('ID OF DELETE',_id)

    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
        // console.log(responseJson.data);
        if (responseJson.code == 200) {
          this.props.dispatch({
            type: "Set_network_file_data",
            payLoad: responseJson.data
          });
          ToastAndroid.showWithGravity(
            responseJson.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          ToastAndroid.showWithGravity(
            "Error in delete media file.",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          "Error in connect to server",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      });
  }
  deleteLocation(location_id, net_id) {
    //console.log('delete location')
    this.setState({ flag: 1 });
    let url = loginUrl + "network/deleteLocation";
    let method = "POST";

    let body = JSON.stringify({
      _id: net_id,
      file_id: location_id
    });
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
      // console.log('response of location delete',responseJson)
        this.setState({ flag: 2 });
        if (responseJson.status == "true") {
          this.Refresh()
          this.props.dispatch({
            type: "Set_location_data",
            payLoad: responseJson.data[0].location
          });
         // console.log('location====',this.props.locationName)
          ToastAndroid.showWithGravity(
            responseJson.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          ToastAndroid.showWithGravity(
            "Error in delete location.",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          "Error in connect to server",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      });
  }
  // selectfilepicked() {
  //   DocumentPicker.show(
  //     {
  //       filetype: [DocumentPickerUtil.allFiles()]
  //     },
  //     (error, res) => {
  //       if (res) {
  //         var fileSize = res.fileSize;
  //         if (fileSize < 12000000) {
  //           var VideoPath = res.uri;
  //           var videofileName = res.fileName;
  //           var videofileType = res.type;
  //           AsyncStorage.getItem("netwrok_data").then(value => {
  //             let temp = JSON.parse(value);
  //             var net_id = temp._id;
  //             let url = loginUrl + "network/addNetworkImage";
  //             let method = "POST";
  //             var data12 = new FormData();
  //             data12.append("mediaImage", {
  //               uri: VideoPath,
  //               name: videofileName,
  //               type: videofileType
  //             });
  //             data12.append("_id", net_id);
  //             this.setState({ flag: 1 });


  //             //  console.log('Network >>>>>>>>>>>>>>>>>',data12);
  //             dataLayer
  //               .postImageData(url, method, data12)
  //               .then(response => response.json())
  //               .then(responseJson => {

  //                 this.setState({ flag: 2 });
  //                 if (responseJson.status == "true") {
  //                   ToastAndroid.showWithGravity(
  //                     "File add successfully.",
  //                     ToastAndroid.SHORT,
  //                     ToastAndroid.BOTTOM
  //                   );
  //                   this.props.dispatch({
  //                     type: "Set_network_file_data",
  //                     payLoad: responseJson.data
  //                   });
  //                   this.setState({
  //                     selectedFile: this.state.selectedFile.concat([
  //                       videofileName
  //                     ])
  //                   });
  //                 } else {
  //                   ToastAndroid.showWithGravity(
  //                     responseJson.message,
  //                     ToastAndroid.SHORT,
  //                     ToastAndroid.BOTTOM
  //                   );
  //                 }
  //               })
  //               .catch(error => {
  //                 ToastAndroid.showWithGravity(
  //                   "Error in connect to server.",
  //                   ToastAndroid.SHORT,
  //                   ToastAndroid.BOTTOM
  //                 );
  //               });
  //           });
  //         } else {
  //           ToastAndroid.showWithGravity(
  //             "Please Upload file less then 12MB.",
  //             ToastAndroid.SHORT,
  //             ToastAndroid.BOTTOM
  //           );
  //         }
  //       }
  //     }
  //     //this.setState({ videoresponse: res });

  //   );
  // }

  componentDidMount() {
 // console.log('DIDDDDD CALEDD-----------')
    AsyncStorage.getItem("netwrok_data").then(value => {
      let temp = JSON.parse(value);
      net_id = temp._id;
      this.setState({
        network: net_id
      })
    });
  }


  deleteCalender(calender_id,network_id) {
    this.setState({ flag: 1 });
    let url = loginUrl + "network/deleteCalendar";
    let method = "POST";

    let body = JSON.stringify({
      _id: network_id,
      calendar_id: calender_id
    });
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        //console.log('response of delete calender...',responseJson)
        this.setState({ flag: 2 });
        if (responseJson.status == "true") {
          this.props.dispatch({
            type: "calender_data",
            payLoad: responseJson.data
          });
         // console.log('CALENDR',this.props.network_calenderdata)
          ToastAndroid.showWithGravity(
            responseJson.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          ToastAndroid.showWithGravity(
            "Error in delete calender.",
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
  }

  Refresh(){
    this.setState({ flag: 1 });
    AsyncStorage.getItem("netwrok_data").then(value => {
      let temp = JSON.parse(value);
      net_id = temp._id;
      let url = loginUrl + "network/networkDetail";
      //console.log('URLLLLLL===',url)
      let method = "POST";
      let body = JSON.stringify({ _id: net_id });
      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
         // console.log(responseJson)
          this.setState({ flag: 2 });
          if (responseJson.status == "true") {
            this.setState({
              network_id: temp.network_id,
              location: responseJson.data,
              locationData: responseJson.data.location,
              locationfullData: responseJson.data.location
            });
            AsyncStorage.getItem("user_data").then(value => {
              let temp = JSON.parse(value);
              let userid = temp._id;
              this.setState({
                user_pic: temp.user_pic,
                user_id: temp._id
              });
            });

            AsyncStorage.setItem(
              "netwrok_data",
              JSON.stringify(responseJson.data)
            );
            this.props.dispatch({
              type: "networkData",
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
  }

 selectfilepicked() {
   var fileCheck
   var fileType
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {

       console.log('res====',res)
       if(res){
        type=res.fileName.split('.')
         if(type[type.length-1]=='jpeg' || type[type.length-1]=='png' || type[type.length-1]=='image/jpg'){
           fileType='image/'+type[type.length-1]
           fileCheck=1
         }
         else if (type[type.length-1] == 'mp4' || type[type.length-1]== '3gpp' || type[type.length-1] == 'avi' || type[type.length-1] == 'application/octet-stream' || type[type.length-1] == 'm4v' || type[type.length-1] == 'x-matroska' || type[type.length-1] == 'quicktime' || type[type.length-1] == 'mpeg' || type[type.length-1] == 'webm' || type[type.length-1] == 'x-ms-wmv'){
          fileType='video/'+type[type.length-1] 
          fileCheck=2
         }
         else if (type[type.length-1] == 'application/pdf' || type[type.length-1] == 'application/msword' || type[type.length-1] == 'application/vnd.ms-powerpoint' || type[type.length-1] == 'text/plain' || type[type.length-1] == 'text/comma-separated-values'){
          if(type[type.length-1]=='txt'){
            fileType='text/plain'
          }
          if(type[type.length-1]=='doc' || type[type.length-1]=='docx' ){
            fileType='application/msword'
          }
          else{
            fileType='application/'+type[type.length-1]
          }
          fileCheck=3
         }
         else{
           fileCheck=4
         }
        var fileSize = res.fileSize;
        if (fileSize < 12000000) {
          var Path = res.uri;
          var fileName = res.fileName;
         // var fileType = res.type;
           AsyncStorage.getItem("netwrok_data").then(value => {
              let temp = JSON.parse(value);
              let url = loginUrl + "networkMedia/addNetworkMedia";
              let method = "POST";
              var data12 = new FormData();
              data12.append("mediaImage", {
                uri: Path,
                name: fileName,
                type: fileType
              });
                data12.append("networkMedia_networkId", temp._id);

              data12.append("networkMedia_userId", temp.user_id);
              data12.append("networkMedia_fileType", fileCheck);
              this.setState({ flag: 1 });
             // console.log('data====',data12)
              dataLayer
                .postImageData(url, method, data12)
                .then(response => response.json())
                .then(responseJson => {
                //  console.log('response of new network====',responseJson)
                  this.setState({ flag: 2 });
                  if (responseJson.status == "true") {
                    ToastAndroid.showWithGravity(
                      "File add successfully.",
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM
                    );
                      this.props.dispatch({
                      type: "Set_network_file_data",
                      payLoad: responseJson.data
                      });
                      this.setState({
                        selectedFile: this.state.selectedFile.concat([
                          fileName
                        ])
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
                  ToastAndroid.showWithGravity(
                    "Error in connect to server.",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                  );
                });
            });
        } else {
          ToastAndroid.showWithGravity(
            "Please Upload file less then 12MB.",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      }
      }
        //this.setState({ videoresponse: res });

    );
  }



addCalender()
{
  this.props.navigation.navigate("NetworkCalender",{type:'calender'})
}
render() {
  console.log('ABCD',this.props.locationData)

  if (this.props.network_filedata.length > 0) {
    var media = this.props.network_filedata;
  } else {
    var media = '';
  }
  if (this.props.locationData.length > 0) {
    var location = this.props.locationData;
  } else {
    var location = '';
  }
  if (this.props.network_calenderdata.length > 0) {
    var SaveCalender = this.props.network_calenderdata[0].calendar;
  } else {
    var SaveCalender = '';
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

  if (media != '') {
    var row = media.map((data, index) => {
      //console.log('data of id',data._id)
      //console.log('network file data===',this.props.network_filedata[0]._id)
      //console.log('network id===',data.networkMedia_networkId)
      return (
        <View style={styles.userblock}>
          <Image
            style={styles.pdfiocn}
            source={require("../assets/img/pdf.png")}
          />
          <Text style={styles.avatartxt}>{data.networkMedia_OriginalFileName}</Text>
          <TouchableOpacity
            onPress={() => this.deleteFile(data._id, data.networkMedia_networkId)}
          >
          
            <Image
              style={styles.crossbtn}
              source={require("../assets/img/cross_red.png")}
            />
          </TouchableOpacity>
        </View>
      );
    });
  } else {
    var row = <Text style={styles.avatartxt} />;
  }
  if (location) {
    var row1 = location.map((data1, index1) => {
      
     // console.log('location data===',data1)
      return (
        

        <View style={styles.locationbox}>
          <TouchableOpacity style={styles.delbar}
            onPress={() => this.deleteLocation(data1._id,this.state.network)} >
            <Image
              style={styles.locdel_btn}
              source={require("../assets/img/cross_red.png")}
            />
          </TouchableOpacity>
          <Text style={styles.avatartxt}>{data1.name}</Text>
          <Text style={styles.avatartxt}>{data1.address}</Text>
        </View>

      );
    });
  } else {
    var row1 = <Text style={styles.avatartxt} />;
  }
  if (SaveCalender) {
    var row2 = SaveCalender.map((data12, index1) => {
     // console.log('data of calender=== ',data12)
      return (
        <View style={styles.claenderbox}
        >
          <TouchableOpacity style={styles.delbar}
            onPress={() => this.deleteCalender(data12._id,this.state.network)} >
            <Image
              style={styles.locdel_btn}
              source={require("../assets/img/cross_red.png")}
            />
          </TouchableOpacity>
          <Text>{data12.calendar_title} </Text>
          <View style={styles.calenrow}>
            <Image
              style={styles.caliocn}
              source={require("../assets/img/blu_clander.png")}
            />
            <Text style={styles.smalltxt}>{data12.date + ' ' + data12.time} </Text>
          </View>
        </View>
      );
    });
  } else {
    var row2 = <Text style={styles.avatartxt} />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerleft}
          onPress={() => this.props.navigation.navigate("NewNetworkStepFirst")}
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
            <Text style={styles.bluetxt}>Step 2</Text>
            <Text style={styles.graytxt}> of 3 </Text>
          </View>
          <View style={styles.fullflot}>
            <Text style={styles.stepname}> Add Media</Text>
          </View>
        </View>
        <View style={styles.invitationBox}>
          <View style={styles.TitleBox}>
            <Text style={styles.invitationTitle}> Media </Text>
          </View>
          <View style={styles.sourceContainer}>
            {row}
            <TouchableOpacity
              style={styles.addfiles}
              onPress={this.selectfilepicked.bind(this)}
            >
              <Text style={styles.rtltxt}> Add Files </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.invitationBox}>
          <View style={styles.TitleBox}>
            <Text style={styles.invitationTitle}> Location </Text>
          </View>

          <View style={styles.locationContainer}>
            {row1}

            <TouchableOpacity
              style={styles.controlbtn}
              onPress={() =>
                this.props.navigation.navigate("addnetworklocation",{type:'loc'})}
            >
              <Image
                style={styles.pdfiocn}
                source={require("../assets/img/wt_plus.png")}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.invitationBox}>
          <View style={styles.TitleBox}>
            <Text style={styles.invitationTitle}> Calendar </Text>
          </View>
          <View style={styles.calendarContainer}>
            {row2}
            {/* <TouchableOpacity style={styles.claenderbox}  
               >
                <Text>Company retreat </Text>
                <View style={styles.calenrow}>
                  <Image
                    style={styles.caliocn}
                    source={require("../assets/img/blu_clander.png")}
                  />
                  <Text style={styles.smalltxt}>9/10 3:00 PM </Text>
                </View>
              </TouchableOpacity>
              */}


            <TouchableOpacity style={styles.controlbtn}
              onPress={() => this.addCalender()}>
              <Image
                style={styles.pdfiocn}
                source={require("../assets/img/wt_plus.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footlft}>
          <Text style={styles.wttxt}> Step 3</Text>
        </View>
        <TouchableOpacity
          style={styles.footrtl}
          onPress={() =>{
            this.props.dispatch({
              type: "clear_network_file_data",
             
            });
            this.props.navigation.navigate("NewNetworkStepThird")}
          }

        >
          <Text style={styles.rtltxt}> Invite People</Text>
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
function mapStateToProps(state) {
  return {
    locationName: state.networksteps.fullnetworkdetails,
    locationData:state.network_details.locationdata,
    network_filedata: state.network_details.network_filedata,
    network_calenderdata: state.network_details.calender_data,
  };
}
module.exports = connect(mapStateToProps)(newnetworkStepSecond);
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

  wttxt: { color: "#fff", fontSize: 16, marginLeft: 10 },

  fullflot: { marginLeft: 155, paddingTop: 10 },

  stepname: { color: "#2980b9", fontWeight: "700", alignSelf: "flex-end" },

  invitationBox: { padding: 10 },

  TitleBox: { flexDirection: "row", marginBottom: 15 },

  invitationTitle: { fontSize: 16, fontWeight: "700", color: "#000" },

  sourceContainer: { flexDirection: "row", flexWrap: "wrap", width: 330 },


  locationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 320,
    flex: 1,
    height: 95,
    overflow: "scroll"
  },
  calendarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 320,
    flex: 1,
    height: 95,
  },
  userblock: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#a1a1a1",
    borderRadius: 3,
    marginRight: 10,
    marginBottom: 15,
    alignItems: "center",
    width: 153,
    height: 35
  },

  pdfiocn: { width: 20, height: 20, marginLeft: 5, marginRight: 5 },

  avatartxt: { fontSize: 12, paddingRight: 5, marginRight: 5, width: 92 },

  addfiles: {
    backgroundColor: "#2980b9",
    height: 35,
    width: 153,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },

  locationbox: {
    width: 95,
    height: 90,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#2980b9",
    borderRadius: 8,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10
  },

  controlbtn: {
    backgroundColor: "#2980b9",
    height: 90,
    width: 30,
    position: "absolute",
    left: 290,
    borderRadius: 5,
    paddingTop: 30
  },

  claenderbox: {
    width: 95,
    height: 90,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#2980b9",
    padding: 8,
    borderRadius: 8
  },

  calenrow: { flexDirection: "row", marginTop: 10 },

  caliocn: { width: 12, height: 12, marginRight: 3 },

  smalltxt: { fontSize: 10, color: "#2980b9" },

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

  crossbtn: { width: 20, height: 20 },

  delbar: { position: "absolute", right: 5, top: 5 },

  locdel_btn: { width: 21, height: 20, }
});
