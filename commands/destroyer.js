require("dotenv").config();

const private_key = process.env.PRIVATE_KEY;
const client_email = process.env.CLIENT_EMAIL;
const spreadsheet_id = process.env.CLIENT_EMAIL;
const { google } = require("googleapis");
const verification = require("./verification");

module.exports = {
  name: "destroyer",
  description: "destroyer commands",
  execute(
    message,
    args,
    Discord,
    GoogleApis,
    GoogleSpreadsheet,
    doc,
    GoogleSpreadsheetWorksheet,
    sheet3,
    bot
  ) {
    let type = args[0];
    let entryValue;
    let commanderName = message.member.nickname
      ? message.member.nickname
      : message.member.user.username;

    let allowedWords = [
      "damage",
      "dmg",
      "kill",
      "kills",
      "bxp",
      "base-xp",
      "fires",
      "fire",
      "floods",
      "flood",
      "torps",
      "torp",
      "cit",
      "cits",
      "mbh",
      "tanked",
      "tanked-dmg",
      "planes",
      "plane-kills",
      "incaps",
      "incap",
      "caps",
      "defended",
      "assists",
      "spotting",
      "spotting-dmg",
      "t7bxp",
      "t7dmg",
    ];

    if (allowedWords.includes(args[0])) {
      let val = parseInt(args[1]);
      if (val > 0) entryValue = args[1];
      else
        return message.channel.send(
          "Sorry I don't recognize that command. Please check the pinned help guide on how to use the CANUKBot."
        );
    } else {
      return message.channel.send(
        "Sorry I don't recognize that command. Please check the pinned help guide on how to use the CANUKBot."
      );
    }

    if (type === "damage" || type === "dmg") {
      addEntryToSheet("A", "B");
    } else if (type === "kills" || type === "kill") {
      addEntryToSheet("D", "E");
    } else if (type === "base-xp" || type === "bxp") {
      addEntryToSheet("G", "H");
    } else if (type === "fires" || type === "fire") {
      addEntryToSheet("J", "K");
    } else if (type === "floods" || type === "flood") {
      addEntryToSheet("M", "N");
    } else if (type === "torp" || type === "torps") {
      addEntryToSheet("P", "Q");
    } else if (type === "spotting" || type === "spotting-dmg") {
      addEntryToSheet("AH", "AI");
    } else if (type === "mbh") {
      addEntryToSheet("S", "T");
    } else if (type === "tanked-dmg" || type === "tanked") {
      addEntryToSheet("V", "W");
    } else if (type === "planes" || type === "plane-kills") {
      addEntryToSheet("Y", "Z");
    } else if (type === "incaps" || type === "incap") {
      addEntryToSheet("AB", "AC");
    } else if (type === "caps" || type === "defended" || type === "assists") {
      addEntryToSheet("AE", "AF");
    } else if (type === "t7bxp") {
      addEntryToSheet("AK", "AL");
    } else if (type === "t7dmg") {
      addEntryToSheet("AN", "AO");
    }

    /**
     * Checks args[1] to see if it is a high score. If not then add to the google sheet.
     * @param sheetCol1 The name column letter
     * @param sheetCol2 The value column letter
     */
    function addEntryToSheet(sheetCol1, sheetCol2) {
      // Change below for each type
      let highScore = sheet3.getCellByA1(sheetCol2 + 5).formattedValue;
      highScore = parseInt(highScore);
      entryValue = Math.abs(entryValue);
      let valueDifferenceHS = highScore - entryValue;
      let valueDifferenceNewHS = entryValue - highScore;
      if (highScore > entryValue) {
        message.channel.send(
          "Sorry " +
            commanderName +
            ", you are " +
            Math.abs(valueDifferenceHS) +
            " from the current high score!"
        );
        gsUpdateAdd(commanderName, entryValue, sheetCol1, sheetCol2, 10);
      } else if (highScore < entryValue) {
        message.channel.send(
          "Well done " +
            commanderName +
            "! Your entry is the new high score by a margin of " +
            Math.abs(valueDifferenceNewHS) +
            "!\nThis high score has been forwarded to a commander for verification."
        );
        verification.execute(message, args, Discord, bot, {
          commanderName,
          val: entryValue,
          sheetCol1,
          sheetCol2,
          startingRowNumber: 10,
          sheetName: "DD",
        });
      } else if (highScore === entryValue) {
        message.channel.send("It's a tie!");
        verification.execute(message, args, Discord, bot, {
          commanderName,
          val: entryValue,
          sheetCol1,
          sheetCol2,
          startingRowNumber: 10,
          sheetName: "DD",
        });
      }
    }
  },
};

const client2 = new google.auth.JWT(client_email, null, private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

async function gsrun(cl) {
  const gsapi = google.sheets({
    version: "v4",
    auth: cl,
  });

  const spreadsheetSizeObjects = {
    spreadsheetId: spreadsheet_id,
    range: "DD!B5",
  };

  let dataSizeFromSheets = await gsapi.spreadsheets.values.get(
    spreadsheetSizeObjects
  );
  const dataSize = dataSizeFromSheets.data.values;

  const songObjects = {
    spreadsheetId: spreadsheet_id,
    range: "DD!A5:B5" + dataSize.toString(),
  };

  let dataSO = await gsapi.spreadsheets.values.get(songObjects);
  const arrayOfSpreadsheetValues = dataSO.data.values;
}

const gsapi = google.sheets({
  version: "v4",
  auth: client2,
});

async function gsLightRun(columnLetter, startingRowNumber) {
  const spreadsheetSizeObjects = {
    spreadsheetId: spreadsheet_id,
    range: "DD!" + columnLetter.toString() + 4,
  };

  let dataSizeFromSheets = await gsapi.spreadsheets.values.get(
    spreadsheetSizeObjects
  );
  const dataSize = dataSizeFromSheets.data.values;

  return parseInt(dataSize) + parseInt(startingRowNumber);
}

function gsUpdateAdd(
  name,
  val,
  columnLetter,
  nextColumnLetter,
  startingRowNumber
) {
  gsLightRun(columnLetter, startingRowNumber).then((newRowToOverwrite) => {
    const gsapi = google.sheets({
      version: "v4",
      auth: client2,
    });

    const givenRange =
      columnLetter.toString() +
      newRowToOverwrite.toString() +
      ":" +
      nextColumnLetter.toString() +
      newRowToOverwrite.toString();
    gsapi.spreadsheets.values
      .append({
        spreadsheetId: spreadsheet_id,
        range: "DD!" + givenRange,
        includeValuesInResponse: true,
        responseDateTimeRenderOption: "FORMATTED_STRING",
        responseValueRenderOption: "FORMATTED_VALUE",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[name, val]],
        },
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Updated Range: " + response.data.updates.updatedRange);
        },
        function (err) {
          console.error("Execute error", err);
        }
      );
  });
}
