require('dotenv').config();

const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');
const {google} = require('googleapis');


module.exports = {
    name: 'verification',
    description: "Verification ticket!",
    execute(message, args, Discord, bot, data, whichBoard, isDevMode, ADMIN_ID) {
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#76ee00')
            .setTitle('Click the below link to view entry and screenshots for verification')
            .setDescription(message.url)
            .setFooter('React with a X or check and the spreadsheet will update accordingly');
        // Checks to see if entry is from admin & devmode is enabled
        if (isDevMode === true && message.member.id === ADMIN_ID) {
            // 970432070956486797 -> dev verification channel id
            bot.channels.cache.get('970432070956486797').send(newEmbed).then(a => {
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
                        // if ticket is approved
                        console.log(data.commanderName);
                        console.log(data.val);
                        console.log(data.sheetCol1);
                        console.log(data.sheetCol2);
                        console.log(data.startingRowNumber);
                        console.log(data.sheetName);
                        console.log("whichBoard:" + whichBoard);
                        //console.log(isDevMode);
                        // return;

                        // TBD: unsure whether gsUpdateDevAdd and gsLightDevRun are actually necessary; dev sheet info should be passed from ship.js to verification
                        // TypeError: Cannot read properties of undefined (reading 'execute') maybe needs to be in an await?

                        await gsUpdateDevAdd(data.commanderName, data.val, data.sheetCol1, data.sheetCol2, data.startingRowNumber, data.sheetName);
                        await new Promise(res => setTimeout(res, 5000));
                        if (whichBoard === 0) {
                            console.log("POOBA:" + whichBoard + isDevMode);
                            bot.commands.get('bbscoresdev').execute(message, args, bot);
                            //isDevMode = true;
                            //console.log("ROOBA:" + whichBoard + isDevMode);
                            // TBD: are all of these whichBoard = 6 necessary?
                            //whichBoard = 6;
                        } else if (whichBoard === 1) {
                            bot.commands.get('dev_cruiserscores').execute(message, args, bot);
                            console.log(whichBoard);
                            whichBoard = 6;
                        } else if (whichBoard === 2) {
                            bot.commands.get('dev_ddscores').execute(message, args, bot, isDevMode, ADMIN_ID);
                            console.log(whichBoard);
                            whichBoard = 6;
                        } else if (whichBoard === 3) {
                            bot.commands.get('dev_cvscores').execute(message, args, bot, isDevMode, ADMIN_ID);
                            console.log(whichBoard);
                            whichBoard = 6;
                        } else if (whichBoard === 5) {
                            bot.commands.get('dev_universalscores').execute(message, args, bot, isDevMode, ADMIN_ID);
                            console.log(whichBoard);
                            whichBoard = 6;
                        }
                        message.react('👍').then();
                        let reply = 'Added to sheet. #leaderboard-scores is updated.';
                        try {
                            message.lineReply(reply);
                        } catch (e) {
                            message.channel.send(reply  + ` ||${name}||`);
                        }
                        // dev-verification channel id: 970432070956486797;  dev-scoreboard channel id (NEED TO ADD NEW MESSAGES HERE): 970432185737822318;  embed id: 841537152910491659; leaderboard channel id: 841438933824569375
                    } else {
                        // if ticket is denied
                        message.react("⁉️")
                        let reply = `Your entry has been rejected by an officer. Do check your screenshots and category.`;
                        try {
                            message.lineReply(reply);
                        } catch (e) {
                            message.channel.send(reply + ` ||${name}||`);
                        }
                    }
                    if (data.prevMessage) data.prevMessage.delete();
                });
            })
        } else {
            console.log(isDevMode + whichBoard)
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
                        // if ticket is approved
                        console.log(data.commanderName);
                        console.log(data.val);
                        console.log(data.sheetCol1);
                        console.log(data.sheetCol2);
                        console.log(data.startingRowNumber);
                        console.log(data.sheetName);
                        console.log(whichBoard);
                        await gsUpdateAdd(data.commanderName, data.val, data.sheetCol1, data.sheetCol2, data.startingRowNumber, data.sheetName);
                        await new Promise(res => setTimeout(res, 5000));
                        if (whichBoard === 0) {
                            bot.commands.get('bbscores').execute(message, args, bot);
                            console.log(whichBoard);
                            whichBoard = 6;
                        } else if (whichBoard === 1) {
                            bot.commands.get('cruiserscores').execute(message, args, bot);
                            console.log(whichBoard);
                            whichBoard = 6;
                        } else if (whichBoard === 2) {
                            bot.commands.get('ddscores').execute(message, args, bot);
                            console.log(whichBoard);
                            whichBoard = 6;
                        } else if (whichBoard === 3) {
                            bot.commands.get('cvscores').execute(message, args, bot);
                            console.log(whichBoard);
                            whichBoard = 6;
                        } else if (whichBoard === 5) {
                            bot.commands.get('universalscores').execute(message, args, bot);
                            console.log(whichBoard);
                            whichBoard = 6;
                        }
                        message.react('👍').then();
                        let reply = 'Added to sheet. #leaderboard-scores is updated.';
                        try {
                            message.lineReply(reply);
                        } catch (e) {
                            message.channel.send(reply  + ` ||${name}||`);
                        }
                        // bot-testing channel id: 802071947088625694;    embed id: 841537152910491659; leaderboard channel id: 841438933824569375

                    } else {
                        // if ticket is denied
                        message.react("⁉️")
                        let reply = `Your entry has been rejected by an officer. Do check your screenshots and category.`;
                        try {
                            message.lineReply(reply);
                        } catch (e) {
                            message.channel.send(reply + ` ||${name}||`);
                        }
                    }
                    if (data.prevMessage) data.prevMessage.delete();
                });
            })
        }


        const client2 = new google.auth.JWT(client_email, null, private_key, [
            'https://www.googleapis.com/auth/spreadsheets'
        ]);

        const gsapi = google.sheets({
            version: 'v4',
            auth: client2
        });


        async function gsLightRun(columnLetter, startingRowNumber) {
            const spreadsheetSizeObjects = {
                spreadsheetId: spreadsheet_id,
                range: data.sheetName + '!' + columnLetter.toString() + 4
            }
            let dataSizeFromSheets = await gsapi.spreadsheets.values.get(spreadsheetSizeObjects);
            const dataSize = dataSizeFromSheets.data.values.toString();
            return parseInt(dataSize) + parseInt(startingRowNumber);
        }

        async function gsLightDevRun(columnLetter, startingRowNumber) {
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

        const gsUpdateDevAdd = (name, val, columnLetter, nextColumnLetter, startingRowNumber, sheetName) => {
            gsLightDevRun(columnLetter, startingRowNumber).then((newRowToOverwrite) => {
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