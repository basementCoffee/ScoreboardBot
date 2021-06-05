require('dotenv').config();

const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');




const {google} = require('googleapis');

module.exports = {
    name: 'verification',
    description: "Verification ticket!",
    execute(message, args, Discord, bot, data) {
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#76ee00')
            .setTitle('Click the below link to view entry and screenshots for verification')
            .setDescription(message.url + '\nThis is a verification ticket for a new HS')
            .addFields({
                name: 'Guide:',
                value: "React with a X or check and the spreadsheet will update accordingly"
            })
            //rick roll gif https://media2.giphy.com/media/ZE5DmCqNMr3yDXq1Zu/source.gif
            .setFooter(' Good luck Commanders!');


        // this is where the message gets sent
        bot.channels.cache.get('803893512072462347').send(newEmbed).then(a => {
            //message.channel.send(newEmbed).then(a => {
            a.react('613845951055921158');
            a.react('613845951341395977');

            const filter = (reaction, user) => {
                return user.id !== bot.user.id && ['613845951055921158', '613845951341395977'].includes(reaction.emoji.id);
            }
            const collector = a.createReactionCollector(filter);

            collector.on('collect', (reaction, reactionCollector) => {
                a.reactions.removeAll().then();
                if (reaction.emoji.id === '613845951055921158') {
                    // if leaderboard data is present - then update, else create leaderboard
                    console.log(data.commanderName);
                    console.log(data.val);
                    console.log(data.sheetCol1);
                    console.log(data.sheetCol2);
                    console.log(data.startingRowNumber);
                    console.log(data.sheetName);
                    gsUpdateAdd(data.commanderName, data.val, data.sheetCol1, data.sheetCol2, data.startingRowNumber, data.sheetName);
                    console.log('bot1: ' + bot.user.username);
                    bot.commands.get('scores').execute(message, args, bot);

                    message.channel.send('Added to sheet. #leaderboard-scores is updated.');
                    // bot-testing channel id: 802071947088625694;    embed id: 841537152910491659; leaderboard channel id: 841438933824569375

                } else {
                    message.channel.send('Sorry your high-score entry has been rejected by an officer. Make sure you include your screenshots and the right category.');
                }
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

            console.log("Database size: " + dataSize);


        }




        async function gsLightRun(columnLetter, startingRowNumber) {


            const spreadsheetSizeObjects = {
                spreadsheetId: spreadsheet_id,
                range: data.sheetName + '!' + columnLetter.toString() + 4
            }

            let dataSizeFromSheets = await gsapi.spreadsheets.values.get(spreadsheetSizeObjects);
            const dataSize = dataSizeFromSheets.data.values.toString();
            console.log('DS:' + dataSize);

            return parseInt(dataSize) + parseInt(startingRowNumber);
        }

        const gsUpdateAdd = (name, val, columnLetter, nextColumnLetter, startingRowNumber, sheetName) => {
            gsLightRun(columnLetter, startingRowNumber).then((newRowToOverwrite) => {
                console.log('light run' + newRowToOverwrite);
                const gsapi = google.sheets({
                    version: 'v4',
                    auth: client2
                });

                const givenRange = columnLetter.toString() + newRowToOverwrite.toString() + ":" + nextColumnLetter.toString() + newRowToOverwrite.toString();
                // console.log('GR: ' + givenRange);
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
                            // Handle the results here (response.result has the parsed body).

                            console.log("Updated Range: " + response.data.updates.updatedRange);
                        },
                        function (err) {
                            console.error("Execute error", err);
                        });

            });
        }
    }
}
