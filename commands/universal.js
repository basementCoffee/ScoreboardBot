require('dotenv').config();

const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');
const {google, GoogleApis} = require('googleapis');
const verification = require('./verification');
const Discord = require("discord.js");
const {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} = require("google-spreadsheet");
const {sendNotHighScoreMessage, sendHighScoreMessage} = require("./utils/utils");
const client2 = new google.auth.JWT(client_email, null, private_key, [
  'https://www.googleapis.com/auth/spreadsheets'
]);
const gsapi = google.sheets({
  version: 'v4',
  auth: client2
});


module.exports = {
  name: 'universal',
  description: "universal commands",
  execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, bot, sheetUNV_10, devsheetUNV_11, whichBoard, isDevMode, ADMIN_ID) {
    let type = args[0];
    let entryValue;
    let commanderName = (message.member.nickname ? message.member.nickname : message.member.user.username);
    let allowedWords = ['coopbxp', 'killsteal'];
    if (allowedWords.includes(args[0])) {
      let val = parseInt(args[1]);
      if (val > 0) entryValue = args[1];
      else return message.channel.send("Sorry I don't recognize that command. Please check the pinned help guide on how to use the CANUKBot.");
    } else {
      return message.channel.send("Sorry I don't recognize that command. Please check the pinned help guide on how to use the CANUKBot.");
    }
    switch (type) {
      case 'coopbxp':
        addEntryToSheetBXP('A', 'B');
        break;
      case 'killsteal':
        addEntryToSheetKILLSTEAL('D', 'E');
        break;
    }

    /**
     * Checks args[1] to see if it is a high score. If not then add to the google sheet.
     * @param sheetCol1 The name column letter
     * @param sheetCol2 The value column letter
     */

    async function addEntryToSheetBXP(sheetCol1, sheetCol2) {
      if (isDevMode === true && ADMIN_ID.includes(message.member.id)) {
        let highScore = devsheetUNV_11.getCellByA1(sheetCol2 + 5).formattedValue;
        highScore = parseInt(highScore);
        entryValue = Math.abs(entryValue);
        let valueDifferenceHS = highScore - entryValue;
        let valueDifferenceNewHS = entryValue - highScore;
        if (highScore > entryValue) {
          await sendNotHighScoreMessage(message, commanderName, valueDifferenceHS);
          gsUpdateAdd(commanderName, entryValue, sheetCol1, sheetCol2, 10);
        } else if (highScore < entryValue) {
          let prevMessage = await sendHighScoreMessage(message, commanderName, valueDifferenceNewHS);
          whichBoard = 9;
          verification.execute(message, args, Discord, bot, {
            commanderName,
            val: entryValue,
            sheetCol1,
            sheetCol2,
            startingRowNumber: 10,
            sheetName: 'DEV_UNIVERSAL'
          }, whichBoard, isDevMode, ADMIN_ID);
        } else if (highScore === entryValue) {
          message.channel.send("It's a tie!");
          whichBoard = 9;
          verification.execute(message, args, Discord, bot, {
            commanderName,
            val: entryValue,
            sheetCol1,
            sheetCol2,
            startingRowNumber: 10,
            sheetName: 'DEV_UNIVERSAL'
          }, whichBoard, isDevMode, ADMIN_ID);
        }
      } else {
          let highScore = sheetUNV_10.getCellByA1(sheetCol2 + 5).formattedValue;
          highScore = parseInt(highScore);
          entryValue = Math.abs(entryValue);
          let valueDifferenceHS = highScore - entryValue;
          let valueDifferenceNewHS = entryValue - highScore;
          if (highScore > entryValue) {
            await sendNotHighScoreMessage(message, commanderName, valueDifferenceHS);
            gsUpdateAdd(commanderName, entryValue, sheetCol1, sheetCol2, 10);
          } else if (highScore < entryValue) {
            let prevMessage = await sendHighScoreMessage(message, commanderName, valueDifferenceNewHS);
            whichBoard = 8;
            verification.execute(message, args, Discord, bot, {
              commanderName,
              val: entryValue,
              sheetCol1,
              sheetCol2,
              startingRowNumber: 10,
              sheetName: 'NEW_UNIVERSAL'
            }, whichBoard, isDevMode, ADMIN_ID);
          } else if (highScore === entryValue) {
            message.channel.send("It's a tie!");
            whichBoard = 8;
            verification.execute(message, args, Discord, bot, {
              commanderName,
              val: entryValue,
              sheetCol1,
              sheetCol2,
              startingRowNumber: 10,
              sheetName: 'NEW_UNIVERSAL'
            }, whichBoard, isDevMode, ADMIN_ID);
          }
      }
    }

    async function addEntryToSheetKILLSTEAL(sheetCol1, sheetCol2) {
      if (isDevMode === true && ADMIN_ID.includes(message.member.id)) {
        let highScore = devsheetUNV_11.getCellByA1(sheetCol2 + 5).formattedValue;
        highScore = parseInt(highScore);
        entryValue = Math.abs(entryValue);
        let valueDifferenceHS = highScore - entryValue;
        let valueDifferenceNewHS = entryValue - highScore;
        if (entryValue > highScore) {
          await sendNotHighScoreMessage(message, commanderName, valueDifferenceHS);
          gsUpdateAdd(commanderName, entryValue, sheetCol1, sheetCol2, 10);
        } else if (entryValue < highScore) {
          let prevMessage = await sendHighScoreMessage(message, commanderName, valueDifferenceNewHS);
          whichBoard = 9;
          verification.execute(message, args, Discord, bot, {
            commanderName,
            val: entryValue,
            sheetCol1,
            sheetCol2,
            startingRowNumber: 10,
            sheetName: 'DEV_UNIVERSAL'
          }, whichBoard, isDevMode, ADMIN_ID);
        }else if (highScore === entryValue) {
          message.channel.send("It's a tie!");
          whichBoard = 9;
          verification.execute(message, args, Discord, bot, {
            commanderName,
            val: entryValue,
            sheetCol1,
            sheetCol2,
            startingRowNumber: 10,
            sheetName: 'DEV_UNIVERSAL'
          }, whichBoard, isDevMode, ADMIN_ID);
        }
      } else {
          let highScore = sheetUNV_10.getCellByA1(sheetCol2 + 5).formattedValue;
          highScore = parseInt(highScore);
          entryValue = Math.abs(entryValue);
          let valueDifferenceHS = entryValue - highScore;
          let valueDifferenceNewHS = highScore - entryValue;
          if (entryValue > highScore) {
            message.channel.send('Sorry ' + commanderName + ', you are ' + Math.abs(valueDifferenceHS) + ' from the current high score!');
            gsUpdateAdd(commanderName, entryValue, sheetCol1, sheetCol2, 10);
          } else if (entryValue < highScore) {
            message.channel.send('Well done ' + commanderName + '! Your entry is the new high score by a margin of ' + Math.abs(valueDifferenceNewHS) + '!\nThis high score has been forwarded to a commander for verification.');
            whichBoard = 8;
            verification.execute(message, args, Discord, bot, {
              commanderName,
              val: entryValue,
              sheetCol1,
              sheetCol2,
              startingRowNumber: 10,
              sheetName: 'NEWUNIVERSAL'
            });
          }else if (highScore === entryValue) {
            message.channel.send("It's a tie!");
            whichBoard = 8;
            verification.execute(message, args, Discord, bot, {
              commanderName,
              val: entryValue,
              sheetCol1,
              sheetCol2,
              startingRowNumber: 10,
              sheetName: 'NEWUNIVERSAL'
            });
          }
      }
    }
  }
}


