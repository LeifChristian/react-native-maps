export default function reducer(state={userdata: [],CountryCode: []}, action) {
    switch(action.type) {
        case "Set_user": {
           return Object.assign({},state,{userdata:action.payLoad});
            break;
        }
        case "CountryCode": {
           return Object.assign({},state,{CountryCode:action.payLoad});
            break;
        }
    }
    return state;
}