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
