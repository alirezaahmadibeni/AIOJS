var AIO = (function () {

    var instance;


    function init() {

        var io, ioB, broker, brokerB;

        function getBroker() {

            const mqtt = require('mqtt');
            broker = mqtt.connect('mqtt://localhost',{username:"broker username", password:"broker password"});

            return broker;
        }

        function getIO1(server) {

            io = require("socket.io")().listen(server);
            return io;
        }

        function getIO2() {
            return io;
        }

        function ioBridge() {
            this.data = [];
            var oldPush = this.data.push;
            this.data.push = function () {
                //do something
                oldPush.apply(this, arguments);
            };
        }


        function brokerBridge() {
            this.data = [];
            var oldPush = this.data.push;
            this.data.push = function () {
                //do something
                oldPush.apply(this, arguments);
            };
        }


        Object.defineProperty(ioBridge.prototype, "data", {
            enumerable: true,
            configurable: true,
            set: function (v) {

                this._data = v;
                if (this.__callback) {

                    this.__callback(this._data);
                }


            },
            get: function () {
                return this._data;
            }
        });


        Object.defineProperty(brokerBridge.prototype, "data", {
            enumerable: true,
            configurable: true,
            set: function (v) {

                this._data = v;
                if (this.__callback) {

                    this.__callback(this._data);
                }


            },
            get: function () {
                return this._data;
            }
        });


        function setCallback(callback) {

            ioBridge.prototype.__callback = callback;
        }

        function setBrokerCallback(callback) {

            brokerBridge.prototype.__callback = callback;
        }


        function getIoBridge() {
            if (!ioB) {
                ioB = new ioBridge()
            }
            return ioB;
        }


        function getBrokerBridge() {
            if (!brokerB) {
                brokerB = new brokerBridge()
            }
            return brokerB;
        }


        function getIO(server) {

            if (arguments.length == 1) {
                return getIO1(server);
            } else {
                return getIO2();
            }


        }


        return {

            getIO: getIO,
            getIoBridge: getIoBridge,
            getBrokerBridge: getBrokerBridge,
            setCallback: setCallback,
            setBrokerCallback: setBrokerCallback,
            getBroker: getBroker


        };


    }


    return {

        getInstance: function () {

            if (!instance) {
                instance = init();
            }

            return instance;

        }

    };//end return


})();


module.exports = AIO;
