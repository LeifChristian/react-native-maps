export default function reducer(state={verified_status:0,user_data:[]}, action) {
    switch(action.type) {
         case "verified_status": {
           return Object.assign({},state,{verified_status:action.payLoad.user_otpStatus});
            break;
        }
         case "user_data": {
           return Object.assign({},state,{user_data:action.payLoad.user_otpStatus});
            break;
        }
    }
    return state;
}