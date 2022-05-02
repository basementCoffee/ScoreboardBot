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
                    value: "Use **!canuk** as a prefix. To submit an entry, use the format: \n`!canuk [dd, bb, cruiser, cv, universal] [damage, fires, torps, etc.] [value]` \n**EXAMPLE**: \n`!canuk dd fires 10` \n"
                }, {
                    name: '----- **Categories and Accepted Keywords** -----',
                    value: "**BB:** Damage, Kills, BXP, Secondary Hits, Citadels, MBH, Tanked Damage, Airplane kills, Fires, Caps/Defends/Assists, Incaps, BXP ≤ T7, Damage ≤ T7 \n \n**Cruiser:** Damage, Kills, BXP, Fires, Floods, Torp Hits, Citadels, MBH, Tanked Damage, Airplane Kills, Incaps, Cap/Defend/Assist, BXP ≤ T7, Damage ≤ T7 \n \n **DD:** Damage, Kills, BXP, Fires, Floods, Torp Hits, MBH, Tanked Damage, Airplane Kills, Incaps, Cap/Defend/Assist, Spotting Damage, BXP ≤ T7, Damage ≤ T7 \n \n **CV:** Damage, Kills, BXP, Citadels, Fires, Floods, Torp Hits, Airplane Kills, Incaps, Target Hits(Bomb/Rocket), BXP ≤ T7, Damage ≤ T7 \n \n **Universal Categories:** BXP(CO-OP), Lowest DMG Kill-Steal"
                }
            )
            .setThumbnail('https://i.pinimg.com/originals/e7/d3/20/e7d320f068eedc680a536d9351dfebab.jpg')
            .setFooter(' Good luck Commanders!')
        message.channel.send(newEmbed);
    }
}