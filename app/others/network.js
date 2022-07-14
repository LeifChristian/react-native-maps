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
  Alert,
  Platform,
  Dimensions
} from "react-native";
import Modal from 'react-native-modalbox';
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
const Timestamp = require("react-timestamp");
var Contacts = require("react-native-contacts");
import ImagePicker from "react-native-image-picker";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PTRView from "react-native-pull-to-refresh";
import  ToastAndroid from 'react-native-simple-toast';
var { height, width } = Dimensions.get('screen');
var img
const profile = require('../../../img/default_pro.png')


export default class Network extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_data: [],
      flag: 0,
      loader: true,
      network_id: "",
      netwrok_member: "",
      post_text: "",
      post_Data: [],
      user_pic: "",
      imgresponse: "",
      user_id: "",
      comment_show_status: "",
      comment_txt: "",
      comment_postID: "",
      network_craeted_status: "",
      city: '',
      latitude: '',
      longitude: '',
      lat: '',
      lng: '',
      location_name: '',
      IsImageShow: true,
      currentUserID:''

    };
    this._refresh = this._refresh.bind(this);
    // console.log('IMGRESPONSE',this.state.imgresponse)
  }
  componentDidMount() {
    var url = 'https://freegeoip.net/json/';
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        var IP = responseJson.ip;
        var url1 = 'http://freegeoip.net/json/' + IP;
        fetch(url1)
          .then((response1) => response1.json())
          .then((responseJson1) => {
            this.setState({
              city: responseJson1.city,
              latitude: responseJson.latitude,
              longitude: responseJson.longitude
            });
          })

      })
      .catch((error) => {
        //console.error(error);
      });

    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      let userid = temp._id;
      this.setState({
        user_pic: temp.user_pic ? network_img + temp.user_pic : null,
        user_id: temp._id
      });
      //console.log('user pic====',this.state.user_pic)
    });
    // AsyncStorage.getItem("netwrok_member").then(value1 => {
    //   let temp1 = JSON.parse(value1);
    //   console.log('value====',temp1)
    //   this.setState({ netwrok_member: temp1 });
    // });


    AsyncStorage.getItem("network_craeted_status").then(value => {
      let temp = JSON.parse(value);
      this.setState({ network_craeted_status: temp.network_craeted_status });
    });
    this.setState({ flag: 1 });
    AsyncStorage.getItem("netwrok_details").then(value => {
      let temp = JSON.parse(value);
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
          //  console.log('===================',responseJson)
          this.setState({ flag: 2 });
          if (responseJson.status == "true") {
            this.setState({ network_id: temp.network_id });
            this.setState({ network_data: responseJson.data });
            this.setState({ post_Data: responseJson.post });
            //this.setState({ post_Data: responseJson.media });
            responseJson.joinedUser.map((data000, index1111) => {
              if (data000.userinfo._id == this.state.user_id) {
                console.log("id!!!!!!!!", data000)
                this.setState({currentUserID:data000._id})
              }
            }
            )
            console.log('response Json : ',responseJson)
            AsyncStorage.setItem(
              "netwrok_group",
              JSON.stringify(responseJson.groupUser)
            );
            AsyncStorage.setItem(
              "netwrok_data",
              JSON.stringify(responseJson.data)
            );
            AsyncStorage.setItem(
              "netwrok_member",
              JSON.stringify(responseJson.joinedUser)
            );
            this.props.dispatch({
              type: "netwrok_member",
              payLoad: responseJson.joinedUser
            });
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

  delete_alert(delete_id) {
    //console.log(delete_id);
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this post?.',
      [

        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.delete_post(delete_id) },
      ],
      { cancelable: false }
    )
  }


  selectLocationTapped() {
    this.refs.modal3.open()
  }


  delete_post(delete_id) {

    //  var network_id = this.state.network_id;
    // alert(delete_id)
    let url = loginUrl + "post/removePost";
    let method = "POST";
    let body = JSON.stringify({
      _id: delete_id,
      network_id: this.state.network_id,
      user_id: this.state.user_id
    });
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "true") {
          this.setState({ flag: 2 })
          // this.Get_Desk_post(this.state.user_id);
          // console.log('IN....', responseJson)
          ToastAndroid.showWithGravity(
            responseJson.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
          this._refresh()
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



  set_comments_status(comment_status, postId) {
    if (comment_status) {
      status = "";
    } else {
      status = "1";
    }
    this.setState({ comment_show_status: status, comment_postID: postId });
  }
  postComments(postID, j) {
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
      //console.log("Response = ", response);

      if (response.didCancel) {
        // console.log("User cancelled photo picker");
      } else if (response.error) {
        // console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        // console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        this.setState({
          avatarSource: source,
          IsImageShow: true,
          imgresponse: response

        });
      }
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
    var DataPost = this.state.post_Data;
    //console.log('Network',DataPost)
    for (let i in DataPost) {
      if (DataPost[i]._id == postID) {
        DataPost[i].isLike = like; //new value
        DataPost[i].totalLikse = likeCount; //new value
        break;
      }
    }
    this.setState({ post_Data: DataPost });
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

  updatePost() {

    if (
      this.state.post_text == "" &&
      this.state.imgresponse == ""
      //  &&
      // this.state.post_text.trim().length == 0
    ) {
      ToastAndroid.showWithGravity(
        "please enter your post",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }

    else {
      this.setState({ flag: 1 });
      if (this.state.imgresponse === "") {
        AsyncStorage.getItem("user_data").then(value => {
          let temp = JSON.parse(value);
          let user_id = temp._id;
          // let url = 'http://pocketdesk.expertteam.in:8080/api/post/addDeskPost'
          let url = loginUrl + "post/addpost";
          let method = "POST";
          // console.log('location_name', typeof this.state.location_name)
          // console.log('post_lat', typeof this.state.lat.toString())
          // console.log('post_lng', typeof this.state.lng.toString())

          var data =
          {
            network_id: this.state.network_id.toString(),
            user_id: this.state.user_id.toString(),
            location_name: this.state.location_name,
            post_text: this.state.post_text,
            post_lng: this.state.lng.toString(),
            post_lat: this.state.lat.toString()

          }
          dataLayer.SaveRawPost(url, method, data).then((res) => {
            // console.log('Response >>>>>>>>>>>>>>', res)
            //alert('without image')

            if (res.data.status === 'true') {
              this.setState({ flag: 2, location_name: '', post_pic: '', post_text: '', IsImageShow: false }, () => {
                this._refresh()
              })

            }
            else {
              ToastAndroid.showWithGravity(
                responseJson.message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );

            }
          }).catch((error) => {
            // console.log('Response Error >>>>>>>>>', error)
            ToastAndroid.showWithGravity(
              'Error In Response',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
            this.setState({ flag: 2 });
          })

        });
      }
      else {
        AsyncStorage.getItem("user_data").then(value => {
          let temp = JSON.parse(value);
          let user_id = temp._id;
          // let url = 'http://pocketdesk.expertteam.in:8080/api/post/addDeskPost'
          let url = loginUrl + "post/addpost";
          // console.log('URRRRRRRR',url)
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
          data12.append('network_id', this.state.network_id.toString())
          data12.append('user_id', this.state.user_id.toString())
          data12.append('location_name', this.state.location_name)
          data12.append('post_text', this.state.post_text)
          data12.append('post_lng', this.state.lng.toString())
          data12.append('post_lat', this.state.lat.toString())
          // console.log('location_name', typeof this.state.location_name)
          // console.log('post_lat', typeof this.state.lat.toString())
          // console.log('post_lng', typeof this.state.lng.toString())
          dataLayer.SavePost(url, method, data12).then((res) => {
            // console.log('Response >>>>>>>>>>>>>>', res)
            //alert('with image')
            if (res.data.status === 'true') {
              this.setState({ flag: 2, location_name: '', post_pic: '', post_text: '', imgresponse: '', IsImageShow: false }, () => {
                this._refresh()
              })

            }
            else {
              ToastAndroid.showWithGravity(
                responseJson.message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );

            }
          }).catch((error) => {
            // console.log('Response Error >>>>>>>>>', error)
            ToastAndroid.showWithGravity(
              'Error In Response',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
            this.setState({ flag: 2 });
          })

        });
      }
    }
    // this.setState({
    //   imgresponse:'',
    //   post_text:''
    // })
  }

  _refresh() {
    //console.log('URIIIII',this.state.imgresponse.uri)
    let url = loginUrl + "network/networkDetail";
    let method = "POST";
    let body = JSON.stringify({
      _id: this.state.network_id,
      user_id: this.state.user_id
    });
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "true") {
          var NewData = responseJson.post;
          this.setState({ post_Data: NewData });
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
        // console.log("error");
      });

    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }
  // add desk
  addDesk(post_id) {
    this.setState({ flag: 2 });
    let url = loginUrl + "deskPost/saveAsDesk";
    // console.log('DESKPOST URL',url)
    let method = "POST";
    let body = JSON.stringify({
      post_id: post_id,
      network_id: this.state.network_id,
      user_id: this.state.user_id
    });
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
        // console.log('AAAAAAA',responseJson)

        if (responseJson.status == "true") {
          var DataPost = this.state.post_Data;
          for (let i in DataPost) {
            if (DataPost[i]._id == post_id) {
              DataPost[i].isDesk = 1; //new value
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

  deleteUser(currentUserID,network_id) {
    let url = loginUrl + "network/deleteNetworkMember";
    let method = "POST";

    let body = JSON.stringify({
      _id: currentUserID,
      network_id: network_id
    });
    console.log('delete member====', body)
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        console.log('res=====', responseJson)
        if (responseJson.status == "true") {
          this.setState({ netwrok_member: responseJson.joinedUser });
          AsyncStorage.setItem(
            "netwrok_member",
            JSON.stringify(responseJson.joinedUser)
          );
          this.props.navigation.navigate('Home')
          ToastAndroid.showWithGravity(
            "Group left successfully",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          ToastAndroid.showWithGravity(
            "Error in leaving the group.",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      })
      .catch(error => { });
  }

  deleteUser_alert(currentUserID,network_id) {
    
    Alert.alert(
      'Confirm',
      'Are you sure you want to leave the group?.',
      [

        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.deleteUser(currentUserID,network_id) },
      ],
      { cancelable: false }
    )
  }

  render() {
    var userProfile = network_img + this.state.user_pic;
    //console.log('user profile===',userProfile)
    var DataPost = this.state.post_Data;
    if (DataPost.length>0) {
      console.log('DATAAAAAAA',DataPost)
      var row2 = DataPost.map((data12, index1) => {
        var post_id = data12._id;
        img = data12.userinfo.user_pic ? network_img + data12.userinfo.user_pic : null;
        let postImg = network_img + data12.post_pic;


        let location_name = data12.location_name
        let postLike = data12.isLike;
        if (data12.post_city != '') {
          var post_city = data12.post_city;
        } else {
          var post_city = '';
        }

        let totalLike = data12.totalLikse;
        if (postLike == "1") {
          var Likepost = "1";
        } else {
          var Likepost = "";
        }
        //console.log('totalLike in network section ',totalLike)

        let isDesk = data12.isDesk;
        if (isDesk == "1") {
          var DeskStatus = "1";
        } else {
          var DeskStatus = "";
        }
        let comments = data12.comment;
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
          data12.userinfo.user_name != "" &&
          data12.userinfo.user_name != "undefined"
        ) {
          var name = data12.userinfo.user_name;
        } else {
          var name = data12.userinfo.user_phone;
        }
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
                    <Text style={styles.smalltxt}>{location_name} </Text>
                  </View>
                </View>
              </View>

              <View style={styles.itemtopRight}>
                {DeskStatus ? (
                  <TouchableOpacity>
                    <Image
                      style={styles.bigthumb}
                      source={require("../assets/img/lampblue.png")}
                    />
                  </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={this.addDesk.bind(this, post_id)}>
                      <Image
                        style={styles.bigthumb}
                        source={require("../assets/img/lampplus.png")}
                      />
                    </TouchableOpacity>
                  )}

                <TouchableOpacity
                  // style={styles.itemtopRight}
                  onPress={this.delete_alert.bind(this, post_id)}
                >
                  <Image
                    style={[styles.binicon]}
                    source={require("../assets/img/bin.png")}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("EditNetworkPost", { post_edit_id: post_id, user_id: this.state.user_id, network_id: this.state.network_id })}
                >
                  <Image
                    style={[styles.editicon, { width: 25, height: 24, marginLeft: 5 }]}
                    source={require("../assets/img/pencil.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.count}
                  onPress={this.postCount.bind(
                    this,
                    Likepost,
                    post_id,
                    totalLike
                  )}
                //onPress={this.postCount(Likepost)}
                >
                  {/* <Image
                    style={styles.bigthumb}
                    source={require("../assets/img/heart_o.png")}
                  /> */}
                  {Likepost ?
                    <Image
                      style={styles.bigthumb}
                      source={require("../assets/img/heart_fill.png")}
                    />
                    :
                    <Image
                      style={styles.bigthumb}
                      source={require("../assets/img/heart_o.png")}
                    />
                  }
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.simpletxt}> {data12.post_text} </Text>

            {data12.post_pic ? (
              <View style={styles.fullImage}>
                <Image style={styles.fullImage} source={{ uri: postImg }} />
              </View>
            ) : null}

            <View style={styles.itemfooter}>
              <View style={styles.footerleft}>
                <Image
                  style={[styles.lineicon, { width: 20, height: 20 }]}
                  source={require("../assets/img/watch.png")}
                />

                <Text style={styles.bold}>
                  <Timestamp
                    time={data12.post_createdDateTime}
                    component={Text}
                  />
                </Text>
              </View>
              <View style={styles.footerright}>
                <TouchableOpacity style={styles.footerright} onPress={this.postCount.bind(
                  this,
                  Likepost,
                  post_id,
                  totalLike
                )}>
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

                <TouchableOpacity
                  style={styles.count}
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

                {/* <TouchableOpacity
              style={styles.contactinfo}
              
              onPress={() => this.delete_alert(post_id)}
            >
              <Image
                style={styles.closeicon}
                source={require("../assets/img/bin.png")}
              />
            
            </TouchableOpacity> */}

              </View>
            </View>
            {this.state.comment_postID == post_id ? (
              <View style={styles.comments_wrapper}>
                {row3}

                <View style={styles.sendcomm_row}>
                  <TextInput
                    placeholder="Write a comment..."
                    style={styles.comm_input}
                    value={this.state.comment_txt}
                    onChangeText={text => this.setState({ comment_txt: text })}
                  />
                  <TouchableOpacity
                    style={styles.trigherbox}
                    onPress={this.postComments.bind(this, post_id, i)}
                  >
                    <Image
                      style={styles.comm_triger}
                      source={require("../assets/img/paperplan.png")}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        );
      });
    } else {
      var row2 = <Text style={styles.avatartxt} />;
    }
    // if (this.state.flag == 1) {
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
        <PTRView onRefresh={this._refresh}>
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
              <Text style={styles.header_title}>
                {this.state.network_data.networkName}
              </Text>
            </View>

            {this.state.network_craeted_status == 1 ?
              <View style={styles.headerright}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("NetworkSettings")}
                >
                  <Image
                    style={styles.baricon}
                    source={require("../assets/img/settings.png")}
                  />
                </TouchableOpacity>
              </View>

              :
              <View style={styles.headerright}>
                <TouchableOpacity
                  onPress={() => this.deleteUser_alert(this.state.currentUserID,this.state.network_id)}
                >
                  <Image
                    style={styles.baricon}
                    source={require("../assets/img/settings.png")}
                  />
                </TouchableOpacity>
              </View>
            }
          </View>
          <ScrollView style={styles.scrollcontainer}>
            <View style={styles.item_outer}>
              <View style={styles.row}>
                <TouchableOpacity
                  //style={styles.roundedthumbnil}
                  onPress={() => this.props.navigation.navigate("Profile")}
                >
                  {img ?
                    <Image style={styles.thumb} source={{ uri: img }} /> :
                    <Image style={styles.thumb} source={this.state.user_pic ? { uri: this.state.user_pic } : profile} />

                  }
                </TouchableOpacity>
                <View>
                  <TextInput
                    onChangeText={text => this.setState({ post_text: text })}
                    value={this.state.post_text}
                    placeholder="Share Something"
                    style={styles.input}
                  />
                  <Text style={{ marginLeft: 15, fontWeight: 'bold' }}>{this.state.location_name}</Text>
                </View>

              </View>
              {/* {this.state.IsImageShow === true && <View style={{ flexDirection: 'column' }}> */}
              {this.state.imgresponse.uri? <View style={{ flexDirection: 'column' }}>
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
                    <Text style={styles.bold}>PICTURE </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.selectLocationTapped.bind(this)} style={styles.colxs}>
                    <Image
                      style={styles.lineiconsmall}
                      source={require("../assets/img/mapmark.png")}
                    />
                    <Text style={styles.bold}> LOCATION </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.colxs}>
                    <Image
                      style={styles.lineicon}
                      source={require("../assets/img/list.png")}
                    />
                    <Text style={styles.bold}> POLL </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.rightside}
                  onPress={() => this.updatePost()}>

                  <View style={styles.postbtn}>
                    <Image
                      style={styles.posticon}
                      source={require("../assets/img/paperplan.png")} />
                    <Text style={styles.bluetxt}> POST </Text>
                  </View>

                </TouchableOpacity>

              </View>
            </View>
            {this.state.flag == 1 ?
              <ActivityIndicator
                style={{ alignSelf: 'center' }}
                animating={true}
                color='white'
                size="large"
              /> : row2}
          </ScrollView>
        </PTRView>
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
module.exports = connect(mapStateToProps)(Network);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: '#333', padding: 10, flexDirection: "row" },

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

  scrollcontainer: {},

  item_outer: { backgroundColor: "#fff", margin: 10, borderRadius: 3, padding: 10, },

  row: {
    flexDirection: "row",
    paddingLeft: 5,
    paddingTop: 5
  },

  roundedthumbnil: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#ff9900",
    textAlign: "center"
  },

  roundview: {
    width: 40,
    height: 40,
    borderRadius: 6,
    //backgroundColor: "#ff9900",
    textAlign: "center"
  },

  thumb: { width: 40, height: 40, borderRadius: 6 },

  input: { marginLeft: 15, width: 270,borderBottomWidth:Platform.OS=='ios'?1:0 ,padding:10},

  leftside: { flexDirection: "row" },

  rightside: {},

  colxs: { flexDirection: "row", margin: 4, paddingTop: 5, },

  postbtn: { flexDirection: "row", margin: 6, },

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

  itemtopLeft: { flexDirection: "row", width: '55%' },

  feederbox: { marginLeft: 10 },

  name: { fontSize: 18, fontWeight: "bold" },

  feedlocatoin: { flexDirection: "row" },
  modal: {
    padding: 10,
  },
  modal3: {
    borderRadius: 5,
    height: 380,
    width: width - 50
  },
  smallthumb: { width: 9, height: 12, marginRight: 5, marginTop: 3 },

  smalltxt: { fontSize: 11, color: "#C0C0C0" },

  itemtopRight: { flexDirection: "row", width: '45%', justifyContent: 'space-between', alignItems: 'center' },

  bigthumb: { width: 25, height: 22, margin: 5 },

  fullImage: { height: 290, marginTop: 5 },

  simpletxt: { paddingLeft: 10, paddingRight: 10 },

  itemfooter: { flexDirection: "row", padding: 10, marginTop: 12 },

  footerleft: { flexDirection: "row", width: '70%' },
  footerright: { flexDirection: "row", alignItems: 'center' },

  count: { flexDirection: "row", padding: 5 },

  hearicon: { width: 20, height: 18 },
  binicon: { width: 18, height: 25 },
  cheaticon: { width: 20, height: 18 },

  comments_wrapper: { backgroundColor: "#f1f1f1" },

  comments_row: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc"
  },
  comm_txt: { fontSize: 12 },

  comm_smtxt: { fontSize: 10, color: "#c1c1c1" },

  comm_user: { width: 30, height: 30, marginRight: 10 },

  sendcomm_row: { flexDirection: "row" },

  comm_input: { width: '88%', paddingLeft: 15 },

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
  }
});
