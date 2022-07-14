import React, { Component } from 'react';
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
  ActivityIndicator,
  NetInfo,
  Picker
  
} from 'react-native';

import { Footer, FooterTab } from 'native-base';
import { connect } from 'react-redux';
import * as dataLayer from '../utility/dataLayer';
import { loginUrl, network_img } from '../utility/constants';
import  ToastAndroid from 'react-native-simple-toast';
// import { Select, Option } from 'react-native-select-list';
export default class newtask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: '',
      user_email: '',
      user_pass: '',
      userdetails: [],
      flag: 0,
      loader: true
    };
  }
  componentWillMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected == false) {
        ToastAndroid.showWithGravity(
          'No Internet Connection avalible',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      } else {
        AsyncStorage.getItem('user_data').then(value => {
          let temp = JSON.parse(value);
          let user_id = temp._id;
          let url = loginUrl + 'user/getuserprofile';
          let method = 'POST';
          let body = JSON.stringify({ user_id: user_id });
          dataLayer
            .postData(url, method, body)
            .then(response => response.json())
            .then(responseJson => {
             // console.log(responseJson.data);
              if (responseJson.status == 'true') {
                this.setState({
                  user_name: responseJson.data.user_name,
                  user_email: responseJson.data.user_email,
                  user_id: responseJson.data._id,
                  user_pass: responseJson.data.user_password
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
              //console.error(error);
            });
        });
      }
    });
  }
  savesetting() {
    if (this.state.user_name == '') {
      ToastAndroid.showWithGravity(
        'Please Enter Name',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else if (this.state.user_email == '') {
      ToastAndroid.showWithGravity(
        'Please Enter Valid Email',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected == false) {
          ToastAndroid.showWithGravity(
            'No Internet Connection avalible',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          this.setState({ flag: 1 });
          let url = loginUrl + 'user/userUpdateProfile';
          let method = 'POST';
          let body = JSON.stringify({
            user_id: this.state.user_id,
            user_email: this.state.user_email,
            user_name: this.state.user_name,
            user_password: this.state.user_pass
          });
          dataLayer
            .postData(url, method, body)
            .then(response => response.json())
            .then(responseJson => {
              this.setState({ flag: 2 });
              if (responseJson.status == 'true') {
                // this.props.dispatch({
                //   type: 'Set_user',
                //   payLoad: responseJson.data
                // });
                AsyncStorage.setItem(
                  'user_data',
                  JSON.stringify(responseJson.data)
                );
                ToastAndroid.showWithGravity(
                  responseJson.message,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
                //this.props.navigation.navigate('Home');
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
              ToastAndroid.showWithGravity(
                'Error in connect to server',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            });
        }
      });
    }
  }
  render() {
    if (this.state.flag == 1) {
      return (
        <ActivityIndicator
          style={styles.indicator}
          animating={this.state.loader}
          size='large'
        />
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        <ScrollView>
          <View style={styles.taskwrapper}>
            <TouchableOpacity
              style={styles.pagetitlebar}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={styles.closeicon}
                source={require('../assets/img/close.png')}
              />
              <Text style={styles.pagetitle}> New Task </Text>
            </TouchableOpacity>
            <View style={styles.formbody}>
              <View style={styles.bodyinner}>
               
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Title </Text>
                  <TextInput
                    style={styles.inputcontrol}
                    value={this.state.user_name}
                    onChangeText={text => this.setState({ user_name: text })}
                  />
                </View>
                <View style={styles.formfieldcontainer}>
                  <Text style={styles.lableControl}> Detail </Text>
                  <TextInput
                    style={styles.inputcontrol}
                    value={this.state.user_email}
                    onChangeText={text => this.setState({ user_email: text })}
                  />
                </View>
              </View>
              <View style={styles.bodyinner}>
               <View style={styles.formfieldcontainer}>
                <Text style={styles.lableControl}> Assign To </Text> 
                <TextInput style={styles.searchcontrol}> </TextInput>
                <Image
                style={styles.assi_avatar}
                source={require('../assets/img/user_small_thumbnil_04.jpg')}
              />
              <Image
                style={styles.assi_avatar}
                source={require('../assets/img/user_small_thumbnil_04.jpg')}
              />

              </View>
               
              </View>
            </View>
            <View style={styles.duewrapper}>

              <View style={styles.duebox}> 
                 <Text style={styles.boxtitle}> Due Time </Text>
                 <View style={styles.skin}> 
                     <Picker style={styles.pikstyle}
                        selectedValue={this.state.language}
                        onValueChange={(itemValue, itemIndex) => this.setState({Time: itemValue})}>
                        <Picker.Item label="10.00" value="10.00" />
                        <Picker.Item label="11.00" value="11.00" />
                    </Picker>
                   </View> 
                   <View style={styles.skin}> 
                     <Picker style={styles.pikstyle}
                        selectedValue={this.state.language}
                        onValueChange={(itemValue, itemIndex) => this.setState({Time1: itemValue})}>
                        <Picker.Item label="AM" value="AM" />
                        <Picker.Item label="PM" value="PM" />
                    </Picker>
                   </View>  
            
                  
              </View>
              <View style={styles.duebox}> 
                 <Text style={styles.boxtitle}> Due Date </Text>
                 
                   <View style={styles.skin_col}>
                        <View style={styles.skin_half}> 
                     <Picker style={styles.pikstyle}
                        selectedValue={this.state.language}
                        onValueChange={(itemValue, itemIndex) => this.setState({Day: itemValue})}>
                        <Picker.Item label="Mon" value="Mon" />
                        <Picker.Item label="Tue" value="Tue" />
                    </Picker>
                   </View>
                    <View style={styles.skin_half}> 
                     <Picker style={styles.pikstyle}
                        selectedValue={this.state.language}
                        onValueChange={(itemValue, itemIndex) => this.setState({Month: itemValue})}>
                        <Picker.Item label="Jan" value="Jan" />
                        <Picker.Item label="Feb" value="Feb" />
                    </Picker>
                   </View>
                    </View>
                    <View style={styles.skin}> 
                     <Picker style={styles.pikstyle}
                        selectedValue={this.state.language}
                        onValueChange={(itemValue, itemIndex) => this.setState({Year: itemValue})}>
                        <Picker.Item label="2017" value="2017" />
                        <Picker.Item label="2016" value="2016" />
                    </Picker>
                   </View>
              </View>

              
              
            </View>
            <View style={styles.bodyinner}>

              
              <TouchableOpacity style={styles.btnwrapper}>
                <Text style={styles.savebtn} onPress={() => this.savesetting()}>
                  {' '}
                  Save{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2980b9', paddingTop: 0 },

  header: { height:55, color:'#333', padding:10, flexDirection:'row' },

  taskwrapper: {backgroundColor:'#fff', borderRadius:5, margin:10 },

  pagetitlebar: {justifyContent:'center', alignItems:'center' },

  closeicon: {width:15,height:15,position:'absolute',right:15,top:10,},

  pagetitle: {fontSize: 20, fontWeight: '700', marginTop: 30 },

  formfieldcontainer: {borderBottomWidth:2 },

  lableControl: {width:80 },

  inputcontrol: {width:230, height:45 },

  searchcontrol: {width:150, height:40,},

  formfieldcontainer: {flexDirection:'row' },

  checkicon: {width:20, height:20, marginRight:5 },

  bodyinner: {paddingTop:15,paddingLeft:20,paddingRight:20,
    paddingBottom:15,},

 btnwrapper: {alignItems: "center", justifyContent:'center'  
  },

  savebtn: { color: "#ffffff", padding: 10, fontSize: 18, 
  backgroundColor: "#2980b9",borderRadius: 5, width:100,
  justifyContent:'center', textAlign: 'center',
  },

  assi_avatar:{width:28, height:28, borderRadius:30, marginRight:5,},



  indicator: {flex:1,alignItems:'center',justifyContent:'center',
  height:80,},

  

  duewrapper:{paddingTop:15,paddingLeft:20,paddingRight:20,
    paddingBottom:15,flexDirection:'row'},

  duebox:{ width:150,justifyContent:'center',alignItems:'center',},

  boxtitle:{ fontSize:18, width:100,},

skin:{ borderWidth:1, backgroundColor:'#fff',  borderColor:'#dbdbdb', 
width:140, borderRadius:3, marginTop:10,},

pikstyle:{ height:30, fontSize:9, },

skin_half:{ width:75, marginTop:10, borderColor:'#dbdbdb',borderWidth:1,
 borderRadius:3},

skin_col:{ flexDirection:'row'},

 
});
