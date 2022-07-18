import { StatusBar } from 'expo-status-bar';
import {React, useState, useEffect, useRef} from 'react';
import Geocoder from 'react-native-geocoding';
import MapView from'react-native-maps';
import { Marker } from "react-native-maps";
import { StyleSheet, Text, View, Button, TouchableOpacity, Appearance, Modal } from 'react-native';
import * as Location from 'expo-location';
import Modality from './modal';
import Prompt from 'react-native-input-prompt'


import axios from 'axios';

const baseUrl = 'http://54.183.11.135:3800/';

// import Realm from "realm";

const locations = [];

export default function App() {

  // Geocoder.init("AIzaSyCuOOvaNrtEmSfpBlobkE8NJYK-Z45IKtE")

  // pm2GetProcess?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342



  const tokyoRegion = {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  

//   Geocoder.geocodePosition({lat: tokyoRegion.latitude, lng: tokyoRegion.longitude}).then(res => { console.log(res)
//     // res is an Array of geocoding object (see below)
// })
// .catch(err => console.log(err))

 const [lat, setLat] = useState(39.97343096953564)
 const [latD, setLatD] = useState(0.0922)
 
 const [long, setLong] = useState(-75.12520805829233)
 const [longD, setLongD] = useState(0.0421)

 const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [display, setDisplay] = useState("null");
  const mapRef = useRef(null);

  const [places, setPlaces] = useState([])

  const [modalVisible, setModalVisible] = useState(false);

  const [addPrompt, setaddPrompt] = useState(false)
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
      console.log(location, "CATION");
  
      Location.watchPositionAsync({
        enableHighAccuracy:true
            }, location => {
             console.log(location.coords.latitude, 'current location');
             locations.push({lat: location.coords.latitude, long: location.coords.longitude})
             console.log(locations, 'lo')
             setDisplay(`lat: ${location.coords.latitude}, long: ${location.coords.longitude}`)
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
            
              console.log(washedResponse)
            
              setPlaces(washedResponse);
            
              // alert(JSON.stringify(washedResponse).replace('[', '').replace("{", "").replace('}', '').replace(']', ''));
            })
            .catch(function (error) {
              console.log(error);
            });
  
            // const get = async () => {
            //  await showMyLocation()
            // }
  
            // get();
  
      
    })();
  }, []);

const addPlace = (text) => {

  setaddPrompt(true);

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



axios(config)
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


}


const deletePlace = (id, lat) => {

  alert(` Delete:  ${id} | Lat: ${lat}`)

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

  // alert(JSON.stringify(washedResponse).replace('[', '').replace("{", "").replace('}', '').replace(']', ''));

} 


const showPlaces = () => {


  return places.map((element) => {

    const gotoPlace = (lat, long) => {

      mapRef.current.animateToRegion({latitude: lat, longitude: long, latitudeDelta: 0.01,
        longitudeDelta: 0.01,}, 3 * 1000);
       setLat(lat); setLong(long)
        //  setLocation(region)

        // setModalVisible(false)

    }
    return (

      // 
 <>
    <TouchableOpacity key={element.id} onPress ={()=>{gotoPlace(element.lat, element.long)}}>
      <Text key={element.id}>
        
        lat: {' '}{element.lat} long: {' '}{element.long}
        
    </Text><Button title="delete" onPress={() => {deletePlace(element.id, element.lat)}}></Button></TouchableOpacity>
    </>
      
    //     <Text key={element.id} coordinate={{"latitude": element.lat,
    // "latitudeDelta": latD,
    // "longitude": element.long,
    // "longitudeDelta": longD}} />

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
    "longitudeDelta": longD}} />

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
   
      case 'up' : setLat(prevState => prevState + (prevState*.01)); // alert(lat); //setLatD(prevState => prevState + 1); alert(latD)
      break;
      case 'down' : setLat(prevState => prevState - (prevState*.01)); //alert(lat); //setLatD(prevState => prevState - 1); alert(latD)
      break;
      case 'left' : setLong(prevState => prevState - (Math.abs(prevState)/100)); //alert(long); //setLongD(prevState => prevState + 1); alert(longD)
      break;
      case 'right' : setLong(prevState => prevState + (Math.abs(prevState)/100)); //alert(long); //setLongD(prevState => prevState - 1); alert(longD)
      break;
      case 'minus' : setLongD(prevState=> prevState + (prevState/4)); console.log(longD)//  setLatD(prevState=> prevState - .01); 
      break;
      case 'plus' : setLongD(prevState=> prevState - (prevState/4));  console.log(longD) // setLatD(prevState=> prevState + .01); 
      break;

  }
}

const myApiKey="Key Received from Google map"


const showMyLocation = async () => {

  setLat(location.coords.latitude);
  setLong(location.coords.longitude);

}

