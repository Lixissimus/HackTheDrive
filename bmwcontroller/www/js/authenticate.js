(function() {
  var App, BMWClient, buildMap, config, bmwClient;

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

  App = bmwClient.model('App');

  $(function() {
    bmwClient.token(function(error, result) {
      if (error) {
        console.log("redirecting to login.");
        return bmwClient.authorize(config.redirect_uri);
      } else {
        bmwClient.get(bmwClient.model("User"), {
          id: result.UserId
        }, function(error, result) {
          var message;
          message = 'Successfully authenticated ';
          if (result.FirstName) {
            message += result.FirstName;
          } else if (result.UserName) {
            message += result.UserName;
          } else if (result.LastName) {
            message += result.LastName;
          } else if (result.Email) {
            message += result.Email;
          } else {
            message += "Unknown";
          }
          onAuthenticated(bmwClient);
        });
      }
    });
  });
}).call(this);