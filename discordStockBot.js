// Config
const {prefix, discToken, fhKey} = require('./config.json');

// Discord
const Discord = require('discord.js');
const discClient = new Discord.Client();
discClient.login(discToken); 

// Finnhub
const finnhub = require('finnhub');
const fh_api_key = finnhub.ApiClient.instance.authentications['api_key'];
fh_api_key.apiKey = fhKey;
const fhClient = new finnhub.DefaultApi();

// Help function
function helpPrinter(currentMessage) {
    currentMessage.channel.send(
        "```Usable Functions\n" +
        "-------------------\n" +
        "$p - Prints the current price as well as daily stats of the stock\n" +
        "$pc - Percent Change\n" +
        "-------------------\n" +
        "Example Usage: $p AAPL MSFT\n" + 
        "```"
    );

}

// Gets a current price of the stocks given
function stockPrice(stockTickers, currentMessage) {
    for (let i = 0; i < stockTickers.length; i++) {
        fhClient.quote(stockTickers[i], (error,data,response) => {
        console.log(stockTickers[i], data);

        currentMessage.channel.send(
            "```Stock: " + stockTickers[i] + "\n" +
            "-----------------------"  + "\n" +
            "Current Price: " + data.c + "\n" +
            "Low: " + data.l + "\n" +
            "High: " + data.h + "\n" +
            "Open: " + data.o + "\n" +
            "Previous Close: " + data.pc + "\n" +
            "-----------------------```"
            );
        });
    }
}

// Percent Change
function findPercentChange(stockTickers, currentMessage) {
    for (let i = 0; i < stockTickers.length; i++) {
        fhClient.quote(stockTickers[i], (error,data,response) => {
        console.log(stockTickers[i], data);
        
        let percentChange = (data.c - data.o) / data.o;
        currentMessage.channel.send(
            "```Stock: " + stockTickers[i] + "\n" +
            "-----------------------\n" +
            "Open: " + data.o + "\n" +
            "Current: " + data.c + "\n" +
            "Percent Change: " + percentChange.toFixed(2) + "%\n" + 
            "-----------------------```" 
            );
        });
    }    
}

// Start of script. Triggers on message
discClient.on('message', message => {

    // Exit if the message doesn't start with the prefix, if its a bot message, or if someone is just typing a dollar amount
    if (!message.content.startsWith(prefix) || message.author.bot || message.content.match(/\$\d*/)) return;
    
    // Holds the arguments after the prefix
    const parameters = message.content.split(" ");
    const action = parameters[0].substring(1);
    parameters.shift();

    // Determine which function to run
    switch(action){
        case 'p':
            stockPrice(parameters, message);
            break;
        case 'pc':
            findPercentChange(parameters, message);
            break;
        case 'help':
            helpPrinter(message);
            break;
        default:
            message.channel.send("``` Type $help for commands ```")
            break;
    }
});


/* TODO:

Symbol Lookup
Check if stock does not exist before running any functions

*/
