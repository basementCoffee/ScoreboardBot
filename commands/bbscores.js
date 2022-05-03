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
var sheetBB_0;


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
    sheetBB_0 = await doc.sheetsByIndex[0];
}


module.exports = {
    name: 'bbscores',
    description: "BB Scoreboard!",
    execute(message, args, bot) {
        const getBBScoreboardEmbed = () => {
            const bbScoreBoardEmbed = new MessageEmbed();
            const description =
                '-------------  **BATTLESHIP** -------------\n' +
                '\`DAMAGE:\`' + sheetBB_0.getCellByA1('AU6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('AU5').formattedValue) + ') \n' +
                '\`BXP:\`' + sheetBB_0.getCellByA1('AX6').formattedValue + ' (' + sheetBB_0.getCellByA1('AX5').formattedValue + ') \n' +
                '\`KILLS:\`' + sheetBB_0.getCellByA1('B6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('B5').formattedValue) + ') \n' +
                '\`MBH:\`' + sheetBB_0.getCellByA1('E6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('E5').formattedValue) + ') \n' +
                '\`CITADELS:\`' + sheetBB_0.getCellByA1('H6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('H5').formattedValue) + ') \n' +
                '\`INCAPACITATIONS:\`' + sheetBB_0.getCellByA1('K6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('K5').formattedValue) + ') \n' +
                '\`FIRES:\`' + sheetBB_0.getCellByA1('N6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('N5').formattedValue) + ') \n' +
                '\`SECONDARY HITS:\`' + sheetBB_0.getCellByA1('Q6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('Q5').formattedValue) + ') \n' +
                '\`AIRPLANE KILLS:\`' + sheetBB_0.getCellByA1('T6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('T5').formattedValue) + ') \n' +
                '\`TORPS:\`' + sheetBB_0.getCellByA1('W6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('W5').formattedValue) + ') \n' +
                '\`FLOODS:\`' + sheetBB_0.getCellByA1('Z6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('Z5').formattedValue) + ') \n' +
                '\`SUB HITS:\`' + sheetBB_0.getCellByA1('AC6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('AC5').formattedValue) + ') \n' +
                '\`AIRSTRIKE:\`' + sheetBB_0.getCellByA1('AF6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('AF5').formattedValue) + ') \n' +
                '\`SPOTS:\`' + sheetBB_0.getCellByA1('AI6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('AI5').formattedValue) + ') \n' +
                '\`CAPS/DEFENDED/ASSIST:\`' + sheetBB_0.getCellByA1('AL6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('AL5').formattedValue) + ') \n' +
                '\`BASE-XP (≤T7):\`' + sheetBB_0.getCellByA1('AO6').formattedValue + ' (' + sheetBB_0.getCellByA1('AO5').formattedValue + ') \n' +
                '\`DAMAGE (≤T7):\`' + sheetBB_0.getCellByA1('AR6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('AR5').formattedValue) + ') \n' +
                '\`TANKED DAMAGE:\`' + sheetBB_0.getCellByA1('BA6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('BA5').formattedValue) + ') \n' +
                '\`SPOTTING DAMAGE:\`' + sheetBB_0.getCellByA1('BD6').formattedValue + ' (' + abbreviateNumber(sheetBB_0.getCellByA1('BD5').formattedValue) + ') \n'
            ;
            bbScoreBoardEmbed.setTitle('[CANUK] BB LEADERBOARD');
            bbScoreBoardEmbed.setColor('#2b89bf');
            bbScoreBoardEmbed.setDescription(description);
            return bbScoreBoardEmbed;
        }
        try {
            bot.channels.cache.get('841438933824569375').messages.fetch('928438773447016478').then((x) => {
                x.edit('Updating the BB Scoreboard...').then(() => {
                    sheetBB_0.loadCells('A1:BD500').then(() => {
                        x.edit('Battleship Scoreboard:');
                        let text = getBBScoreboardEmbed();
                        x.edit(text);
                    })
                })
            })
        }
        catch (e) {
            console.log('Cannot find the the scoreboard embed.');
            bot.channels.cache.get('802071947088625694').send('Oi some hoser deleted the original pinned leaderboard. Make sure you replace the fetch id with the new one in the code!');
            bot.channels.cache.get('841438933824569375').send.then((x) => {
                x.edit('Updating scoreboard...').then(() => {
                    sheetBB_0.loadCells('A1:BD500').then(() => {
                        x.edit('Scoreboard:');
                        x.edit(getBBScoreboardEmbed());
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