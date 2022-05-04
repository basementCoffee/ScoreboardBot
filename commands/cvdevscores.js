require('dotenv').config();

const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');
const {MessageEmbed} = require("discord.js");
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
var devsheetCV_7;


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
    devsheetCV_7 = await doc.sheetsByIndex[7];
}


module.exports = {
    name: 'cvdevscores',
    description: "CV DEV SCOREBOARD!",
    execute(message, args, bot) {
        const getCVScoreboardEmbed = () => {
            const cvScoreBoardEmbed = new MessageEmbed();
            const description =
                '\n-----------  **CARRIER DEV SCOREBOARD**  -----------\n' +
                '\`DAMAGE:\`' + devsheetCV_7.getCellByA1('AO6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('AO5').formattedValue) + ') \n' +
                '\`BXP:\`' + devsheetCV_7.getCellByA1('AR6').formattedValue + ' (' + devsheetCV_7.getCellByA1('AR5').formattedValue + ') \n' +
                '\`KILLS:\`' + devsheetCV_7.getCellByA1('B6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('B5').formattedValue) + ') \n' +
                '\`CITADELS:\`' + devsheetCV_7.getCellByA1('E6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('E5').formattedValue) + ') \n' +
                '\`INCAPACITATIONS:\`' + devsheetCV_7.getCellByA1('H6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('H5').formattedValue) + ') \n' +
                '\`FIRES:\`' + devsheetCV_7.getCellByA1('K6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('K5').formattedValue) + ') \n' +
                '\`SECONDARY HITS:\`' + devsheetCV_7.getCellByA1('N6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('N5').formattedValue) + ') \n' +
                '\`AIRPLANE KILLS:\`' + devsheetCV_7.getCellByA1('Q6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('Q5').formattedValue) + ') \n' +
                '\`TORPS:\`' + devsheetCV_7.getCellByA1('T6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('T5').formattedValue) + ') \n' +
                '\`FLOODS:\`' + devsheetCV_7.getCellByA1('W6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('W5').formattedValue) + ') \n' +
                '\`TARGET HITS:\`' + devsheetCV_7.getCellByA1('Z6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('Z5').formattedValue) + ') \n' +
                '\`SPOTS:\`' + devsheetCV_7.getCellByA1('AC6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('AC5').formattedValue) + ') \n' +
                '\`CAPS/DEFENDED/ASSIST:\`' + devsheetCV_7.getCellByA1('AF6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('AF5').formattedValue) + ') \n' +
                '\`BASE-XP (≤T7):\`' + devsheetCV_7.getCellByA1('AI6').formattedValue + ' (' + devsheetCV_7.getCellByA1('AI5').formattedValue + ') \n' +
                '\`DAMAGE (≤T7):\`' + devsheetCV_7.getCellByA1('AL6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('AL5').formattedValue) + ') \n' +
                '\`TANKED DAMAGE:\`' + devsheetCV_7.getCellByA1('AU6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('AU5').formattedValue) + ') \n' +
                '\`SPOTTING DAMAGE:\`' + devsheetCV_7.getCellByA1('AX6').formattedValue + ' (' + abbreviateNumber(devsheetCV_7.getCellByA1('AX5').formattedValue) + ') \n'
            ;
            cvScoreBoardEmbed.setTitle('[CANUK] CV DEV LEADERBOARD');
            cvScoreBoardEmbed.setColor('#ff0000');
            cvScoreBoardEmbed.setDescription(description);
            return cvScoreBoardEmbed;
        }
        try {
            bot.channels.cache.get('970432185737822318').messages.fetch('970463803412217966').then((x) => {
                x.edit('Updating the CV DEV SCOREBOARD...').then(() => {
                    devsheetCV_7.loadCells('A1:AX500').then(() => {
                        x.edit('CV DEV SCOREBOARD:');
                        x.edit(getCVScoreboardEmbed());
                    })
                })
            })
        }
        catch (e) {
            console.log('Cannot find the the scoreboard embed.');
            bot.channels.cache.get('970471187480207440').send('Oi some hoser deleted the original pinned leaderboard. Make sure you replace the fetch id with the new one in the code!');
            bot.channels.cache.get('970432185737822318').send.then((x) => {
                x.edit('Updating scoreboard...').then(() => {
                    devsheetCV_7.loadCells('A1:AX500').then(() => {
                        x.edit('CV DEV SCOREBOARD:');
                        x.edit(getCVScoreboardEmbed());
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