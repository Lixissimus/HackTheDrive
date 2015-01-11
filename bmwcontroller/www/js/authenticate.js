(function() {
  var BMWClient, config, bmwClient;

  BMWClient = this.BMWClient;

  config = {
    application: '9a2bad4b-b159-40da-b880-d59ed4154b76',
    redirect_uri: document.URL,
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
        bmwClient.get(bmwClient.model("User"), {
          id: result.UserId
        }, function(error, result) {
          if (error) {
            console.log('Error retrieving User');
            return;
          }
          var name = '';
          if (result.FirstName) {
            name += result.FirstName;
          } else if (result.UserName) {
            name += result.UserName;
          } else if (result.LastName) {
            name += result.LastName;
          } else if (result.Email) {
            name += result.Email;
          } else {
            name += "Unknown";
          }
          onAuthenticated(bmwClient, name);
        });
      }
    });
  });
}).call(this);