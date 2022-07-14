/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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

//import styles from "../assets/img/styles";

export default class notes extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerleft} onPress={() => this.props.navigation.navigate('Home')}>
            <Image
              style={styles.backicon}
              source={require("../assets/img/backarrow.png")}
            />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}> IBM NETWORK </Text>
            <Text style={styles.header_subtitle}> NOTES </Text>
          </View>

          <View style={styles.headerright}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("add_notes")}
            >
              <Image
                style={styles.baricon}
                source={require("../assets/img/circal_plus.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchbar}>
          <TextInput placeholder="SEARCH" style={styles.input} />
          <Image
            style={styles.searchicon}
            source={require("../assets/img/searchicon.png")}
          />
        </View>
        <ScrollView>
          <View style={styles.gridwrapper}>
            <View style={styles.columnbox}>
              <Text style={styles.title}> Buy wedding supplies </Text>
              <View style={styles.timebar}>
                <Image style={styles.icon} source={require("../assets/img/watch.png")} />
                <Text style={styles.graytxt}> DUE </Text>
                <Text style={styles.date}> 14 July 2017 </Text>
              </View>
              <View style={styles.colfooter}>
                <Text style={styles.assign}>ASSIGNED TO</Text>
                <Image
                  style={styles.smalllthumb}
                  source={require("../assets/img/user_thumbnil_01.jpg")}
                />
                <Image
                  style={styles.smalllthumb}
                  source={require("../assets/img/user_thumbnil_01.jpg")}
                />
                <Image
                  style={styles.smalllthumb}
                  source={require("../assets/img/user_thumbnil_01.jpg")}
                />
              </View>
            </View>
            <View style={styles.columnbox}>
              <Text style={styles.title}> Meeting #5 </Text>
              <View style={styles.timebar}>
                <Image style={styles.icon} source={require("../assets/img/watch.png")} />
                <Text style={styles.graytxt}> DUE </Text>
                <Text style={styles.date}> 18 July 2017 </Text>
              </View>
              <Text style={styles.bxtxt}>
                {" "}Lorem Ipsum dolor sit amet, consectetur adipiscing elit.sed
                do eiusmod tempor incididunt ut labore{" "}
              </Text>
              <View style={styles.colfooter}>
                <Text style={styles.assign}>ASSIGNED TO</Text>
                <Image
                  style={styles.smalllthumb}
                  source={require("../assets/img/user_thumbnil_01.jpg")}
                />
              </View>
            </View>
            <View style={styles.columnbox}>
              <Text style={styles.title}> Meeting #5 </Text>
              <View style={styles.timebar}>
                <Image style={styles.icon} source={require("../assets/img/watch.png")} />
                <Text style={styles.graytxt}> DUE </Text>
                <Text style={styles.date}> 18 July 2017 </Text>
              </View>
              <Text style={styles.bxtxt}>
                {" "}Lorem Ipsum dolor sit amet, consectetur adipiscing elit.sed
                do eiusmod tempor incididunt ut labore{" "}
              </Text>
              <View style={styles.colfooter}>
                <Text style={styles.assign}>ASSIGNED TO</Text>
                <Image
                  style={styles.smalllthumb}
                  source={require("../assets/img/user_thumbnil_01.jpg")}
                />
              </View>
            </View>
            <View style={styles.columnbox}>
              <Text style={styles.title}> Meeting #5 </Text>
              <View style={styles.timebar}>
                <Image style={styles.icon} source={require("../assets/img/watch.png")} />
                <Text style={styles.graytxt}> DUE </Text>
                <Text style={styles.date}> 18 July 2017 </Text>
              </View>
              <Text style={styles.bxtxt}>
                {" "}Lorem Ipsum dolor sit amet, consectetur adipiscing elit.sed
                do eiusmod tempor incididunt ut labore{" "}
              </Text>
              <View style={styles.colfooter}>
                <Text style={styles.assign}>ASSIGNED TO</Text>
                <Image
                  style={styles.smalllthumb}
                  source={require("../assets/img/user_thumbnil_01.jpg")}
                />
              </View>
            </View>
            <View style={styles.columnbox}>
              <Text style={styles.title}> Meeting #5 </Text>
              <View style={styles.timebar}>
                <Image style={styles.icon} source={require("../assets/img/watch.png")} />
                <Text style={styles.graytxt}> DUE </Text>
                <Text style={styles.date}> 18 July 2017 </Text>
              </View>
              <Text style={styles.bxtxt}>
                {" "}Lorem Ipsum dolor sit amet, consectetur adipiscing elit.sed
                do eiusmod tempor incididunt ut labore{" "}
              </Text>
              <View style={styles.colfooter}>
                <Text style={styles.assign}>ASSIGNED TO</Text>
                <Image
                  style={styles.smalllthumb}
                  source={require("../assets/img/user_thumbnil_01.jpg")}
                />
              </View>
            </View>
            <View style={styles.columnbox}>
              <Text style={styles.title}> Meeting #5 </Text>
              <View style={styles.timebar}>
                <Image style={styles.icon} source={require("../assets/img/watch.png")} />
                <Text style={styles.graytxt}> DUE </Text>
                <Text style={styles.date}> 18 July 2017 </Text>
              </View>
              <Text style={styles.bxtxt}>
                {" "}Lorem Ipsum dolor sit amet, consectetur adipiscing elit.sed
                do eiusmod tempor incididunt ut labore{" "}
              </Text>
              <View style={styles.colfooter}>
                <Text style={styles.assign}>ASSIGNED TO</Text>
                <Image
                  style={styles.smalllthumb}
                  source={require("../assets/img/user_thumbnil_01.jpg")}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },

  headercenter: { width: 295 },

  headerright: { width: 20, justifyContent: "center" },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  header_subtitle: { color: "#FFF", fontSize: 13, textAlign: "center" },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },

  searchbar: {
    backgroundColor: "#fff",
    marginTop: 15,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 3,
    flexDirection: "row",
    marginBottom: 15
  },

  searchicon: { width: 20, height: 20, marginTop: 14 },

  input: { marginLeft: 15, width: 290 },

  gridwrapper: { flexDirection: "row", flexWrap: "wrap" },

  columnbox: { backgroundColor: "#fff", padding: 10, width: 170, margin: 5 },

  title: { fontWeight: "700", fontSize: 16 },

  icon: { width: 15, height: 15 },

  timebar: { flexDirection: "row", marginTop: 10, marginBottom: 10 },

  graytxt: { color: "#ccc", fontSize: 12 },

  bxtxt: { color: "#828282", fontSize: 12 },

  date: { fontSize: 12, color: "#2980b9" },

  colfooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#c0c0c6",
    paddingTop: 8
  },

  assign: {
    fontSize: 8,
    fontWeight: "700",
    color: "#a8a8a8",
    marginRight: 8,
    paddingTop: 3
  },

  smalllthumb: { width: 20, height: 20, borderRadius: 30, marginRight: 3 },

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
