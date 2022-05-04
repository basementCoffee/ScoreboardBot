require('dotenv').config();
let version = require('./package.json').version;
require('discord-reply');


// Importing from .env
const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');
const token = process.env.TOKEN.replace(/\\n/gm, '\n');
const {exec} = require("child_process");
const Discord = require('discord.js');


// Google stuff
const {GoogleApis} = require('googleapis');
const {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} = require('google-spreadsheet');
var doc = new GoogleSpreadsheet(spreadsheet_id);


// Button testing
// const discord = require('discord.js'); // Define / Require the discord.js module.
const buttonClient = new Discord.Client(); // Creating a discord.js client instance (constructor).
const disbut = require('discord-buttons');
disbut(buttonClient); // Requiring discord-buttons and binding it to the initialised client.


// Initialize the sheet
var sheetBB_0;
var devsheetBB_1;
var sheetCA_2;
var devsheetCA_3;
var sheetDD_4;
var devsheetDD_5;
var sheetCV_6;
var devsheetCV_7;
var sheetSUB_8;
var devsheetSUB_9;
var sheetUNV_10;
var devsheetUNV_11;
const ADMIN_ID = ['268554823283113985', '443150640823271436', '160520338378194954'];
let isDevMode = process.argv[2] === '--dev';


// whichBoard allows verification to update just the corresponding score board embed; option is defaulted to updating all of them as per legacy
// 0 is bb, 1 is bbdev, 2 is cruiser, 3 is cruiserdev and so on; 12 is all
var whichBoard;


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
    sheetBB_0 = await doc.sheetsByIndex[0];
    devsheetBB_1 = await doc.sheetsByIndex[1];
    sheetCA_2 = await doc.sheetsByIndex[2];
    devsheetCA_3 = await doc.sheetsByIndex[3];
    sheetDD_4 = await doc.sheetsByIndex[4];
    devsheetDD_5 = await doc.sheetsByIndex[5];
    sheetCV_6 = await doc.sheetsByIndex[6];
    devsheetCV_7 = await doc.sheetsByIndex[7];
    sheetSUB_8 = await doc.sheetsByIndex[8];
    devsheetSUB_9 = await doc.sheetsByIndex[9];
    sheetUNV_10 = await doc.sheetsByIndex[10];
    devsheetUNV_11 = await doc.sheetsByIndex[11];
    console.log(sheetBB_0.title); // title of the tabs
    console.log(sheetCA_2.title);
    console.log(sheetDD_4.title);
    console.log(sheetCV_6.title);
    console.log(sheetSUB_8.title);
    console.log(sheetUNV_10.title);
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
    bot.user.setActivity("WoWS | !canuk help", {type: "PLAYING"});
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
    switch (command) {
        case 'bb':
            if (isDevMode === true && ADMIN_ID.includes(message.member.id)) {
                devsheetBB_1.loadCells('A1:BD500').then(() =>
                    bot.commands.get('battleship').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetBB_0, devsheetBB_1, whichBoard, isDevMode, ADMIN_ID)
                );
            } else {
                sheetBB_0.loadCells('A1:BD500').then(() =>
                    bot.commands.get('battleship').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetBB_0, devsheetBB_1, whichBoard, isDevMode, ADMIN_ID)
                );
            }
        break;
        case 'cruiser':
            if (isDevMode === true && ADMIN_ID.includes(message.member.id)) {
                devsheetCA_3.loadCells('A1:BD500').then(() =>
                    bot.commands.get('cruiser').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetCA_2, devsheetCA_3, whichBoard, isDevMode, ADMIN_ID)
                );
            } else {
                sheetCA_2.loadCells('A1:BD500').then(() =>
                    bot.commands.get('cruiser').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetCA_2, devsheetCA_3, whichBoard, isDevMode, ADMIN_ID)
                );
            }
        break;
        case 'dd':
            if (isDevMode === true && ADMIN_ID.includes(message.member.id)) {
                devsheetDD_5.loadCells('A1:BD500').then(() =>
                    bot.commands.get('destroyer').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetDD_4, devsheetDD_5, whichBoard, isDevMode, ADMIN_ID)
                );
            } else {
                sheetDD_4.loadCells('A1:BD500').then(() =>
                    bot.commands.get('destroyer').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetDD_4, devsheetDD_5, whichBoard, isDevMode, ADMIN_ID)
                );
            }
        break;
        case 'cv':
            if (isDevMode === true && ADMIN_ID.includes(message.member.id)) {
                console.log(isDevMode);
                devsheetCV_7.loadCells('A1:AX500').then(() =>
                    bot.commands.get('carrier').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetCV_6, devsheetCV_7, whichBoard, isDevMode, ADMIN_ID)
                );
            } else {
                console.log(isDevMode);
                sheetCV_6.loadCells('A1:AX500').then(() =>
                    bot.commands.get('carrier').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetCV_6, devsheetCV_7, whichBoard, isDevMode, ADMIN_ID)
                );
            }
        break;
        case 'subs':
            bot.commands.get('submarine').execute(message, args, Discord);
        break;
        case 'universal':
            if (isDevMode === true && ADMIN_ID.includes(message.member.id)) {
                devsheetUNV_11.loadCells('A1:E500').then(() =>
                    bot.commands.get('universal').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetUNV_10, devsheetUNV_11, whichBoard, isDevMode, ADMIN_ID)
                );
            } else {
                sheetUNV_10.loadCells('A1:E500').then(() =>
                    bot.commands.get('universal').execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetUNV_10, devsheetUNV_11, whichBoard, isDevMode, ADMIN_ID)
                );
            }
        break;
        case 'guide':
        case 'help':
            bot.commands.get('help').execute(message, args, Discord);
        break;
        case 'info':
            message.channel.send("https://github.com/basementCoffee/ScoreboardBot");
        break;
        case 'skynet':
            message.channel.send("https://www.youtube.com/watch?v=_Wlsd9mljiU");
        break;
        case 'dev':
        case 'devmode':
            if (!ADMIN_ID.includes(message.member.id)) {
                message.channel.send('This feature has been limited to Admins only.');
                return;
            }
            if (args[0] === 'status'){
                message.channel.send(`devmode is currently **${isDevMode ? 'on' : 'off'}**`);

            }
            else if (isDevMode) {
                message.channel.send('*devmode is off*');
                isDevMode = false;
            } else {
                message.channel.send('*devmode is on*');
                isDevMode = true;
            }
        break;
        case 'scores':
            if (!ADMIN_ID.includes(message.member.id)) {
                message.channel.send('This feature has been limited to Admins only.')
                return;
            }
            message.channel.send('The scoreboards are updating.');
            if (isDevMode === true && ADMIN_ID.includes(message.member.id)) {
                bot.commands.get('bbdevscores').execute(message, args, bot);
                bot.commands.get('dddevscores').execute(message, args, bot);
                bot.commands.get('cruiserdevscores').execute(message, args, bot);
                bot.commands.get('cvdevscores').execute(message, args, bot);
                bot.commands.get('universaldevscores').execute(message, args, bot);
            } else {
                bot.commands.get('bbscores').execute(message, args, bot);
                bot.commands.get('ddscores').execute(message, args, bot);
                bot.commands.get('cruiserscores').execute(message, args, bot);
                bot.commands.get('cvscores').execute(message, args, bot);
                bot.commands.get('universalscores').execute(message, args, bot);
            }

        break;
        case 'sheet':
            let button = new disbut.MessageButton()
                .setStyle('url')
                .setURL('https://docs.google.com/spreadsheets/d/1N_DoscLuWj2AZ90ZEDCQBH5FTFLaU-ZPriVi2ZKHkOo/edit?usp=sharing')
                .setLabel('Holy Sheet')
            message.channel.send('Click me!', button);
        break;
        case 'add':
            if (!ADMIN_ID.includes(message.member.id)) {
                message.channel.send('This feature has been limited to Admins only.')
                return;
            }
            // Below .get('ID') comes from leaderboard-highscores channel id
            if (isDevMode === true && ADMIN_ID.includes(message.member.id)) {
                bot.channels.cache.get('970432185737822318').send("Dont delete me 1");
                bot.channels.cache.get('970432185737822318').send("Dont delete me 2");
                bot.channels.cache.get('970432185737822318').send("Dont delete me 3");
                bot.channels.cache.get('970432185737822318').send("Dont delete me 4");
                bot.channels.cache.get('970432185737822318').send("Dont delete me 5");
            } else if (isDevMode === false && message.member.id === ADMIN_ID) {
                bot.channels.cache.get('895160324607586315').send("Dont delete me 1");
                bot.channels.cache.get('895160324607586315').send("Dont delete me 2");
                bot.channels.cache.get('895160324607586315').send("Dont delete me 3");
                bot.channels.cache.get('895160324607586315').send("Dont delete me 4");
                bot.channels.cache.get('895160324607586315').send("Dont delete me 5");
            }
        break;
        case 'devstrike':
        case 'update':
        case 'detonate':
            if (!ADMIN_ID.includes(message.member.id)) {
                message.channel.send('This feature has been limited to Admins only.')
                return;
            }
            // Below .get('ID') comes from leaderboard-submissions channel id
            bot.channels.cache.get('693937210000670892').send('***The ScoreboardBot is now updating, please hold off on all submissions for a few minutes!***');
            let cmd = process.env.DEVSTRIKE;
            exec(cmd);
        break;
    }
});


bot.login(token);