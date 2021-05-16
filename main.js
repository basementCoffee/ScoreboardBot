require('dotenv').config();

//Importing from .env
const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');
const private_key_id = process.env.PRIVATE_KEY_ID.replace(/\\n/gm, '\n');
const token = process.env.TOKEN.replace(/\\n/gm, '\n');
const prefix = process.env.PREFIX.replace(/\\n/gm, '\n');
const version = process.env.VERSION.replace(/\\n/gm, '\n');
const info = process.env.INFO.replace(/\\n/gm, '\n');

const {google, GoogleApis} = require('googleapis');
const {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} = require('google-spreadsheet');

var doc = new GoogleSpreadsheet(spreadsheet_id);


// Initialize the sheet
var sheet1;
var sheet2;
var sheet3;
var sheet4;
var sheet5;


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
            console.log(rows);
        });
        console.log("done");
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
        console.log(rows);
    });
    console.log("done");
});


// Bot initialization
const fs = require('fs');
const Discord = require('discord.js');
const {SSL_OP_SSLEAY_080_CLIENT_DH_BUG} = require('constants');
const {gamesConfiguration} = require('googleapis/build/src/apis/gamesConfiguration');
const {sheets} = require('googleapis/build/src/apis/sheets');

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
});


//Prefix
bot.on('message', message => {
    message.content = message.content.toLowerCase();
    if (!message.content.startsWith(prefix) || message.author.bot) return;


    //Args split
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    bot.user.setActivity("WoWS [!canuk help]");


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

        message.channel.send("CANUK Bot is currently on " + version);

    } else if (command === 'info') {

        message.channel.send(info);

    } else if (command === 'keys' || command === 'keywords') {

        bot.commands.get('keys').execute(message, args, Discord, bot);

    } else if (command === 'skynet') {

        message.channel.send("https://www.youtube.com/watch?v=_Wlsd9mljiU");

    } else if (command === 'scores' || command === 'scoreboard' || command === 'leaderboard') {

        message.channel.send('The scoreboard is updating.');
        bot.commands.get('scores').execute(message, args, bot);


    }
});


bot.login(token);

