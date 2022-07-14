import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView, AsyncStorage
} from "react-native";
import { Button } from "native-base";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import Video from "react-native-af-video-player"
import Sample from '../../../img/desk_assets/video.mp4'


export default class Videopage extends Component {
    constructor(props) {
        super(props)
    }
    onBack() {
        AsyncStorage.setItem(
            "mediaType",
            JSON.stringify({
                mediaType: ''
            })
        );
        this.props.navigation.navigate("Videomedia",{type:this.props.navigation.state.params.type});
    }
    render() {
        const { navigation } = this.props
        const url = navigation.getParam('url')
      //  console.log('==========', url)
        return (
            // <View style={styles.container}>
            //     <View style={styles.headerleft}>
            //       <TouchableOpacity
            //         transparent
            //         style={styles.headerleft}
            //         onPress={() => this.onBack()}>
            //         <Image
            //           style={styles.backicon}
            //           source={require("../assets/img/close.png")}/>
            //       </TouchableOpacity>

            //       </View>
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <View style={{ width: 20,paddingLeft:5 }}>
                    <TouchableOpacity
                        transparent
                        style={{ width: 30,paddingLeft:5}}
                        onPress={() => this.onBack()}>
                        <Image
                            style={{ width: 20, height: 20,marginTop:15, tintColor: 'white' }}
                            source={require("../assets/img/close.png")} />
                    </TouchableOpacity>
                </View>
                <View style={styles.videoview}>
                    <Video url={url} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        backgroundColor: 'black',
        paddingTop: 0,
    },
    header: {
        height: 55,
        color: "#333",
        padding: 10,
        flexDirection: "row"
    },
    headerleft: {
        width: 20
    },
    backicon: {
        width: 15,
        height: 25,
        marginTop: 5,
        tintColor: 'white'
    },
    headercenter: {
        width: 295
    },
    header_title: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700"
    },
    videoview: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
        //top: '20%',
        //alignItems:'center',
        //paddingTop: 50,
    }
})