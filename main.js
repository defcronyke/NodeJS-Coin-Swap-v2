/*  
    NodeJS Coin-Swap v2 API wrapper library

        Designed to make it easy to connect software with Coin-Swap.net.

    To use the private API, you need to log in to your Coin-Swap account, go to 
    the Balance section, then click on the API Settings tab. Where it says 
    "Activate your API key", click the "Request Activation Code" button. The 
    button will turn into an activation code. You'll need to put the activation 
    code in a file called bot.cfg like so:
   
       {"apikey":"your-api-key-here","initkey":"your-activation-code-here"}
*/

var config_module = require("./config"),
    cookie_module = require("./cookie_manager"),
    coinswapapi = require("./coinswapapi");

var main = (function() {
    
    // Public API   TODO: Make public API calls here.
    
    // Examples
    /*
    coinswapapi.Getallmarkets(function(markets) {
        console.log("Markets:");
        console.log(markets);
    });
    */
   
    /*
    coinswapapi.GetMarketHistory("DOGE/BTC", function(history) {
        console.log("history:");
        console.log(history);
    });
    */
    /*
    coinswapapi.GetMarketOrders("DOGE/BTC", "BUY", function(orders) {
        console.log("orders:");
        console.log(orders);
    });
    */
   
    /*
    coinswapapi.GetMarketStats("DOGE/BTC", function(stats) {
        console.log("stats:");
        console.log(stats);
    });
    */
        
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
            
            // TODO: Make private or public API calls here.
            
            // Examples:
            /*
            coinswapapi.Accountbalance(config, cookie, "DOGE", function(account) {
                console.log("%s account balance: %s", account["symbol"], account["balance"]);
            });
            */
            
            /*
            coinswapapi.Buy(config, 5835, 0.00000049, 100, cookie, function(order) {
                console.log("order:");
                console.log(order);
                
                coinswapapi.Cancelorder(config, cookie, order, function(cancelled_order) {
                    console.log("order cancelled:");
                    console.log(cancelled_order);
                });
            });
            */
            
            /*
            coinswapapi.Sell(config, 5835, 0.00000149, 100, cookie, function(order) {
                console.log("order:");
                console.log(order);
            });
            */
           
            /*
            coinswapapi.ChangePrice(config, "vAKk2sYwhlUpG5utI1EJtvBm5GgMOIRE", 0.00000301, cookie, function(res) {
                console.log("price changed:");
                console.log(res);
            });
            */
           
            /*
            coinswapapi.GetOpenorders(config, cookie, function(orders) {
                console.log("open orders:");
                console.log(orders);
            });
            */
           
            /*
            coinswapapi.GetSingleorder(config, cookie, "1hTsGlUse5GDh9rFWC6S82nDQYOxCtzi", function(order) {
                console.log("open order:");
                console.log(order);
            });
            */
        });
    });

})();	// main() called in-place, because I like having a main() okay?!
