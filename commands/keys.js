module.exports = {
  name: "keys",
  description: "Keywords command!",
  execute(message, args, Discord) {
    const newEmbed = new Discord.MessageEmbed()
      .setColor("#FFFAFA")
      .setTitle("Command Keys")
      .setURL("https://bit.ly/39XH7sO")
      .addFields({
        name: "**Accepted Keywords**",
        value:
          "**BB:**  'damage', 'dmg', 'kill', 'kills', 'bxp', 'base-xp', 'secondaries', 'secondary', 'cit', 'cits', 'mbh', 'tanked', 'planes', 'fires', 'fire', 'caps', 'cap', 'defended', 'assist', 'incaps', 'incap', 't7bxp', 't7dmg', 't7damage' \n \n**Cruiser:** 'damage', 'dmg', 'kill', 'kills', 'bxp', 'fires', 'fire', 'floods', 'flood', 'torps', 'torp', 'cit', 'cits', 'mbh', 'tanked-dmg', 'tanked', 'planes', 'plane-kills', 'incaps', 'incap', 'caps', 'defended', 'assists', 't7bxp', 't7dmg' \n \n**DD:** 'damage', 'dmg', 'kill', 'kills', 'bxp', 'base-xp', 'fires', 'fire', 'floods', 'flood', 'torps', 'torp', 'cit', 'cits', 'mbh', 'tanked', 'tanked-dmg', 'planes', 'plane-kills', 'incaps', 'incap', 'caps', 'defended', 'assists', 'spotting', 'spotting-dmg', 't7bxp', 't7dmg' \n \n**CV:** 'damage', 'dmg', 'kill', 'kills', 'bxp', 'base-xp', 'cit', 'cits', 'fires', 'fire', 'floods', 'torps', 'planes', 'incaps', 'incap', 'target-hits', 'targets', 't7bxp', 't7dmg' \n \n**Universal:** 'bxp-coop', 'coopbxp', 'killsteal', 'ks', 'steal'",
      })
      .setFooter("Good luck Commanders!");
    message.channel.send(newEmbed);
  },
};
