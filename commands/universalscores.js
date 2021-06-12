require("dotenv").config();

const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, "\n");
const client_email = process.env.CLIENT_EMAIL.replace(/\\n/gm, "\n");
const spreadsheet_id = process.env.SPREADSHEET_ID.replace(/\\n/gm, "\n");

const { google, GoogleApis } = require("googleapis");

const {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} = require("google-spreadsheet");

// Initialize the sheet
var doc = new GoogleSpreadsheet(spreadsheet_id);

var sheet1;
var sheet2;
var sheet3;
var sheet4;
var sheet5;

(async function () {
  await initializeAuth();
})();

async function initializeAuth() {
  await doc.useServiceAccountAuth({
    client_email: client_email,
    private_key: private_key,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title); // title of the sheet
  sheet1 = await doc.sheetsByIndex[0];
  sheet2 = await doc.sheetsByIndex[1];
  sheet3 = await doc.sheetsByIndex[2];
  sheet4 = await doc.sheetsByIndex[3];
  sheet5 = await doc.sheetsByIndex[4];
}

const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "universalscores",
  description: "Universal Categories Scoreboard!",
  execute(message, args, bot) {
    const getUniversalScoreboardEmbed = () => {
      const universalScoreBoardEmbed = new MessageEmbed();
      const description =
        "\n-----------  **UNIVERSAL CATEGORIES**  -----------\n" +
        "`BXP (CO-OP):`" +
        sheet5.getCellByA1("B6").formattedValue +
        " (" +
        abbreviateNumber(sheet5.getCellByA1("B5").formattedValue) +
        ") \n" +
        "`KILL STEALS:`" +
        sheet5.getCellByA1("E6").formattedValue +
        " (" +
        abbreviateNumber(sheet5.getCellByA1("E5").formattedValue) +
        ") \n";
      universalScoreBoardEmbed.setTitle(
        "[CANUK] Universal Categories LEADERBOARD"
      );
      universalScoreBoardEmbed.setColor("#ffffff");
      universalScoreBoardEmbed.setDescription(description);
      return universalScoreBoardEmbed;
    };

    try {
      bot.channels.cache
        .get("841438933824569375")
        .messages.fetch("852989695095865375")
        .then((x) => {
          x.edit("Updating the Universal Categories Scoreboard...").then(() => {
            sheet5.loadCells("A1:E500").then(() => {
              x.edit("Universal Categories Scoreboard:");
              x.edit(getUniversalScoreboardEmbed());
            });
          });
        });
    } catch (e) {
      console.log("Cannot find the the scoreboard embed.");
      bot.channels.cache
        .get("852991463428063272")
        .send(
          "Oi some idiot deleted the original pinned leaderboard. Make sure you replace the fetch id with the new one in the code!"
        );
      bot.channels.cache.get("841438933824569375").send.then((x) => {
        x.edit("Updating scoreboard...").then(() => {
          sheet5.loadCells("A1:E500").then(() => {
            x.edit("Universal Categories Scoreboard:");
            x.edit(getUniversalScoreboardEmbed());
          });
        });
      });
    }
  },
};

abbreviateNumber = function (num) {
  num = parseInt(num);
  let fixed = 0; // number of decimal places to show
  if (num === null) {
    return null;
  } // terminate early
  if (num === 0) {
    return "0";
  } // terminate early
  fixed = !fixed || fixed < 0 ? 0 : fixed;
  var b = num.toPrecision(2).split("e"), // get power
    k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    c =
      k < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
    d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
    e = d + ["", "k", "m", "b", "t"][k]; // append power
  return e;
};
