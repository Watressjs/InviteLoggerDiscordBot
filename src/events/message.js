const { Client, Message } = require('discord.js');
const db = require('quick.db');

/**
 * @param {Client} client 
 * @param {Message} msg 
 */
module.exports = (client, msg) => {
    if(msg.author.bot || !msg.guild) return;
    const config = db.get(`guilds.${msg.guild.id}`);

    if(msg.content.replace(/ /g, "").replace(/!/g, "") == client.user.toString()) return msg.reply(`mój obecny prefiks to **${config.prefix}**.`).catch(()=>{});

    if(!msg.content.startsWith(config.prefix)) return;

    let cmd = msg.content.slice(config.prefix.length).split(" ")[0];
    let args = msg.content.slice(config.prefix.length + cmd.length).trim().split(/ +/g);

    let command = client.commands.get(cmd);
    if(!command) command = client.commands.get(client.aliases.get(cmd));
    if(!command) {
        cmd = cmd + " " + args[0];
        args = args.slice(1);
        command = client.commands.get(cmd);
        if(!command) command = client.commands.get(client.aliases.get(cmd));
    }
    if(command) command.run(client, msg, args);
};
