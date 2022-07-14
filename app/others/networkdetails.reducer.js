export default function reducer(
  state = {
    networks: [],
    locationdata: [],
    network_filedata: [],
    calender_data: [],
    netwrok_member:[],
    backbutton:'',
    Network_addmedia_view:''
  },
  action
) {
  switch (action.type) {
    case "Set_networkdata": {
      return Object.assign({}, state, { networks: action.payLoad });

      break;
    }
     case "Network_addmedia_view": {
    
      return Object.assign({}, state, { Network_addmedia_view: 5 });

      break;
    }
    case "Set_location_data": {
      return Object.assign({}, state, { locationdata: action.payLoad });

      break;
    }
    case "Set_network_file_data": {
      return Object.assign({}, state, { network_filedata: action.payLoad });

      break;
    }

    case "calender_data": {
      return Object.assign({}, state, { calender_data: action.payLoad });
      break;
    }
     case "netwrok_member": {
      return Object.assign({}, state, { netwrok_member: action.payLoad });
      break;
    }
    case "clear_network_file_data": {
      return Object.assign({}, state, { network_filedata: [],calender_data:[],locationdata:[] });

      break;
    }
     case "setBackbuttonStatus": {
       
      return Object.assign({}, state, { backbutton: action.payLoad.backbutton_status });

      break;
    }
  }
  return state;
}
