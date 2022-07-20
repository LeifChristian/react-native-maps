import { StatusBar } from 'expo-status-bar';
import {React, useState, useEffect, useRef} from 'react';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";
import { StyleSheet, Text, View, Button, TouchableOpacity, Appearance, Modal, Pressable, Alert, Image } from 'react-native';
import * as Location from 'expo-location';
import Modality from './modal';
import Prompt from 'react-native-input-prompt'
import axios from 'axios';
import mapstyle from "./mapstyle.json"

console.log(mapstyle.json)

const baseUrl = 'http://54.183.11.135:3800/';
// const locations = [];

export default function App() {

  const tokyoRegion = {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  
  const [locations, setLocations] = useState(null)
  const [lat, setLat] = useState(39.97343096953564)
  const [latD, setLatD] = useState(0.0922)
  const [long, setLong] = useState(-75.12520805829233)
  const [longD, setLongD] = useState(0.0421)

  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([])

  const [errorMsg, setErrorMsg] = useState(null);
  const [display, setDisplay] = useState("null");
  const mapRef = useRef(null);
  
  const [modalVisible, setModalVisible] = useState(false);

  const [addPrompt, setaddPrompt] = useState(false)
  const [deletePrompt, setDeletePrompt] = useState(true);
  const [inputText, setinputText] = useState('')

  let region = {
    "latitude": lat,
    "latitudeDelta": latD,
    "longitude": long,
    "longitudeDelta": longD,
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      
      setLocation(location);
      console.log(location, "here");
  
      Location.watchPositionAsync({
        enableHighAccuracy:true
            }, location => {
             console.log(location.coords.latitude, location.coords.longitude, 'current location');
             setLocations({lat: location.coords.latitude, long: location.coords.longitude})
             console.log(locations, 'lo')
             setDisplay(`lat: ${location.coords.latitude.toFixed(7)}, long: ${location.coords.longitude.toFixed(7)}`)
             setLat(location.coords.latitude);
             setLong(location.coords.longitude)
            });
  
            var data = JSON.stringify({
              "password": "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
              
            });
            
            var config = {
              method: 'post',
              url: 'http://54.183.11.135:3802/getPlaces?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342',
              headers: { 
                'Content-Type': 'application/json'
              },
              data : data
            };
            
            axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data), 'res!!!!!!');
            
              // let obj = JSON.stringify(response.data);
            
              let washedResponse = JSON.parse(JSON.stringify(response.data));
            
              console.log(washedResponse, 'wash?')
            
              setPlaces(washedResponse);
            
              // alert(JSON.stringify(washedResponse).replace('[', '').replace("{", "").replace('}', '').replace(']', ''));
            })
            .catch(function (error) {
              console.log(error);
            });
      
    })();
  }, []);

const addPlace = async (text) => {

  setaddPrompt(true);

  console.log(locations," goddamn Fucking locations")

var data = JSON.stringify({
  "password": "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
  "coords": locations,
  "name": text
});

var config = {
  method: 'post',
  url: 'http://54.183.11.135:3802/addPlace?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

await axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));

  let obj = JSON.stringify(response.data);

  let washedResponse = JSON.parse(obj);

  console.log(washedResponse)

  setPlaces(washedResponse);
  console.log(places, 'places')

  console.log(washedResponse[washedResponse.length-1], 'washedResponse')

  // alert(JSON.stringify(washedResponse).replace('[', '').replace("{", "").replace('}', '').replace(']', ''));

})
.catch(function (error) {
  console.log(error);
});

refresh()
}

const refresh = () => {

  var data = JSON.stringify({
    "password": "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
    
  });
  
  var config = {
    method: 'post',
    url: 'http://54.183.11.135:3802/getPlaces?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data), 'res!!!!!!');
  
    // let obj = JSON.stringify(response.data);
  
    let washedResponse = JSON.parse(JSON.stringify(response.data));
  
    console.log(washedResponse)
  
    setPlaces(washedResponse);
  
    // alert(JSON.stringify(washedResponse).replace('[', '').replace("{", "").replace('}', '').replace(']', ''));
  })
  .catch(function (error) {
    console.log(error);
  });

}

