(function() {
  var BMWClient, config, bmwClient;

  BMWClient = this.BMWClient;

  config = {
    application: '9a2bad4b-b159-40da-b880-d59ed4154b76',
    redirect_uri: 'http://localhost:8000/index.html',
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