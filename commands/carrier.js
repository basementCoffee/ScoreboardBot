require('dotenv').config();


const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');
const {sendHighScoreMessage, sendNotHighScoreMessage} = require('./utils/utils')
const {google, GoogleApis} = require('googleapis');
const verification = require('./verification');
const Discord = require("discord.js");
const {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} = require("google-spreadsheet");
const client2 = new google.auth.JWT(client_email, null, private_key, [
  'https://www.googleapis.com/auth/spreadsheets'
]);
const gsapi = google.sheets({
  version: 'v4',
  auth: client2
});


module.exports = {
  name: 'carrier',
  description: "carrier commands",
  execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheetCV_6, devsheetCV_7, bot, whichBoard, isDevMode, ADMIN_ID) {
    let type = args[0];
    let entryValue;
    let commanderName = (message.member.nickname ? message.member.nickname : message.member.user.username);
    let allowedWords = ['kills', 'cits', 'incaps', 'fires', 'secondaries', 'planekills', 'torps', 'floods', 'targets', 'spots', 'caps', 't7bxp', 't7dmg', 'dmg', 'bxp', 'tanked', 'spottingdmg'];
    if (allowedWords.includes(args[0])) {
      let val = parseInt(args[1]);
      if (val > 0) entryValue = args[1];
      //else return message.channel.send("Sorry I don't recognize that command. Please check the pinned help guide on how to use the CANUKBot.");
    } else {
      return message.channel.send("Sorry I don't recognize that command. Please check the pinned help guide on how to use the CANUKBot.");
    }
    if (isDevMode === true && message.member.id === ADMIN_ID) {
      switch (type) {
        case 'kills':
          addEntryToDevSheet('A', 'B');
          break;
        case 'cits':
          addEntryToDevSheet('D', 'E');
          break;
        case 'incaps':
          addEntryToDevSheet('G', 'H');
          break;
        case 'fires':
          addEntryToDevSheet('J', 'K');
          break;
        case 'secondaries':
          addEntryToDevSheet('M', 'N');
          break;
        case 'planekills':
          addEntryToDevSheet('P', 'Q');
          break;
        case 'torps':
          addEntryToDevSheet('S', 'T');
          break;
        case 'floods':
          addEntryToDevSheet('V', 'W');
          break;
        case 'targets':
          addEntryToDevSheet('Y', 'Z');
          break;
        case 'spots':
          addEntryToDevSheet('AB', 'AC');
          break;
        case 'caps':
          addEntryToDevSheet('AE', 'AF');
          break;
        case 't7bxp':
          addEntryToDevSheet('AH', 'AI');
          break;
        case 't7dmg':
          addEntryToDevSheet('AK', 'AL');
          break;
        case 'dmg':
          addEntryToDevSheet('AN', 'AO');
          break;
        case 'bxp':
          addEntryToDevSheet('AQ', 'AR');
          break;
        case 'tanked':
          addEntryToDevSheet('AT', 'AU');
          break;
        case 'spottingdmg':
          addEntryToDevSheet('AW', 'AX');
          break;
      }
    } else {
      switch (type) {
        case 'kills':
          addEntryToSheet('A', 'B');
          break;
        case 'cits':
          addEntryToSheet('D', 'E');
          break;
        case 'incaps':
          addEntryToSheet('G', 'H');
          break;
        case 'fires':
          addEntryToSheet('J', 'K');
          break;
        case 'secondaries':
          addEntryToSheet('M', 'N');
          break;
        case 'planekills':
          addEntryToSheet('P', 'Q');
          break;
        case 'torps':
          addEntryToSheet('S', 'T');
          break;
        case 'floods':
          addEntryToSheet('V', 'W');
          break;
        case 'targets':
          addEntryToSheet('Y', 'Z');
          break;
        case 'spots':
          addEntryToSheet('AB', 'AC');
          break;
        case 'caps':
          addEntryToSheet('AE', 'AF');
          break;
        case 't7bxp':
          addEntryToSheet('AH', 'AI');
          break;
        case 't7dmg':
          addEntryToSheet('AK', 'AL');
          break;
        case 'dmg':
          addEntryToSheet('AN', 'AO');
          break;
        case 'bxp':
          addEntryToSheet('AQ', 'AR');
          break;
        case 'tanked':
          addEntryToSheet('AT', 'AU');
          break;
        case 'spottingdmg':
          addEntryToSheet('AW', 'AX');
          break;
      }
    }

    /**
     * Checks args[1] to see if it is a high score. If not then add to the google sheet.
     * @param sheetCol1 The name column letter
     * @param sheetCol2 The value column letter
     */

    async function addEntryToSheet(sheetCol1, sheetCol2) {
      // Change below for each type
      let highScore = sheetCV_6.getCellByA1(sheetCol2 + 5).formattedValue;
      highScore = parseInt(highScore);
      entryValue = Math.abs(entryValue);
      let valueDifferenceHS = highScore - entryValue;
      let valueDifferenceNewHS = entryValue - highScore;
      if (highScore > entryValue) {
        sendNotHighScoreMessage(message, commanderName, valueDifferenceHS);
        gsUpdateAdd(commanderName, entryValue, sheetCol1, sheetCol2, 10);
      } else if (highScore < entryValue) {
        let prevMessage = await sendHighScoreMessage(message, commanderName, valueDifferenceNewHS);
        // Passes on to verification which board to update
        whichBoard = 0;
        verification.execute(message, args, Discord, bot,  {
          commanderName,
          val: entryValue,
          sheetCol1,
          sheetCol2,
          startingRowNumber: 10,
          sheetName: 'NEWCV',
          prevMessage
        }, whichBoard);
      } else if (highScore === entryValue) {
        message.channel.send("It's a tie!");
        whichBoard = 0;
        verification.execute(message, args, Discord, bot, {
          commanderName,
          val: entryValue,
          sheetCol1,
          sheetCol2,
          startingRowNumber: 10,
          sheetName: 'NEWCV'
        }, whichBoard);
      }
    }

    async function addEntryToDevSheet(sheetCol1, sheetCol2) {
      // Change below for each type
      let devhighScore = devsheetCV_7.getCellByA1(sheetCol2 + 5).formattedValue;
      devhighScore = parseInt(devhighScore);
      entryValue = Math.abs(entryValue);
      let valueDifferenceHS = devhighScore - entryValue;
      let valueDifferenceNewHS = entryValue - devhighScore;
      if (devhighScore > entryValue) {
        sendNotHighScoreMessage(message, commanderName, valueDifferenceHS);
        gsUpdateDevAdd(commanderName, entryValue, sheetCol1, sheetCol2, 10);
      } else if (devhighScore < entryValue) {
        let prevMessage = await sendHighScoreMessage(message, commanderName, valueDifferenceNewHS);
        // Passes on to verification which board to update
        whichBoard = 0;
        verification.execute(message, args, Discord, bot,  {
          commanderName,
          val: entryValue,
          sheetCol1,
          sheetCol2,
          startingRowNumber: 10,
          sheetName: 'DEV_CV',
          prevMessage
        }, whichBoard);
      } else if (devhighScore === entryValue) {
        message.channel.send("It's a tie!");
        whichBoard = 0;
        verification.execute(message, args, Discord, bot, {
          commanderName,
          val: entryValue,
          sheetCol1,
          sheetCol2,
          startingRowNumber: 10,
          sheetName: 'DEV_CV'
        }, whichBoard);
      }
    }
  }
}


async function gsLightRun(columnLetter, startingRowNumber) {
  const spreadsheetSizeObjects = {
    spreadsheetId: spreadsheet_id,
    range: 'NEWCV!' + columnLetter.toString() + 4
  }
  let dataSizeFromSheets = await gsapi.spreadsheets.values.get(spreadsheetSizeObjects);
  const dataSize = dataSizeFromSheets.data.values;
  return parseInt(dataSize) + parseInt(startingRowNumber);
}

async function gsLightDevRun(columnLetter, startingRowNumber) {
  const spreadsheetSizeObjects = {
    spreadsheetId: spreadsheet_id,
    range: 'DEV_CV!' + columnLetter.toString() + 4
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
              // Handle the results here (response.result has the parsed body).
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
              // Handle the results here (response.result has the parsed body).
              console.log("Updated Range: " + response.data.updates.updatedRange);
            },
            function (err) {
              console.error("Execute error", err);
            });
  });
}