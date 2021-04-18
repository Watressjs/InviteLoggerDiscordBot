const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');

const categoryNames = require('../../../assets/exports/categories.json');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    const guild = db.get(`guilds.${msg.guild.id}`);
    const cmd = args[0];
    if(cmd) {
        var command = client.commands.get(cmd);
        if(!command) command = client.commands.get(client.aliases.get(cmd));
        if(!command) return client.sendError("Podana nazwa polecenia nie pasuje do żadnego polecenia bota!", msg);
        let obj = {
            name: command.name,
            category: categoryNames[command.category],
            desc: command.description,
            usage: command.usage ? `\`\`${guild.prefix}${command.name}\`\` ${command.usage}` : false,
            exemples: command.exemples ? `\`\`\`${command.exemples.map(e => guild.prefix + e).join("\n")}\`\`\`` : false,
            permissions: command.permissions ? command.permissions.map(p => `\`\`${p}\`\``).join(", ") : false
        };
        let embed = new MessageEmbed()
            .setColor(client.config.embedColors)
            .setFooter(msg.author.username, msg.author.displayAvatarURL())
            .setAuthor(obj.name)
            .addField(
                "Kategoria",
                obj.category
            ).addField(
                "Opis",
                obj.desc
            )
            if(obj.usage) embed.addField(
                "Posługuj się:",
                obj.usage
            )
            if(obj.exemples) embed.addField(
                "Przykłady",
                obj.exemples
            )
            if(obj.permissions) embed.addField(
                "Wymagane uprawnienia:",
                obj.permissions
            )
        msg.channel.send(embed).catch(()=>{});
    } else {
        let embed = new MessageEmbed()
            .setColor(client.config.embedColors)
            .setFooter(msg.author.username, msg.author.displayAvatarURL())
            .setAuthor(msg.guild.id, msg.guild.iconURL())
            .setDescription(
                `Aby umieścić polecenia, użyj prefix \`\`${guild.prefix}\`\` !\n` +
                client.commands.filter(c => c.category == "any").map(c => c.description).join("\n")
            )
        let categories = [];
        client.commands.filter(c => c.category !== "any").forEach(c => { if(!categories.includes(c.category)) categories.push(c.category) });
        categories.forEach(cat => {
            embed.addField(
                categoryNames[cat],
                client.commands.filter(c => c.category == cat).map(c => `\`\`${c.name}\`\``).join(", ")
            )
        });
        msg.channel.send(embed).catch(()=>{});
    };
};
module.exports = {
    name: "help",
    category: "any",
    description: "``help`` : Wysyła listę komend",
    usage: "``[commande]``",
    aliases: ["h"],
    run: run
};