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
,} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import moment from "moment";
import  ToastAndroid from 'react-native-simple-toast';
export default class TaskDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_name: "",
      network_id: "",
      taskData: [],
      userID: "",
      task_title: "",
       task_dueDate: "",
       task_assign:[],
       task_duedate:'',
       task_created_img:network_img + "default_img.png",
       task_desc:'',
       task_username:'',
        flag: 0,
    };
  }
  componentWillMount() {
    this.setState({
      network_name: this.props.Detailsnetwork.networkName,
      network_id: this.props.Detailsnetwork._id
    });
      this.setState({ flag: 1 });
    AsyncStorage.getItem("task_id").then(value => {
      let temp = JSON.parse(value);

      let url = loginUrl + "task/getTaskDetail";
      let method = "POST";
      let body = JSON.stringify({
        task_id: temp.task_id
      });

      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ flag: 2 });
          
          if (responseJson.status == "true") {
           
            this.setState({ taskData: responseJson.data,
              task_title:responseJson.data[0].task_title,
              task_desc:responseJson.data[0].task_discription,
              task_created_img:network_img + responseJson.data[0].userinfo.user_pic,
              task_dueDate:responseJson.data[0].task_dueDate,
              task_username:responseJson.data[0].userinfo.user_name,
              task_assign:responseJson.data[0].user
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
    var DataTask = this.state.taskData; 

    
    
      if (DataTask && DataTask!='undefined') {
     if(this.state.task_assign)
      {
          var row2 = this.state.task_assign.map((data12, index1) => {
           // console.log(data12);
            if(data12.image!=undefined)
              {
                 var img = network_img + data12.image;
              }else{
                var img = network_img + "default_img.png";
              }
              
                return(
                       <View style={styles.imgbox}>
                        <Image
                          style={styles.smalllthumb}
                          source={{uri:img}}
                        />
                        {/* <Text> Jerry M.</Text> */}
                      </View>
                );
          });
      }
   
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.settingswrapper}>
            <View style={styles.pagetitlebar}>
              <Text> Posted By </Text>
              <View style={styles.postby}>
                <Image style={styles.post_avt} source={{ uri: this.state.task_created_img }} />
                <Text style={styles.post_avt_name}> {this.state.task_username}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeicon}
                onPress={() => this.props.navigation.goBack()}
              >
                <Image source={require("../assets/img/close.png")} />
              </TouchableOpacity>
          
                <View style={styles.postbody}>
                  <Text style={styles.post_title}>
                   {this.state.task_title}
                  </Text>
                  <Text style={styles.post_content}>
                  {this.state.task_desc}
                  </Text>

                  <View style={styles.colfooter}>
                    <Text style={styles.assign}>ASSIGNED TO</Text>
                    <View style={styles.multipal_img_tray}>
                     {row2}
                      
                      <Image
                        style={styles.smalllthumb}
                        source={require("../assets/img/user_small_thumbnil_04.jpg")}
                      />
                    </View>
                  </View>
                </View>
             
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.footinput}>
            <Text styl={styles.labeltxt}>
               {moment(this.state.task_dueDate).format("DD/MM/YYYY h:m:A")}
            </Text>
          </View>
          <TouchableOpacity style={styles.btn_done}>
            <Image
                        style={styles.smalllthumb}
                        source={require("../assets/img/checked.png")}
                      />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  }
}
function mapStateToProps(state) {
  return {
    Detailsnetwork: state.networksteps.fullnetworkdetails
  };
}
module.exports = connect(mapStateToProps)(TaskDetails);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 0 },

  settingswrapper: { backgroundColor: "#fff", margin: 5 },

  pagetitlebar: { padding: 15 },

  closeicon: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 15,
    top: 30
  },

  pagetitle: { fontSize: 20, fontWeight: "700", marginTop: 30 },

  postby: { flexDirection: "row" },

  post_avt: { width: 35, height: 35, borderRadius: 35 },

  post_avt_name: {
    color: "#2980b9",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 3
  },

  postbody: { marginTop: 40 },

  post_title: { fontSize: 36, color: "#000" },

  post_content: {
    fontSize: 24,
    color: "#ccc",
    fontWeight: "300",
    lineHeight: 40
  },

  colfooter: { paddingTop: 8, marginTop: 30 },

  assign: {
    fontSize: 16,
    fontWeight: "300",
    color: "#333",
    marginRight: 8,
    paddingTop: 3,
    marginBottom: 15
  },
  multipal_img_tray: { flexDirection: "row" },
  imgbox: { marginRight: 15 },

  smalllthumb: { width: 50, height: 50, borderRadius: 50 },

  footer: {
    height: 60,
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#c0c0c6"
  },

  footinput: { width: 300, height: 60, padding: 20 },

  btn_done: { backgroundColor: "#2980b9", height: 60, width: 60 },
   indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  },
});
