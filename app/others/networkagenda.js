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
  ToastAndroid,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import {Agenda} from 'react-native-calendars';
export default class networkagenda extends Component {
  constructor(props) {
    super(props);
     this.state = {
      items: {}
    };
  }
  onDayPress(day) { 
    this.setState({
      selected: day.dateString
    });
  }
 
 renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
    );
  }
   renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }
   rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }
   timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
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
            <Text style={styles.header_title}>
            
            </Text>
          </View>

        </View>
        <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2017-05-16'}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    Detailsnetwork: state.network_details
  };
}
module.exports = connect(mapStateToProps)(networkagenda);
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

  scrollcontainer: {},

  item_outer: { backgroundColor: "#fff", margin: 10, borderRadius: 3 },

  row: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5
  },

  roundedthumbnil: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#ff9900",
    textAlign: "center"
  },

  thumb: { width: 40, height: 40, borderRadius: 6 },

  input: { marginLeft: 15, width: 270 },

  leftside: { flexDirection: "row" },

  rightside: {},

  colxs: { flexDirection: "row", margin: 4 },

  postbtn: { flexDirection: "row", marginLeft: 8 },

  lineicon: { width: 20, height: 15, marginRight: 5 },

  lineiconsmall: { width: 16, height: 17 },

  posticon: { width: 15, height: 14, marginRight: 3, marginTop: 3 },

  bluetxt: { fontWeight: "bold", color: "#2980b9" },

  bold: { fontWeight: "bold", fontSize: 12 },

  separators: {
    width: 180,
    height: 1,
    backgroundColor: "#acacac",
    marginTop: 15,
    marginBottom: 15
  },

  itemtop: { flexDirection: "row", padding: 10 },

  itemtopLeft: { flexDirection: "row", width: 250 },

  feederbox: { marginLeft: 10 },

  name: { fontSize: 18, fontWeight: "bold" },

  feedlocatoin: { flexDirection: "row" },

  smallthumb: { width: 9, height: 12, marginRight: 5, marginTop: 3 },

  smalltxt: { fontSize: 11, color: "#C0C0C0" },

  itemtopRight: { flexDirection: "row" },

  bigthumb: { width: 25, height: 22, margin: 5 },

  fullImage: { height: 290 },

  itemfooter: { flexDirection: "row", padding: 10, marginTop: 12 },

  footerleft: { flexDirection: "row", width: 200 },

  footerright: { flexDirection: "row" },

  count: { flexDirection: "row", padding: 5 },

  hearicon: { width: 20, height: 18 },

  cheaticon: { width: 20, height: 18 },

  footer: { height: 70, color: "#333", padding: 10, flexDirection: "row" },

  footcol: {
    width: 70,
    textAlign: "right",
    alignItems: "center",
    justifyContent: "center"
  },

  footicon: { width: 35, height: 32 },

  footcol_caption: { color: "#fff", fontSize: 10, marginTop: 5 },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
  }
});