const confirmDeletePlace = (id, lat, name) => {
  return Alert.alert(
    "Sure?",
    `Confirm delete ${name}`,
    [
      // The "Yes" button
      {
        text: "Yes",
        onPress: () => {
        deletePlace(id, lat, name)
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: "No",
      },
    ]
  ), lat, id, name;
};

const deletePlace = (id, lat) => {

  //  alert(` Deleted:  ${id} | Lat: ${lat}`)

  setModalVisible(false)

  var config = {
    method: 'delete',
    url: `http://54.183.11.135:3802/deletePlace?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342&id=${id}`,
    headers: { }
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
  
  refresh()

} 

const showPlaces = () => {

  return places.map((element) => {


    const gotoPlace = (lat, long) => {
        mapRef.current.animateToRegion({latitude: lat, longitude: long, latitudeDelta: 0.01,
        longitudeDelta: 0.01,}, 3 * 1000);
       setLat(lat); setLong(long);
   
        //  setLocation(region)
        // setModalVisible(false)
    }

    return (

 <View key={element.id} >
    <TouchableOpacity onPress ={()=>{gotoPlace(element.lat, element.long, element.name)}}>
      <Text style={styles.modalHeaderStyle} >
        
     {element?.name}

      </Text>

      <Text style={styles.modalItemStyle}> {element.lat}{element.long}

      </Text>
     
    </TouchableOpacity>
{}
    <TouchableOpacity onPress={() => {confirmDeletePlace(element.id, element.lat, element.name)}}>
      <Text style={{textAlign: 'center', color: "white", fontSize: 23}}>X
{/*         
     {element?.name} {' '} {element.lat} x {' '}{element.long} */}

    </Text></TouchableOpacity>

    
    <View style={{ flex: 1 }}>
 <Text></Text>
      <View
        style={{
          borderBottomColor: 'white',
          borderBottomWidth: 1,
        }}
      />
      <Text>world</Text>
    </View>
    
    {/* <Button title="delete" onPress={() => {deletePlace(element.id, element.lat)}}></Button> */}

    </View>
    

    );
  });

}

const list = () => {

  // console.log(places, 'plazzzzzz')
  return places.map((element) => {
    return (
      
        <Marker key={element.id} coordinate={{"latitude": element.lat,
    "latitudeDelta": latD,
    "longitude": element.long,
    "longitudeDelta": longD}} ></Marker>

    );
  });
};

const clearData = () => {var axios = require('axios');


try {
  
  var data = JSON.stringify({
    "password": "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
    "coords": locations
  });
  
  var config = {
    method: 'post',
    url: 'http://54.183.11.135:3800/clear?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  
    let obj = JSON.stringify(response.data);
  
    let washedResponse = JSON.parse(obj);
  
    console.log(washedResponse)
  
  })
  .catch(function (error) {
    console.log(error);
  });
  


} catch (error) {
  console.log(error)
}

}

 const move = (direction) => {

  switch(direction) {
   
      case 'up' : setLat(prevState => prevState + (prevState*.01)); setDisplay(`lat: ${lat + (lat*.01)}, long: ${long}`)// alert(lat); //setLatD(prevState => prevState + 1); alert(latD)
      break;
      case 'down' : setLat(prevState => prevState - (prevState*.01)); setDisplay(`lat: ${lat - (lat*.01)}, long: ${long}`) //alert(lat); //setLatD(prevState => prevState - 1); alert(latD)
      break;
      case 'left' : setLong(prevState => prevState - (Math.abs(prevState)/100)); setDisplay(`lat: ${lat}, long: ${(long - (Math.abs(long)/100))}`) //alert(long); //setLongD(prevState => prevState + 1); alert(longD)
      break;
      case 'right' : setLong(prevState => prevState + (Math.abs(prevState)/100)); setDisplay(`lat: ${lat}, long: ${long + (Math.abs(long)/100)}`) //alert(long); //setLongD(prevState => prevState - 1); alert(longD)
      break;
      case 'minus' : setLongD(prevState=> prevState + (prevState/4)); console.log(longD)//  setLatD(prevState=> prevState - .01); 
      break;
      case 'plus' : setLongD(prevState=> prevState - (prevState/4));  console.log(longD) // setLatD(prevState=> prevState + .01); 
      break;

  }
}

const showMyLocation = async () => {


  
  let location = await Location.getCurrentPositionAsync({});
      
  setLocation(location);

  setLat(location.coords.latitude);
  setLong(location.coords.longitude);
  setDisplay(`lat: ${location.coords.latitude.toFixed(7)}, long: ${location.coords.longitude.toFixed(7)}`)

}

const goToTokyo = () => {
  //Animate the user to new region in 3 seconds
  mapRef.current.animateToRegion(tokyoRegion, 3 * 1000);

  setTimeout(function() {setLat(tokyoRegion.latitude)
    setLong(tokyoRegion.longitude)}, 3200)
  
};

const onMapPress = (e) => {

  console.log(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, "natiVEEE")

  console.log(typeof e.nativeEvent.coordinate.latitude)

  let slimLat = e.nativeEvent.coordinate.latitude.toFixed(7);
  let slimLong = e.nativeEvent.coordinate.longitude.toFixed(7);

  console.log(slimLat, slimLong, "sleem")

  // console.log(locations[0].lat, locations[0].long, 'lolololo')

   setLocations([]);

   setLocations([{lat: slimLat, long: slimLong}])

setLat(e.nativeEvent.coordinate.latitude);
setLong(e.nativeEvent.coordinate.longitude)
setLocation({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
// setDisplay({lat: e.nativeEvent.coordinate.latitude, long: e.nativeEvent.coordinate.longitude})
setDisplay(`lat: ${e.nativeEvent.coordinate.latitude.toFixed(7)}, long: ${e.nativeEvent.coordinate.longitude.toFixed(7)}`)

// alert(`lat: ${lat}, long: ${long}`)



}


  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!fff</Text>
      <StatusBar style="auto" /> */}
      
      <MapView userInterfaceStyle={'dark'} ref={mapRef} style={{height: '60%', width: '100%'}} 
        showsUserLocation={true} //showsMyLocationButton
       onPress = {(e)=> {onMapPress(e)}}
      region={region}>
        
        <Marker coordinate={region} image={require('./pin.png')}></Marker>
      
      {list()}</MapView> 

      <View style={{backgroundColor:'black'}}></View>

      <Text style={{color: 'white', fontSize: 16, marginTop: '2%'}}>{display}</Text>

      <Prompt style={{backgroundColor: 'black'}}
    visible={addPrompt}
    title="Name Your Place"
    placeholder="..."

    submitText={'save'}
    cancelText={"cancel"
    }
    titleStyle={{color: 'black'}}
    onCancel={() =>
       setaddPrompt(false)
    }

    onSubmit={text =>{
      (text.length == 0) ? text='untitled' : '';
      //  alert(text);
       setinputText(text)
      addPlace(text)
      setaddPrompt(false)
      }
    }
/>

      <View style={[styles.group, styles.top]}>
        
        <TouchableOpacity
       onPressIn={()=> {move('up')}}>
        <Text style={styles.up}>↑</Text>
      </TouchableOpacity>

    </View>

      <View style={styles.group}>

      <TouchableOpacity
      
        onPressIn={()=> {move('minus')}}>
        <Text style={styles.minus}>--</Text>
      </TouchableOpacity>
        
        
        
        
        <TouchableOpacity
        onPressIn={()=> {move('left')}}>
        <Text style={[styles.leftRight]}>←</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={showMyLocation}>
        <Image style={{height: 41, width: 41, marginTop: 14, marginRight: 2, marginLeft: -2, justifyContent: 'center', alignContent:'center', alignItems: 'center'}} source={require("./center.png")}></Image>
</TouchableOpacity>

      
      <TouchableOpacity
        onPressIn={()=> {move('right')}}>
        <Text style={[styles.leftRight]}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
    
        onPressIn={()=> {move('plus')}}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
      
      
      </View>
      
      <View style={styles.group}>
      <TouchableOpacity
        onPressIn={()=> {move('down')}}
      >
        <Text style={styles.Down}>↓</Text>
      </TouchableOpacity>
      </View>

       {/* <TouchableOpacity style={styles.button} onPressIn={()=> {showMyLocation()}}>
        <Text style={styles.buttonStyle}>Where Am I?</Text> </TouchableOpacity> */}

      <View style={styles.group}>
        
        {/* <TouchableOpacity style={styles.button} onPressIn={()=> {goToTokyo()}}>
        <Text style={styles.buttonStyle}>Tokyo</Text> </TouchableOpacity>  */}

      <TouchableOpacity
        onPressIn={()=> {setaddPrompt(true)}}>
        <Text style={styles.buttonStyle}>Add</Text>
      </TouchableOpacity>

      <Modality places = {places} modalVisible={modalVisible} setModalVisible={setModalVisible} showPlaces={showPlaces}/>
      
      {/* <TouchableOpacity style={styles.button} onPressIn={()=> {clearData()}}>
        <Text style={styles.buttonStyle}>ClearData</Text></TouchableOpacity> */}

      </View>
      <View style={styles.group}>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection:'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },

top: {marginTop: '3%'},
group: {flexDirection: 'row', marginTop: '2%'},

leftRight: {color: 'white', marginLeft: "2%", marginTop: "2%", marginBottom: '2%',fontWeight: "900", textAlign: 'center', fontSize: 32, width: 52, borderRadius: 12, padding: 6, backgroundColor:'black'},
plus: {color: 'white', marginRight: '-.1%', marginLeft: ".41%",
marginTop: '6%',
fontWeight: "900", textAlign: 'center', fontSize: 32, width: 52, borderRadius: 12, padding: 8, backgroundColor:'black'},
minus: {color: 'white', // marginLeft:'32%', marginRight: '3%', 
marginTop: '6%', 
fontWeight: "900", textAlign: 'center', fontSize: 32, width: 52, borderRadius: 12, padding: 8, backgroundColor:'black'},
up: {color: 'white', marginLeft:'1%', marginRight: '1%', fontWeight: "900", textAlign: 'center', fontSize: 32, width: 52, borderRadius: 12, padding: 4, backgroundColor:'black'},
buttonStyle: {marginBottom: '5%', marginTop: '5%', marginRight: '8%', marginBottom:'1%',  color: 'white',textAlign: 'center', fontSize: 24, borderRadius: 12, padding: 6, backgroundColor:'black', marginTop: 2},
Down: {marginBottom: '2%', marginTop: '30%', color: 'white', marginRight: '1%',fontWeight: "800", textAlign: 'center', fontSize: 28, width: 52,borderRadius: 12, padding: 6, backgroundColor:'black', marginTop: 2},

modalItemStyle: { fontSize: 16, textAlign: 'center', color: 'white'},

modalHeaderStyle: { fontSize: 20, fontWeight: '600', fontStyle: 'italic', textAlign: 'center', color: 'white',marginBottom: '2%'}
});