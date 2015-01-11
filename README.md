# PlayNow - HackTheDrive

PlayNow is the most fun way possible to pass the wait time during charging. The very own car with its steering wheel and accelerator pedal serves as a controller for the challenging Open Source game HexGL in which i3 owners compete with each other to reach the highest scores at hundreds of ChargePoints. Excellent driving behaviour measured by Zendrive can give an extra boost to increase the chance to reach top positions. All this is combined in a multi-platform app generated with PhoneGap.
This prototype shows the variety of possibilities to use the i3 as a controller for virtual reality scenarios. It barely scratches the surface of what will be possible with future car API extensions such as virtual driving lessons as well as safe driving trainings.

Our prototype combines the information of the BMW Car Data API and Zendrive API with a mobile gaming app to connect reality with virtuality. The score data is stored in a MongoDB instance connected to a node.js WebSocket server on a DigitalOcean droplet. The Open Source game HexGL and Polymer frontend is encapsulated in a PhoneGap created mobile app powered by a Heroku instance. 
