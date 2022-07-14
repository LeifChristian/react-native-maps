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
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import * as dataLayer from "../utility/dataLayer";
import { loginUrl, network_img } from "../utility/constants";
import moment from "moment";
import  ToastAndroid from 'react-native-simple-toast';
export default class task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network_name: "",
      network_id: "",
      taskData: [],
      userID: "",
      flag: 0,
      search_txt: "",
      taskfullData: []
    };
 
  }
  componentWillMount() {
    this.setState({
      network_name: this.props.Detailsnetwork.networkName,
      network_id: this.props.Detailsnetwork._id
    });
    this.setState({ flag: 1 });
    AsyncStorage.getItem("user_data").then(value => {
      let temp = JSON.parse(value);

      let url = loginUrl + "task/getTask";
      let method = "POST";
      let body = JSON.stringify({
        _id: temp._id
      });

      dataLayer
        .postData(url, method, body)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ flag: 2 });
          if (responseJson.status == "true") {
            this.setState({
              taskData: responseJson.data,
              taskfullData: responseJson.data
            });
            this.props.dispatch({
              type: "clearAssignTaskUser",
              payLoad: responseJson.data
            });
            this.props.dispatch({
              type: "remove_task_title",
              payLoad: responseJson.data
            });
            this.props.dispatch({
              type: "remove_task_description",
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
  taskDetails(task_id) {
    AsyncStorage.setItem(
      "task_id",
      JSON.stringify({
        task_id: task_id
      })
    );
    this.props.navigation.navigate("TasksDetails");
  }
  searchFilter() {
    let text = this.state.search_txt;
  let fullList = this.state.taskData;
    let filteredList = fullList.filter(item => {
     if (item.task_title.toLowerCase().match(text)) return item;
    });

    if (!text || text === "") {
      this.setState({
        taskData: fullList
      });
    } else if (Array.isArray(filteredList)) {
      this.setState({
        taskData: filteredList
      });
    }
  }
  checktext(text) {
      
    if (text == "") {
      var Data = this.state.taskfullData;
      this.setState({
        taskData: Data,search_txt:text
      });
    }else{
     
     let fullList = this.state.taskfullData;
    let filteredList = fullList.filter(item => {
      if (item.task_title.toLowerCase().match(text)) return item;
    });
       if (!text || text === "") {
      this.setState({
        taskData: fullList,search_txt:text
      });
    } else if (Array.isArray(filteredList)) {
      this.setState({
        taskData: filteredList,search_txt:text
      });
    }
    }
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
    var DataTask = this.state.taskData;

    if (DataTask) {
      var row2 = DataTask.map((data12, index1) => {
        var netID = data12.task_networkId;
        //  console.log(this.state.network_id+"  "+netID);
        if (this.state.network_id == netID) {
          if (data12.user != undefined) {
           let user = data12.user;
        if (user) {
          var row3 = user.map((data321, index123) => {
           
            if(data321.image!= undefined)
              {
                var commentimg = network_img + data321.image;
              }else{
                 var commentimg = network_img + "default_img.png";
              }
            return (
             <Image style={styles.smalllthumb} source={{ uri:commentimg }} />
            );
          });
        } else {
          var row3 = <Text style={styles.avatartxt} />;
        }
          
            // var img = network_img + "default_img.png";
          } else {
           var row3 = <Text style={styles.avatartxt} />;
          }

          return (
            <TouchableOpacity
              style={styles.columnbox}
              onPress={() => this.taskDetails(data12._id)}
            >
              <Text style={styles.title}> {data12.task_title} </Text>
              <View style={styles.timebar}>
                <Image
                  style={styles.icon}
                  source={require("../assets/img/watch.png")}
                />
                <Text style={styles.graytxt}> DUE </Text>
                <Text style={styles.date}>
                  {moment(data12.task_dueDate).format("DD-MMM-YYYY")}
                </Text>
              </View>
              <Text style={styles.bxtxt}>{data12.task_discription}</Text>
              <View style={styles.colfooter}>
                <Text style={styles.assign}>ASSIGNED TO</Text>
                {row3}
              </View>
            </TouchableOpacity>
          );
        }
      });
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
            <Text style={styles.header_title}> {this.state.network_name} </Text>
            <Text style={styles.header_subtitle}> TASK </Text>
          </View>

          <View style={styles.headerright}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("newtask")}
            >
              <Image
                style={styles.baricon}
                source={require("../assets/img/circal_plus.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchbar}>
          <TextInput
            placeholder="SEARCH"
            style={styles.input}
          
            onChangeText= {(text) => this.checktext(text)}
          />
          <TouchableOpacity onPress={() => this.searchFilter()}>
            <Image
              style={styles.searchicon}
              source={require("../assets/img/searchicon.png")}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.gridwrapper}>{row2}</View>
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
module.exports = connect(mapStateToProps)(task);
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
    padding:10,
    marginBottom: 15
  },

  searchicon: { width: 20, height: 20,  },

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
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80
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
