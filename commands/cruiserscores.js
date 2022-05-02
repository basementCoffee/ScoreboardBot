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
var sheet1;


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
    sheet1 = await doc.sheetsByIndex[2];
}


module.exports = {
    name: 'cruiserscores',
    description: "Cruiser Scoreboard!",
    execute(message, args, bot, isDevMode, ADMIN_ID) {
        const getCruiserScoreboardEmbed = () => {
            const cruiserScoreBoardEmbed = new MessageEmbed();
            const description =
                '\n-----------  **CRUISER**  -----------\n' +
                '\`DAMAGE:\`' + sheet1.getCellByA1('AU6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('AU5').formattedValue) + ') \n' +
                '\`BXP:\`' + sheet1.getCellByA1('AX6').formattedValue + ' (' + sheet1.getCellByA1('AX5').formattedValue + ') \n' +
                '\`KILLS:\`' + sheet1.getCellByA1('B6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('B5').formattedValue) + ') \n' +
                '\`MBH:\`' + sheet1.getCellByA1('E6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('E5').formattedValue) + ') \n' +
                '\`CITADELS:\`' + sheet1.getCellByA1('H6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('H5').formattedValue) + ') \n' +
                '\`INCAPACITATIONS:\`' + sheet1.getCellByA1('K6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('K5').formattedValue) + ') \n' +
                '\`FIRES:\`' + sheet1.getCellByA1('N6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('N5').formattedValue) + ') \n' +
                '\`SECONDARY HITS:\`' + sheet1.getCellByA1('Q6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('Q5').formattedValue) + ') \n' +
                '\`AIRPLANE KILLS:\`' + sheet1.getCellByA1('T6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('T5').formattedValue) + ') \n' +
                '\`TORPS:\`' + sheet1.getCellByA1('W6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('W5').formattedValue) + ') \n' +
                '\`FLOODS:\`' + sheet1.getCellByA1('Z6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('Z5').formattedValue) + ') \n' +
                '\`SUB HITS:\`' + sheet1.getCellByA1('AC6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('AC5').formattedValue) + ') \n' +
                '\`AIRSTRIKE:\`' + sheet1.getCellByA1('AF6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('AF5').formattedValue) + ') \n' +
                '\`SPOTS:\`' + sheet1.getCellByA1('AI6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('AI5').formattedValue) + ') \n' +
                '\`CAPS/DEFENDED/ASSIST:\`' + sheet1.getCellByA1('AL6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('AL5').formattedValue) + ') \n' +
                '\`BASE-XP (≤T7):\`' + sheet1.getCellByA1('AO6').formattedValue + ' (' + sheet1.getCellByA1('AO5').formattedValue + ') \n' +
                '\`DAMAGE (≤T7):\`' + sheet1.getCellByA1('AR6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('AR5').formattedValue) + ') \n' +
                '\`TANKED DAMAGE:\`' + sheet1.getCellByA1('BA6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('BA5').formattedValue) + ') \n' +
                '\`SPOTTING DAMAGE:\`' + sheet1.getCellByA1('BD6').formattedValue + ' (' + abbreviateNumber(sheet1.getCellByA1('BD5').formattedValue) + ') \n'
            ;
            cruiserScoreBoardEmbed.setTitle('[CANUK] Cruiser LEADERBOARD');
            cruiserScoreBoardEmbed.setColor('#6e838b');
            cruiserScoreBoardEmbed.setDescription(description);
            return cruiserScoreBoardEmbed;
        }
        try {
            bot.channels.cache.get('841438933824569375').messages.fetch('928438774629806210').then((x) => {
                x.edit('Updating the Cruiser Scoreboard...').then(() => {
                    sheet1.loadCells('A1:BD500').then(() => {
                        x.edit('Cruiser Scoreboard:');
                        x.edit(getCruiserScoreboardEmbed());
                    })
                })
            })
        }
        catch (e) {
            console.log('Cannot find the the scoreboard embed.');
            bot.channels.cache.get('802071947088625694').send('Oi some hoser deleted the original pinned leaderboard. Make sure you replace the fetch id with the new one in the code!');
            bot.channels.cache.get('841438933824569375').send.then((x) => {
                x.edit('Updating scoreboard...').then(() => {
                    sheet1.loadCells('A1:BD500').then(() => {
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