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
  ActivityIndicator,
  AsyncStorage, Alert
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl } from "../utility/constants";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import  ToastAndroid from 'react-native-simple-toast';
import ImagePicker from "react-native-image-picker";
var type
var edit
var id
export default class AddMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageresponse: "",
      videoresponse: "",
      avatarSource: "",
      videoSource: "",
      audioresponse: "",
      documentresponse: "",
      network_name: "",
      network_id: "",
      flag: 0,
      image_view: "",
      user_id: ''
    };
    console.log('prams:',this.props.navigation.state.params)
   // console.log('PATH ADD MEDIA', this.props.navigation.state.params)
  }


  componentWillMount() {
  
    AsyncStorage.getItem("mediaType").then(value => {
      let temp = JSON.parse(value);
      this.setState({ image_view: temp.mediaType });
    });
    this.setState({
      //network_id: this.props.navigation.state.params.network_id
      network_id: this.props.Detailsnetwork._id
    });
  }

  // componentDidMount() {
  //   edit = this.props.navigation.state.params.edit
  //   id = this.props.navigation.state.params.id
  //   console.log('EDIT====', edit)
  //   console.log('ID====', id)
  // }

  selectAudioTapped() {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.audio()]
      },
      (error, res) => {
       // console.log(res);
        if (!error) {
          this.uploadFile(4, res);
          this.setState({ audioresponse: res });
        }
      }
    );
  }
  selectImageTapped() {
    // DocumentPicker.show(
    //   {
    //     filetype: [DocumentPickerUtil.images()]
    //   },
    //   (error, res) => {
    //     if (!error) {
    //       // if (this.props.navigation.state.params.edit == 'edit') {
    //       //   this.editdoc(res,id)
    //       // }
    //       // else {
    //         this.uploadFile(1, res);
    //       //}
    //       this.setState({ imageresponse: res });
    //     }
    //     //console.log('===========',res)
    //   }
    // );
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
        // console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        // console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        console.log('response : ',response)
        this.uploadFile(1, response);
        this.setState({
          avatarSource: source,
          IsImageShow: true,
          imgresponse: response

        });
      }
    });

  }
  selectDocunmentTapped() {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {

        if (!error) {
          //this.uploadFile(3, res);
          this.uploadDoc(3, res);
          this.setState({ documentresponse: res,flag:1 });
        }
      }
    );
  }
  selectVideoTapped() {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        if (!error) {
          //this.uploadFile(2, res);
          this.uploadVideo(2, res);
          this.setState({ videoresponse: res,flag:1 });
        }
      }
    );
  }

  uploadVideo(filetype1, res) {
   // console.log('REPONSE', filetype1)
   type=res.fileName.split('.')
   fileType='video/'+type[type.length-1]
    if (fileType == 'video/mp4' || fileType == 'video/3gpp' || fileType == 'video/avi' || fileType == 'application/octet-stream' || fileType == 'video/m4v' || fileType == 'video/x-matroska' || fileType == 'video/quicktime' || fileType == 'video/mpeg' || fileType == 'video/webm' || fileType == 'video/x-ms-wmv') {
      var Path = res.uri;
      var fileName = res.fileName;
      var fileType = fileType;
      AsyncStorage.getItem("user_data").then(value => {
        let temp = JSON.parse(value);
       // console.log(temp)
        this.setState({
          user_id: temp._id
        }, () => console.log('USER', this.state.user_id));
      })
        .then(() => {
          type = this.props.navigation.state.params.type
          if (type) {
            AsyncStorage.getItem("user_data").then(value => {
              let temp = JSON.parse(value);
              //console.log('DEMO TEMP',temp)
              this.setState({
                user_id: temp._id
              })
              let url = loginUrl + "networkMedia/addNetworkMediaInDesk";
              let method = "POST";
              var data12 = new FormData();
             // console.log('url Deskmedia--------->', url)
              data12.append("mediaImage", {
                uri: Path,
                name: fileName,
                type: fileType,
                // mediaImage: Path,
                // networkMedia_userId: this.state.user_id,
                // networkMedia_fileType: 2,
                // networkMedia_networkId: this.state.network_id,
              });

              // if (this.state.network_id) {
              //   data12.append("networkMedia_networkId", this.state.network_id);
              // }
              data12.append("networkMedia_userId", this.state.user_id);
              data12.append("networkMedia_fileType", filetype1);
             // console.log('DATADATADATADATA======', data12)
              dataLayer
                .postImageData(url, method, data12)
                .then(response => response.json())
                .then(responseJson => {
                  this.setState({ flag: 2 });
               //   console.log('RES NEW=======>', responseJson)
                  if (responseJson.status == "true") {
                    ToastAndroid.showWithGravity(
                      "File add successfully.",
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM
                    );
                  } else {
                    console.log('error : ',responseJson.message)
                    ToastAndroid.showWithGravity(
                      responseJson.message,
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM
                    );
                  }
                })
                .catch(error => {
                  ToastAndroid.showWithGravity(
                    "Error in connect to server of desk media.",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                  );
                 // console.log('ERRRRROORRR===', error)
                });
            });
          }
          else {

            AsyncStorage.getItem("user_data").then(value => {
              let temp = JSON.parse(value);
              let url = loginUrl + "networkMedia/addNetworkMedia";
              let method = "POST";
              var data12 = new FormData();
             // console.log('url--------->', url)
              data12.append("mediaImage", {
                uri: Path,
                name: fileName,
                type: fileType
              });
             // console.log('TYPE', type)
             // console.log('data121212', data12)
              if (this.state.network_id) {
                data12.append("networkMedia_networkId", this.state.network_id);
              }
              data12.append("networkMedia_userId", temp._id);
              data12.append("networkMedia_fileType", filetype1);
              this.setState({ flag: 1 });
              dataLayer
                .postImageData(url, method, data12)
                .then(response => response.json())
                .then(responseJson => {
                  this.setState({ flag: 2 });
                  if (responseJson.status == "true") {
                    ToastAndroid.showWithGravity(
                      "File add successfully.",
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
                  ToastAndroid.showWithGravity(
                    "Error in connect to server.",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                  );
                });
            });
          }
        })

    }
    else {
      ToastAndroid.showWithGravity(
        "Provide provide Video files only",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  }

  uploadFile(filetype1, res) {
   // console.log('REPONSE', res)
    var Path = res.uri;
    var fileName = res.fileName;
    var fileType = res.type;
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
    //  console.log(temp)
      this.setState({
        user_id: temp._id
      }, () => console.log('USER', this.state.user_id));
    }).then(() => {
      type = this.props.navigation.state.params.type
      if (type) {
      //  console.log('deskPhoto')
        AsyncStorage.getItem("user_data").then(value => {
          let temp = JSON.parse(value);
          //console.log('DEMO TEMP',temp)
          this.setState({
            user_id: temp._id
          })
          let url = loginUrl + "networkMedia/addNetworkMediaInDesk";
          let method = "POST";
          var data12 = new FormData();
        //  console.log('urlNEWWW--------->', url)
          data12.append("mediaImage", {
            uri: Path,
            name: fileName,
            type: fileType,
            // mediaImage: Path,
            // networkMedia_userId: this.state.user_id,
            // networkMedia_fileType: 2,
            // networkMedia_networkId: this.state.network_id,
          });

          // if (this.state.network_id) {
          //   data12.append("networkMedia_networkId", this.state.network_id);
          // }
          data12.append("networkMedia_userId", this.state.user_id);
          data12.append("networkMedia_fileType", filetype1);
        //  console.log('DATADATADATADATA======', data12)
          dataLayer
            .postImageData(url, method, data12)
            .then(response => response.json())
            .then(responseJson => {
              this.setState({ flag: 2 });
            //  console.log('RES NEW=======>', responseJson)
              if (responseJson.status == "true") {
                ToastAndroid.showWithGravity(
                  "File add successfully.",
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
              ToastAndroid.showWithGravity(
                "Error in connect to server of desk media.",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            //  console.log('ERRRRROORRR===', error)
            });
        });
      } else {
       // console.log('NetworkPhoto')
        AsyncStorage.getItem("user_data").then(value => {
          let temp = JSON.parse(value);
          //console.log('temp : ',temp)
          let url = loginUrl + "networkMedia/addNetworkMedia";
          let method = "POST";
          var data12 = new FormData();
        //  console.log('url--------->', url)
          data12.append("mediaImage", {
            uri: Path,
            name: fileName,
            type: fileType
          });
          //console.log('DATA12===',data12)
          if (this.state.network_id) {
            data12.append("networkMedia_networkId", this.state.network_id);
          }
          data12.append("networkMedia_userId", temp._id);
          data12.append("networkMedia_fileType", filetype1);
          this.setState({ flag: 1 });
          dataLayer
            .postImageData(url, method, data12)
            .then(response => response.json())
            .then(responseJson => {
              console.log('RESPONSE OF ADD IMG',responseJson)
              this.setState({ flag: 2 });
              if (responseJson.status == "true") {
                ToastAndroid.showWithGravity(
                  "File add successfully.",
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
              ToastAndroid.showWithGravity(
                "Error in connect to server.",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            });
        });
      }
    })
  }


  setModalVisible(visible, name, id) {
    this.setState({ modalVisible: visible, updatefilename: name, editID: id });
  }
  uploadDoc(filetype1, res) {
  console.log("file name : ",res.fileName,res.type)
  type=res.fileName.split('.')
  console.log('file : ',[type.length-1])
  if(type[type.length-1]=='txt'){
    fileType='text/plain'
  }
  if(type[type.length-1]=='doc' || type[type.length-1]=='docx' ){
    fileType='application/msword'
  }
  else{
    fileType='application/'+type[type.length-1]
  }
  console.log('type : ',fileType)
  //  console.log('REPONSE', filetype1)
    if (fileType == 'application/pdf' || fileType == 'application/msword'  || fileType == 'application/vnd.ms-powerpoint' || fileType == 'text/plain' || fileType == 'text/comma-separated-values') {
      var Path = res.uri;
      var fileName = res.fileName;
      var fileType = fileType;
      AsyncStorage.getItem("user_data").then(value => {
        let temp = JSON.parse(value);
      //  console.log(temp)
        this.setState({
          user_id: temp._id
        }, () => console.log('USER', this.state.user_id));
      }).then(() => {
        type = this.props.navigation.state.params.type
        if (type) {
          AsyncStorage.getItem("user_data").then(value => {
            let temp = JSON.parse(value);
            //console.log('DEMO TEMP',temp)
            this.setState({
              user_id: temp._id
            })
            let url = loginUrl + "networkMedia/addNetworkMediaInDesk";
            let method = "POST";
            var data12 = new FormData();
          //  console.log('urlNEWWW--------->', url)
            data12.append("mediaImage", {
              uri: Path,
              name: fileName,
              type: fileType,
              // mediaImage: Path,
              // networkMedia_userId: this.state.user_id,
              // networkMedia_fileType: 2,
              // networkMedia_networkId: this.state.network_id,
            });

            // if (this.state.network_id) {
            //   data12.append("networkMedia_networkId", this.state.network_id);
            // }
            data12.append("networkMedia_userId", this.state.user_id);
            data12.append("networkMedia_fileType", filetype1);
          //  console.log('DATADATADATADATA======', data12)
            dataLayer
              .postImageData(url, method, data12)
              .then(response => response.json())
              .then(responseJson => {
                this.setState({ flag: 2 });
              //  console.log('RES NEW=======>', responseJson)
                if (responseJson.status == "true") {
                  ToastAndroid.showWithGravity(
                    "File add successfully.",
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
                ToastAndroid.showWithGravity(
                  "Error in connect to server of desk media.",
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
             //   console.log('ERRRRROORRR===', error)
              });
          });
        } else {
          AsyncStorage.getItem("user_data").then(value => {
            let temp = JSON.parse(value);
            let url = loginUrl + "networkMedia/addNetworkMedia";
            let method = "POST";
            var data12 = new FormData();
         //   console.log('url--------->', url)
            data12.append("mediaImage", {
              uri: Path,
              name: fileName,
              type: fileType
            });
            if (this.state.network_id) {
              data12.append("networkMedia_networkId", this.state.network_id);
            }
            data12.append("networkMedia_userId", temp._id);
            data12.append("networkMedia_fileType", filetype1);
            this.setState({ flag: 1 });
            dataLayer
              .postImageData(url, method, data12)
              .then(response => response.json())
              .then(responseJson => {
                this.setState({ flag: 2 });
                if (responseJson.status == "true") {
                  ToastAndroid.showWithGravity(
                    "File add successfully.",
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
                ToastAndroid.showWithGravity(
                  "Error in connect to server.",
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              });
          });
        }
      })
    }
    else {
      ToastAndroid.showWithGravity(
        "Provide provide Document files only",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  }

  onBack() {
    AsyncStorage.setItem(
      "mediaType",
      JSON.stringify({
        mediaType: ""
      })
    );
    console.log('type:',this.props.navigation.state.params)
    if(this.props.navigation.state.params.type){
      if(this.props.navigation.state.params.media=='1')
          this.props.navigation.navigate("ImageMedia",{type:this.props.navigation.state.params.type,media:'1'});
      else if(this.props.navigation.state.params.media=='2')
              this.props.navigation.navigate("Videomedia",{type:this.props.navigation.state.params.type,media:'2'});
      else if(this.props.navigation.state.params.media=='3')
              this.props.navigation.navigate("Documentmedia",{type:this.props.navigation.state.params.type,media:'3'});
      else
         this.props.navigation.navigate("MusicMedia",{type:this.props.navigation.state.params.type,media:'4'});
    }
    else{
      if(this.props.navigation.state.params.media=='1')
          this.props.navigation.navigate("ImageMedia",{type:this.props.navigation.state.params.type,media:'1'});
      else if(this.props.navigation.state.params.media=='2')
              this.props.navigation.navigate("Videomedia",{type:this.props.navigation.state.params.type,media:'2'});
      else if(this.props.navigation.state.params.media=='3')
              this.props.navigation.navigate("Documentmedia",{type:this.props.navigation.state.params.type,media:'3'});
      else
         this.props.navigation.navigate("MusicMedia",{type:this.props.navigation.state.params.type,media:'4'});
    }
    
   }
   

  render() {
  //  console.log(this.state.image_view);
    if (this.state.flag == 1) {
      return (
        <View  style={styles.indicator}>
        <Text>Please Wait...</Text>
        <ActivityIndicator
          animating={this.state.loader}
          size="large"
        />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerleft}
            onPress={() => this.onBack()}
          >
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}> Add Media </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollcontainer}>
          {this.state.image_view == 5 || this.state.image_view == 1 ? (
            <TouchableOpacity
              style={styles.buttontry}
              onPress={this.selectImageTapped.bind(this)}
            >
              <Text style={styles.btnPrimery}> Add Images </Text>
            </TouchableOpacity>
          ) : null}

          {this.state.image_view == 5 || this.state.image_view == 2 ? (
            <TouchableOpacity
              style={styles.buttontry}
              onPress={this.selectVideoTapped.bind(this)}
            >
              <Text style={styles.btnPrimery}> Add Video </Text>
            </TouchableOpacity>
          ) : null}

          {this.state.image_view == 5 || this.state.image_view == 3 ? (
            <TouchableOpacity
              style={styles.buttontry}
              onPress={this.selectDocunmentTapped.bind(this)}
            >
              <Text style={styles.btnPrimery}> Add Documents</Text>
            </TouchableOpacity>
          ) : null}

          {this.state.image_view == 5 || this.state.image_view == 4 ? (
            <TouchableOpacity
              style={styles.buttontry}
              onPress={this.selectAudioTapped.bind(this)}
            >
              <Text style={styles.btnPrimery}> Add Music</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    Detailsnetwork: state.networksteps.fullnetworkdetails,
    MediaView: state.network_details.Network_addmedia_view
  };
}
module.exports = connect(mapStateToProps)(AddMedia);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  /* Header CSS*/
  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },

  headercenter: { width: 270, textAlign: "center" },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  btnsm: {
    color: "#fff",
    backgroundColor: "#2a90b9",
    padding: 4,
    borderRadius: 5
  },

  /****************/

  scrollcontainer: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 4,
    paddingTop: 75
  },

  frnd_lst_wrap: { flexDirection: "row", padding: 5 },

  checkbox: { flex: 1, padding: 5, width: 105 },

  cont_no: { padding: 5 },

  /*  Footer CSS*/
  footer: {
    height: 55,
    color: "#333",
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#145d8d",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },

  footjumbotxt: { color: "#fff", fontSize: 18, fontWeight: "700" },

  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    backgroundColor: "rgba(255,255,255,0.5)"
  },
  buttontry: {
    marginTop: 30,
    backgroundColor: "#f1f1f1",
    textAlign: "center",
    width: 250,
    marginLeft: 40
  },

  btnPrimery: {
    textAlign: "center",
    backgroundColor: "#2980b9",
    padding: 15,
    borderRadius: 4,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
