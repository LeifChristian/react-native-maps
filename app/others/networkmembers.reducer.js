export default function reducer(
  state = {
   
    allnetwrokmembers:[],
    netwrok_admin_id:''
  },
  action
) {
  switch (action.type) {
    case "Set_AllNetworkMembers": {
      return Object.assign({}, state, { allnetwrokmembers: action.payLoad });

      break;
    }
   case "user_admin_id": {
      return Object.assign({}, state, { netwrok_admin_id: action.payLoad });

      break;
    }
   

    
  }
  return state;
}
