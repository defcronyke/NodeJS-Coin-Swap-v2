var https = require("https"),
	fs	 = require("fs");

var Save_cookie = function(cookie, callback) {
	
	fs.writeFile("./userkey.cookie", cookie, {mode: 384}, function(err) {
		
		if (err) {
			console.log("Error: couldn't write userkey.cookie file: %s", err);
			return;
		}
		
		callback();
		
	});
};

var Get_userkey_cookie = function(activation_code, callback) {
	
	var result = "";
	
	var options = {
		host: "api.coin-swap.net",
		path: "/initialize/" + activation_code,
		rejectUnauthorized: false,
	};
	
	var httpsclient_callback = function(res) {
		
		var res_str = "";
		
		res.on("data", function(chunk) {
			res_str += chunk;
		});
		
		res.on("end", function() {
			//console.log(res.headers);
			console.log(res_str);
			
			var cookies = res.headers["set-cookie"];
			
			(function find_userkey_cookie(n) {	// Look for the userkey cookie.
				
				if (cookies[n].split("=")[0] == "userkey") {
					result = cookies[n];
					callback(result);
					return;
				}
				
				if (n >= cookies.length-1) {	// base case: userkey cookie not found.
					callback(result);
					return;	
				}
				
				find_userkey_cookie(n+1);	// recursive case: There are more cookies to look through.
				
			})(0);	// Call function in place.
		});
	};
	
	https.request(options, httpsclient_callback).end();
};

var Load_cookie = function(filename, callback) {
	
	fs.readFile(filename, 'utf8', function(err, data) {
		if (err) {
			console.log("File Read Error: %s", err);
			return;
		}

		console.log("Loaded %s from disk: %s", filename, data);
		callback(data);
	});
};

var Load_userkey_cookie = function(config, callback) {
	
	var result;
	if (!fs.existsSync("./userkey.cookie")) {								// If userkey.cookie file isn't found on disk.
		
		console.log("Userkey cookie not found. Attempting to get a new one.");
		
		if (config.initkey === "") {										// If the user hasn't yet filled in the initkey section of the config file.
			
			console.log("Error: You need to specify your activation key in the config file's initkey section.");
		
		} else {															// If the initkey is present in the config file.
			
			Get_userkey_cookie(config.initkey, function(userkey_cookie) {	// Get a new userkey.cookie from Coin-Swap.
				
				if (userkey_cookie === "") {								// If Coin-Swap didn't respond with a userkey cookie.
					
					console.log("Error: Coin-Swap didn't send us a userkey cookie.");
					
			} else {														// If we successfully received a new userkey.cookie.
					
					console.log("Userkey cookie: %s", userkey_cookie);
					result = userkey_cookie;
					Save_cookie(result, function() {						// Save the new userkey.cookie to disk.
						
						console.log("userkey.cookie saved to disk.");
						callback(result);
						
					});
				}
			});
		}
	} else {																// If userkey.cookie file is found on disk.	

		Load_cookie("userkey.cookie", function(result) {					// Load the userkey.cookie from disk.
			
			callback(result);
			
		});
		
		return;
	}
};

exports.Load_userkey_cookie = Load_userkey_cookie;
