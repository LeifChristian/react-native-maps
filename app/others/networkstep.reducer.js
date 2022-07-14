export default function reducer(
  state = { network: [], fullnetworkdetails: [], post_user_data: [],SelectdContactNumber:[],SelectdFacebookFrnds:[],SelectedUsers:[] },
  action
) {
  switch (action.type) {
    case "netwroklist": {
      return Object.assign({}, state, { network: action.payLoad });

      break;
    }
    case "networkData": {
     return Object.assign({}, state, { fullnetworkdetails: action.payLoad });
      break;
    }
    case "user_postData": {
      return Object.assign({}, state, { post_user_data: action.payLoad });
      break;
    }
      case "clear_location_data": {
      return Object.assign({}, state, { fullnetworkdetails:[] });
      break;
    }
    case "StoredConatcNumber": {
      return Object.assign({}, state, { SelectdContactNumber:action.payLoad });
      break;
    }
     case "clearConatcNumber": {
      return Object.assign({}, state, { SelectdContactNumber:[] });
      break;
    }
     case "StoredFacebookFrnds": {
      return Object.assign({}, state, { SelectdFacebookFrnds:action.payLoad });
      break;
    }
     case "clearFacebookFrnds": {
      return Object.assign({}, state, { SelectdFacebookFrnds:[] });
      break;
    }
    case "StoredUsers": {
      return Object.assign({}, state, { SelectedUsers:action.payLoad });
      break;
    }
     case "clearUsers": {
      return Object.assign({}, state, { SelectedUsers:[] });
      break;
    }
  }
  return state;
}
