/*  
    NodeJS Coin-Swap v2 API wrapper library
    
        Designed to make it easy to connect software with Coin-Swap.net.
    
    If you get this message:
      "This request is not valid. Please request a new API initilization or 
       contact support if the problem persists.."
    You need to log into your Coin-Swap account, go to the Balance section,
    then click on the API Settings tab. Where it says "Activate your API 
    key", click the "Request Activation Code" button. The button will turn
    into an activation code. You'll need to create a bot.cfg file in this
    project's folder and put the activation code in it like so:
       
       {"apikey":"your-api-key-here","initkey":"your-activation-code-here"}
*/

var config_module = require("./config"),
	cookie_module = require("./cookie_manager");

var main = (function() {
/*
	To use any private API calls you must have the config file initialized and filled out.
	Check for a config file. If there is no config file, create a blank template.
	If you do not plan to use private API calls, you can comment this out.
*/
	var config = {};
	config_module.Init_config(function(config_obj) {
		
		config = config_obj;
		
	/*
		The following will check for the required cookie and must be used for private API calls.
		If no cookie is found it will attempt to retrieve it from the server.
		The config file must be filled out before the package can be used.
		If you do not plan to use private API calls, you can comment this out.
	*/
		cookie_module.Load_userkey_cookie(config, function(cookie) {
			
			console.log("Loaded userkey cookie.");
			
		});
	});

})();	// main() called in-place, because I like having a main() okay?!
