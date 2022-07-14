export default function reducer(state = { mediaTypeView:''},action) {
  switch (action.type) {
    case "Network_addmedia_view1111": {
      console.log("hii");
      return Object.assign({}, state, { mediaTypeView: action.payLoad });

      break;
    }
  }
  return state;
}
