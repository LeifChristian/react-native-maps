
import { React, useState, useEffect, useRef } from "react";
import MapView from "react-native-maps";
import Geocoder from 'react-native-geocoding';
import { Marker } from "react-native-maps";
import {
  // Button,
  // Appearance,
  // Modal,
  // Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image, ScrollView
} from "react-native";
import * as Location from "expo-location";
import Modality from "./modal";
import Prompt from "react-native-input-prompt";
import axios from "axios";
import mapstyle from "./mapstyle.json";
// import { StatusBar } from "expo-status-bar";
// import Geocoder from "react-native-geocoding";

// console.log(mapstyle);

// const baseUrl = "http://54.183.11.135:3800/";

export default function App() {
  const tokyoRegion = {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [locations, setLocations] = useState(null);
  const [lat, setLat] = useState(39.97343096953564);
  const [latD, setLatD] = useState(0.0122);
  const [long, setLong] = useState(-75.12520805829233);
  const [longD, setLongD] = useState(0.0421);

  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  const [errorMsg, setErrorMsg] = useState(null);
  const [display, setDisplay] = useState("null");
  const mapRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [addPrompt, setaddPrompt] = useState(false);
  const [inputText, setinputText] = useState("");

  let region = {
    latitude: lat,
    latitudeDelta: latD,
    longitude: long,
    longitudeDelta: longD,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      // console.log(location, "LOCATIONSSSSSS ")

      // setLocation(location);
      console.log(location, "here");

      Location.watchPositionAsync(
        {
          enableHighAccuracy: true,
        },
        (location) => {
          console.log(
            location.coords.latitude,
            location.coords.longitude,
            "current location"
          );
          setLocations([
            { lat: location.coords.latitude, long: location.coords.longitude },
          ]);
          console.log(locations, "lo");
          setDisplay(
            `lat: ${location.coords.latitude}, long: ${location.coords.longitude}`
          );
          setLat(location.coords.latitude);
          setLong(location.coords.longitude);
        }
      );

      var data = JSON.stringify({
        password:
          "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
      });

      var config = {
        method: "post",
        url: "http://54.183.11.135:3802/getPlaces?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data), "res!!!!!!");

          // let obj = JSON.stringify(response.data);

          let washedResponse = JSON.parse(JSON.stringify(response.data));

          console.log(washedResponse, "wash?");

          setPlaces(washedResponse);

          // alert(JSON.stringify(washedResponse).replace('[', '').replace("{", "").replace('}', '').replace(']', ''));
        })
        .catch(function (error) {
          console.log(error);
        });
    })();
  }, []);

  const refresh = async () => {
    var data = JSON.stringify({
      password:
        "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
    });

    var config = {
      method: "post",
      url: "http://54.183.11.135:3802/getPlaces?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data), "res!!!!!!");

        // let obj = JSON.stringify(response.data);

        let washedResponse = JSON.parse(JSON.stringify(response.data));

        console.log(washedResponse);

        setPlaces(washedResponse);

        // alert(JSON.stringify(washedResponse).replace('[', '').replace("{", "").replace('}', '').replace(']', ''));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addPlace = async (text) => {
    setaddPrompt(true);

    console.log(locations, " goddamn Fucking locations");

    console.log(text, "text");

    // if(!locations.length){setLocations({lat: lat, long: long})}

    var data = JSON.stringify({
      password:
        "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
      coords: locations,
      name: text,
    });

    var config = {
      method: "post",
      url: "http://54.183.11.135:3802/addPlace?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));

        let obj = JSON.stringify(response.data);

        let washedResponse = JSON.parse(obj);

        console.log(washedResponse);

        setPlaces(washedResponse);
        console.log(places, "places");

        console.log(
          washedResponse[washedResponse.length - 1],
          "washedResponse"
        );

        // alert(JSON.stringify(washedResponse).replace('[', '').replace("{", "").replace('}', '').replace(']', ''));
      })
      .catch(function (error) {
        console.log(error);
      });

    refresh();
  };

  const confirmDeletePlace = (id, lat, name) => {
    return (
      Alert.alert("Sure?", `Confirm delete ${name}`, [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            deletePlace(id, lat, name);
          },
        },
        // Dismiss the dialog when tapped
        {
          text: "No",
        },
      ]),
      lat,
      id,
      name
    );
  };

  const deletePlace = (id, lat) => {
    //  alert(` Deleted:  ${id} | Lat: ${lat}`)

    setModalVisible(false);

    var config = {
      method: "delete",
      url: `http://54.183.11.135:3802/deletePlace?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342&id=${id}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    refresh();
  };

  const showPlaces = () => {
    return places.map((element) => {
      const gotoPlace = (lat, long) => {
        mapRef.current.animateToRegion(
          {
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          3 * 1000
        );
        setLat(lat);
        setLong(long);

        //  setLocation(region)
        // setModalVisible(false)
      };

      return (
        <View key={element.id}>
           <ScrollView style={styles.scrollView}>
          <TouchableOpacity
            onPress={() => {
              gotoPlace(element.lat, element.long, element.name);
            }}
          >
            <Text style={styles.modalHeaderStyle}>{element?.name}</Text>

            <Text style={styles.modalItemStyle}>
              {" "}
              {element.lat.toFixed(7)}
              {element.long.toFixed(7)}
            </Text>
          </TouchableOpacity>
          </ScrollView>
          {}
          <TouchableOpacity
            onPress={() => {
              confirmDeletePlace(element.id, element.lat, element.name);
            }}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 23 }}>
              X
              {/*         
     {element?.name} {' '} {element.lat} x {' '}{element.long} */}
            </Text>
          </TouchableOpacity>

          {/* <Button title="delete" onPress={() => {deletePlace(element.id, element.lat)}}></Button> */}
        </View>
      );
    });
  };

  const list = () => {
    // console.log(places, 'places')
    return places.map((element) => {
      return (
        <Marker
          key={element.id}
          coordinate={{
            latitude: element.lat,
            latitudeDelta: latD,
            longitude: element.long,
            longitudeDelta: longD,
          }}
        ></Marker>
      );
    });
  };

  const clearData = () => {
    var axios = require("axios");

    try {
      var data = JSON.stringify({
        password:
          "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
        coords: locations,
      });

      var config = {
        method: "post",
        url: "http://54.183.11.135:3800/clear?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));

          let obj = JSON.stringify(response.data);

          let washedResponse = JSON.parse(obj);

          console.log(washedResponse);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const move = (direction) => {
    switch (direction) {
      case "up":
        setLat((prevState) => prevState + prevState * 0.01);
        setDisplay(
          `lat: ${(lat + lat * 0.01).toFixed(7)}, long: ${long.toFixed(7)}`
        );
        setLocations([{ lat: lat, long: long }]); // alert(lat); //setLatD(prevState => prevState + 1); alert(latD)
        break;
      case "down":
        setLat((prevState) => prevState - prevState * 0.01);
        setDisplay(
          `lat: ${(lat - lat * 0.01).toFixed(7)}, long: ${long.toFixed(7)}`
        );
        setLocations([{ lat: lat, long: long }]); //alert(lat); //setLatD(prevState => prevState - 1); alert(latD)
        break;
      case "left":
        setLong((prevState) => prevState -  (longD/10));
        console.log(longD)
        setDisplay(
          `lat: ${lat.toFixed(7)}, long: ${(
            long -
            (longD-10)
          ).toFixed(7)}`
        );
        setLocations([{ lat: lat, long: long }]); //alert(long); //setLongD(prevState => prevState + 1); alert(longD)
        break;
      case "right":
        console.log(longD)
        setLong((prevState) => prevState + (longD /10));
        setDisplay(
          `lat: ${lat.toFixed(7)}, long: ${(
            long +
            (longD/10)
          ).toFixed(7)}`
        );
        setLocations([{ lat: lat, long: long }]); //alert(long); //setLongD(prevState => prevState - 1); alert(longD)
        break;
      case "minus":
        setLongD((prevState) => prevState + prevState / 4);
        setLatD((prevState) => prevState + prevState / 4);
        console.log(longD); //  setLatD(prevState=> prevState - .01);
        break;
      case "plus":
        setLongD((prevState) => prevState - prevState / 4);
        setLatD((prevState) => prevState - prevState / 4);
        console.log(longD); // setLatD(prevState=> prevState + .01);
        break;
    }
  };

  const showMyLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});

    // setLocation(location);

    console.log(location, "here is the loc data")

    setLat(location.coords.latitude);
    setLong(location.coords.longitude);
    setLongD(prevState => prevState);
    setLatD(prevState => prevState)
    setDisplay(
      `lat: ${location.coords.latitude}, long: ${location.coords.longitude}`
    );
  };

  const goToTokyo = () => {
    //Animate the user to new region in 3 seconds
    mapRef.current.animateToRegion(tokyoRegion, 3 * 1000);

    setTimeout(function () {
      setLat(tokyoRegion.latitude);
      setLong(tokyoRegion.longitude);
    }, 3200);
  };

  const onMapPress = (e) => {
    console.log(
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude,
      "native coordinates"
    );

    console.log(typeof e.nativeEvent.coordinate.latitude);

    let slimLat = e.nativeEvent.coordinate.latitude.toFixed(7);
    let slimLong = e.nativeEvent.coordinate.longitude.toFixed(7);

    console.log(slimLat, slimLong, "sleem");

    // console.log(locations[0].lat, locations[0].long, 'locations[0]')

    setLocations([]);

    setLocations([{ lat: slimLat, long: slimLong }]);

    setLat(e.nativeEvent.coordinate.latitude);
    setLong(e.nativeEvent.coordinate.longitude);
    setLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
    // setDisplay({lat: e.nativeEvent.coordinate.latitude, long: e.nativeEvent.coordinate.longitude})
    setDisplay(
      `lat: ${e.nativeEvent.coordinate.latitude.toFixed(
        7
      )}, long: ${e.nativeEvent.coordinate.longitude.toFixed(7)}`
    );

    // alert(`lat: ${lat}, long: ${long}`)
  };

  const onLongPress = (e) => {
    // console.log(e, "LONGPRESS!!!");
    console.log(
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude,
      "native coordinates LONGGG"
    );
    alert(e.nativeEvent.coordinate.latitude.toString().slice(0, 9) + ' | ' +
      e.nativeEvent.coordinate.longitude.toString().slice(0, 9) )
  }

  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!fff</Text>
      <StatusBar style="auto" /> */}

      <MapView
        userInterfaceStyle={'dark'}
        ref={mapRef}
        style={{ height: "60%", width: "100%" }}
        showsUserLocation={true} //showsMyLocationButton,
        onPress={(e) => {
          onMapPress(e);
        }}
        onLongPress={(e)=> {onLongPress(e)}}
        region={region}
      >
        <Marker coordinate={region} image={require("./pin.png")}></Marker>

        {list()}
      </MapView>

      <View style={{ backgroundColor: "black" }}></View>

      <Text style={{ color: "white", fontSize: 16, marginTop: "2%" }}>
        {display}
      </Text>

      <Prompt
        style={{ backgroundColor: "black" }}
        visible={addPrompt}
        title="Name Your Place"
        placeholder="..."
        submitText={"save"}
        cancelText={"cancel"}
        titleStyle={{ color: "black" }}
        onCancel={() => setaddPrompt(false)}
        onSubmit={(text) => {
          text.length == 0 ? (text = "untitled") : "";
          //  alert(text);  
          setinputText(text);
          addPlace(text);
          setaddPrompt(false);
        }}
      />

      <View style={[styles.group, styles.top]}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => {
            move("up");
          }}
        >
          <Text style={styles.up}>↑</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.group}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => {
            move("minus");
          }}
        >
          <Text style={styles.minus}>--</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPressIn={() => {
            move("left");
          }}
        >
          <Text style={[styles.leftRight]}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={showMyLocation}>
          <Image
            style={{
              height: 41,
              width: 41,
              marginTop: 14,
              marginRight: 2,
              marginLeft: -2,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
            source={require("./center.png")}
          ></Image>
        </TouchableOpacity>

        <TouchableOpacity
          onPressIn={() => {
            move("right");
          }}
        >
          <Text style={[styles.leftRight]}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPressIn={() => {
            move("plus");
          }}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.group}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => {
            move("down");
          }}
        >
          <Text style={styles.Down}>↓</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.group}>
        {/* <TouchableOpacity style={styles.button} onPressIn={()=> {goToTokyo()}}>
        <Text style={styles.buttonStyle}>Tokyo</Text> </TouchableOpacity>  */}

        <TouchableOpacity
          style={styles.button}
          onPressIn={() => {
            setaddPrompt(true);
          }}
        >
          <Text style={styles.buttonStyle}>Add</Text>
        </TouchableOpacity>

        <Modality
          places={places}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          showPlaces={showPlaces}
        />
      </View>
      <View style={styles.group}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  top: { marginTop: "3%" },
  group: { flexDirection: "row", marginTop: "2%" },

  leftRight: {
    color: "white",
    marginLeft: "2%",
    marginTop: "2%",
    marginBottom: "2%",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 32,
    width: 52,
    borderRadius: 12,
    padding: 6,
    backgroundColor: "black",
  },
  plus: {
    color: "white",
    marginRight: "-.1%",
    marginLeft: ".41%",
    marginTop: "6%",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 32,
    width: 52,
    borderRadius: 12,
    padding: 8,
    backgroundColor: "black",
  },
  minus: {
    color: "white", // marginLeft:'32%', marginRight: '3%',
    marginTop: "6%",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 32,
    width: 52,
    borderRadius: 12,
    padding: 8,
    backgroundColor: "black",
  },
  up: {
    color: "white",
    marginLeft: "1%",
    marginRight: "1%",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 32,
    width: 52,
    borderRadius: 12,
    padding: 4,
    backgroundColor: "black",
  },
  buttonStyle: {
    marginBottom: "5%",
    marginTop: "5%",
    marginRight: "8%",
    marginBottom: "1%",
    color: "white",
    textAlign: "center",
    fontSize: 24,
    borderRadius: 12,
    padding: 6,
    backgroundColor: "black",
    marginTop: 2,
  },
  Down: {
    marginBottom: "2%",
    marginTop: "30%",
    color: "white",
    marginRight: "1%",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 28,
    width: 52,
    borderRadius: 12,
    padding: 6,
    backgroundColor: "black",
    marginTop: 2,
  },

  modalItemStyle: { fontSize: 16, textAlign: "center", color: "white" },
  modalHeaderStyle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  
});
