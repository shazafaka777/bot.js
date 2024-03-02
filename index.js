const { Client, Intents, Collection , EmbedBuilder, ButtonBuilder, ButtonStyle,ActionRowBuilder, SlashCommandBuilder} = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token } = require('./config.json');

const client = new Client({ 
    intents: [
        1 << 0, // GUILDS
        1 << 1  // GUILD_MEMBERS
    ]
});



const welcomeChannelId = '1203315963785908224';
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.once('ready', () => {
    console.log('Бот готов');
});
client.on('guildMemberAdd', member => {
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
    if (!welcomeChannel) return;

    const welcomeEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`Добро пожаловать на сервер!`)
        .setAuthor({ name: 'ИМПЕРИЯ ОНЛАЙН', iconURL: 'https://media.discordapp.net/attachments/1197809245966569564/1213186003741839360/01-03-2024_192313.png?ex=65f48e83&is=65e21983&hm=23aea6653d7e8b22e4d3a88af1b45e3bfa26e6e5eae8ae85bf22ae48d7e1dd50&=&format=webp&quality=lossless&width=100&height=93' })
        .setImage('https://media.discordapp.net/attachments/1197809245966569564/1213493124610007091/02-03-2024_172746.png?ex=65f5ac8a&is=65e3378a&hm=56cf11cb95e2adc7fc5c978a194b07bb7562a3062a145e0cc7325f56a4b42aa8&=&format=webp&quality=lossless&width=761&height=212')
        .setDescription(`Привет, ${member}! Мы рады видеть тебя на нашем сервере. Надеемся, что тебе здесь понравится.`)
        .setTimestamp();

        const button = new ButtonBuilder()
        .setLabel('TG')
        .setURL('https://t.me/+O-xYYWdO_XJiNjYy')
        .setStyle(ButtonStyle.Link);

        const button2 = new ButtonBuilder()
        .setLabel('VK')
        .setURL('https://vk.com/online.empire')
        .setStyle(ButtonStyle.Link);
    	const actionRow = new ActionRowBuilder()
			.addComponents(button, button2);


    welcomeChannel.send({ embeds: [welcomeEmbed], components: [actionRow] });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Произошла ошибка при выполнении команды.', ephemeral: true });
    }
});

client.login(token);