async function gsLightRun(columnLetter, startingRowNumber) {
  const spreadsheetSizeObjects = {
    spreadsheetId: spreadsheet_id,
    range: 'NEWUNIVERSAL!' + columnLetter.toString() + 4
  }
  let dataSizeFromSheets = await gsapi.spreadsheets.values.get(spreadsheetSizeObjects);
  const dataSize = dataSizeFromSheets.data.values;
  return parseInt(dataSize) + parseInt(startingRowNumber);
}

async function gsLightDevRun(columnLetter, startingRowNumber) {
  const spreadsheetSizeObjects = {
    spreadsheetId: spreadsheet_id,
    range: 'DEV_UNIVERSAL!' + columnLetter.toString() + 4
  }
  let dataSizeFromSheets = await gsapi.spreadsheets.values.get(spreadsheetSizeObjects);
  const dataSize = dataSizeFromSheets.data.values;
  return parseInt(dataSize) + parseInt(startingRowNumber);
}


function gsUpdateAdd(name, val, columnLetter, nextColumnLetter, startingRowNumber) {
  gsLightRun(columnLetter, startingRowNumber).then((newRowToOverwrite) => {
    const gsapi = google.sheets({
      version: 'v4',
      auth: client2
    });
    const givenRange = columnLetter.toString() + newRowToOverwrite.toString() + ":" + nextColumnLetter.toString() + newRowToOverwrite.toString();
    gsapi.spreadsheets.values.append({
      "spreadsheetId": spreadsheet_id,
      "range": givenRange,
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
              console.log("Updated Range: " + response.data.updates.updatedRange);
            },
            function (err) {
              console.error("Execute error", err);
            });
  });
}

function gsUpdateDevAdd(name, val, columnLetter, nextColumnLetter, startingRowNumber) {
  gsLightDevRun(columnLetter, startingRowNumber).then((newRowToOverwrite) => {
    const gsapi = google.sheets({
      version: 'v4',
      auth: client2
    });
    const givenRange = columnLetter.toString() + newRowToOverwrite.toString() + ":" + nextColumnLetter.toString() + newRowToOverwrite.toString();
    gsapi.spreadsheets.values.append({
      "spreadsheetId": spreadsheet_id,
      "range": givenRange,
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
              console.log("Updated Range: " + response.data.updates.updatedRange);
            },
            function (err) {
              console.error("Execute error", err);
            });
  });
}