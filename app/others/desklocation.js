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
  NetInfo,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import  ToastAndroid from 'react-native-simple-toast';
export default class Desklocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: [],
      locationData: [],
      locationfullData: [],
      search_txt: '',
      user_id: "",
      network_id: "",
      name:"",
      address: "",
      details: "",
      phone: "",
      email: "",
      addto_desk: "",
      location_name: "",
      desk_status: 2,
      flag:1,
      modalVisible:false
      //comment_postID: "",
    };
  }
  searchFilter() {
    let text = this.state.search_txt;
    let fullList = this.state.locationData;
    let filteredList = fullList.filter(item => {
      if (item.name.toLowerCase().match(text)) return item;
    });

    if (!text || text === "") {
      this.setState({
        locationData: fullList
      });
    } else if (Array.isArray(filteredList)) {
      this.setState({
        locationData: filteredList
      });
    }
  }

  checktext(text) {
    if (text == "") {
      var Data = this.state.locationfullData;
      this.setState({
        locationData: Data
      });
    } else {
      let fullList = this.state.locationfullData;
      let filteredList = fullList.filter(item => {
        if (item.name.toLowerCase().match(text)) return item;
      });
      if (!text || text === "") {
        this.setState({
          locationData: fullList, search_txt: text
        });
      } else if (Array.isArray(filteredList)) {
        this.setState({
          locationData: filteredList, search_txt: text
        });
      }
    }
  }
  delete_location(delete_id,net_id) {
//console.log('network_id of desk==',net_id)
    var network_id = this.state.network_id;
    //console.log('network id of delete in desk ',network_id)

    //console.log('response of network id in desk location',network_id)
    this.setState({ flag: 1});
    var delete_id = delete_id;
    //console.log('Delete id',delete_id)

    let url = loginUrl + "deskPost/addLocationInDesk";
    let method = "POST";
    let body = JSON.stringify({
      delete:true,
      user_id:this.state.user_id,
      location_id: delete_id,
      network_id : net_id == undefined? null:net_id
    });
  
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
       // console.log('response of desk location delete',responseJson)
        if (responseJson.status == true) {
          this.Refresh()
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
  delete_alert(delete_id,net_id) {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this location?.',
      [

        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.delete_location(delete_id,net_id) },
      ],
      { cancelable: false }
    )
  }

  componentDidMount() {
    this.setState({ flag: 1 });
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);
      let userid = temp._id;
      this.setState({
        user_id: temp._id
      });
    })
    AsyncStorage.getItem("netwrok_details").then(value => {
      let temp = JSON.parse(value);
      let url = loginUrl + "deskPost/saveLocationAsDesk";
      
      //console.log('URLLLLLL===',url)
      let method = "POST";
      let body = JSON.stringify({ user_id:this.state.user_id,getlocationInDesk:true});
      //console.log('LOCATION BODY=============',body)
      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
        //  console.log('RESPONSE DESK LOCATION',responseJson)
          this.setState({ flag: 2});
          if (responseJson.status == 200) {
            this.setState({
            locationData:responseJson.location_detail
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
        // console.log('error',error)
        });
    });
  }

  edit_location(data) {

    //  this.props.navigation.navigate("addnetworklocation");
//console.log('data of desk location',data)
    this.props.navigation.navigate('editnetworklocation',{type:'desk_location',data:data,network_id:this.state.network_id});
  }
  Dailogbox(){
    return(
      <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
         //   console.log('Modal has been closed.');
          }}>
          <View style={styles.modalView}> 
            <View style={styles.dailogView}>
                <Text style={styles.dailogTitle}>You can not edit this location because it is desked from Network.</Text>
                <TouchableOpacity
                  onPress={()=>this.setState({modalVisible:false})}
                 style={styles.okButton}>
                  <Text style={styles.okButtontext}>OK</Text>
                </TouchableOpacity>
            </View>
          </View>
      </Modal>
    )
  }
  Refresh(){
    
    // this.setState({ flag: 1 });
    // AsyncStorage.getItem("user_data").then(value => {
    //   let temp = JSON.parse(value);
    //   let userid = temp._id;
    //   this.setState({
    //     user_id: temp._id
    //   });
    // })

    this.setState({ flag: 1 });

    AsyncStorage.getItem("netwrok_details").then(value => {
      let temp = JSON.parse(value);
      let url = loginUrl + "deskPost/saveLocationAsDesk";
      
      //console.log('URLLLLLL===',url)
      let method = "POST";
      let body = JSON.stringify({user_id:this.state.user_id,getlocationInDesk:true});
      //console.log('LOCATION BODY=============',body)
      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
          //console.log('RESPONSE DESK LOCATION',responseJson)
          this.setState({ flag: 2});
          if (responseJson.status == 200) {
            this.setState({
            locationData:responseJson.location_detail
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
       //  console.log('error',error)
        });
    });
  }

  render() {

    if (this.state.locationData) {
      var row1 = this.state.locationData.map((data, index) => {
        //var post_id = data._id;
      //  console.log('data network id',data.network_id)

        return (
          <View style={styles.col_container}>
            <View style={styles.addresswizard}>
              <View style={styles.addwizardTop}>
                <Image
                  style={styles.locationmap}
                  source={require("../assets/img/map_big.jpg")}
                />
              </View> 
              <View style={styles.addwizardBottom}>
                <View style={styles.citydetail}>
                  <Text style={styles.cityname}> {data.name} </Text>
                  <Text style={styles.smalltxt}>{data.details}</Text>
                </View>
                <View style={styles.contactdetail}>
                  <View style={styles.contactinfo}>
                  <View style={{width:'18%',marginRight:10}}>
                    <Image
                      style={styles.teleicon}
                      source={require("../assets/img/telephone.png")}
                    />
                    </View>
                    <Text style={styles.bold}>{data.phone}</Text>
                  </View>
                  <View style={styles.contactinfo}>
                  <View style={{width:'18%',marginRight:10}}>
                    <Image
                      style={{height:18,width:14}}
                      source={require("../assets/img/mappoint.png")}
                    />
                    </View>
                    <Text style={styles.bold}>{data.address}</Text>
                  </View>
                  <View style={styles.contactinfo}>
                  <View style={{width:'18%',marginRight:10}}>
                    <Image
                      style={{height:12,width:18,marginRight:2}}
                      source={require("../assets/img/envealop.png")}
                    />
                    </View>
                    <Text style={styles.bold}>{data.email}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', width: 70, marginBottom: 10, }}>

                    <TouchableOpacity


                      onPress={() => this.delete_alert(data._id,data.network_id)}
                    >
                      <Image
                        style={styles.binicon}
                        source={require("../assets/img/bin.png")}
                      />

                    </TouchableOpacity>
                      <TouchableOpacity>
                        <Image
                          style={styles.bigthumb}
                          source={require("../assets/img/lampblue.png")}
                        />
                      </TouchableOpacity>
                      
                     
                  {data.network_id != undefined ?
                  //  <TouchableOpacity onPress={() => alert('You can not edit this location because it is desked from Network.')}>
                   <TouchableOpacity onPress={() => this.setState({modalVisible:true})}>
                     <Image
                      style={styles.editicon}
                     source={require("../assets/img/pencil.png")}/>

                 </TouchableOpacity> 
                   :
                    <TouchableOpacity onPress={() => this.edit_location(data)}>

                      <Image
                        style={styles.editicon}
                        source={require("../assets/img/pencil.png")}/>

                    </TouchableOpacity>}

                  </View>

                </View>
              </View>
            </View>
          </View>

        );
      });
    }
  
    else {
      var row1 = <Text style={styles.avatartxt} />;
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
            <Text style={styles.header_subtitle}> LOCATION </Text>
          </View>

          <TouchableOpacity
            style={styles.headerright}
            onPress={() => this.props.navigation.navigate("addnetworklocation",{type:'desk_location'})}
          >
            <Image
              style={styles.baricon}
              source={require("../assets/img/circal_plus.png")}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollcontainer}>
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

        {this.state.flag==1?
          <ActivityIndicator
          style={{alignSelf:'center'}}
          animating={true}
          color='white'
          size="large"
        />:row1}

        </ScrollView>
        {this.Dailogbox()}
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    locationdata: state.networksteps.fullnetworkdetails
  };
}
module.exports = connect(mapStateToProps)(Desklocation);
const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26
  },

  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },

  headercenter: { width: 295,alignSelf:'center' },

  headerright: { width: 20 },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },
  header_subtitle: { color: "#FFF", fontSize: 17, textAlign: "center",fontWeight:'bold' },

  searchbar: {
    backgroundColor: "#fff",
    margin: 10,
    padding:10,
    borderRadius: 3,
    flexDirection: "row",
    padding:Platform.OS=='ios'?10:0,
    alignItems:'center',
    marginBottom: 15,
    width:'95%',
  },

  searchicon: { width: 20, height: 20,  },

  col_container: {
    backgroundColor: "#fff", margin: 10, borderRadius: 3, flexDirection: "row"
  },

  smallmap: { width: 90, height: 95 },

  teletxt: { flexDirection: "row", marginTop: 8, marginBottom: 5 },

  col_3: { textAlign: "center", justifyContent: "center" },

  col_6: { width: 180, marginLeft: 10, marginRight: 10 },

  cityname: { fontSize: 14, marginTop: 5, marginBottom: 5 },

  input: { marginLeft: 15, width:'85%' },

  navigaticon: { width: 25, height: 25, marginLeft: 8, marginBottom: 8 },

  bold: { fontWeight: "bold", fontSize: 12 },

  teleicon: { width: 15, height: 15, marginRight: 5 },

  smalltxt: { fontSize: 10, color: "#C0C0C0" },

  bluesmall: { fontSize: 8, color: "#2980b9" },

  addresswizard: { backgroundColor: "#fff", margin: 10, borderRadius: 3 },

  addwizardBottom: { flexDirection: "row", padding: 10 },

  citydetail: { width: 170 },

  contactdetail: { marginTop: 10 },

  contactinfo: { flexDirection: "row", marginBottom: 10, width: 105 },

  locationmap: { height: 100, width: 340, borderRadius: 3 },

  editicon: { width: 20, height: 20, marginRight: 10 },
  bigthumb: { width: 20, height: 20, marginRight: 10 },
  binicon: { width: 16, height: 21, marginRight: 10 },

  footer: { height: 70, color: "#333", padding: 10, flexDirection: "row" },

  footcol: { width: 70, textAlign: "right", alignItems: "center", justifyContent: "center" },

  footicon: { width: 35, height: 32 },

  modalView:{backgroundColor:'rgba(82,82,82,0.5)',flex:1,justifyContent:'center',alignItems:'center'},
  dailogView:{backgroundColor:'white',height:150,width:'90%',borderRadius:10},
  dailogTitle:{fontSize:18,fontWeight:'500',color:'black',width:'80%',alignSelf:'center',marginTop:'10%'},
  okButton:{alignSelf:'flex-end',marginRight:10,width:'20%',alignItems:'center',bottom:-20},
  okButtontext:{fontWeight:'bold',color:'#2980b9',fontSize:18}
});
