/*
    Cookie Manager

        Deals with loading your userkey.cookie from disk 
        or fetching a new one from Coin-Swap.  
*/

var https = require("https"),
    fs	 = require("fs");

// Save a cookie to disk.
var Save_cookie = function(filename, cookie, callback) {
    
    fs.writeFile(filename, cookie, {mode: 384}, function(err) {

        if (err) {
            console.log("Error: couldn't write %s file: %s", filename, err);
            return;
        }

        callback();
    });
};

// Load a cookie from disk.
var Load_cookie = function(filename, callback) {

    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
            console.log("Error: couldn't read %s file: %s", filename, err);
            return;
        }

        callback(data);
    });
};

// Get a new userkey cookie from Coin-Swap.
var Get_userkey_cookie = function(activation_code, callback) {

    var result = "";

    var options = {
        host: "api.coin-swap.net",
        path: "/initialize/" + activation_code,
        rejectUnauthorized: false,
    };

    var httpsclient_callback = function(res) {

        var res_str = "";

        res.on("data", function(chunk) {  // When we get a chunk of data from the https request.
            res_str += chunk;
        });

        res.on("end", function() {        // Once we have the whole https response.

            console.log(res_str);

            var cookies = res.headers["set-cookie"]; // Get all cookies from the set-cookie header.

            (function find_userkey_cookie(n) {       // Look for the userkey cookie.

                if (cookies[n].split("=")[0] == "userkey") {    // base case: If we find a userkey cookie.
                    result = cookies[n];
                    callback(result);
                    return;
                }

                if (n >= cookies.length-1) {    // base case: If a userkey cookie is not found.
                    callback(result);
                    return;	
                }

                find_userkey_cookie(n+1);   // recursive case: If there are more cookies to look through.

            })(0);   // Call this function in place.
        });
    };

    https.request(options, httpsclient_callback).end();    // Make an HTTPS request to Coin-Swap for a new userkey cookie.
};

// Load userkey cookie from disk, if not found retrieve a new one from Coin-Swap.
var Load_userkey_cookie = function(config, callback) {

    var result;
    if (!fs.existsSync("./userkey.cookie")) {  // If userkey.cookie file isn't found on disk.

        console.log("Userkey cookie not found. Attempting to get a new one.");

        if (config.initkey === "") {  // If the user hasn't yet filled in the initkey section of the config file.

            console.log("Error: You need to specify your activation code in the config file's initkey section.");
		
        } else {      // If the initkey is present in the config file.

            Get_userkey_cookie(config.initkey, function(userkey_cookie) {    // Get a new userkey.cookie from Coin-Swap.

                if (userkey_cookie === "") {    // If Coin-Swap didn't respond with a userkey cookie.

                    console.log("Error: Coin-Swap didn't send us a userkey cookie.");

                } else {  // If we successfully received a new userkey.cookie.

                    result = userkey_cookie;
                    Save_cookie("./userkey.cookie", result, function() {   // Save the new userkey.cookie to disk.

                        console.log("userkey.cookie saved to disk.");
                        callback(result);
                    });
                }
            });
        }
    } else {   // If userkey.cookie file is found on disk.	

        Load_cookie("userkey.cookie", function(result) {  // Load the userkey.cookie from disk.

            callback(result);
        });

        return;
    }
};

exports.Load_userkey_cookie = Load_userkey_cookie;
