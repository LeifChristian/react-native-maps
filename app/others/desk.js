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
  Dimensions,
  Alert,Platform
} from "react-native";
import { connect } from "react-redux";
import Modal from 'react-native-modalbox';
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import  ToastAndroid from 'react-native-simple-toast';
const Timestamp = require("react-timestamp");
var Contacts = require("react-native-contacts");
import ImagePicker from "react-native-image-picker";
import AwesomeAlert from "react-native-awesome-alerts";
import PTRView from "react-native-pull-to-refresh";
var { height, width } = Dimensions.get('screen');
var img
const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };
const profile= require('../../../img/default_pro.png')


export default class Desk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_data: [],
      flag: 0,
      loader: true,
      network_id: "",
      post_text: "",
      post_Data: [],
      desk_Data: [],
      user_pic: "",
      imgresponse: "",
      user_id: "",
      comment_show_status: "",
      comment_txt: "",
      comment_postID: "",
      network_craeted_status: "",
      showAlert: false,
      location_address: {},
      location_name: '',
      lat: '',
      lng: '',
    };
  }
  componentDidMount() {

    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      let userid = temp._id;
      this.setState({
        user_pic: temp.user_pic?network_img + temp.user_pic :null,
        user_id: temp._id
      });


      //console.log("IDDDDDDDDDDDDDDDDDDDDD>>>>>>", userid)
      this.Get_Desk_post(temp._id);

    })

  }
  Get_Desk_post(user_id) {
    let url = loginUrl + "deskPost/getDeskPost";
    // let url = 'http://pocketdesk.expertteam.in:8080/api/deskPost/getDeskPost'
    //console.log('========--------=======----->', url)
    
    let method = "POST";
    let body = JSON.stringify({
      user_id: user_id?user_id:this.state.user_id
    });
    //console.log('getDESKPOST BODY',body)
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      
      .then(responseJson => {
       //console.log('Desk data=========--=--=--=-=-=',responseJson)
        if (responseJson.status == "true") {

          //console.log('POST >>>>>>>>>>>>>>', responseJson.post)
          this.setState({ desk_Data: responseJson.post },()=>console.log('DESK DATA',this.state.desk_Data));
          
          this.setState({ flag: 2 });
          
        } else {
          ToastAndroid.showWithGravity(
            responseJson.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      })
      .catch(error => {

      });
  }
  set_comments_status(comment_status, postId) {
    if (comment_status) {
      status = "";
    } else {
      status = "1";
    }
    this.setState({ comment_show_status: status, comment_postID: postId });
  }
  postComments(postID, j) {
    //alert('DESK')
    //console.log('DESK')
    if (this.state.comment_txt != "") {
      let url = loginUrl + "comment/postcomment";
      let method = "POST";
      let body = JSON.stringify({
        post_id: postID,
        comment_text: this.state.comment_txt,
        user_id: this.state.user_id
      });

      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status == "true") {
            var DataPost = this.state.post_Data;
            for (let i in DataPost) {
              if (DataPost[i]._id == postID) {
                DataPost[i].comment = responseJson.data; //new value
                break;
              }
            }
            this.setState({ post_Data: DataPost, comment_txt: "" });
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
        });
    }
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
     // console.log("Response = ", response);

      if (response.didCancel) {
       // console.log("User cancelled photo picker");
      } else if (response.error) {
       // console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
      //  console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        // alert(source)
        this.setState({
          avatarSource: source,
          imgresponse: response
        });
      }
    });
  }

  selectLocationTapped() {
    this.refs.modal3.open()
  }
  updatePost() {


    if (
      this.state.post_text == "" &&
      this.state.imgresponse == "" &&
      this.state.post_text.trim().length == 0
    ) {
      ToastAndroid.showWithGravity(
        "please enter your post",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
    else {
      this.setState({ flag: 1 });
      AsyncStorage.getItem("user_data").then(value => {
        let temp = JSON.parse(value);
        let user_id = temp._id;
        // let url = 'http://pocketdesk.expertteam.in:8080/api/post/addDeskPost'
        let url = loginUrl + "post/addDeskPost";
        let method = "POST";
        var PicturePath = this.state.imgresponse.uri;
        var fileName = this.state.imgresponse.fileName;
        var fileType = this.state.imgresponse.type;
        var data12 = new FormData();
        let imageData = {}
        if (PicturePath) {
          data12.append('post_pic', {
            uri: PicturePath,
            name: fileName,
            type: fileType
          });
        }
        data12.append('user_id', this.state.user_id)
        data12.append('post_text', this.state.post_text)
        data12.append('post_lng', this.state.lng.toString())
        data12.append('post_lat', this.state.lat.toString())
        data12.append('location_name', this.state.location_name)
       // console.log('location_name', typeof this.state.location_name)
       // console.log('post_lat', typeof this.state.lat.toString())
        //console.log('post_lng', typeof this.state.lng.toString())
        // data12.append(data);
        var body = JSON.stringify(data12)
        dataLayer
          .postImageData(url, method, data12)
          .then(response => response.json())
          .then(responseJson => {
          //  console.log('RESPONSE IOIUOIOIOIO >>>', responseJson)
            this.setState({ flag: 2 });
            this.setState({
              imgresponse: "",
              post_text: ""
            });
            if (responseJson.status == "true") {
              //this.refresh()
              this.Get_Desk_post(this.state.user_id);
             // this.setState({ desk_Data: responseJson.post, location_name: '', flag: 2 });
            } else {
              ToastAndroid.showWithGravity(
                responseJson.message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            }
          })
          .catch(error => {
          //  console.log('Response Error >>>>>>>>>', error)
            ToastAndroid.showWithGravity(
              'Error In Response',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
            this.setState({ flag: 2 });
          });
      });
    }
  }

  // refresh(){
  //   AsyncStorage.getItem("user_data").then(value => {
  //     let temp = JSON.parse(value);
  //     let userid = temp._id;
  //     this.setState({
  //       user_pic: temp.user_pic,
  //       user_id: temp._id
  //     });

  //     this.Get_Desk_post(temp._id);

  //   })
  // }

  
  delete_alert(deskpost_id) {
  //  console.log('delete id ======== >',deskpost_id);
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this post?.',
      [

        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.deleteDeskPost(deskpost_id) },
      ],
      { cancelable: false }
    )
  }
  deleteDeskPost(deskpost_id) {
    this.setState({ flag: 1 });
 
    let url = loginUrl + "deskPost/removeDeskPost";
    let method = "POST";
 
    let body = JSON.stringify({
      _id: deskpost_id
    });
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
 
      //  console.log('RESPONSE TO DELETE POST IN DESK',responseJson)
        if (responseJson.status == "true") {
          ToastAndroid.showWithGravity(
            responseJson.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            this.Get_Desk_post(this.state.user_id)
          );
        } else {
          ToastAndroid.showWithGravity(
            "Error in delete Desk Post.",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      })
      .catch(error => {
      });
  }
  showAlert() {
    this.setState({
      showAlert: true
    });
  }

  hideAlert() {
    this.setState({
      showAlert: false
    });
  }

  postCount(postLike, postID, likeCount) {
    if (postLike) {
      var like = "0";
      if (likeCount > 0) {
        var likeCount = likeCount - 1;
      }
    } else {
      var like = "1";
      var likeCount = likeCount + 1;
    }
    if (postLike) {
      var sendlike = "1";
    } else {
      var sendlike = "0";
    }
    var desk_Data = this.state.desk_Data;
    console.log('DATAPOST DESK',desk_Data)
    for (let i in desk_Data) {
      if (desk_Data[i]._id == postID) {
        desk_Data[i].isLike = like;
        desk_Data[i].totalLikse = likeCount;
        break;
      }
    }
    //this.setState({ desk_Data: desk_Data });
    let url = loginUrl + "post/postLikeStatus";
    let method = "POST";
    let body = JSON.stringify({
      post_id: postID,
      isPostLike: sendlike,
      user_id: this.state.user_id
    });

    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        console.log('response of like post in desk',responseJson)
        if (responseJson.status == "true") {
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

      });
  }

  render() {
    if (this.state.showAlert == true) {
      return (
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Welcome to in ADD ON"
          message="Under Developement!"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Cancel"
          confirmText="Yes,Ok!"
          cancelButtonColor="#2980b9"
          confirmButtonColor="#2980b9"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      );
    }
    var userProfile = network_img + this.state.user_pic;
    var desk_Data = this.state.desk_Data ? this.state.desk_Data : null;

    if (desk_Data) {
      var row2 = desk_Data.map((data12, index1) => {
        //console.log("THIS IS ERORORORORR>>>>>>>>>>>>>>", data12)
        if (data12 && data12[0].post_type == 1) {

          //console.log('DESK DATA  >>>>>>>>>>>>>>>>>>>>>>>>', data12[0])
          var post_id = data12[0]._id;
          img = data12[0].userinfo.user_pic?network_img + data12[0].userinfo.user_pic:null;
          let postImg = network_img + data12[0].post_pic;
          let postLike = data12[0].isLike;
          let location = data12[0].post_city;

          let totalLike = data12[0].totalLikse;
          if (postLike == "1") {
            var Likepost = "1";
          } else {
            var Likepost = "";
          }
    
          let comments = data12[0].comment;
          if (comments) {
            var i = 0;
            var row3 = comments.map((data321, index123) => {
              i++;
              let commentimg = network_img + data321.userinfo.user_pic;

              return (
                <View style={styles.comments_row}>
                  <Image style={styles.comm_user} source={{ uri: commentimg }} />
                  <View style={styles.comm_txt_box}>
                    <Text style={styles.comm_txt}> {data321.comment_text} </Text>
                    <Text style={styles.comm_smtxt}>
                      <Timestamp
                        time={data321.comment_createdDateTime}
                        component={Text}
                      />
                    </Text>
                  </View>
                </View>
              );
            });
          } else {
            var row3 = <Text style={styles.avatartxt} />;
          }
          if (
            data12[0].userinfo.user_name != "" &&
            data12[0].userinfo.user_name != "undefined"
          ) {
            var name = data12[0].userinfo.user_name;
          } else {
            var name = data12[0].userinfo.user_phone;
          }
        //  console.log("id======>",data12[0])
          return (
            <View style={styles.item_outer}>
              <View style={styles.itemtop}>
                <View style={styles.itemtopLeft}>
                  <View style={styles.roundview}>
                  {img ?
                  <Image style={styles.thumb} source={{ uri: img }} /> :
                  <Image style={styles.thumb} source={profile} />


                }
                  </View>
                  <View style={styles.feederbox}>
                    <Text style={styles.name}>{name} </Text>
                    <View style={styles.feedlocatoin}>
                      <Image
                        style={styles.smallthumb}
                        source={require("../assets/img/mappoint.png")}
                      />
                      <Text style={styles.smalltxt}>{data12[0].location_name} </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.itemtopRight}>
                <TouchableOpacity
                 // style={styles.itemtopRight}
                  onPress={()=>this.delete_alert(data12[0]._id)}
                >
                  <Image
                    style={[styles.binicon]}
                    source={require("../assets/img/bin.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("EditDeskPost", { editData: data12[0] })}
                >
                  <Image
                    style={[styles.editicon, { height: 27 }]}
                    source={require("../assets/img/pencil.png")}
                  />
                </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.simpletxt}> {data12[0].post_text} </Text>

              {data12[0].post_pic ? (
                <View style={styles.fullImage}>
                  <Image style={styles.fullImage} source={{ uri: postImg }} />
                </View>
              ) : null}
              <View style={styles.itemfooter}>
                <View style={styles.footerleft}>
                  <Image
                    style={[styles.lineicon,{height:20,width:20}]}
                    source={require("../assets/img/watch.png")}
                  />

                  <Text style={styles.bold}>
                    <Timestamp
                      time={data12[0].deskPostDateTime}
                      component={Text}
                    />
                  </Text>
                </View>
                <View style={styles.footerright}>
                  <TouchableOpacity style={styles.count}
                  // onPress={this.postCount.bind(
                  //   this,
                  //   Likepost,
                  //   post_id,
                  //   totalLike
                  // )}
                  >
                    {Likepost ? 
                      <Image
                        style={styles.hearicon}
                        source={require("../assets/img/heart_fill.png")}
                      />
                     : 
                        <Image
                          style={styles.hearicon}
                          source={require("../assets/img/heart_o.png")}
                        />
                      }
                    <Text style={styles.bold}> {totalLike} </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.count}
                    onPress={this.set_comments_status.bind(
                      this,
                      this.state.comment_show_status,
                      post_id
                    )}
                    >
                    <Image
                      style={styles.cheaticon}
                      source={require("../assets/img/cheat.png")}
                    />
                    <Text style={styles.bold}> {i} </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.comment_postID == post_id ? 
                <View style={styles.comments_wrapper}>
                  {row3}

                  {/* <View style={styles.sendcomm_row}>
                    <TextInput
                      placeholder="Write a comment..."
                      style={styles.comm_input}
                      value={this.state.comment_txt}
                      onChangeText={text => this.setState({ comment_txt: text })}
                    />
                    <TouchableOpacity
                      style={styles.trigherbox}
                      onPress={this.postComments.bind(this, post_id, i)} >
                      <Image
                        style={styles.comm_triger}
                        source={require("../assets/img/paperplan.png")}
                      />
                    </TouchableOpacity>
                  </View> */}
                </View>
               : null}
            </View>
          );  
      }
      });
    } else {
      var row2 = <Text style={styles.avatartxt} />;
    }
    // if (this.state.flag <= 0) {
    //   return (
    //     <ActivityIndicator
    //       style={styles.indicator}
    //       animating={this.state.loader}
    //       size="large"
    //     />
    //   );
    // }
    return (

      <View style={styles.container}>
        <Modal style={[styles.modal, styles.modal3, { overflow: 'visible' }]} backdrop={true} position={"center"} ref={"modal3"}  >


          <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Search Locations</Text>
          <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'google'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed='auto'    // true/false/undefined
            fetchDetails={true}
            renderDescription={(row) => row.description} // custom description render
            onPress={async (data, details = null) => { // 'details' is provided when fetchDetails = true

              //  alert(JSON.stringify(data))
              // console.log(data);

              //  alert(JSON.stringify(details.geometry.location))
              this.setState({ location_name: details.formatted_address, lat: details.geometry.location.lat, lng: details.geometry.location.lng })
              this.refs.modal3.close()




            }}
            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyC6UCBHHPynK23huodeSYkp8yafUlb_rCQ',
              language: 'en', // language of the results
              types: '(cities)' // default: 'geocode'
            }}
            styles={{
              textInputContainer: {
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                borderBottomWidth: 1
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: '#5d5d5d',
                fontSize: 16
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              },
            }}

            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
              types: 'food'
            }}

            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            // predefinedPlaces={[homePlace, workPlace]}

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          // renderLeftButton={() => <Image source={require('path/custom/left-icon')} />}
          // renderRightButton={() => <Text>Custom text after the inputg</Text>}
          />


        </Modal>
        <View style={styles.togglewrapper}>
          <TouchableOpacity
            style={styles.squerbox}
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Image
              style={styles.squerbox_icon1}
              source={require("../assets/img/saurehome.png")}
            />
            <Text style={styles.squerbox_txt}> HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.squerbox}
            onPress={() => {
              this.showAlert();
            }}>
            <Image
              style={styles.squerbox_icon2}
              source={require("../assets/img/puzzle.png")}
            />
            <Text style={styles.squerbox_txt}> ADD ON</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.squerbox}
            onPress={() => this.props.navigation.navigate("Settings")}>
            <Image
              style={styles.squerbox_icon3}
              source={require("../assets/img/gear.png")}
            />
            <Text style={styles.squerbox_txt}> SETTINGS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.squerbox}
            onPress={() => this.props.navigation.navigate("Profile")}>
            <Image
              style={styles.squerbox_icon4}
              source={require("../assets/img/customer.png")}
            />
            <Text style={styles.squerbox_txt}> PROFILE</Text>
          </TouchableOpacity>
        </View>

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
            <Text style={styles.header_title}>DESK</Text>
          </View>

          <View style={styles.headerright}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("NetworkSettings")}
            >
              <Image
                style={styles.baricon}
                source={require("../assets/img/useronline_icon.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView keyboardShouldPersistTaps='always' style={styles.scrollcontainer}>

          <View style={styles.item_outer}>
            <View style={styles.row}>
              <TouchableOpacity
                //style={styles.roundedthumbnil}
                onPress={() => this.props.navigation.navigate("Profile")}
              >
              {img ?
                  <Image style={styles.thumb} source={{ uri: img }} /> :
                  <Image style={styles.thumb} source={this.state.user_pic?{uri:this.state.user_pic}:profile} />
                }
              </TouchableOpacity>
              <View>
                <TextInput
                  onChangeText={text => this.setState({ post_text: text })}
                  value={this.state.post_text}
                  placeholder="Add to your desk"
                  style={styles.input}
                />
                <Text style={{ marginLeft: 15, fontWeight: 'bold' }}>{this.state.location_name}</Text>
              </View>
            </View>
            {this.state.imgresponse.uri?<View style={{ flexDirection: 'column' }}>
              <Image source={{ uri: this.state.imgresponse.uri }} style={{ width: 300, height: 300, alignSelf: 'center' }} />
            </View>:null}
            <View style={styles.row}>
              <View style={styles.leftside}>
                <TouchableOpacity
                  style={styles.colxs}
                  onPress={this.selectPhotoTapped.bind(this)}
                >
                  <Image
                    style={styles.lineicon}
                    source={require("../assets/img/camera.png")}
                  />
                  <Text style={styles.bold}> ADD A PHOTO </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.selectLocationTapped.bind(this)} style={styles.colxs}>
                  <Image
                    style={styles.lineiconsmall}
                    source={require("../assets/img/mapmark.png")}
                  />
                  <Text style={styles.bold}> ADD LOCATION </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.rightside}
                onPress={() => this.updatePost()}
              >
                <View style={styles.postbtn}>
                  <Image
                    style={styles.posticon}
                    source={require("../assets/img/paperplan.png")}
                  />
                  <Text style={styles.bluetxt}> POST </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.flag <= 0?
          <ActivityIndicator
          style={{alignSelf:'center'}}
          animating={true}
          color='white'
          size="large"
        />:row2}
        </ScrollView>

      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    Detailsnetwork: state.network_details,
    post_userData: state.networksteps.post_user_data,
    SelectPhoneFrnds: state.networksteps.SelectdContactNumber
  };
}
module.exports = connect(mapStateToProps)(Desk);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  togglewrapper: {
    padding: 10,
    backgroundColor: "#2980b9",
    flexDirection: "row"
  },
  roundview:{
    width: 40,
    height: 40,
    borderRadius: 6,
    //backgroundColor: "#ff9900",
    textAlign: "center"
  },

  squerbox: {
    width: 77,
    height: 75,
    marginRight: 10,
    backgroundColor: "#125f92",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },

  squerbox_icon1: { width: 36, height: 32 },
  squerbox_icon2: { width: 29, height: 32 },
  squerbox_icon3: { width: 32, height: 32 },
  squerbox_icon4: { width: 30, height: 32 },

  squerbox_txt: { fontSize: 12, color: "#fff", marginTop: 10 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },
  headercenter: { width: 285 },
  headerright: { width: 26 },
  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 22, height: 22, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  scrollcontainer: {},

  item_outer: { backgroundColor: "#fff", margin: 10, borderRadius: 3 },

  row: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5
  },

  roundedthumbnil: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#ff9900",
    textAlign: "center"
  },

  thumb: { width: 40, height: 40, borderRadius: 6 },

  input: { marginLeft: 15, width: 270,borderBottomWidth:Platform.OS=='ios'?1:0 ,padding:10,borderColor:"#C0C0C0" },

  leftside: { flexDirection: "row" },

  rightside: {},

  colxs: { flexDirection: "row", margin: 4, width: 118 },

  postbtn: { flexDirection: "row", marginLeft: 8 },

  lineicon: { width: 20, height: 15, marginRight: 5 },

  lineiconsmall: { width: 16, height: 17 },

  posticon: { width: 15, height: 14, marginRight: 3, marginTop: 3 },

  bluetxt: { fontWeight: "bold", color: "#2980b9" },

  bold: { fontWeight: "bold", fontSize: 12 },

  separators: {
    width: 180,
    height: 1,
    backgroundColor: "#acacac",
    marginTop: 15,
    marginBottom: 15
  },

  itemtop: { flexDirection: "row", padding: 10 },

  itemtopLeft: { flexDirection: "row", width:'80%' },

  feederbox: { marginLeft: 10 },

  name: { fontSize: 18, fontWeight: "bold" },

  feedlocatoin: { flexDirection: "row" },

  smallthumb: { width: 9, height: 12, marginRight: 5, marginTop: 3 },

  smalltxt: { fontSize: 11, color: "#C0C0C0" },

  itemtopRight: { flexDirection: "row" ,width:'20%',justifyContent:'space-between',alignItems:'center'},

  bigthumb: { width: 25, height: 22, margin: 5 },

  fullImage: { height: 290, marginTop: 5 },

  simpletxt: { paddingLeft: 10, paddingRight: 10 },

  itemfooter: { flexDirection: "row", padding: 10, marginTop: 12 },

  footerleft: { flexDirection: "row", width: '70%' },

  footerright: { flexDirection: "row",width:'30%' },

  count: { flexDirection: "row", padding: 5 },

  hearicon: { width: 20, height: 18 },

  cheaticon: { width: 20, height: 18 },

  comments_wrapper: { backgroundColor: "#f1f1f1" },

  comments_row: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc"
  },
  modal: {
    padding: 10,
  },
  modal3: {
    borderRadius: 5,
    height: 380,
    width: width - 50
  },
  comm_txt: { fontSize: 12 },

  comm_smtxt: { fontSize: 10, color: "#c1c1c1" },

  comm_user: { width: 30, height: 30, marginRight: 10 },

  sendcomm_row: { flexDirection: "row" },

  comm_input: { width: 300, paddingLeft: 15 },

  trigherbox: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    width: 30,
    height: 30,
    borderRadius: 3
  },

  comm_triger: { width: 20, height: 20 },

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

  binicon: { height: 25, width: 18 },
  editicon: { width:27, height: 24,marginRight:5},
  addresswizard: { backgroundColor: "#fff", margin: 10, borderRadius: 3 },

  addwizardBottom: { flexDirection: "row", padding: 10 },

  citydetail: { width: 170 },

  contactdetail: { marginTop: 10 },

  contactinfo: { flexDirection: "row", marginBottom: 10, width: 105 },

  locationmap: { height: 100, width: 340, borderRadius: 3 },

  teleicon: { width: 15, height: 15, marginRight: 5 },
});
