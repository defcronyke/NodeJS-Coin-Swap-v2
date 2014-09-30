var client_module = require("./client");


/* --- Public API --- */

// The Getallmarkets function will request a market summary for every market that Coin-Swap.net has active.
var Getallmarkets = function(callback) {
    var url = "https://api.coin-swap.net/market/summary";
    client_module.DialCoinSwapPublic(url, function(res) {
        var markets = JSON.parse(res);
        callback(markets);
    });
};

/* The GetMarketHistory function will request trade history for a specific market.
   The market variable is a string in the form of a pairing.
   Example: var market = "DOGE/BTC"
   You must pass this string variable to the function. */
var GetMarketHistory = function(market, callback) {
    var url = "https://api.coin-swap.net/market/history/" + market;
    client_module.DialCoinSwapPublic(url, function(res) {
        var history = JSON.parse(res);
        callback(history);
    });
};

/* The GetMarketOrders function will retrieve open orders for a specific market.
   The market variable is a string in the form of a pairing.
   Example: var market = "DOGE/BTC"
   You must pass this string variable to the function, and also a type of order,
   which should be BUY or SELL. */  
var GetMarketOrders = function(market, type, callback) {
    var url = "https://api.coin-swap.net/market/orders/" + market + "/" + type;
    client_module.DialCoinSwapPublic(url, function(res) {
        var orders = JSON.parse(res);
        callback(orders);
    });
};

/* The GetMarketStats function will request stats on a specific market.
   The market variable is a string in the form of a pairing.
   Example: var market = "DOGE/BTC"
   You must pass this string variable to the function. */
var GetMarketStats = function(market, callback) {
    var url = "https://api.coin-swap.net/market/stats/" + market;
    client_module.DialCoinSwapPublic(url, function(res) {
        var stats = JSON.parse(res);
        callback(stats);
    });
};

/* --- End Public API --- */


/* --- Private API --- */

// This will retrieve an account balance for the specified currency.
var Accountbalance = function(config, cookie, coin, callback) {
    var url = "https://api.coin-swap.net/balance/" + coin + "/" + config["apikey"];
    client_module.DialCoinSwapPrivate(url, cookie, function(res) {
        var balance = JSON.parse(res);
        callback(balance);
    });
};

/* The Buy function will create a market order of type buy. You must pass it the config,
   the marketid, the price, the amount, the cookie, and a callback which runs when the function is finished. */
var Buy = function(config, marketid, price, amount, cookie, callback) {
    var url = "https://api.coin-swap.net/order/v2/buy/" + marketid + "/" + config["apikey"] + "/" + price.toString() + "/" + amount.toString();
    client_module.DialCoinSwapPrivate(url, cookie, function(res) {
        var order = JSON.parse(res);
        callback(order);
    });
};

/* The Sell function will create a market order of type sell. You must pass it the config struct,
   the marketid, the price, the amount, and the cookie. */
var Sell = function(config, marketid, price, amount, cookie, callback) {
    var url = "https://api.coin-swap.net/order/v2/sell/" + marketid + "/" + config["apikey"] + "/" + price.toString() + "/" + amount.toString();
    client_module.DialCoinSwapPrivate(url, cookie, function(res) {
        var order = JSON.parse(res);
        callback(order);
    });
};

// Cancel an order.
var Cancelorder = function(config, cookie, openorder, callback) {
    var url = "https://api.coin-swap.net/order/cancel/" + openorder["orderid"] + "/" + config["apikey"];
    client_module.DialCoinSwapPrivate(url, cookie, function(res) {
        var order = JSON.parse(res);
        callback(order);
    });
};

// Change the price of an order.
var ChangePrice = function(config, orderid, price, cookie, callback) {
    var url = "https://api.coin-swap.net/order/change/" + orderid + "/" + config["apikey"] + "/" + price.toString();
    client_module.DialCoinSwapPrivate(url, cookie, function(res) {
        var order = JSON.parse(res);
        callback(order);
    });
};

// The GetOpenorders function will request all open orders for this user.
var GetOpenorders = function(config, cookie, callback) {
    var url = "https://api.coin-swap.net/order/open/" + config["apikey"];
    client_module.DialCoinSwapPrivate(url, cookie, function(res) {
        var orders = JSON.parse(res);
        callback(orders);
    });
};

// This will retrieve information for the specified order.
var GetSingleorder = function(config, cookie, orderid, callback) {
    var url = "https://api.coin-swap.net/order/single/" + orderid + "/" + config["apikey"];
    client_module.DialCoinSwapPrivate(url, cookie, function(res) {
        var orders = JSON.parse(res);
        callback(orders);
    });
};

/* --- End Private API --- */

exports.Getallmarkets = Getallmarkets;
exports.GetMarketHistory = GetMarketHistory;
exports.GetMarketOrders = GetMarketOrders;
exports.GetMarketStats = GetMarketStats;

exports.Accountbalance = Accountbalance;
exports.Buy = Buy;
exports.Sell = Sell;
exports.Cancelorder = Cancelorder;
exports.ChangePrice = ChangePrice;
exports.GetOpenorders = GetOpenorders;
exports.GetSingleorder = GetSingleorder;
