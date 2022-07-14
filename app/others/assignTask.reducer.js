export default function reducer(
  state = {
    assignmembers:'',networkTask:[],task_title:'',task_desc:'',
  },
  action
) {
  switch (action.type) {
    case "AssignTaskUser": {
      return Object.assign({}, state, { assignmembers: action.payLoad });

      break;
    }
     case "clearAssignTaskUser": {
       
      return Object.assign({}, state, { assignmembers: '' });

      break;
    }
    case "networkTask": {
      return Object.assign({}, state, { networkTask: action.payLoad });

      break;
    }
     case "add_task_title": {
      return Object.assign({}, state, { task_title: action.payLoad });

      break;
    }
    case "remove_task_title": {
      return Object.assign({}, state, { task_title: '' });

      break;
    }
     case "add_task_description": {
      
      return Object.assign({}, state, { task_desc: action.payLoad });

      break;
    }
     case "remove_task_description": {
      
      return Object.assign({}, state, { task_desc: '' });

      break;
    }
  }
  return state;
}
