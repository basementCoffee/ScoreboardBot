require('dotenv').config();

const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');



const {
    google,
    GoogleApis
} = require('googleapis');

const {
    GoogleSpreadsheet,
    GoogleSpreadsheetWorksheet
} = require('google-spreadsheet');

// Initialize the sheet
var doc = new GoogleSpreadsheet(spreadsheet_id);

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
    });


    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title); // title of the sheet
    sheet1 = await doc.sheetsByIndex[0];
    sheet2 = await doc.sheetsByIndex[1];
    sheet3 = await doc.sheetsByIndex[2];
    sheet4 = await doc.sheetsByIndex[3];
    sheet5 = await doc.sheetsByIndex[4];
}

const {MessageEmbed} = require("discord.js");
module.exports = {
    name: 'cruiserscores',
    description: "Cruiser Scoreboard!",
    execute(message, args, bot) {
        const getCruiserScoreboardEmbed = () => {
            const cruiserScoreBoardEmbed = new MessageEmbed();
            const description =
                '\n-----------  **CRUISER**  -----------\n' +
                '\`DAMAGE:\`' + sheet2.getCellByA1('B6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('B5').formattedValue) + ') \n' +
                '\`KILLS:\`' + sheet2.getCellByA1('E6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('E5').formattedValue) + ') \n' +
                '\`BXP:\`' + sheet2.getCellByA1('H6').formattedValue + ' (' + sheet2.getCellByA1('H5').formattedValue + ') \n' +
                '\`FIRES:\`' + sheet2.getCellByA1('K6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('K5').formattedValue) + ') \n' +
                '\`FLOODS:\`' + sheet2.getCellByA1('N6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('N5').formattedValue) + ') \n' +
                '\`TORPS:\`' + sheet2.getCellByA1('Q6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('Q5').formattedValue) + ') \n' +
                '\`CITADELS:\`' + sheet2.getCellByA1('T6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('T5').formattedValue) + ') \n' +
                '\`MBH:\`' + sheet2.getCellByA1('W6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('W5').formattedValue) + ') \n' +
                '\`TANKED DAMAGE:\`' + sheet2.getCellByA1('Z6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('Z5').formattedValue) + ') \n' +
                '\`AIRPLANE KILLS:\`' + sheet2.getCellByA1('AC6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('AC5').formattedValue) + ') \n' +
                '\`INCAPACITATIONS:\`' + sheet2.getCellByA1('AF6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('AF5').formattedValue) + ') \n' +
                '\`CAP/DEFENDED/ASSISTS:\`' + sheet2.getCellByA1('AI6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('AI5').formattedValue) + ') \n' +
                '\`BASE-XP (≤T7):\`' + sheet2.getCellByA1('AL6').formattedValue + ' (' + sheet2.getCellByA1('AL5').formattedValue + ') \n' +
                '\`DAMAGE (≤T7):\`' + sheet2.getCellByA1('AO6').formattedValue + ' (' + abbreviateNumber(sheet2.getCellByA1('AO5').formattedValue) + ') \n'
            ;
            cruiserScoreBoardEmbed.setTitle('[CANUK] Cruiser LEADERBOARD');
            cruiserScoreBoardEmbed.setColor('#6e838b');
            cruiserScoreBoardEmbed.setDescription(description);
            return cruiserScoreBoardEmbed;
        }

        try {
            bot.channels.cache.get('841438933824569375').messages.fetch('928438774629806210').then((x) => {
                x.edit('Updating the Cruiser Scoreboard...').then(() => {
                    sheet2.loadCells('A1:AO500').then(() => {
                        x.edit('Cruiser Scoreboard:');
                        x.edit(getCruiserScoreboardEmbed());
                    })
                })
            })
        }

        catch (e) {
            console.log('Cannot find the the scoreboard embed.');
            bot.channels.cache.get('852991463428063272').send('Oi some idiot deleted the original pinned leaderboard. Make sure you replace the fetch id with the new one in the code!');
            bot.channels.cache.get('841438933824569375').send.then((x) => {
                x.edit('Updating scoreboard...').then(() => {
                    sheet2.loadCells('A1:AO500').then(() => {
                        x.edit('Cruiser Scoreboard:');
                        x.edit(getCruiserScoreboardEmbed());
                    })
                })
            })
        }
    }
}


abbreviateNumber = function (num) {
    num = parseInt(num);
    let fixed = 0; // number of decimal places to show
    if (num === null) {
        return null;
    } // terminate early
    if (num === 0) {
        return '0';
    } // terminate early
    fixed = (!fixed || fixed < 0) ? 0 : fixed;
    var b = (num).toPrecision(2).split("e"), // get power
        k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
        c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
        d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
        e = d + ['', 'k', 'm', 'b', 't'][k]; // append power
    return e;
}

