require('dotenv').config();

const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, '\n');
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, '\n');




const {google} = require('googleapis');
const verification = require('./verification');

module.exports = {
  name: 'universal',
  description: "universal commands",
  execute(message, args, Discord, GoogleApis, GoogleSpreadsheet, doc, GoogleSpreadsheetWorksheet, sheet5, bot) {
    let type = args[0];
    let entryValue;
    let commanderName = (message.member.nickname ? message.member.nickname : message.member.user.username);

    let allowedWords = ['bxp-coop', 'coopbxp', 'killsteal', 'ks', 'steal'];

    if (allowedWords.includes(args[0])) {
      let val = parseInt(args[1]);
      if (val > 0) entryValue = args[1];
      else return message.channel.send("Sorry I don't recognize that command. Please check the pinned help guide on how to use the CANUKBot.");
    } else {
      return message.channel.send("Sorry I don't recognize that command. Please check the pinned help guide on how to use the CANUKBot.");
    }

    if (type === 'bxp-coop' || type === 'coopbxp') {
      addEntryToSheetBXP('A', 'B');
    } else if (type === 'killsteal' || type === 'ks' || type === 'steal') {
      addEntryToSheetKILLSTEAL('D', 'E');
    }


    /**
     * Checks args[1] to see if it is a high score. If not then add to the google sheet.
     * @param sheetCol1 The name column letter
     * @param sheetCol2 The value column letter
     */
    function addEntryToSheetBXP(sheetCol1, sheetCol2) {
      // Change below for each type
      let highScore = sheet5.getCellByA1(sheetCol2 + 5).formattedValue;
      highScore = parseInt(highScore);
      entryValue = Math.abs(entryValue);
      let valueDifferenceHS = highScore - entryValue;
      let valueDifferenceNewHS = entryValue - highScore;
      if (highScore > entryValue) {
        message.channel.send('Sorry ' + commanderName + ', you are ' + Math.abs(valueDifferenceHS) + ' from the current high score!');
        gsUpdateAdd(commanderName, entryValue, sheetCol1, sheetCol2, 10);
      } else if (highScore < entryValue) {
        message.channel.send('Well done ' + commanderName + '! Your entry is the new high score by a margin of ' + Math.abs(valueDifferenceNewHS) + '!\nThis high score has been forwarded to a commander for verification.');
        verification.execute(message, args, Discord, bot, {
          commanderName,
          val: entryValue,
          sheetCol1,
          sheetCol2,
          startingRowNumber: 10,
          sheetName: 'Universal'
        });
      } else if (highScore === entryValue) {
        message.channel.send("It's a tie!");
        verification.execute(message, args, Discord, bot, {
          commanderName,
          val: entryValue,
          sheetCol1,
          sheetCol2,
          startingRowNumber: 10,
          sheetName: 'DD'
        });
      }
    }

    function addEntryToSheetKILLSTEAL(sheetCol1, sheetCol2) {
      // Change below for each type
      let highScore = sheet5.getCellByA1(sheetCol2 + 5).formattedValue;
      highScore = parseInt(highScore);
      entryValue = Math.abs(entryValue);
      let valueDifferenceHS = entryValue - highScore;
      let valueDifferenceNewHS = highScore - entryValue;
      if (entryValue > highScore) {
        message.channel.send('Sorry ' + commanderName + ', you are ' + Math.abs(valueDifferenceHS) + ' from the current high score!');
        gsUpdateAdd(commanderName, entryValue, sheetCol1, sheetCol2, 10);
      } else if (entryValue < highScore) {
        message.channel.send('Well done ' + commanderName + '! Your entry is the new high score by a margin of ' + Math.abs(valueDifferenceNewHS) + '!\nThis high score has been forwarded to a commander for verification.');
        verification.execute(message, args, Discord, bot, {
          commanderName,
          val: entryValue,
          sheetCol1,
          sheetCol2,
          startingRowNumber: 10,
          sheetName: 'Universal'
        });

      }else if (highScore === entryValue) {
        message.channel.send("It's a tie!");
        verification.execute(message, args, Discord, bot, {
          commanderName,
          val: entryValue,
          sheetCol1,
          sheetCol2,
          startingRowNumber: 10,
          sheetName: 'Universal'
        });
      }


    }
  }
}

const client2 = new google.auth.JWT(client_email, null, private_key, [
  'https://www.googleapis.com/auth/spreadsheets'
]);


async function gsrun(cl) {
  const gsapi = google.sheets({
    version: 'v4',
    auth: cl
  });


  const spreadsheetSizeObjects = {
    spreadsheetId: spreadsheet_id,
    range: 'Universal!B5'
  }

  let dataSizeFromSheets = await gsapi.spreadsheets.values.get(spreadsheetSizeObjects);
  const dataSize = dataSizeFromSheets.data.values;


  const songObjects = {
    spreadsheetId: spreadsheet_id,
    range: "Universal!A5:B5" + dataSize.toString()

  };

  let dataSO = await gsapi.spreadsheets.values.get(songObjects);
  const arrayOfSpreadsheetValues = dataSO.data.values;

}

const gsapi = google.sheets({
  version: 'v4',
  auth: client2
});

async function gsLightRun(columnLetter, startingRowNumber) {


  const spreadsheetSizeObjects = {
    spreadsheetId: spreadsheet_id,
    range: 'Universal!' + columnLetter.toString() + 4
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
