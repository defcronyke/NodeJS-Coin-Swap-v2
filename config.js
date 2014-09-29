/*
    Config

        Loads a config file, or makes a new empty one if it's not found on disk.
*/

var fs = require('fs');

var Config = {
    "apikey": "",
    "initkey": "",
};

// Load a config file or create a new one if it's not found.
var Init_config = function(callback) {

    // try to read bot.cfg from disk
    fs.readFile("./bot.cfg", 'utf8', function(err, data) {

        if (err) {

            console.log("Config file not found. Making a new one. You'll need to put your apikey and initkey (activation code) from your coinswap account in this new bot.cfg file.");
            create_config();

        } else {

            Config = JSON.parse(data);
            callback(Config);
        }
    });
};

// Create a new config file.
var create_config = function() {

    var conf_str = JSON.stringify(Config);

    fs.writeFile("bot.cfg", conf_str, function(err) {
        if (err) {
            console.log("Error: Couldn't write new config file: %s", err);
        }
    });
};

exports.Init_config = Init_config;
