'use strict'

require("./browser-deeplink");
deeplink.setup({
  iOS: {
      appName: "myapp",
      appId: "123456789",
  },
  android: {
      appId: "com.myapp.android"
  }
});

window.onload = function() {
  deeplink.open("myapp://object/xyz");
}

class OpenAppFromWebsiteController {

}

module.exports = OpenAppFromWebsiteController
