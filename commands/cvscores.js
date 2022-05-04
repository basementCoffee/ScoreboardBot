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
var sheetCV_6;


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
    sheetCV_6 = await doc.sheetsByIndex[6];
}


module.exports = {
    name: 'cvscores',
    description: "CV Scoreboard!",
    execute(message, args, bot) {
        const getCVScoreboardEmbed = () => {
            const cvScoreBoardEmbed = new MessageEmbed();
            const description =
                '\n-----------  **CARRIER**  -----------\n' +
                '\`DAMAGE:\`' + sheetCV_6.getCellByA1('AO6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('AO5').formattedValue) + ') \n' +
                '\`BXP:\`' + sheetCV_6.getCellByA1('AR6').formattedValue + ' (' + sheetCV_6.getCellByA1('AR5').formattedValue + ') \n' +
                '\`KILLS:\`' + sheetCV_6.getCellByA1('B6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('B5').formattedValue) + ') \n' +
                '\`CITADELS:\`' + sheetCV_6.getCellByA1('E6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('E5').formattedValue) + ') \n' +
                '\`INCAPACITATIONS:\`' + sheetCV_6.getCellByA1('H6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('H5').formattedValue) + ') \n' +
                '\`FIRES:\`' + sheetCV_6.getCellByA1('K6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('K5').formattedValue) + ') \n' +
                '\`SECONDARY HITS:\`' + sheetCV_6.getCellByA1('N6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('N5').formattedValue) + ') \n' +
                '\`AIRPLANE KILLS:\`' + sheetCV_6.getCellByA1('Q6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('Q5').formattedValue) + ') \n' +
                '\`TORPS:\`' + sheetCV_6.getCellByA1('T6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('T5').formattedValue) + ') \n' +
                '\`FLOODS:\`' + sheetCV_6.getCellByA1('W6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('W5').formattedValue) + ') \n' +
                '\`TARGET HITS:\`' + sheetCV_6.getCellByA1('Z6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('Z5').formattedValue) + ') \n' +
                '\`SPOTS:\`' + sheetCV_6.getCellByA1('AC6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('AC5').formattedValue) + ') \n' +
                '\`CAPS/DEFENDED/ASSIST:\`' + sheetCV_6.getCellByA1('AF6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('AF5').formattedValue) + ') \n' +
                '\`BASE-XP (≤T7):\`' + sheetCV_6.getCellByA1('AI6').formattedValue + ' (' + sheetCV_6.getCellByA1('AI5').formattedValue + ') \n' +
                '\`DAMAGE (≤T7):\`' + sheetCV_6.getCellByA1('AL6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('AL5').formattedValue) + ') \n' +
                '\`TANKED DAMAGE:\`' + sheetCV_6.getCellByA1('AU6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('AU5').formattedValue) + ') \n' +
                '\`SPOTTING DAMAGE:\`' + sheetCV_6.getCellByA1('AX6').formattedValue + ' (' + abbreviateNumber(sheetCV_6.getCellByA1('AX5').formattedValue) + ') \n'
            ;
            cvScoreBoardEmbed.setTitle('[CANUK] CV LEADERBOARD');
            cvScoreBoardEmbed.setColor('#ff0000');
            cvScoreBoardEmbed.setDescription(description);
            return cvScoreBoardEmbed;
        }
        try {
            bot.channels.cache.get('841438933824569375').messages.fetch('928438779126112256').then((x) => {
                x.edit('Updating the CV Scoreboard...').then(() => {
                    sheetCV_6.loadCells('A1:AX500').then(() => {
                        x.edit('CV Scoreboard:');
                        x.edit(getCVScoreboardEmbed());
                    })
                })
            })
        }
        catch (e) {
            console.log('Cannot find the the scoreboard embed.');
            bot.channels.cache.get('802071947088625694').send('Oi some idiot deleted the original pinned leaderboard. Make sure you replace the fetch id with the new one in the code!');
            bot.channels.cache.get('841438933824569375').send.then((x) => {
                x.edit('Updating scoreboard...').then(() => {
                    sheetCV_6.loadCells('A1:AX500').then(() => {
                        x.edit('CV Scoreboard:');
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