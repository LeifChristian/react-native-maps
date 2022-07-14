import { combineReducers } from "redux";
import signupReducer from "../signup/signup.reducer";
import otpReducer from "../otp/otp.reducer";
import networkstep from "../others/networkstep.reducer";
import networkdetails from "../others/networkdetails.reducer";
import logindetails from "../login/login.reducer";
import networkstatus from "../network_connection/network_connection.reducer";
import Allmembersnetwork from "../others/networkmembers.reducer";
import BackButton from "../others/networkdetails.reducer";
import AssignTaskUser from "../others/assignTask.reducer";
import NetworkMedia from "../others/networkMedia.reducer";
export default combineReducers({
  user:signupReducer,
  otpstatus:otpReducer,
  networksteps:networkstep,
   network_details:networkdetails,
   networkconnection:networkstatus,
   loginReducer:logindetails,
   Allmebers:Allmembersnetwork,
   BackButton:BackButton,
   AssignTaskUser:AssignTaskUser,
   NetworkMedia:NetworkMedia,
})