const setToPlace = () => {
  setLat(38.897957);
  setLong(-77.036560);
}



const goToTokyo = () => {
  //Animate the user to new region. Complete this animation in 3 seconds
  
  mapRef.current.animateToRegion(tokyoRegion, 3 * 1000);

  setTimeout(function() {setLat(tokyoRegion.latitude)
    setLong(tokyoRegion.longitude)}, 3200)
  
};

  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!fff</Text>
      <StatusBar style="auto" /> */}
      
      <MapView userInterfaceStyle={'dark'} ref={mapRef} style={{height: '60%', width: '100%'}} 
       showsUserLocation={true} //showsMyLocationButton
      region={region}><Marker coordinate={region} />{list()}</MapView> 

      <View style={{backgroundColor:'white'}}></View>

      <Text style={{color: 'white', fontSize: 16, marginTop: '2%'}}>{display}</Text>

      <Prompt
    visible={addPrompt}
    title="Name your place"
    placeholder="Type Something"
    onCancel={() =>
       setaddPrompt(false)
        
    }
    onSubmit={text =>{
       alert(text);
       setinputText(text)
      addPlace(text)
      setaddPrompt(false)
      }
    }
/>

      <Text style={{display: 'none'}} ><Button title={'White House'} onPressIn={()=> {setToPlace()}}> </Button> </Text>

      <View style={[styles.group, styles.top]}>
      <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {move('minus')}}
      >
        <Text style={styles.buttonPlusMinus}>--</Text>
      </TouchableOpacity>
        
        
        <TouchableOpacity
        style={styles.button} onPressIn={()=> {move('up')}}
      >
        <Text style={styles.minus}>↑</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {move('plus')}}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
      
    </View>


      <View style={styles.group}><TouchableOpacity
      
        onPressIn={()=> {move('left')}}
      >
        <Text style={[styles.leftRight]}>←</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        // style={styles.button}
        onPressIn={()=> {move('right')}}
      >
        <Text style={[styles.leftRight]}>→</Text>
      </TouchableOpacity></View>
      

      <View style={styles.group}>

     

      <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {move('down')}}
      >
        <Text style={styles.buttonPlusMinus}>↓</Text>
      </TouchableOpacity>
      
      
      </View>



       <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {showMyLocation()}}
      >
        <Text style={styles.buttonStyle}>Where Am I?</Text>
      </TouchableOpacity>

      <View style={styles.group}><TouchableOpacity
        style={styles.button}
        onPressIn={()=> {goToTokyo()}}
      >
        <Text style={styles.buttonStyle}>Tokyo</Text>
      </TouchableOpacity> 

      <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {setaddPrompt(true)}}
      >
        <Text style={styles.buttonStyle}>Add</Text>
      </TouchableOpacity>
      

      
      <Modality places = {places} modalVisible={modalVisible} setModalVisible={setModalVisible} showPlaces={showPlaces}/>
      
      {/* <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {addPlace()}}
      >
        <Text style={styles.buttonStyle}>Places</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {clearData()}}
      >
        <Text style={styles.buttonStyle}>ClearData</Text>
      </TouchableOpacity> */}
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
  group: {flexDirection: 'row'},

  upDown: {textAlign: 'center', marginTop: '5%', marginLeft: 'auto', marginRight: 'auto', padding: '1%'},
  leftRight: {color: 'black', marginLeft:'1%', marginRight: '1%', marginTop: "2%", marginBottom: '2%',fontWeight: "900", textAlign: 'center', fontSize: 32, width: 52, borderRadius: 12, padding: 6, backgroundColor:'blueviolet'},
plus: {color: 'black', marginLeft:'1%', marginRight: '1%', fontWeight: "900", textAlign: 'center', fontSize: 32, width: 52, borderRadius: 12, padding: 6, backgroundColor:'blueviolet'},
minus: {color: 'black', marginLeft:'1%', marginRight: '1%', fontWeight: "900", textAlign: 'center', fontSize: 32, width: 52, borderRadius: 12, padding: 6, backgroundColor:'blueviolet'},
  buttonStyle: {marginBottom: '5%', marginTop: '5%', marginRight: '3%', marginBottom:'1%',  color: 'black',textAlign: 'center', fontSize: 24, borderRadius: 12, padding: 6, backgroundColor:'blueviolet', marginTop: 2},

  
  buttonPlusMinus: {marginBottom: '2%', marginTop: '30%', color: 'black', marginRight: '1%',fontWeight: "800", textAlign: 'center', fontSize: 28, width: 52,borderRadius: 12, padding: 6, backgroundColor:'blueviolet', marginTop: 2},

showModal: {display:'inherit'},
hideM:{display:'none3'}
});