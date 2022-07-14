export default function reducer(state={}, action) {
    switch(action.type) {
        case "Connection": {
        return Object.assign({},state,{ netstatus:action.payLoad.net_status});
            break;
        }
    }
    return state;
}