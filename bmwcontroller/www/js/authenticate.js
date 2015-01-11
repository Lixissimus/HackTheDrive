(function() {
  var BMWClient, config, bmwClient;

  BMWClient = this.BMWClient;

  config = {
    application: '9a2bad4b-b159-40da-b880-d59ed4154b76',
    redirect_uri: document.URL.indexOf('file:///') >= 0 ? 'http://bmwplaynow.herokuapp.com/index.html' : document.URL,
    hostname: 'data.api.hackthedrive.com',
    version: 'v1',
    port: '443',
    scheme: 'https'
  };

  bmwClient = new BMWClient(config);

  $(function() {
    bmwClient.token(function(error, result) {
      if (error) {
        console.log("redirecting to login.");
        return bmwClient.authorize(config.redirect_uri);
      } else {
        onAuthenticated(bmwClient);
      }
    });
  });
}).call(this);