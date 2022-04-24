require('dotenv').config();


const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');
const {google} = require('googleapis');


module.exports = {
    name: 'verification',
    description: "Verification ticket!",
    execute(message, args, Discord, bot, data, whichBoard) {
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#76ee00')
            .setTitle('Click the below link to view entry and screenshots for verification')
            .setDescription(message.url)
            .setFooter('React with a X or check and the spreadsheet will update accordingly');

        // this is where the message gets sent

        bot.channels.cache.get('803893512072462347').send(newEmbed).then(a => {
            a.react('613845951055921158');
            a.react('613845951341395977');
            let name = (message.member.nickname ? message.member.nickname : message.member.user.username);
            const filter = (reaction, user) => {
                return user.id !== bot.user.id && ['613845951055921158', '613845951341395977'].includes(reaction.emoji.id);
            }
            const collector = a.createReactionCollector(filter);
            collector.on('collect', async (reaction, reactionCollector) => {
                a.reactions.removeAll().then();
                if (reaction.emoji.id === '613845951055921158') {

                    // if leaderboard data is present - then update, else create leaderboard

                    console.log(data.commanderName);
                    console.log(data.val);
                    console.log(data.sheetCol1);
                    console.log(data.sheetCol2);
                    console.log(data.startingRowNumber);
                    console.log(data.sheetName);
                    await gsUpdateAdd(data.commanderName, data.val, data.sheetCol1, data.sheetCol2, data.startingRowNumber, data.sheetName);
                    await new Promise(res => setTimeout(res, 1000));
                    if (whichBoard === 0) {
                        bot.commands.get('bbscores').execute(message, args, bot);
                        console.log(whichBoard);
                        whichBoard = 7;
                    } else if (whichBoard === 1) {
                        bot.commands.get('cruiserscores').execute(message, args, bot);
                        console.log(whichBoard);
                        whichboard = 7;
                    } else if (whichBoard === 2) {
                        bot.commands.get('ddscores').execute(message, args, bot);
                        console.log(whichBoard);
                        whichboard = 7;
                    } else if (whichBoard === 3) {
                        bot.commands.get('cvscores').execute(message, args, bot);
                        console.log(whichBoard);
                        whichboard = 7;
                    } else if (whichBoard === 5) {
                        bot.commands.get('universalscores').execute(message, args, bot);
                        console.log(whichBoard);
                        whichboard = 7;
                    }
                    // bot.commands.get('bbscores').execute(message, args, bot);
                    // bot.commands.get('ddscores').execute(message, args, bot);
                    // bot.commands.get('cruiserscores').execute(message, args, bot);
                    // bot.commands.get('cvscores').execute(message, args, bot);
                    // bot.commands.get('universalscores').execute(message, args, bot);
                    message.react('👍').then();
                    let reply = 'Added to sheet. #leaderboard-scores is updated.';
                    try {
                        message.lineReply(reply);
                    } catch (e) {
                        message.channel.send(reply  + ` ||${name}||`);
                    }

                    // bot-testing channel id: 802071947088625694;    embed id: 841537152910491659; leaderboard channel id: 841438933824569375

                } else {
                    message.react("⁉️")
                    let reply = `Your entry has been rejected by an officer. Do check your screenshots and category.`;
                    try {
                        message.lineReply(reply);
                    } catch (e) {
                        message.channel.send(reply + ` ||${name}||`);
                    }
                }

                // deletes the 'well done' message

                if (data.prevMessage) data.prevMessage.delete();
            });
        })
        const client2 = new google.auth.JWT(client_email, null, private_key, [
            'https://www.googleapis.com/auth/spreadsheets'
        ]);
        const gsapi = google.sheets({
            version: 'v4',
            auth: client2
        });
        async function gsrun(cl) {
            const spreadsheetSizeObjects = {
                spreadsheetId: spreadsheet_id,
                range: data.sheetName + '!B5'
            }
            let dataSizeFromSheets = await gsapi.spreadsheets.values.get(spreadsheetSizeObjects);
            const dataSize = dataSizeFromSheets.data.values;
            console.log("Data Size gsrun: " + dataSize);
            const songObjects = {
                spreadsheetId: spreadsheet_id,
                range: data.sheetName + "!A5:B5" + dataSize.toString()
            };
            let dataSO = await gsapi.spreadsheets.values.get(songObjects);
            const arrayOfSpreadsheetValues = dataSO.data.values;
        }
        async function gsLightRun(columnLetter, startingRowNumber) {
            const spreadsheetSizeObjects = {
                spreadsheetId: spreadsheet_id,
                range: data.sheetName + '!' + columnLetter.toString() + 4
            }
            let dataSizeFromSheets = await gsapi.spreadsheets.values.get(spreadsheetSizeObjects);
            const dataSize = dataSizeFromSheets.data.values.toString();
            return parseInt(dataSize) + parseInt(startingRowNumber);
        }
        const gsUpdateAdd = (name, val, columnLetter, nextColumnLetter, startingRowNumber, sheetName) => {
            gsLightRun(columnLetter, startingRowNumber).then((newRowToOverwrite) => {
                const gsapi = google.sheets({
                    version: 'v4',
                    auth: client2
                });
                const givenRange = columnLetter.toString() + newRowToOverwrite.toString() + ":" + nextColumnLetter.toString() + newRowToOverwrite.toString();
                gsapi.spreadsheets.values.append({
                    "spreadsheetId": spreadsheet_id,
                    "range": sheetName + '!' + givenRange,
                    "includeValuesInResponse": true,
                    "responseDateTimeRenderOption": "FORMATTED_STRING",
                    "responseValueRenderOption": "FORMATTED_VALUE",
                    "valueInputOption": "USER_ENTERED",
                    "resource": {
                        "values": [
                            [
                                name,
                                val
                            ]
                        ]
                    }
                })
                    .then(function (response) {
                        },
                        function (err) {
                            console.error("Execute error", err);
                        });
            });
        }
    }
}