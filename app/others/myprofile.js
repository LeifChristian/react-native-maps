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
  ScrollView
} from "react-native";

export default class myprofile extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerleft} onPress={() => this.props.navigation.navigate("DrawerOpen")}>
            <Image style={styles.baricon} source={require("../assets/img/bar_icon.png")} />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}> Profile </Text>
            <Text style={styles.header_subtitle}> Under Developement </Text>
          </View>

          <View style={styles.headerright}>
            <Image
              style={styles.baricon}
              source={require("../assets/img/circal_plus.png")}
            />
          </View>
        </View>
      </View>
    );
  }
}


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
