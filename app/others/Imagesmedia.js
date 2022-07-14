import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  Picker,
  Dimensions,
  Modal,
  Alert,
  ActivityIndicator,
  Linking
} from "react-native";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import { Icon, Button, Container, Header, Content, Form, Item, Input, Label, Title } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob'
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import ResponsiveImage from "react-native-responsive-image";
import PinchZoomView from "react-native-pinch-zoom-view";
import  ToastAndroid from 'react-native-simple-toast';
var type
var edit
var img1
export default class Imagemedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_name: "",
      network_id: "",
      flag: 0,
      imagesData: [],
      modalVisible: false,
      updatefilename: '',
      editID: '',
      deskimage: '',
      user_id: '',
      addto_desk: "",
      location_name: "",
      desk_status: 2,
      flagImage: false,
      isDone: false,
    };
    // this.onDownloadImagePress = this.onDownloadImagePress.bind(this);

    // console.log('ABCSGSG===',this.props.navigation.state.params.type)
  }
  componentDidMount() {
    console.log('media: ', this.props.navigation.state.params.media)
    this.setState({ flag: 1 });
    this.setState({
      network_name: this.props.Detailsnetwork.networkName,
      network_id: this.props.Detailsnetwork._id
    });
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      // console.log(temp)
      this.setState({
        user_id: temp._id
      }, () => console.log('USER', this.state.user_id));
    }).then(() => {
      type = this.props.navigation.state.params.type
      //  console.log('TYPE+==========',this.state.user_id)
      if (type) {
        let url = loginUrl + "networkMedia/networkMediaInDesk";
        let method = "POST";
        let body = JSON.stringify({
          // netword_id: this.props.Detailsnetwork._id,
          // file_type: 3
          user_id: this.state.user_id,
          media_type: 1,
          getMediaDesk: true
        });
        // console.log('DOCUMENT BODY',body)
        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
            this.setState({ flag: 2 });
            console.log('DOCUMENT', responseJson)
            if (responseJson.status == "true") {
              this.setState({
                imagesData: responseJson.Media_In_Desk
              });

            }

          })
          .catch(error => {

          });
      }
      else {
        let url = loginUrl + "networkMedia/getNetworkMedia";
        let method = "POST";
        let body = JSON.stringify({
          netword_id: this.props.Detailsnetwork._id,
          //user_id: this.state.user_id,
          file_type: 1
        });
        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
            console.log('Res', responseJson)
            this.setState({ flag: 2 });
            if (responseJson.status == "true") {
              this.setState({
                imagesData: responseJson.data
              });
              // ToastAndroid.showWithGravity(
              //   //responseJson.message,
              //   ToastAndroid.SHORT,
              //   ToastAndroid.BOTTOM
              // );
            } else {
              ToastAndroid.showWithGravity(
                //"Error in add task.",
                "Media not found",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            }
          })
          .catch(error => {
            this.setState({ flag: 2 });
          });
      }
    })

  }



  selectImageTapped(id) {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.images()]
      },
      (error, res) => {
        //  console.log('RESPONSE===',res)
        if (!error) {
          this.editdoc(id, res);
          //this.Refresh(id,res);
          this.setState({
            imageresponse: res.uri
          });
        }
      }
    );
  }
  editdoc(id, res) {

    // console.log('IDIDID', id)
    // console.log('RESRESRES', res)
    var Path = res.uri;
    var fileName = res.fileName;
    var fileType = res.type;
    let url = loginUrl + "networkMedia/networkMediaActions";
    let method = "POST";
    var data12 = new FormData();
    // console.log('url--------->', url)
    data12.append("mediaImage", {
      uri: Path,
      name: fileName,
      type: fileType
    });
    data12.append('_id', id);
    data12.append('action', 'editImage');
    //console.log('step11122222----',data12)
    dataLayer
      .postImageData(url, method, data12)
      .then(response => response.json())
      .then(responseJson => {
        // console.log('RESPONSE', responseJson)
        if (responseJson.status) {
          this.imageRefresh();
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
        // console.log('ERROOR', error)
      });
  }

  // Refresh(id,res){
  //   this.editdoc(id,res),
  // }

  imageRefresh() {

    //  this.setState({
    //   network_name: this.props.Detailsnetwork.networkName,
    //   network_id: this.props.Detailsnetwork._id
    // });
    this.setState({ flag: 1 });
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      //  console.log(temp)
      this.setState({
        user_id: temp._id
      }, () => console.log('USER', this.state.user_id));
    }).then(() => {
      type = this.props.navigation.state.params.type
      // console.log('TYPE+==========',this.state.user_id)
      if (type) {
        let url = loginUrl + "networkMedia/networkMediaInDesk";
        let method = "POST";
        let body = JSON.stringify({
          // netword_id: this.props.Detailsnetwork._id,
          // file_type: 3
          user_id: this.state.user_id,
          media_type: 1,
          getMediaDesk: true
        });
        // console.log('DOCUMENT BODY',body)
        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
            this.setState({ flag: 2 });
            //  console.log('DOCUMENT', responseJson)
            if (responseJson.status == "true") {
              this.setState({
                imagesData: responseJson.Media_In_Desk
              });

            }
            else {
              this.setState({
                imagesData: null
              });
            }

          })
          .catch(error => {

          });
      }
      else {
        let url = loginUrl + "networkMedia/getNetworkMedia";
        let method = "POST";
        let body = JSON.stringify({
          netword_id: this.props.Detailsnetwork._id,
          //user_id: this.state.user_id,
          file_type: 1
        });
        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
            this.setState({ flag: 2 });
            if (responseJson.status == "true") {
              this.setState({
                imagesData: responseJson.data
              });
              // ToastAndroid.showWithGravity(
              //   //responseJson.message,
              //   ToastAndroid.SHORT,
              //   ToastAndroid.BOTTOM
              // );
            } else {
              this.setState({
                imagesData: null
              });
              ToastAndroid.showWithGravity(
                "Media not found",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            }
          })
          .catch(error => {
            this.setState({ flag: 2 });
          });
      }
    })
  }

  onBack() {
    AsyncStorage.setItem(
      "mediaType",
      JSON.stringify({
        mediaType: ""
      })
    );
    if (this.props.navigation.state.params.type) {
      this.props.navigation.navigate("DeskMedia");
    }
    else {
      this.props.navigation.navigate("Media");
    }
  }
  AddmediaView(mediaType, id) {
    AsyncStorage.setItem(
      "mediaType",
      JSON.stringify({
        mediaType: mediaType
      })
    );

    this.props.navigation.navigate("AddMedia", { type: type, network_id: this.props.Detailsnetwork._id, media: this.props.navigation.state.params.media });
  }

  deleteimg(id) {
    //  console.log('++++',id)
    let url
    let method
    let body
    if (type) {
      url = loginUrl + 'networkMedia/deleteMediaFromDesk';
      method = 'POST';
      body = JSON.stringify({
        //deleteFromDesk: true,
        _id: id,
      });
    }
    else {
      url = loginUrl + "networkMedia/networkMediaActions";
      method = "POST";
      body = JSON.stringify({
        action: 'delete',
        _id: id
      });
    }

    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        //  console.log('RESPONSE',responseJson)
        if (responseJson.code == 200) {
          this.imageRefresh()
          // AsyncStorage.setItem(
          //       "location_data",
          //       JSON.stringify(responseJson.data)
          //     );
          //     this.props.dispatch({
          //       type: "networkData",
          //       payLoad: responseJson.data
          //     });
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
        // console.log('ERROOR',error)
      });
  }
  delete_alert(id) {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this Image?.',
      [

        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.deleteimg(id) },
      ],
      { cancelable: false }
    )
  }


  // setModalVisible(visible,name,id) {
  //   this.setState({ modalVisible: visible,updatefilename: name,editID:id});
  // }

  addDesk(id) {
    //this.setState({ flag: 2 });
    let url = loginUrl + "networkMedia/networkMediaInDesk";
    //console.log('DESKPOST URL',url)
    let method = "POST";
    let body = JSON.stringify({
      //post_id: post_id,
      //network_id: this.state.network_id,
      _id: id,
      //user_id: this.state.user_id,
    });
    //  console.log('DOCUMENT MEDIA TO DESK======',body)
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
        // console.log('network document response',responseJson)
        if (responseJson.status == "true") {
          this.imageRefresh()
          var DataPost = this.state.post_Data;
          for (let i in DataPost) {
            if (DataPost[i]._id == post_id) {
              DataPost[i].isAddDesk = true; //new value
              break;
            }
          }
          this.setState({ post_Data: DataPost });
          ToastAndroid.showWithGravity(
            responseJson.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          //Alert.alert("ID")
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

  onDownloadImagePress(name) {
    console.log('IMAGE',img1)
    var image1 = network_img + name
    RNFetchBlob
      .config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: '/storage/emulated/0/PocketDesk/Image/' + name,
          description: 'Image downloaded.'
        }
      })
      .fetch('GET', image1, {})

      .uploadProgress({ interval : 250 },(written, total) => {
        console.log('uploaded', written / total)
      })
      .progress({ count : 10 },(received, total) => {
        console.log('progress', received / total)
      })
      .then((res) => {
        console.log('File to be saved at: ', res.path())
      })
     
  }


  render() {
    // if (this.state.flag == 1) {
    //   return (
    //     <ActivityIndicator
    //       style={styles.indicator}
    //       animating={this.state.loader}
    //       size="large"
    //     />
    //   );
    // }
    // console.log('IMAGES====',this.state.imagesData)
    var images = this.state.imagesData;

    if (images) {
      var row2 = images.map((data12, index1) => {
        img1 = network_img + data12.networkMedia_ConvertedFileName;
        console.log('IMA======', img1)
        // let isDesk = data12.isDesk;
        // if (isDesk == "1") {
        //   var DeskStatus = "1";
        // } else {
        //   var DeskStatus = "";
        // }
        //console.log('------->',data12)
        return (
          <View style={styles.docs}>
            <View style={{ flexDirection: "row", padding: 10, justifyContent: 'flex-end', width: '100%' }}>

              {data12.isAddDesk == true ?
                <TouchableOpacity style={{ marginLeft: 5 }}>
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={require("../assets/img/lampblue.png")} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => this.addDesk(data12._id)} style={{ marginLeft: 5 }}>
                  <Image
                    style={{ width: 24, height: 20 }}
                    source={require("../assets/img/lampplus.png")} />
                </TouchableOpacity>
              }

              <TouchableOpacity style={{ marginLeft: 7 }} onPress={() => this.delete_alert(data12._id)}>
                <Image
                  style={{ width: 15, height: 20 }}
                  source={require("../assets/img/bin.png")} />
              </TouchableOpacity>

              <TouchableOpacity style={{ marginLeft: 7 }} onPress={() => this.selectImageTapped(data12._id)}>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../assets/img/pencil.png")} />
              </TouchableOpacity>

              <TouchableOpacity style={{ marginLeft: 7 }} onPress={() => this.onDownloadImagePress(data12.networkMedia_ConvertedFileName)}>
                <Image
                  style={{ width: 20, height: 20, tintColor: '#68a9cc' }}
                  source={require("../assets/img/download.png")} />
              </TouchableOpacity>

            </View>

            {/* <PinchZoomView> */}
            {/* <ResponsiveImage
                  resizeMode="contain"
                  source={{ uri: img1 }}
                  initWidth="250"
                  initHeight="250"/> */}
            <Image
              resizeMode="cover"
              source={{ uri: img1 }}
              style={{ width: '90%', height: 250 }}
            />
            {/* </PinchZoomView> */}
            <Text style={styles.centertxt}>
              {data12.networkMedia_OriginalFileName}
            </Text>
          </View>
        );
      });
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            transparent
            style={styles.headerleft}
            onPress={() => this.onBack()}
          >
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}> </Text>
            <Text style={styles.header_subtitle}>PHOTOS MEDIA </Text>
          </View>

          <TouchableOpacity
            style={styles.headerright}
            onPress={() => this.AddmediaView(1)}
          >
            <Image
              style={styles.baricon}
              source={require("../assets/img/circal_plus.png")}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollcontainer}>

          {this.state.flag == 1 ?
            <ActivityIndicator
              style={{ alignSelf: 'center' }}
              animating={true}
              color='white'
              size="large"
            /> :
            <View style={styles.mediagallerywrapper}>
              <View style={styles.galleryrow}>{row2}</View>
            </View>}
        </ScrollView>
        {/* <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#rgba(0,0,0,0.5)',flex:1}}>
          
            <View style={{ height: '35%', width: '90%', backgroundColor: 'white', borderRadius: 7 }}>
              <View style={{ backgroundColor: 'white', marginTop: '10%', width: '100%',marginLeft:'3%' }}>
                
                <Item floatingLabel style={{borderBottomWidth: 1,}}>
                <Label>File Name</Label>
                <Input value={this.state.updatefilename} onChangeText={(value)=> this.setState({updatefilename:value})} numberOfLines={2} />
              </Item>
              </View>

              <View style={{ width: '100%', bottom: 0, position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ width: '50%', alignItems: 'center', backgroundColor: '#2980b9', padding: '3%', borderBottomRadius:7}} onPress={() => { this.setModalVisible(!this.state.modalVisible) }}>
                  <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '50%', alignItems: 'center', backgroundColor: '#2980b9', padding: '3%', borderBottomRadius: 7}} onPress={()=> this.edit_alert(this.state.editID)}>
                  <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Save</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
          
        </Modal> */}



      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    Detailsnetwork: state.networksteps.fullnetworkdetails
  };
}
module.exports = connect(mapStateToProps)(Imagemedia);
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

  mediagallerywrapper: { margin: 10 },

  galleryrow: {},

  docs: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cde2ef",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: "#fff", 
    borderRadius: 5,
    marginBottom:10
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

  centertxt: { fontSize: 14, color: "#2980b9", marginTop: 10 },

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

  footcol_caption: { color: "#fff", fontSize: 10, marginTop: 5 },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  },
});
