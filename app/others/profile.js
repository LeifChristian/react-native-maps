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
  AsyncStorage,
  ActivityIndicator
} from "react-native";
const Timestamp = require("react-timestamp");
var img
const profile= require('../../../img/default_pro.png')

import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import  ToastAndroid from 'react-native-simple-toast';
export default class Networkprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_email: "",
      user_name: "",
      user_phone: "",
      user_pic: "",
      user_pic2: "",
      user_id: "",
      network_count: "",
      myPost: [],
      comment_show_status: "",
      comment_postID: ""
    };
  }
  componentWillMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected == false) {
        ToastAndroid.showWithGravity(
          "No Internet Connection Available",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      } else {
        this.setState({ flag: 1 });
        AsyncStorage.getItem("user_data").then(value => {
          let temp = JSON.parse(value);
         console.log('temp data of user===', temp)
          this.setState({
            user_id: temp._id,
            user_email: temp.user_email,
            user_name: temp.user_name,
            user_phone: temp.user_phone,
            user_pic:temp.user_pic?network_img + temp.user_pic :null
          });
          console.log('temp user pic=====',network_img + temp.user_pic)
        });
        AsyncStorage.getItem("myNetwork").then(value => {
          let temp = JSON.parse(value);
          this.setState({
            network_count: temp.length
          });
          let url = loginUrl + "post/getMyPost";
          let method = "POST";
          let body = JSON.stringify({ user_id: this.state.user_id });
          dataLayer
            .postData(url, method, body)
            .then(response => response.json())
            .then(responseJson => {
//console.log('okkk', responseJson)
              this.setState({ flag: 2 });
              if (responseJson.status == "true") {
                this.setState({
                  myPost: responseJson.data,
                  user_pic:responseJson.data[0].userinfo.user_pic? network_img + responseJson.data[0].userinfo.user_pic : null
                });

              } else {
                ToastAndroid.showWithGravity(
                  responseJson.message,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              }
            })
            .catch(error => { });
        });
      }
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
            var DataPost = this.state.myPost;
            for (let i in DataPost) {
              if (DataPost[i]._id == postID) {
                DataPost[i].comment = responseJson.data; //new value
                break;
              }
            }
            this.setState({ myPost: DataPost, comment_txt: "" });
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
          // ToastAndroid.showWithGravity(
          //   "Error in to connect to server.",
          //   ToastAndroid.SHORT,
          //   ToastAndroid.BOTTOM
          // );
        });
    }
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
    var DataPost = this.state.myPost;
    for (let i in DataPost) {
      if (DataPost[i]._id == postID) {
        DataPost[i].isLike = like; //new value
        DataPost[i].totalLikse = likeCount; //new value
        break;
      }
    }
    this.setState({ myPost: DataPost });
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
        // ToastAndroid.showWithGravity(
        //   "Error in to connect to server.",
        //   ToastAndroid.SHORT,
        //   ToastAndroid.BOTTOM
        // );
      });
  }
