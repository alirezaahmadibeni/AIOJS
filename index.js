var express = require("express"),
    app = express(),
    http = require("http"),
    https = require("https"),
    server = http.createServer(app),
    io = require("./AIO").getInstance().getIO(),
    ioBridge = (require("./AIO").getInstance()).getIoBridge(),
    setCallback = (require("./AIO").getInstance()).setCallback,
    broker = (require("./AIO").getInstance()).getBroker(),
    brokerBridge = (require("./AIO").getInstance()).getBrokerBridge(),
    setBrokerCallback = (require("./AIO").getInstance()).setBrokerCallback;


const port = process.env.PORT || 4000;
const ip = '0.0.0.0';
const fullAddressServer = 'http://0.0.0.0:4000/';



server.listen(port, ip, function () {

    console.log('server listening at port 4000');

});


broker.on('connect', () => {

    console.log("connected to mqtt server");
    broker.subscribe('yourtopic');

});

app.get('/', function (req, res) {
    return res.status(200).send("simple app for manage device transactions over mqtt protocol");
});



app.get('/transaction', function (req, res) {

    //send data with AIO to device for charge nfc card
    broker.publish("charge", JSON.stringify({
        device_id: "AADFDFDFDFDF",// fake id
        bill: 50000,
        userID: 202564558
    }));

    //manage response from devices
    setBrokerCallback((v) => {

        v.forEach((response, index, array) => {
            //check device_id
            if (response.device_id && response.device_id == "AADFDFDFDFDF") {
                //TODo now manage your reponse

            }
        })

    });


    return res.status(200).send("transaction");
});
