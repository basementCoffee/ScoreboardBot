module.exports = {
    name: 'help',
    description: "Help command!",
    execute(message, args, Discord) {
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#ff0d0c')
            .setTitle('Help Guide')
            .setURL('https://bit.ly/39XH7sO')
            .addFields({
                    name: 'Usage:',
                    value: "Use **!canuk** as a prefix. To submit an entry, use the format: \n`!canuk [dd, bb, cruiser, cv, universal] [damage, fires, torps, etc.] [score]` \n**EXAMPLE**: \n`!canuk dd fires 10` \n"
                }, {
                    name: '----- **Ship Categories & Keywords** -----',
                    value: "__**BB**__ \n *KILLS, MBH, CITS, INCAPS, FIRES, SECONDARIES, PLANEKILLS, TORPS, FLOODS, SUBHITS, AIRSTRIKE, SPOTS, CAPS, T7BXP, T7DMG, DMG, BXP, TANKED, SPOTTINGDMG* \n \n__**Cruiser**__ \n *KILLS, MBH, CITS, INCAPS, FIRES, SECONDARIES, PLANEKILLS, TORPS, FLOODS, SUBHITS, AIRSTRIKE, SPOTS, CAPS, T7BXP, T7DMG, DMG, BXP, TANKED, SPOTTINGDMG* \n \n __**DD**__ \n *KILLS, MBH, CITS, INCAPS, FIRES, SECONDARIES, PLANEKILLS, TORPS, FLOODS, SUBHITS, SPOTS, CAPS, T7BXP, T7DMG, DMG, BXP, TANKED, SPOTTINGDMG* \n \n __**CV**__ \n *KILLS, CITS, INCAPS, FIRES, SECONDARIES, PLANEKILLS, TORPS, FLOODS, TARGETS, SPOTS, CAPS, T7BXP, T7DMG, DMG, BXP, TANKED, SPOTTINGDMG* \n \n __**Universal Categories**__ \n *COOPBXP, KILLSTEAL*"
                }
            )
            .setThumbnail('https://i.pinimg.com/originals/e7/d3/20/e7d320f068eedc680a536d9351dfebab.jpg')
            .setFooter(' Good luck Commanders!')
        message.channel.send(newEmbed);
    }
}