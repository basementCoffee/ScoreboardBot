require('dotenv').config();
let version = require('./package.json').version;
require('discord-reply');


// Importing from .env
const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');
const token = process.env.TOKEN.replace(/\\n/gm, '\n');
const { exec } = require("child_process");
const Discord = require('discord.js');


// Google stuff
const {GoogleApis} = require('googleapis');
const {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} = require('google-spreadsheet');
var doc = new GoogleSpreadsheet(spreadsheet_id);


// Initialize the sheet
var sheet0;
var sheet1;
var sheet2;
var sheet3;
var sheet4;
var sheet5;


// whichBoard allows verification to update just the corresponding score board embed; option is defaulted to updating all of them as per legacy
// 0 is bb, 1 is dd, and so on; 6 is all
var whichBoard = 6;


// Google login/auth
(async function () {
    await initializeAuth();
}());


async function initializeAuth() {
    await doc.useServiceAccountAuth({
        client_email: client_email,
        private_key: private_key,
    }, function (err) {
        // Get all the rows from the spreadsheet.
        doc.getRows(1, function (err, rows) {
        });
    });
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title); // title of the sheet
    sheet0 = await doc.sheetsByIndex[6];
    sheet1 = await doc.sheetsByIndex[7];
    sheet2 = await doc.sheetsByIndex[8];
    sheet3 = await doc.sheetsByIndex[9];
    sheet4 = await doc.sheetsByIndex[10];
    sheet5 = await doc.sheetsByIndex[11];
    console.log(sheet0.title); // title of the tabs
    console.log(sheet1.title);
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

    // Get all the rows from the spreadsheet.
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


// Console log on wake
bot.once('ready', () => {
    console.log('CANUK Bot is online!');
    bot.user.setActivity("WoWS | !canuk help", {type:"PLAYING"});
});


// Prefix
const firstPrefix = '!canuk ';
const secondPrefix = '!canuck ';


bot.on('message', message => {
    message.content = message.content.toLowerCase();
    if (message.author.bot || (!message.content.startsWith(firstPrefix) && !message.content.startsWith(secondPrefix))) {
        return;
    }

    // Args split
    if (message.content.startsWith(firstPrefix)) {
        var args = message.content.slice(firstPrefix.length).split(/ +/);
    } else if (message.content.startsWith(secondPrefix)) {
        var args = message.content.slice(secondPrefix.length).split(/ +/);
    }
    const command = args.shift().toLowerCase();
    if (command === 'version') return message.channel.send((new MessageEmbed()).setTitle('Version').setDescription(`[${version}](https://github.com/basementCoffee/ScoreboardBot)`));

    // COMMANDS
    if (command === 'bb') {
        sheet0.loadCells('A1:BD500').then(() =>
            bot.commands.get('battleship').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet0, bot, whichBoard)
        );
    } else if (command === 'cruiser') {
        sheet1.loadCells('A1:BD500').then(() =>
            bot.commands.get('cruiser').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet1, bot, whichBoard)
        );
    } else if (command === 'dd') {
        sheet2.loadCells('A1:BD500').then(() =>
            bot.commands.get('destroyer').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet2, bot, whichBoard)
        );
    } else if (command === 'cv') {
        sheet3.loadCells('A1:BD500').then(() =>
            bot.commands.get('carrier').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet3, bot, whichBoard)
        );
    } else if (command === 'subs') {
        bot.commands.get('submarine').execute(message, args, Discord);
    } else if (command === 'universal') {
        sheet5.loadCells('A1:E500').then(() =>
            bot.commands.get('universal').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet5, bot, whichBoard)
        );
    } else if (command === 'help') {
        bot.commands.get('help').execute(message, args, Discord);
        bot.commands.get('keys').execute(message, args, Discord, bot);
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
        message.channel.send('Click me!', button);
    } else if (command === 'add') {
        // Below .get('ID') comes from leaderboard-highscores channel id
        bot.channels.cache.get('895160324607586315').send("Dont delete me 1");
        bot.channels.cache.get('895160324607586315').send("Dont delete me 2");
        bot.channels.cache.get('895160324607586315').send("Dont delete me 3");
        bot.channels.cache.get('895160324607586315').send("Dont delete me 4");
        bot.channels.cache.get('895160324607586315').send("Dont delete me 5");
    } else if (command === 'devstrike' || command === 'update' && message.member.id === '268554823283113985') {

        // Below .get('ID') comes from leaderboard-submissions channel id
        bot.channels.cache.get('693937210000670892').send('***The ScoreboardBot is now updating, please hold off on all submissions for a few minutes!***');
        let cmd = process.env.DEVSTRIKE;
        exec(cmd);
    } else if (command === 'subs' || command === 'submarine' || command === 'subs' || command === 'submarines') {
        message.channel.send('Ping @BrownSycamore#0536 if subs are officially released and you are reading this');
    }
});


bot.login(token);