/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    Platform,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    AsyncStorage,
    ActivityIndicator,
    NetInfo,
    BackHandler
} from "react-native";
var SharedPreferences = require("react-native-shared-preferences");
import  ToastAndroid from 'react-native-simple-toast';
const FBSDK = require("react-native-fbsdk");
const { LoginButton, LoginManager, AccessToken } = FBSDK;
import ModalDropdown from 'react-native-modal-dropdown';
import { Dropdown } from 'react-native-material-dropdown';
//import { connect } from "react-redux"
import { Button, Picker, Item, } from "native-base";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, parseUrl } from "../utility/constants";
import { connect } from "react-redux";
import * as _ from "lodash";
import newnetworkStepFirst from "./newnetworkstepfirst";

// import { Select, Option } from 'react-native-select-list';
export default class Resetpassword extends Component {
    constructor(props) {
        super(props);
        this.state = { valid: false, Phone_number: "", country: [], user_pass: "", conf_pass: "", flag: 0, loader: true, country_data: [], country_code: '',user_id:this.props.navigation.state.params.user_id };
    }
    componentWillMount() {
    }

    parseLogin(userId) {
        let url1 = parseUrl + "login?username=" + userId + "&password=123456";
        dataLayer
            .getParseData(url1, "get")
            .then(response => response.json())
            .then(responseJson => {
                AsyncStorage.setItem("ParseUser", JSON.stringify(responseJson));
            })
            .catch(error => {
                // console.log('parse parselogin Error =>',error)
                ToastAndroid.showWithGravity(
                    "Error in connect to parse server parselogin",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
            });
    }
   

    onlogin() {
        if (this.state.user_pass == "") {
            ToastAndroid.showWithGravity(
                "Please Enter Valid Password",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        } else
         {
            this.setState({ flag: 1 });
            let url = loginUrl + "user/resetForgotPassword";
            let method = "POST";
            let body = JSON.stringify({
                password: this.state.user_pass,
                user_id:this.props.navigation.state.params.user_id
            });
            console.log('body of password====', body)
            dataLayer
                .postData(url, method, body)
                .then(response => response.json())
                .then(responseJson => {
                    console.log('response of forget password=====', responseJson)
                    this.setState({ flag: 2 });
                    if (responseJson.status == "true") {
                        if (this.state.conf_pass != null || this.state.conf_pass != "" || this.state.conf_pass != undefined) {
                            if (this.state.user_pass == this.state.conf_pass) {
                                this.props.navigation.navigate("Login");

                                ToastAndroid.showWithGravity(
                                    responseJson.message,
                                    ToastAndroid.SHORT,
                                    ToastAndroid.BOTTOM
                                );
                            } else {
                                {this.setState({valid:true})}
                            }
                        }
                    }
                })
                .catch(error => {
                    this.setState({ flag: 2 });
                });
        }
    }
    // valids(){
    //     this.setState({valid:false})
    // }

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
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollcontainer}>
                    <View style={styles.logocontainer}>
                        <Image
                            style={styles.logo}
                            source={require("../assets/img/pocket.png")}
                        />

                        <Text style={styles.apptitle}>
                            Pocket <Text style={{ color: "#2980b9" }}>Desk</Text>
                        </Text>

                        <Text style={styles.apppunchline}>
                            Reset your Password
            </Text>
                    </View>
                    <View style={styles.formcontainer}>
                        <Text style={styles.numtxt}> PASSWORD </Text>
                        <View style={styles.inputgroup}>
                            <TextInput
                                style={styles.inputph}
                                secureTextEntry={true}
                                onChangeText={text => this.setState({ user_pass: text })}
                                onFocus={()=>this.setState({valid:false})}
                            />
                        </View>

                        <Text style={styles.numtxt}> CONFIRM PASSWORD </Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ conf_pass: text })}
                            onFocus={()=>this.setState({valid:false})}
                            />
                           
                           {this.state.valid ? <Text style={{color:'red'}}>Password does not match</Text> : null}
                          
                           
                        <View style={styles.btnrow}>
                            <TouchableOpacity
                                style={styles.buttoncontainerblk}
                                onPress={() => this.onlogin()}>
                                <Text style={styles.btntext}>Save</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        id: state.user.id,
    };
}
module.exports = connect(mapStateToProps)(Resetpassword);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 10,
        borderColor: "#2980b9",
        backgroundColor: "#fff"
    },

    logocontainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },

    logo: {
        width: 60,
        height: 60
    },

    apptitle: {
        color: "#333333",
        textAlign: 'center',
        fontSize: 35,
    },

    apppunchline: {
        width: 200,
        textAlign: 'center',
        marginTop: 15,
        fontSize: 18
    },

    formcontainer: {
        paddingTop: 100,
        paddingLeft: 15,
        paddingRight: 15,

    },

    numtxt: { color: '#acacac' ,marginTop:15},

    inputph: { borderColor: '#2980b9', width: '80%', height: 40, marginTop: 5,borderBottomWidth:Platform.OS=='ios'?1:0 },

    input: { borderColor: '#2980b9', width: '80%', height: 40, marginTop: 5,borderBottomWidth:Platform.OS=='ios'?1:0 },

    btnrow: { flexDirection: 'row', marginTop: 50, alignItems: 'center', justifyContent: 'center', },

    buttoncontainer: {
        backgroundColor: '#4267B2',
        padding: 10,
        width: '60%',
        height: 50,
        borderRadius: 5,
        marginRight: 10,
        marginLeft: 10
    },

    buttoncontainerblk: {
        backgroundColor: '#4267B2',
        padding: 10,
        width: '35%',
        height: 50,
        borderRadius: 5,
        marginBottom: 30
    },

    btntext: {
        textAlign: 'center',
        color: '#fff',
        paddingTop: 5,
        fontSize: 16,
        alignItems: 'flex-end'
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },

    codeselect: { width: 300, marginTop: 25, height: 30, borderBottomWidth: 1, borderColor: '#888' },

    fullwidth: { width: 250, backgroundColor: '#ff9900', },

    inputgroup: { flexDirection: 'row', },

    countrycode: { width: '30%', marginTop: -55, }
});
