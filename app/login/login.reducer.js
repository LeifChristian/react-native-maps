export default function reducer(state={id:12,fb_data:[],user_data:[]}, action) {
    switch(action.type) {
        case "Set_user": {
            return Object.assign({},state,{id:action.payLoad._id});
            break;
        }
        case "fb_user_data": {
            return Object.assign({},state,{fb_data:action.payLoad});
            break;
        }
        case "user_data": {
            return Object.assign({},state,{user_data:action.payLoad});
            break;
        }
    }
    return state;
}