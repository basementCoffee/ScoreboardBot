require('dotenv').config();
let version = require('./package.json').version;
//Importing from .env
const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');
const token = process.env.TOKEN.replace(/\\n/gm, '\n');


//Google stuff
const {GoogleApis} = require('googleapis');
const {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} = require('google-spreadsheet');
var doc = new GoogleSpreadsheet(spreadsheet_id);


const Discord = require('discord.js');
require('discord-reply');

//Button testing
//const discord = require('discord.js'); // Define / Require the discord.js module.
const buttonClient = new Discord.Client(); // Creating a discord.js client instance (constructor).
const disbut = require('discord-buttons');
disbut(buttonClient); // Requiring discord-buttons and binding it to the initialised client.


// Initialize the sheet
var sheet1;
var sheet2;
var sheet3;
var sheet4;
var sheet5;

//Google login/auth
(async function () {
    await initializeAuth();
}());

async function initializeAuth() {
    await doc.useServiceAccountAuth({
        client_email: client_email,
        private_key: private_key,
    }, function (err) {

        // Get all of the rows from the spreadsheet.
        doc.getRows(1, function (err, rows) {
        });
    });


    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title); // title of the sheet
    sheet1 = await doc.sheetsByIndex[0];
    sheet2 = await doc.sheetsByIndex[1];
    sheet3 = await doc.sheetsByIndex[2];
    sheet4 = await doc.sheetsByIndex[3];
    sheet5 = await doc.sheetsByIndex[4];
    console.log(sheet1.title); // title of the tabs
    console.log(sheet2.title);
    console.log(sheet3.title);
    console.log(sheet4.title);
    console.log(sheet5.title);
}

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth({
    client_email: client_email,
    private_key: private_key,
}, function (err) {

    // Get all of the rows from the spreadsheet.
    doc.getRows(1, function (err, rows) {
    });
});


// Bot initialization
const fs = require('fs');

const {MessageEmbed, Client} = require('discord.js');
const bot = new Client();
bot.commands = new Discord.Collection();


const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}


//Console log on wake
bot.once('ready', () => {
    console.log('CANUK Bot is online!');
    bot.user.setActivity("WoWS | !canuk help", {type:"PLAYING"});
});

const firstPrefix = '!canuk ';
const secondPrefix = '!canuck ';
//Prefix
bot.on('message', message => {
    message.content = message.content.toLowerCase();
    if (message.author.bot || (!message.content.startsWith(firstPrefix) && !message.content.startsWith(secondPrefix))) {
        return;
    }

//Args split
    if (message.content.startsWith(firstPrefix)) {
        var args = message.content.slice(firstPrefix.length).split(/ +/);
    } else if (message.content.startsWith(secondPrefix)) {
        var args = message.content.slice(secondPrefix.length).split(/ +/);
    }

    const command = args.shift().toLowerCase();

    if (command === 'version') return message.channel.send((new MessageEmbed()).setTitle('Version').setDescription(`[${version}](https://github.com/basementCoffee/ScoreboardBot)`));




    //Commands

    if (command === 'bb' || command === 'battleship') {

        sheet1.loadCells('A1:AL595').then(() =>
            bot.commands.get('battleship').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet1, bot)
        );

    } else if (command === 'cruiser' || command === 'cl' || command === 'ca') {

        sheet2.loadCells('A1:AO500').then(() =>
            bot.commands.get('cruiser').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet2, bot)
        );

    } else if (command === 'destroyer' || command === 'dd') {

        sheet3.loadCells('A1:AO500').then(() =>
            bot.commands.get('destroyer').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet3, bot)
        );

    } else if (command === 'cv' || command === 'carrier') {

        sheet4.loadCells('A1:AL500').then(() =>
            bot.commands.get('carrier').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet4, bot)
        );

    } else if (command === 'universal') {

        sheet5.loadCells('A1:E500').then(() =>
            bot.commands.get('universal').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet5, bot)
        );

    } else if (command === 'help') {

        bot.commands.get('help').execute(message, args, Discord);

    } else if (command === 'version') {

        message.channel.send("CANUK Bot is currently on V2.2.2");

    } else if (command === 'info') {

        message.channel.send(info);

    } else if (command === 'keys' || command === 'keywords') {

        bot.commands.get('keys').execute(message, args, Discord, bot);

    } else if (command === 'skynet') {

        message.channel.send("https://www.youtube.com/watch?v=_Wlsd9mljiU");

    } else if (command === 'scores' || command === 'scoreboard' || command === 'leaderboard') {

        message.channel.send('The scoreboards are updating.');
        bot.commands.get('bbscores').execute(message, args, bot);
        bot.commands.get('ddscores').execute(message, args, bot);
        bot.commands.get('cruiserscores').execute(message, args, bot);
        bot.commands.get('cvscores').execute(message, args, bot);
        bot.commands.get('universalscores').execute(message, args, bot);


    } else if (command === 'sheet') {

        let button = new disbut.MessageButton()
            .setStyle('url')
            .setURL('https://docs.google.com/spreadsheets/d/1N_DoscLuWj2AZ90ZEDCQBH5FTFLaU-ZPriVi2ZKHkOo/edit?usp=sharing')
            .setLabel('Holy Sheet')
        //.setDisabled();

        message.channel.send('Click me!', button);

    } //else if (command === 'add') {

    //bot.channels.cache.get('841438933824569375').send("Dont delete me 2");
    //bot.channels.cache.get('841438933824569375').send("Dont delete me 3");
    //bot.channels.cache.get('841438933824569375').send("Dont delete me 4");
    //bot.channels.cache.get('841438933824569375').send("Dont delete me 5");

    //}
});


bot.login(token);