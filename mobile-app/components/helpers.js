import { Toast } from 'native-base'; 
export default {
  showFetchError: function(errors) {
    console.log(errors)
    if(typeof(errors) == 'string') {
      return Toast.show({
        text: errors
      })
    }
    if(errors instanceof Object) {
      for(var key in errors) {
        if(errors.hasOwnProperty(key)) {
          Toast.show({
            text: errors[key]
          })
        }
      }
    }
  }
}
