
import * as discord from 'discord.js'
import { weather, format } from './format'
import { config } from 'dotenv';
import { get_metar, get_taf } from './metar';

config();

const client = new discord.Client();
const prefix = process.env.DISCORD_BOT_PREFIX || '';
const token = process.env.DISCORD_BOT_TOKEN || '';

client.on("ready", () => {
    console.log(`Bot has started ${JSON.stringify(client)}.`);
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", handle_message);

client.login(token);

async function handle_message(message: discord.Message) {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const raw = args.shift()
    const code  = validate(raw);

    if(code === "ping") {
        const m = await message.channel.send("Ping");
        m.edit(`Pong: Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
    }
    
    let result = ''

    if (code) {
        try {
            result = await format({
                code: code,
                metar: await get_metar(code),
                taf: await get_taf(code),   
            } as weather)
        } catch (err) {
            console.log(err)
        }
    } else {
        result = `'${raw}' is not a valid airport identifier.`
    }
    
    await message.channel.send(result);
}

function validate(code: string | undefined): string {

    if (!code) {
        return ''
    }

    if (code.length === 4 && code[0] === 'K') {
        return code
    }

    if (code.length === 3 ) {
        return `K${code}`
    }

    return ''
}
