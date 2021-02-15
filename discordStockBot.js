// Config
const { prefix, discToken, fhKey} = require('./config.json');

// Discord
const Discord = require('discord.js');
const discClient = new Discord.Client();
discClient.login(discToken);

// Finnhub
const finnhub = require('finnhub');
const fh_api_key = finnhub.ApiClient.instance.authentications['api_key'];
fh_api_key.apiKey = fhKey
const fhClient = new finnhub.DefaultApi()


discClient.on('message', message => {

    // Exit if the message doesn't start with the prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Tickers will be held in this variable
    const inputTickers = message.content.substring(1).toUpperCase();


    fhClient.quote(inputTickers, (error,data,response) => {
        console.log( inputTickers, data)

        // Percent change from previous close to current
        percentChange = ((data.c - data.pc) / data.pc) * 100

        if (data.c == 0) {
            message.channel.send("```$" + inputTickers + " is not a stock ```");
        }
        else {
        message.channel.send(
            "```Stock: " + inputTickers + "\n" +
            "-----------------------"  + "\n" +
            "Current Price: " + data.c + "\n" +
            "Low: " + data.l + "\n" +
            "High: " + data.h + "\n" +
            "Open: " + data.o + "\n" +
            "Previous Close: " + data.pc + "\n" +
            "-----------------------"  + "\n" +
            "Percent Change: " + percentChange.toFixed(2) + "%```"
            );
        }
    });
});
