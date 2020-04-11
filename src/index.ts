
import * as discord from 'discord.js'
import { config } from 'dotenv';
import { get_metar, get_taf } from './metar'

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
    const code  = args.shift();

    if(code === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong: Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
    }

    if (code) {
        await message.channel.send(await write_weather(code));
    }
}

async function write_weather(code: string): Promise<string> {

    try {
        
        const metar = await get_metar(code)
        const taf = await get_taf(code)

        const time = new Date(metar.time.dt.substring(0, metar.time.dt.length - 1))
        const gusts = metar.wind_gust ? metar.wind_gust : 'no gusts'

        return `

            ${metar.sanitized}

            Time: ${time.toUTCString()}
            Altimeter: ${metar.altimeter.value} inHg
            Clouds: ${metar.clouds[0].type} at ${metar.clouds[0].altitude}00
            Visibility: ${metar.visibility.value} SM
            Wind: ${metar.wind_direction.value}&deg; at ${metar.wind_speed.value} kts ${gusts}
            Dew: ${metar.dewpoint.value} &deg;C

            TAF

            ${format_taf(taf)}
        `
    } catch (err) {
        console.log(err)
    }

    return ''
}

function format_taf(taf: any) {
    let s = '';
    
    taf.forecast.forEach((f) => {
        s += `\n${f.summary}`
    });
    return s
}