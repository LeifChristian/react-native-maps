export default function reducer(
    state = {
      chatData:[]
    },
    action
  ) {
    switch (action.type) {
      case "addMessage": {
        return Object.assign({}, state, { chatData: action.payLoad });
        break;
      }
    }
    return state;
  }
  