//   demo(){
// alert('back')
// this.props.navigation.navigate("Home")
//   }
  render() {
   // console.log('user pic===',this.state.user_pic)
    var myPost = this.state.myPost;
    if (myPost) {
      var row2 = myPost.map((data12, index1) => {
        var post_id = data12._id;
        img = data12.userinfo.user_pic ? network_img + data12.userinfo.user_pic : null ;
        let postImg = network_img + data12.post_pic;
        let postLike = data12.isLike;
        let totalLike = data12.totalLikse;
        if (postLike == "1") {
          var Likepost = "1";
        } else {
          var Likepost = "";
        }
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
                {img ?
                  <Image style={styles.thumb} source={{ uri: img }} /> :
                  <Image
                  style={styles.thumb}
                  source={profile}
                //source={{uri: img}}
                />

                }
                {/* <View style={styles.roundedthumbnil}>
                  <Image style={styles.thumb} source={{ uri: img }} />
                </View> */}
                <View style={styles.feederbox}>
                  <Text style={styles.name}>{name} </Text>
                  <View style={styles.feedlocatoin}>
                    <Image
                      style={styles.smallthumb}
                      source={require("../assets/img/mappoint.png")}
                    />
                    <Text style={styles.smalltxt}>New york City </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.itemtopRight}
                onPress={this.postCount.bind(
                  this,
                  Likepost,
                  post_id,
                  totalLike
                )}
              >
                <Image
                  style={styles.bigthumb}
                  source={require("../assets/img/heart_o.png")}
                />
              </TouchableOpacity>
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
                  style={[styles.lineicon, { height: 20 }]}
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
                <View style={styles.count}>
                  {Likepost ? (
                    <Image
                      style={styles.hearicon}
                      source={require("../assets/img/heart_fill.png")}
                    />
                  ) : (
                      <Image
                        style={styles.hearicon}
                        source={require("../assets/img/heart_o.png")}
                      />
                    )}
                  <Text style={styles.bold}> {totalLike} </Text>
                </View>

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
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerleft}
            onPress={() => this.props.navigation.navigate("Home")}>
          
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title} />
          </View>

          <View style={styles.headerright}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Settings")}
            >
              <Image
                style={styles.baricon}
                source={require("../assets/img/settings.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={styles.profilewraper}>
            <View style={styles.imagebox}>
            {
              this.state.user_pic != null ?  
              <Image
                style={styles.profilethumbnil}
                source={{ uri: this.state.user_pic }}
              /> 
              //console.log(this.state.user_pic)
              :
              <Image
                style={styles.profilethumbnil}
                source={profile}
              //source={{uri: img}}
              />
            }
              
              <Text style={styles.profilename}> {this.state.user_name}</Text>
            </View>
            <View style={styles.profileinfo}>
              <View style={styles.infoleft}>
                <Text style={styles.bixdigit}>{this.state.network_count} </Text>
                <Text style={styles.digittitle}>NETWORKS </Text>
              </View>
              <View style={styles.inforight}>
                <View style={styles.infolist}>
                  <Image
                    style={styles.icon}
                    source={require("../assets/img/lendline.png")}
                  />
                  <Text>{this.state.user_phone} </Text>
                </View>
                <View style={styles.infolist}>
                  <Image
                    style={styles.icon}
                    source={require("../assets/img/eterate.png")}
                  />
                  <Text style={styles.emailtext}>{this.state.user_email} </Text>
                </View>
              </View>
            </View>
          </View>
          {this.state.flag == 1 ?
            <ActivityIndicator
              style={styles.indicator}
              animating={true}
              color='white'
              size="large"
            /> :
            row2
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },
  emailtext: { fontSize: 10 },
  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },

  headercenter: { width: 295 },

  headerright: { width: 20, justifyContent: "center" },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },

  icon: { width: 20, height: 20, marginTop: 5, marginRight: 8 },

  profilewraper: { backgroundColor: "#fff", borderRadius: 5, margin: 10 },

  imagebox: { alignItems: "center", justifyContent: "center", paddingTop: 10, },

  profilethumbnil: {
    borderRadius: 40,
    width: 80,
    height: 80,
    borderColor: "#333",
    borderWidth: 2,
    //backgroundColor:'red'
  },

  profilename: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 15
  },

  profileinfo: {
    borderTopWidth: 1,
    borderColor: "#3c8bbf",
    flexDirection: "row"
  },
  comments_row: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc"
  },
  comm_txt: { fontSize: 12 },

  comm_smtxt: { fontSize: 10, color: "#c1c1c1" },

  comm_user: { width: 30, height: 30, marginRight: 10 },
  comm_triger: { width: 20, height: 20 },
  sendcomm_row: { flexDirection: "row" },
  comments_wrapper: { backgroundColor: "#f1f1f1" },

  comm_input: { width: 300, paddingLeft: 15 },
  infoleft: { alignItems: "center", justifyContent: "center", width: 150 },

  bixdigit: { fontSize: 35, fontWeight: "bold" },

  digittitle: { fontSize: 18 },

  inforight: { borderLeftWidth: 1, borderColor: "#3c8bbf", },

  infolist: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#3c8bbf",
    padding: 18,
    alignItems: 'center', justifyContent: 'center'
  },

  item_outer: { backgroundColor: "#fff", margin: 10, borderRadius: 3 },

  roundedthumbnil: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#ff9900",
    textAlign: "center"
  },

  thumb: { width: 40, height: 40, borderRadius: 6 },

  itemtop: { flexDirection: "row", padding: 10 },

  itemtopLeft: { flexDirection: "row", width: 250 },

  feederbox: { marginLeft: 10 },

  name: { fontSize: 18, fontWeight: "bold" },

  feedlocatoin: { flexDirection: "row" },

  smallthumb: { width: 9, height: 12, marginRight: 5, marginTop: 3 },

  smalltxt: { fontSize: 11, color: "#C0C0C0" },

  itemtopRight: { flexDirection: "row" },

  bigthumb: { width: 25, height: 22, marginLeft: 30 },

  fullImage: { height: 290 },

  itemfooter: { flexDirection: "row", padding: 10, marginTop: 12 },

  lineicon: { width: 20, height: 15, marginRight: 5 },

  lineiconsmall: { width: 16, height: 17 },

  footerleft: { flexDirection: "row", width: 200 },

  footerright: { flexDirection: "row" },

  count: { flexDirection: "row", padding: 5 },

  hearicon: { width: 20, height: 18 },

  cheaticon: { width: 20, height: 18 },

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
  indicator: { marginTop: 50 }
});
