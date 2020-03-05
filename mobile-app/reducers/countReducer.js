let userinfo = {
  token: '',
  username: '',
  usertype: ''
}
export default function(state=userinfo, action){
  console.log('action run', action)
  switch (action.type) {
    case "setUserInfo":
      return {
        ...state,
        username: action.info.username,
        usertype: action.info.usertype,
        token: action.info.token
      }
      break;
    default:
        return state;
  }
}
