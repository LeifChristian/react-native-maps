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
  Actions,Platform
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import  ToastAndroid from 'react-native-simple-toast';
import { ActionSheet } from "native-base";

export default class location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: [],
      locationData: [],
      locationfullData: [],
      search_txt: '',
      user_id: "",
      network_id: "",
      address: "",
      details: "",
      phone: "",
      email: "",
      addto_desk: "",
      location_name: "",
      desk_status: 2,
      flagImage:false
      //comment_postID: "",
    };
  }
  
  componentDidMount(newProps) {
   // console.log('props',this.props)
    this.setState({
      location: this.props.locationdata.location
    });
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
  delete_location(delete_id,network_id) {


    var delete_id = delete_id;

    let url = loginUrl + "network/deleteLocation";
    let method = "POST";
    let body = JSON.stringify({
      _id: network_id,
      file_id: delete_id
    });

    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
        if (responseJson.status == "true") {
          this.Refresh()
          // AsyncStorage.setItem(
          //       "location_data",
          //       JSON.stringify(responseJson.data)
          //     );
          //     this.props.dispatch({
          //       type: "networkData",
          //       payLoad: responseJson.data
          //     });
          this.props.navigation.navigate("Location");
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
  delete_alert(delete_id,network_id) {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this location?.',
      [

        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.delete_location(delete_id,network_id)},
      ],
      { cancelable: false }
    )
  }
  componentDidMount() {
    this.setState({ flag: 1 });
    AsyncStorage.getItem("netwrok_details").then(value => {
      let temp = JSON.parse(value);
      let url = loginUrl + "network/networkDetail";
     // console.log('URLLLLLL===',url)
      let method = "POST";
      let body = JSON.stringify({ _id: temp.network_id });
      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
        //  console.log('network=============>',responseJson)
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

  edit_location(data) {

    //  this.props.navigation.navigate("addnetworklocation");

    this.props.navigation.navigate('editnetworklocation', {
      data: data,
      network_id: this.state.network_id,
      
    });
  }

  addDesk(id) {
    //this.setState({ flag: 2 });
    let url = loginUrl + "deskPost/saveLocationAsDesk";
    //console.log('DESKPOST URL',url)
    let method = "POST";
    let body = JSON.stringify({
      //post_id: post_id,
      network_id: this.state.network_id,
      location_id:id,
      user_id: this.state.user_id,
    });
   // console.log('BODY@@@@@@@@@@',body)
    dataLayer
      .postData(url, method, body)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ flag: 2 });
     // console.log('network location response',responseJson)
        if (responseJson.status == "true") {
          this.Refresh()
          var DataPost = this.state.post_Data;
          for (let i in DataPost) {
            if (DataPost[i]._id == id) {
              DataPost[i].saveAsDesk = true //new value
              break;
            }
          }
          this.setState({ post_Data: DataPost,flagImage:!this.state.flagImage });
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



  Refresh(){
    this.setState({ flag: 1 });
    AsyncStorage.getItem("netwrok_details").then(value => {
      let temp = JSON.parse(value);
      let url = loginUrl + "network/networkDetail";
      //console.log('URLLLLLL===',url)
      let method = "POST";
      let body = JSON.stringify({ _id: temp.network_id });
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

  

  // addtoDesk(){
  //   return(
  //     <View>
  //     {this.state.flagImage == false ? 
  //       <TouchableOpacity onPress={()=>this.addDesk(data._id)}>
  //         <Image
  //           style={styles.bigthumb}
  //           source={require("../assets/img/lampplus.png")}
  //         />
  //       </TouchableOpacity>
  //     :
  //       <Image
  //         style={styles.bigthumb}
  //         source={require("../assets/img/lampblue.png")}
  //       />
  //     }
  //     </View>
  //   )
  // }

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
    if (this.state.locationData) {
      var row1 = this.state.locationData.map((data, index) => {
      //  console.log('1234556======>',data)
      //  // let isDesk = data.saveAsDesk;
      //   console.log('ISDESKKSKSKS',isDesk)
      //   if (isDesk == "true") {
      //     var DeskStatus = "1";
      //   } else {
      //     var DeskStatus = "";
      //   }
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
                      style={{height:12,width:18}}
                      source={require("../assets/img/envealop.png")}
                    />
                    </View>
                    <Text style={styles.bold}>{data.email}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', width: 70, marginBottom: 10, }}>

                    <TouchableOpacity


                      onPress={() => this.delete_alert(data._id,this.state.network_id)}
                    >
                      <Image
                        style={styles.binicon}
                        source={require("../assets/img/bin.png")}
                      />

                    </TouchableOpacity>

                  <View>
                  {data.saveAsDesk == true ? 
                   <TouchableOpacity style={{ marginLeft: 5 }}>
                   <Image
                     style={[styles.bigthumb,{height:22,width:22}]}
                     source={require("../assets/img/lampblue.png")} />
                 </TouchableOpacity>
                 : 
                  <TouchableOpacity style={{ marginLeft: 5 }} onPress={()=>this.addDesk(data._id)}>
                  <Image
                    style={styles.bigthumb}
                    source={require("../assets/img/lampplus.png")} />
                </TouchableOpacity>
                  }

                  </View>
                    
                    <TouchableOpacity


                      onPress={() => this.edit_location(data)}
                    >
                      <Image
                        style={styles.editicon}
                        source={require("../assets/img/pencil.png")}
                      />

                    </TouchableOpacity>

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
            <Text style={styles.header_title}>{this.state.location.networkName} </Text>
            <Text style={styles.header_subtitle}> LOCATION </Text>
          </View>

          <TouchableOpacity
            style={styles.headerright}
            onPress={() => this.props.navigation.navigate("addnetworklocation",{type:'network'})}
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
        />:
            row1}
        </ScrollView>
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    locationdata: state.networksteps.fullnetworkdetails
  };
}
module.exports = connect(mapStateToProps)(location);
const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26
  },

  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },

  headercenter: { width: 295 },

  headerright: { width: 20 },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },
  header_subtitle: { color: "#FFF", fontSize: 13, textAlign: "center" },

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

  searchicon: { width: 20, height: 21, },

  col_container: {
    backgroundColor: "#fff", margin: 10, borderRadius: 3, flexDirection: "row"
  },

  smallmap: { width: 90, height: 95 },

  teletxt: { flexDirection: "row", marginTop: 8, marginBottom: 5 },

  col_3: { textAlign: "center", justifyContent: "center" },

  col_6: { width: 180, marginLeft: 10, marginRight: 10 },

  cityname: { fontSize: 14, marginTop: 5, marginBottom: 5 },

  input: { marginLeft: 15, width:'80%' },

  navigaticon: { width: 25, height: 25, marginLeft: 8, marginBottom: 8 },

  bold: { fontWeight: "bold", fontSize: 12 },

  teleicon: { width: 15, height: 15, marginRight: 5 },

  smalltxt: { fontSize: 10, color: "#C0C0C0" },

  bluesmall: { fontSize: 8, color: "#2980b9" },

  addresswizard: { backgroundColor: "#fff", margin: 10, borderRadius: 3 },

  addwizardBottom: { flexDirection: "row", padding: 10 },

  citydetail: { width: '50%' },

  contactdetail: { marginTop: 10 ,width:'50%'},

  contactinfo: { flexDirection: "row", marginBottom: 10, width:'90%'},

  locationmap: { height: 100, width: '100%', borderRadius: 3 },

  editicon: { width: 20, height: 20, marginRight: 10 },
  bigthumb: { width: 23, height: 20, marginRight: 10 },
  binicon: { width: 16, height: 23, marginRight: 10 },

  footer: { height: 70, color: "#333", padding: 10, flexDirection: "row" },

  footcol: { width: 70, textAlign: "right", alignItems: "center", justifyContent: "center" },

  footicon: { width: 35, height: 32 },

  footcol_caption: { color: "#fff", fontSize: 10, marginTop: 5 }

});
