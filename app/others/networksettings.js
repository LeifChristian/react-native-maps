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
  Field,
  AsyncStorage,
  Alert
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import ImagePicker from "react-native-image-picker";
import  ToastAndroid from 'react-native-simple-toast';
const profile= require('../../../img/default_pro.png')
const networkprofile = require('../../../img/undefined.png')

export default class networkprofilesetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_data: [],
      flag: 0,
      loader: true,
      avatarSource: "",
      netwrok_member: "",
      network_id: "",
      network_edit: "",
      network_name: ""
    };
  }
  componentDidMount() {
    AsyncStorage.getItem("netwrok_data").then(value => {
     // console.log('NETWORK DATA=======>',value)
      let temp = JSON.parse(value);
    //  console.log(temp);
      this.setState({ network_data: temp, network_id: temp._id,network_name:temp.networkName });
    });
    AsyncStorage.getItem("netwrok_member").then(value1 => {
      let temp1 = JSON.parse(value1);
      console.log('value====',temp1)
      this.setState({ netwrok_member: temp1 });
    });
    //this.setState({ network_data: this.props.Details_network });
  }

   delete_net(id){
   
     var net_id = id;
  
   // var delete_id = net_id;
   
    let url = loginUrl + "network/deleteNetwork";
    let method = "POST";
    let body = JSON.stringify({
      _id:net_id
     
    });

    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
       // console.log(responseJson);
        if (responseJson.status == "true") {
        //  this.props.navigation.goBack();
         // this.setState({ network_data1:'' });
           this.props.navigation.navigate("Home");  
        } else {
         
        }
      })
      .catch(error => {
        this.setState({ flag: 2 });
      }); 
   } 

   delete_alert(network_id_get){
      Alert.alert(
  'Confirm',
  'Are you sure you want to delete this network?.',
  [

    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    {text: 'OK', onPress: () =>this.delete_net(network_id_get)},
  ],
  { cancelable: false }
)
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
      //  console.log("User cancelled photo picker");
      } else if (response.error) {
      //  console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
       // console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        this.setState({
          avatarSource: response.uri,

          imgresponse: response
        });
      }
    });
  }
  updatenetworkInfo() {
    var url = loginUrl + "network/networkSetting";
    let method = "POST";
    var networkname=this.state.network_name?this.state.network_name : this.state.network_data.networkName;
    var data12 = new FormData();
    if(this.state.imgresponse!='' && this.state.imgresponse!=undefined)
      {
        var PicturePath = this.state.imgresponse.uri;
        var fileName = this.state.imgresponse.fileName;
        var fileType = this.state.imgresponse.type;
        data12.append("coverphotoImage", {
        uri: PicturePath,
        name: fileName,
        type: fileType
      });
      }
     if(this.state.network_name!='')
      {
        data12.append("networkName", this.state.network_name);
      }
      else{
        data12.append("networkName",  this.state.network_data.network_name);
      }
   
    data12.append("_id", this.state.network_id);
//console.log(data12);
//console.log('NAME',networkname)
    dataLayer
      .postImageData(url, method, data12)
      .then(response => response.json())
      .then(responseJson => {
        //console.log('RES@@@@',responseJson)
        this.setState({ flag: 2 });
        if (responseJson.status == "true") {
          this.setState({ network_name: networkname,network_edit: 2 });
           ToastAndroid.showWithGravity(
            'Profile update Successfully',
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
  DeleteMember(member_id, network_id) {
    // this.setState({ flag: 1 });
    let url = loginUrl + "network/deleteNetworkMember";
    let method = "POST";

    let body = JSON.stringify({
      _id: member_id,
      network_id: network_id
    });
    console.log('delete member====',body)
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        console.log('res=====',responseJson)
        if (responseJson.status == "true") {
          this.setState({ netwrok_member: responseJson.joinedUser });
          AsyncStorage.setItem(
            "netwrok_member",
            JSON.stringify(responseJson.joinedUser)
          );
          ToastAndroid.showWithGravity(
            responseJson.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          ToastAndroid.showWithGravity(
            "Error in delete member.",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      })
      .catch(error => {});
  }
  editNetworkName() {
    this.setState({ network_edit: 1 });
   
  }
 
  render() {
    console.log('data',network_img + this.state.network_data.coverPhoto )
    
      var img = this.state.network_data.coverPhoto?network_img + this.state.network_data.coverPhoto:null;
    
     // var img =  network_img + this.state.network_data.coverPhoto
    
    //console.log('image',img)
    var Member = this.state.netwrok_member;
    //console.log('network member====',this.state.netwrok_member)

    if (Member) {
      var memberslist = Member.map((data321, index123) => {
        // if (data321.userinfo.user_pic) {
        //   var memberimg =data321.userinfo.user_pic? network_img + data321.userinfo.user_pic:null;
        // } else {
        //   var memberimg = network_img + data321;
        // }
        //console.log('data = ==',data321)
        var memberimg =data321.userinfo.user_pic? network_img + data321.userinfo.user_pic:null;
        if (
          data321.userinfo.user_name != undefined &&
          data321.userinfo.user_name != ""
        ) {
          var member_name = data321.userinfo.user_name;
        } else {
          var member_name = data321.userinfo.user_phone;
        }
        return (
          <View style={styles.memberlist}>
            <View style={styles.listlft}>
              {/* <Image style={styles.smallthumb} source={{ uri: memberimg }} /> */}
              {memberimg ?
                  <Image style={styles.smallthumb} source={{ uri: memberimg }} /> :
                  <Image style={styles.smallthumb} source={profile} />
                }
              <Text> {member_name} </Text>
            </View>
            <TouchableOpacity
              style={styles.btnwrap}
              onPress={() => this.DeleteMember(data321._id, data321.network_id)}
            >
            {index123!=0?
             <Image
             style={styles.cross}
             source={require("../assets/img/cross_red.png")}
           />:null
            }
             
            </TouchableOpacity>
          </View>
        );
      });
    } else {
      var memberslist = <Text style={styles.avatartxt} />;
    }
    var Admin = this.state.netwrok_member;
    if (Admin) {
      var adminlist = Admin.map((data3, index3) => {
        if (data3.is_user_admin == "1") {
          // if (data3.userinfo.user_pic) {
          //   var adminimg = data3.userinfo.user_pic?network_img + data3.userinfo.user_pic:null;
          // } else {
          //   var adminimg = network_img + data3;
          // }
          var adminimg = data3.userinfo.user_pic?network_img + data3.userinfo.user_pic:null;

          if (
            data3.userinfo.user_name != undefined &&
            data3.userinfo.user_name != ""
          ) {
            var admin_name = data3.userinfo.user_name;
          } else {
            var admin_name = data3.userinfo.user_phone;
          }
          return (
            <View style={styles.colblock}>
              {/* <Image style={styles.roundedthumb} source={{ uri: adminimg }} /> */}
              {adminimg ?
                  <Image style={styles.roundedthumb} source={{ uri: adminimg }} /> :
                  <Image style={styles.roundedthumb} source={profile} />
                }
              <Text style={styles.smalltxt}> {admin_name} </Text>
            </View>
          );
        }
      });
    } else {
      var memberslist = <Text style={styles.avatartxt} />;
    }
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        <TouchableOpacity
          style={styles.btnwrap}
          onPress={() => this.props.navigation.navigate("Network")}
        >
          <Image
            style={styles.closebtn}
            source={require("../assets/img/close_white.png")}
          />
        </TouchableOpacity>

        <ScrollView>
          <View style={styles.settingswrapper}>
            <View style={styles.pagetitlebar}>
              <Text style={styles.pagetitle}> NETWORK SETTINGS </Text>
              <TouchableOpacity onPress={() => this.updatenetworkInfo()}>
                <Image
                  style={styles.saveicon}
                  source={require("../assets/img/checked.png")}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.groupinro}>
              <View style={styles.grouplft}>
                {img ? 
                 <Image
                 style={styles.grouplogo}
                 source={{uri:this.state.avatarSource?this.state.avatarSource:network_img + this.state.network_data.coverPhoto}}
               />
                  
                 : 
                 <Image style={styles.grouplogo} source={this.state.avatarSource?{uri:this.state.avatarSource}:networkprofile} />
                 
                }
                <TouchableOpacity
                  style={styles.cover}
                  onPress={this.selectPhotoTapped.bind(this)}
                >
                  <Image
                    style={styles.whpencil}
                    source={require("../assets/img/pencil_white.png")}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.grouprtl}>
                <View style={styles.ltrTop}>
                  {this.state.network_edit == 1 ? (
                    <TextInput
                      style={styles.grouptitle}
                      keyboardType="text"
                   
                      onChangeText={text =>
                        this.setState({ network_name: text })}
                    />
                  ) : (
                    <Text style={styles.grouptitle}>
                      {this.state.network_name ? this.state.network_name : this.state.network_data.networkName}
                    </Text>
                  )}
                  <TouchableOpacity onPress={() => this.editNetworkName()}>
                    <Image
                      style={styles.pencilicon}
                      source={require("../assets/img/pencil.png")}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.ltrBottom}>
                  <Text style={styles.bluetxt}> INVITE VIDEO </Text>
                  <View style={styles.ltrsep}>
                     <TouchableOpacity onPress={() => this.delete_alert(this.state.network_id)}>
                    <Image
                      style={styles.binicon}
                      source={require("../assets/img/bin.png")}
                    />
                  </TouchableOpacity>
                  </View>
                  <View style={styles.ltrsep}>
                    <Image
                      style={styles.shareicon}
                      source={require("../assets/img/share.png")}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.adminbar}>
              <Text style={styles.bartitle}>Admins</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("addAdmin")}
              >
                <Image
                  style={styles.memnerthumb}
                  source={require("../assets/img/addmember.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.admin_list}>
              <View style={styles.adminthumbnils} />
              {adminlist}
            </View>
            <View style={styles.memeberbar}>
              <Text style={styles.bartitle}>Memeber </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("addMembers")}
              >
                <Image
                  style={styles.memnerthumb}
                  source={require("../assets/img/addmember.png")}
                />
              </TouchableOpacity>
            </View>
            {memberslist}
          </View>
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    Details_network: state.networksteps.fullnetworkdetails
  };
}
connect(mapStateToProps)(networkprofilesetting);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  btnwrap: { alignItems: "flex-end", marginRight: 20, marginBottom: 10 },

  closebtn: { width: 20, height: 20 },

  settingswrapper: { backgroundColor: "#fff", borderRadius: 5, margin: 10 },

  pagetitlebar: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#d7d7d7",
    flexDirection: "row"
  },

  closeicon: {
    width: 15,
    height: 15,
    position: "absolute",
    right: 15,
    top: 10
  },

  pagetitle: {
    fontSize: 20,
    fontWeight: "700",
    width: 290,
    textAlign: "center"
  },

  groupinro: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#d7d7d7"
  },

  grouplft: {
    borderRightWidth: 1,
    borderColor: "#d7d7d7",
    padding: 10,
    height: 115,
  },

  grouplogo: { borderRadius: 44.5, width: 85, height: 85},

  cover: {
    backgroundColor: "#2980b9",
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    top: 65,
    right: 15,
    padding: 8
  },

  whpencil: { width: 15, height: 15 },

  saveicon: { width: 25, height: 25 },

  ltrTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 65,
    width: 220
  },

  ltrBottom: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#d7d7d7"
  },

  grouptitle: { fontSize: 18, color: "#000", width: 190, padding: 5 },

  pencilicon: { width: 22, height: 22, marginRight: 10 },

  bluetxt: { color: "#2980b9", width: 125, paddingTop: 15, paddingLeft: 10 },

  ltrsep: { borderLeftWidth: 1, borderColor: "#d7d7d7",height:50 },

  binicon: { marginRight: 15, marginLeft: 15, marginTop: 15 ,width: 16, height: 22,},

  shareicon: {
    marginRight: 15,
    marginLeft: 15,
    marginTop: 15,
    width: 20,
    height: 20
  },

  adminbar: { paddingTop: 20, paddingLeft: 10, flexDirection: "row" },

  bartitle: {
    fontSize: 16,
    paddingLeft: 20,
    fontWeight: "bold",
    marginBottom: 15
  },

  admin_list: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#888",
    marginBottom: 10
  },

  adminthumbnils: { flexDirection: "row" },

  colblock: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    margin: 10
  },

  roundedthumb: { width: 50, height: 50, borderRadius: 25 },

  smalltxt: { fontSize: 10, width: 70,textAlign:'center'},

  memberlist: { flexDirection: "row", padding: 10 },

  listlft: { flexDirection: "row", width: 270, alignItems: "center" },

  smallthumb: { borderRadius: 17.5, width: 35, height: 35, marginRight: 10 },

  cross: { width: 20, height: 20 },

  memeberbar: {
    flexDirection: "row",
    paddingLeft: 8,
    paddingBottom: 8,
    paddingRight: 8
  },

  bartitle: { width: 270 },

  memnerthumb: {}
});
