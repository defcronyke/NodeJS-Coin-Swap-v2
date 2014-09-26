var https = require("https"),
	fs	 = require("fs");

/*
// Get a new userkey cookie and save it to disk.
func Get_userkey_cookie(activation_code string) *http.Cookie {

    var result *http.Cookie

    tr := &http.Transport{
        TLSClientConfig: &tls.Config{InsecureSkipVerify : true},
    }
    client := &http.Client{Transport: tr}
    // api url that responds with json data
    url := "https://api.coin-swap.net/initialize/" + activation_code

    // Request the url response which will be in the form of json
    urlResponse, urlError := client.Get(url)

    // Check if there was an error:
    if urlError != nil {
        fmt.Printf("Url Error: %v\n", urlError)
        return result
    }
    
    apiResponse,apiError := ioutil.ReadAll(urlResponse.Body)
    urlResponse.Body.Close() // Close the url request
    // Check if there was an error
    if apiError != nil {
        fmt.Printf("API Error: %v\n", apiError)
        return result
    }
    _ = apiResponse
    //fmt.Printf("API Response: %v\n", apiResponse)
    
    fmt.Printf("Cookies:\n")
    
    got_userkey := false
    var userkey *http.Cookie
    for c_num, c := range urlResponse.Cookies() {
        fmt.Printf("%v:\n  Name: %v\n  Value: %v\n\n",c_num, c.Name, c.Value)
        
        if c.Name == "userkey" {
            got_userkey = true
            userkey = c
            break
        }
    }
    
    if !got_userkey {
        fmt.Printf("Cookie Error: Didn't get a userkey cookie from server.\n")
        return result
    }
    
    result = userkey
    Save_cookie(userkey)
    
    return result
} 
*/

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

var Load_userkey_cookie = function(config, callback) {
	
	var result;
	if (!fs.existsSync("./userkey.cookie")) {
		
		console.log("Userkey cookie not found. Attempting to get a new one.");
		
		if (config.initkey === "") {
			
			console.log("Error: You need to specify your activation key in the config file's initkey section.");
		
		} else {
			
			Get_userkey_cookie(config.initkey, function(userkey_cookie) {
				
				if (userkey_cookie === "") {
					
					console.log("Error: Coin-Swap didn't send us a userkey cookie.");
					
				} else {
					
					console.log("Userkey cookie: %s", userkey_cookie);
					result = userkey_cookie;
					Save_cookie(result, function() {
						
						console.log("userkey.cookie saved to disk.");
						callback(result);
						
					});
				}
			});
		}
	} else {
		
		// Load_cookie("userkey.cookie")
		callback(result);
		return;
	}
};

exports.Load_userkey_cookie = Load_userkey_cookie;