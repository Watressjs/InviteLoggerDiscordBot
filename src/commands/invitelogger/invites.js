const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    const member = args[0] ? msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) : msg.member;
    if(!member) return client.sendError("Żaden członek nie jest zgodny z podanymi informacjami.", msg);

    if(!db.has(`userInvites.${member.guild.id}.${member.user.id}`)) {
        db.set(`userInvites.${member.guild.id}.${member.user.id}`, {
            count: {
                ordinaries: 0,
                bonus: 0,
                fakes: 0,
                leaves: 0,
                total: 0,
                reloaded: {
                    ordinaries: 0,
                    bonus: 0,
                    fakes: 0,
                    leaves: 0,
                    total: 0,
                }
            },
            joined: [{
                fake: false,
                by: false,
                at: member.joinedAt,
                inviteCode: false
            }]
        });
    };
    const invites = db.get(`userInvites.${member.guild.id}.${member.user.id}.count`);
    let embed = new MessageEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setFooter(msg.author.username, msg.author.displayAvatarURL())
        .setColor(client.config.embedColors)
        .setDescription(
            `${member.user.id == msg.author.id ? "Twoje" : member.user.toString()} a **${invites.total}** zaproszenia !\n\n` +
            `✅ \`\`${invites.ordinaries}\`\` **narmalne**\n` +
            `✨ \`\`${invites.bonus}\`\` **bonusowe**\n` +
            `💩 \`\`${invites.fakes}\`\` **fejkowe**\n` +
            `❌ \`\`${invites.leaves}\`\` **opuściło**`
        )
    msg.channel.send(embed);
};

module.exports = {
    name: "invites",
    category: "invitelogger",
    description: "Wysyła podsumowanie Twoich zaproszeń lub zaproszenia członka.",
    usage: "``[@member | memberID]``",
    aliases: ["invite", "i"],
    run: run
};