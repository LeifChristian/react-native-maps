import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,AsyncStorage,Platform,
  PermissionsAndroid
} from "react-native";
import { Button } from "native-base";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl } from "../utility/constants";
export default class Networkmedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_name: "",
      network_id: "",
      flag: 0,
      hasPermission: undefined,
      
    };
    this.getMedia.bind();
    //console.log('PATH',this.props.type)
  }
  componentDidMount() {
    this._checkPermission().then((hasPermission)=>{
      this.setState({ hasPermission });
      // if (!hasPermission) return;
    })
    this.setState({
      network_name: this.props.Detailsnetwork.networkName,
      network_id: this.props.Detailsnetwork._id
    });
    console.log('>>>>>>>>>>>>>>>>PROPS>>>>>>>>>',this.props.Detailsnetwork.networkName)
   // console.log('>>>>>>>>>>>>>>>>PROPS>>>>>>>>>',this.props.Detailsnetwork._id)
//console.log('---------------STATE---------',this.state.network_id)
  }
  getMedia(mediaType) {
    if (mediaType == 1) {
      this.props.navigation.navigate("ImageMedia",{type:this.props.type,media:'1'});
    } else if (mediaType == 2) {
      this.props.navigation.navigate("Videomedia",{type:this.props.type,media:'2'});
    } else if (mediaType == 3) {
      this.props.navigation.navigate("Documentmedia",{type:this.props.type,media:'3'});
    } else if (mediaType == 4) {
      this.props.navigation.navigate("MusicMedia",{type:this.props.type,media:'4'});
    }
  }
   onBack() {
     AsyncStorage.setItem(
      "mediaType",
      JSON.stringify({
        mediaType: ''
      })
    );
    this.props.navigation.navigate("Media");
  }
  AddmediaView(mediaType) {
   AsyncStorage.setItem(
      "mediaType",
      JSON.stringify({
        mediaType: mediaType
      })
    );
   
    this.props.navigation.navigate("AddMedia",{type:this.props.type});
  }

  _checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }
    // const rationale = {
    //   'title': 'Storage Permission',
    //   'message': 'Media files needs access to your storage so you can store those medias.'
    // };
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      .then((result) => {
        console.log('Permission result:', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            transparent
            style={styles.headerleft}
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          {this.props.type!='DeskMedia'?
          <View style={styles.headercenter}>
            <Text style={styles.header_title}>{this.props.Detailsnetwork.networkName}</Text>
            <Text style={styles.header_subtitle}> MEDIA </Text>
          </View>
          :
          <View style={styles.headercenter}>
          <Text style={styles.header_title}>MEDIA</Text>
        </View>
          }
          <TouchableOpacity
            style={styles.headerright}
            onPress={() => this.AddmediaView("5")}
          >
            <Image
              style={styles.baricon}
              source={require("../assets/img/circal_plus.png")}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollcontainer}>
          <View style={styles.mediagallerywrapper}>
            <View style={styles.galleryrow}>
              <TouchableOpacity
                style={styles.docs}
                onPress={this.getMedia.bind(this, 3)}>

                <Image
                  style={styles.galicon}
                  source={require("../assets/img/docs_icon.png")}
                />
                <Text style={styles.centertxt}>DOCS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.getMedia.bind(this, 1)}
                style={styles.photos}
              >
                <Image
                  style={styles.galicon}
                  source={require("../assets/img/photosicon.png")}
                />
                <Text style={styles.centertxt}>PHOTOS</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.galleryrow}>
              <TouchableOpacity
                style={styles.videos}
                onPress={this.getMedia.bind(this, 2)}
              >
                <Image
                  style={styles.galicon}
                  source={require("../assets/img/videosicon.png")}
                />
                <Text style={styles.centertxt}>VIDEOS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.music}
                onPress={this.getMedia.bind(this, 4)}
              >
                <Image
                  style={styles.galicon}
                  source={require("../assets/img/musicicon.png")}
                />
                <Text style={styles.centertxt}>MUSIC</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.Filemanagewrap}>
            <Text style={styles.heading}> FILE MANAGER</Text>
            <View style={styles.listrow}>
              <View style={styles.folder}>
                <Image
                  style={styles.baricon}
                  source={require("../assets/img/folder.png")}
                />
                <Text style={styles.foldername}> Screenshots</Text>
              </View>
              <View style={styles.postedby}>
                <Text style={styles.smalltxt}> POSTED BY ME</Text>
              </View>
            </View>
            <View style={styles.listrow}>
              <View style={styles.folder}>
                <Image
                  style={styles.baricon}
                  source={require("../assets/img/folder.png")}
                />
                <Text style={styles.foldername}> Android</Text>
              </View>
              <View style={styles.postedby}>
                <Text style={styles.smalltxt}> POSTED BY ME</Text>
              </View>
            </View>
            <View style={styles.listrow}>
              <View style={styles.folder}>
                <Image
                  style={styles.baricon}
                  source={require("../assets/img/folder.png")}
                />
                <Text style={styles.foldername}> DCIM</Text>
              </View>
              <View style={styles.postedby}>
                <Text style={styles.smalltxt}> POSTED BY ME</Text>
              </View>
            </View>
            <View style={styles.listrow}>
              <View style={styles.folder}>
                <Image
                  style={styles.baricon}
                  source={require("../assets/img/folder.png")}
                />
                <Text style={styles.foldername}> Download</Text>
              </View>
              <View style={styles.postedby}>
                <Text style={styles.smalltxt}> POSTED BY ME</Text>
              </View>
            </View>
            <View style={styles.listrow}>
              <View style={styles.folder}>
                <Image
                  style={styles.baricon}
                  source={require("../assets/img/folder.png")}
                />
                <Text style={styles.foldername}> Documents</Text>
              </View>
              <View style={styles.postedby}>
                <Text style={styles.smalltxt}> POSTED BY ME</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    Detailsnetwork: state.networksteps.fullnetworkdetails
  };
}
module.exports = connect(mapStateToProps)(Networkmedia);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

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

  header_subtitle: { color: "#FFF", fontSize: 13, textAlign: "center" },

  mediagallerywrapper: { backgroundColor: "#fff", borderRadius: 5, margin: 10 },

  galleryrow: { flexDirection: "row" },

  docs: {
    width: 170,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cde2ef",
    borderBottomWidth: 1,
    borderRightWidth: 1
  },
  photos: {
    width: 170,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cde2ef",
    borderBottomWidth: 1
  },
  videos: {
    width: 170,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cde2ef",
    borderRightWidth: 1
  },
  music: {
    width: 170,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cde2ef"
  },

  galicon: { alignItems: "center" },

  centertxt: { fontSize: 16, color: "#2980b9", marginTop: 10 },

  Filemanagewrap: {
    backgroundColor: "#fff",
    borderRadius: 5,
    margin: 10,
    padding: 15
  },

  heading: {
    fontSize: 18,
    color: "#828282",
    fontWeight: "700",
    marginBottom: 30
  },

  listrow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },

  folder: { flexDirection: "row", width: 200 },

  foldername: { fontSize: 16, paddingTop: 5, marginLeft: 8 },

  smalltxt: { fontSize: 10, color: "#C0C0C0" },

  bold: { fontWeight: "bold", fontSize: 12 },

  footer: { height: 70, color: "#333", padding: 10, flexDirection: "row" },

  footcol: {
    width: 70,
    textAlign: "right",
    alignItems: "center",
    justifyContent: "center"
  },

  footicon: { width: 35, height: 32 },

  footcol_caption: { color: "#fff", fontSize: 10, marginTop: 5 }
});
