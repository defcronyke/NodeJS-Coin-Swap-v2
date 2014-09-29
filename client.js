var https = require("https"),
    url = require('url');

// Perform a private API request.
var DialCoinSwapPrivate = function(cs_url, cookie, callback) {
    
    var options = url.parse(cs_url);    // Populate the hostname, path, etc.
    options["rejectUnauthorized"] = false;  // Ignore self-signed ssl certificate error.
    options["headers"] = { "Cookie": cookie };  // Set the userkey cookie.

    var httpsclient_callback = function(res) {
        var res_str = "";

        res.on("data", function(chunk) {  // When we get a chunk of data from the https request.
            res_str += chunk;
        });

        res.on("end", function() {  // When we have the complete response.
            callback(res_str);
        });
    };
    
    https.request(options, httpsclient_callback).end(); // Perform the API request.
};

// Perform a public API request. 
var DialCoinSwapPublic = function(cs_url, callback) {
    
    var options = url.parse(cs_url);    // Populate the hostname, path, etc.
    options["rejectUnauthorized"] = false;  // Ignore self-signed ssl certificate error.

    var httpsclient_callback = function(res) {
        var res_str = "";

        res.on("data", function(chunk) {  // When we get a chunk of data from the https request.
            res_str += chunk;
        });

        res.on("end", function() {  // When we have the complete response.
            callback(res_str);
        });
    };
    
    https.request(options, httpsclient_callback).end(); // Perform the API request.
};

exports.DialCoinSwapPrivate = DialCoinSwapPrivate;
exports.DialCoinSwapPublic = DialCoinSwapPublic;
