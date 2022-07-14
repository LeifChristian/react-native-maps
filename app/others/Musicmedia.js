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
  AsyncStorage, ActivityIndicator,
  Picker,
  Dimensions,
  Modal,
  Alert,
  DeviceEventEmitter,
  Platform
} from "react-native";
import { Icon, Button, Container, Header, Content, Form, Item, Input, Label, Title } from 'native-base';
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import AudioPlayer from "react-native-play-audio";
import RNFetchBlob from 'rn-fetch-blob'
import  ToastAndroid from 'react-native-simple-toast';
var type
var img1
var PushNotification = require('react-native-push-notification');
export default class Musicmedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_name: "",
      network_id: "",
      flag: 0,
      MusicData: [],
      play_status: true,
      btnId: "",
      search_txt: "",
      musicfullData: [],
      modalVisible: false,
      updatefilename: '',
      editID: '',
      deskmusic: '',
      user_id: '',
      addto_desk: "",
      location_name: "",
      desk_status: 2,
      flagImage: false
    };
    this.playAudio = this.playAudio.bind(this);
    this.addMedia.bind();
  }
  playMusic(url) {
    AudioPlayer.prepare(url, () => {
      AudioPlayer.play();

      AudioPlayer.getDuration(duration => {
        // console.log(duration);
      });
    });
  }
  addMedia() {
    AsyncStorage.setItem(
      "mediaType",
      JSON.stringify({
        mediaType: 4
      })
    );
    this.props.navigation.navigate("AddMedia", { type: type, network_id: this.props.Detailsnetwork._id, media: this.props.navigation.state.params.media });
  }
  playAudio(name, url, status, Id) {
    // console.log('Play >>>>>>>>>>',name,'>>',url,'>>',status,'>>',Id)
    this.setState({ url: url })
    if (status == true) {
      PushNotification.localNotification({
        id: '123',
        message: name,
        actions: this.state.play_status == true ? '["Stop"]' : '["Play"]',
        largeIcon: "appicon",
        smallIcon: "appicon",
        priority: "max",
        autoCancel: false,
        ongoing: true,
      })
      this.setState({ play_status: false, btnId: Id });
      this.playMusic(url);
    } else {
      PushNotification.localNotification({
        id: '123',
        actions: this.state.play_status == true ? '["Stop"]' : '["Play"]',
        message: name,
        largeIcon: "appicon",
        smallIcon: "appicon",
        priority: "high",
        autoCancel: false,
      })
      //PushNotification.cancelLocalNotifications({id:'123'});
      AudioPlayer.stop();
      this.setState({ play_status: true, btnId: Id });
    }
  }

  componentDidMount() {
    PushNotification.registerNotificationActions(["Stop"]);
    DeviceEventEmitter.addListener('notificationActionReceived', (action) => {
      //  console.log ('Notification action received: ' + action);
      const info = JSON.parse(action.dataJSON);
      if (info.action == 'Stop') {
        this.playAudio(null, null, false, this.state.btnId)
      }
      if (info.action == 'Play') {
        this.playMusic(this.state.url)
      }

    })
    AudioPlayer.onEnd(() => {
      // console.log("pushnotification close..")
      PushNotification.localNotification({
        id: '123',
        actions: this.state.play_status == true ? '["Stop"]' : '["Play"]',
        largeIcon: "appicon",
        smallIcon: "appicon",
        priority: "high",
        autoCancel: false,
      })
      this.setState({ play_status: true });
    });
    this.setState({ flag: 1 });
    this.setState({
      network_name: this.props.Detailsnetwork.networkName,
      network_id: this.props.Detailsnetwork._id
    });
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      //  console.log(temp)
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
          media_type: 4,
          getMediaDesk: true
        });
        //  console.log('DOCUMENT BODY',body)
        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
            this.setState({ flag: 2 });
            //  console.log('DOCUMENT', responseJson)
            if (responseJson.status == "true") {
              this.setState({
                MusicData: responseJson.Media_In_Desk
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
          // user_id: this.state.user_id,
          file_type: 4
        });
        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
            this.setState({ flag: 2 });
            //  console.log('RESPONSE GET NETWORK MEDIA',responseJson)
            if (responseJson.status == "true") {
              this.setState({
                MusicData: responseJson.data, musicfullData: responseJson.data
              });
              //  ToastAndroid.showWithGravity(
              //    responseJson.message,
              //    ToastAndroid.SHORT,
              //    ToastAndroid.BOTTOM
              //  );
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
    })

  }
  searchFilter() {
    let text = this.state.search_txt;
    let fullList = this.state.musicfullData;
    let filteredList = fullList.filter(item => {
      if (item.networkMedia_OriginalFileName.toLowerCase().match(text)) return item;
    });

    if (!text || text === "") {
      this.setState({
        MusicData: fullList
      });
    } else if (Array.isArray(filteredList)) {
      this.setState({
        MusicData: filteredList
      });
    }
  }
  checktext(text) {

    if (text == "") {
      var Data = this.state.musicfullData;
      this.setState({
        MusicData: Data, search_txt: text
      });
    } else {

      let fullList = this.state.musicfullData;
      let filteredList = fullList.filter(item => {
        if (item.networkMedia_OriginalFileName.toLowerCase().match(text)) return item;
      });
      if (!text || text === "") {
        this.setState({
          MusicData: fullList, search_txt: text
        });
      } else if (Array.isArray(filteredList)) {
        this.setState({
          MusicData: filteredList, search_txt: text
        });
      }
    }
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

  deletemusic(id) {
    //  console.log('++++',id)
    let url
    let method
    let body
    if (type) {
      //    console.log('TYPE OF NETWORK',type)
      url = loginUrl + 'networkMedia/deleteMediaFromDesk';
      method = 'POST';
      body = JSON.stringify({
        //deleteFromDesk: true,
        _id: id,
      });
    }
    else {
      url = loginUrl + 'networkMedia/networkMediaActions';
      method = 'POST';
      body = JSON.stringify({
        action: 'delete',
        _id: id,
      });
    }
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        //   console.log('RESPONSE',responseJson)
        if (responseJson.code == 200) {
          this.deleteRefresh()
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
        //   console.log('ERROOR',error)
      });
  }
  delete_alert(id) {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this Music?.',
      [

        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.deletemusic(id) },
      ],
      { cancelable: false }
    )
  }

  // donedelete(id){
  //   this.deletemusic(id),this.deleteRefresh()
  // }


  setModalVisible(visible, name, id) {
    this.setState({ modalVisible: visible, updatefilename: name, editID: id });
  }
  editdoc(id) {
    // console.log('IDIDID',id)
    let url = loginUrl + "networkMedia/networkMediaActions";
    let method = "POST";
    let body = JSON.stringify({
      action: 'edit',
      _id: id,
      edited_image_name: this.state.updatefilename,
    });
    //  console.log('EDIT',body)
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        //   console.log('RESPONSE',responseJson)
        if (responseJson.code == 200) {
          this.deleteRefresh()
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
        //   console.log('ERROOR',error)
      });
  }
  edit_alert(id) {
    //  console.log('ALERT ID',id)
    Alert.alert(
      'Confirm',
      'Are you sure you want to update this Music?.',
      [

        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.editdoc(id) },
      ],
      { cancelable: false }
    )
    this.setState({ modalVisible: false })
  }

  deleteRefresh() {

    this.setState({ flag: 1 });
    //  this.setState({
    //    network_name: this.props.Detailsnetwork.networkName,
    //    network_id: this.props.Detailsnetwork._id
    //  });
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      //  console.log(temp)
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
          media_type: 4,
          getMediaDesk: true
        });
        //  console.log('DOCUMENT BODY',body)
        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
            this.setState({ flag: 2 });
            //  console.log('DOCUMENT', responseJson)
            if (responseJson.status == "true") {
              this.setState({
                MusicData: responseJson.Media_In_Desk
              });

            }
            else {
              this.setState({
                MusicData: null
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
          file_type: 4
        });
        dataLayer
          .postData(url, method, body)
          .then(response => response.json())
          .then(responseJson => {
            this.setState({ flag: 2 });
            if (responseJson.status == "true") {
              this.setState({
                MusicData: responseJson.data, musicfullData: responseJson.data
              });
              //  ToastAndroid.showWithGravity(
              //    responseJson.message,
              //    ToastAndroid.SHORT,
              //    ToastAndroid.BOTTOM
              //  );
            } else {
              this.setState({
                MusicData: null
              });
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
    })
  }
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
        //  console.log('network document response',responseJson)
        if (responseJson.status == "true") {
          this.deleteRefresh()
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
    var image1 = network_img + name
    RNFetchBlob
      .config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: '/storage/emulated/0/PocketDesk/Music/' + name,
          description: 'Music downloaded.'
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
      // .catch((err)=>{
      //   console.log(err)
      // })
      // .cancel((err)=>{
      //   console.log(err)
      // })
  }


  render() {
    //  if (this.state.flag == 1) {
    //   return (
    //     <ActivityIndicator
    //       style={styles.indicator}
    //       animating={this.state.loader}
    //       size="large"
    //     />
    //   );
    // }
    var Music = this.state.MusicData;
    if (Music) {
      var row2 = Music.map((data12, index1) => {
        img1 = network_img + data12.networkMedia_ConvertedFileName;
        // let isDesk = data12.isDesk;
        // if (isDesk == "1") {
        //   var DeskStatus = "1";
        // } else {
        //   var DeskStatus = "";
        // }
        return (
          <View style={styles.music_row}>

            <View style={{ width: '62%', paddingRight: 5 }}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Text style={styles.music_title}>
                  {data12.networkMedia_OriginalFileName}
                </Text>
              </ScrollView>
            </View>

            <View style={{ flexDirection: 'row', width: '38%', justifyContent: 'space-between',alignItems:'center'}}>

              <TouchableOpacity
                onPress={() => this.playAudio(
                  data12.networkMedia_OriginalFileName,
                  network_img + data12.networkMedia_ConvertedFileName,
                  this.state.play_status,
                  data12._id
                )}
              >
                {this.state.play_status || this.state.btnId != data12._id ? (
                  <Image
                    style={styles.music_btn}
                    source={require("../assets/img/play.png")}
                  />
                ) : (
                    <Image
                      style={styles.music_btn}
                      source={require("../assets/img/pause.jpg")}
                    />
                  )}
              </TouchableOpacity>

              <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => this.setModalVisible(true, data12.networkMedia_OriginalFileName, data12._id)}>
                <Image
                  style={styles.pdficon}
                  source={require("../assets/img/pencil.png")} />
              </TouchableOpacity>

              <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => this.delete_alert(data12._id)}>
                <Image
                  style={styles.binicon}
                  source={require("../assets/img/bin.png")} />
              </TouchableOpacity>

              {data12.isAddDesk == true ?
                <TouchableOpacity style={{ marginLeft: 4 }}>
                  <Image
                    style={styles.deskicon}
                    source={require("../assets/img/lampblue.png")} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => this.addDesk(data12._id)}>
                  <Image
                    style={styles.adddeskicon}
                    source={require("../assets/img/lampplus.png")} />
                </TouchableOpacity>
              }
              <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => this.onDownloadImagePress(data12.networkMedia_ConvertedFileName)}>
                <Image
                  style={styles.downloadicon}
                  source={require("../assets/img/download.png")} />
              </TouchableOpacity>
            </View>

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
            <Text style={styles.header_subtitle}>Audio MEDIA </Text>
          </View>

          <TouchableOpacity
            style={styles.headerright}
            onPress={() => this.addMedia()}
          >
            <Image
              style={styles.baricon}
              source={require("../assets/img/circal_plus.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.searchbar}>
          <TextInput
            placeholder="SEARCH"
            style={styles.input}
            onChangeText={text => this.checktext(text)}
          />
          <TouchableOpacity onPress={() => this.searchFilter()}>
            <Image
              style={styles.searchicon}
              source={require("../assets/img/searchicon.png")}
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
              {row2}</View>}
              
        </ScrollView>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#rgba(0,0,0,0.5)', flex: 1 }}>

            <View style={{ height: '35%', width: '90%', backgroundColor: 'white', borderRadius: 7 }}>
              <View style={{ backgroundColor: 'white', marginTop: '10%', width: '100%', marginLeft: '3%' }}>
                {/* <TextInput
                  value={this.state.updatefilename}
                  underlineColorAndroid='transparent'
                      placeholder="Email" /> */}
                <Item floatingLabel style={{ borderBottomWidth: 1, }}>
                  <Label>File Name</Label>
                  <Input value={this.state.updatefilename} onChangeText={(value) => this.setState({ updatefilename: value })} numberOfLines={2} />
                </Item>
              </View>

              <View style={{ width: '100%', bottom: 0, position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ width: '50%', alignItems: 'center', backgroundColor: '#2980b9', padding: '3%', borderBottomRadius: 7 }} onPress={() => { this.setModalVisible(!this.state.modalVisible) }}>
                  <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '50%', alignItems: 'center', backgroundColor: '#2980b9', padding: '3%', borderBottomRadius: 7 }} onPress={() => this.edit_alert(this.state.editID)}>
                  <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Save</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>

        </Modal>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    Detailsnetwork: state.networksteps.fullnetworkdetails
  };
}
module.exports = connect(mapStateToProps)(Musicmedia);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  },
  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  searchbar: {
    backgroundColor: "#fff",
    marginTop: 15,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 3,
    alignSelf:'center',
    flexDirection: "row",
    padding:Platform.OS=='ios'?10:0,
    alignItems:'center',
    marginBottom: 15,
    width:'95%',
  },

  searchicon: { width: 20, height: 20,},

  input: { marginLeft: 15, width: '85%' },
  headerleft: { width: 20 },

  headercenter: { width: 295 },

  headerright: { width: 20 },

  backicon: { width: 15, height: 25, marginTop: 5 },
  playbtnicon: { width: 55, height: 35, marginTop: 5 },
  baricon: { width: 20, height: 20, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  header_subtitle: { color: "#FFF", fontSize: 13, textAlign: "center" },

  mediagallerywrapper: {  margin: 10 },

  music_row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ececec",
    width: '100%',
    backgroundColor: "#fff", 
    borderRadius: 5,
    marginBottom:10
  },


  music_title: { width: 275, fontSize: 16, height: 20 },

  music_btn: { width: 25, height: 18 },
  pdficon: { width: 20, height: 20 },
  binicon: { width: 16, height: 22, },
  deskicon: { width: 20, height: 20 },
  downloadicon:{width:20, height:20, tintColor:'#68a9cc'},
  adddeskicon: { width: 23, height: 20 },


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
