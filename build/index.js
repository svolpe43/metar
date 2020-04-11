"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord = require("discord.js");
const dotenv_1 = require("dotenv");
const metar_1 = require("./metar");
dotenv_1.config();
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
function handle_message(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.author.bot)
            return;
        if (message.content.indexOf(prefix) !== 0)
            return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const code = args.shift();
        if (code === "ping") {
            const m = yield message.channel.send("Ping?");
            m.edit(`Pong: Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
        }
        if (code) {
            yield message.channel.send(yield write_weather(code));
        }
    });
}
function write_weather(code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const metar = yield metar_1.get_metar(code);
            const taf = yield metar_1.get_taf(code);
            const time = new Date(metar.time.dt.substring(0, metar.time.dt.length - 1));
            const gusts = metar.wind_gust ? metar.wind_gust : 'no gusts';
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
        `;
        }
        catch (err) {
            console.log(err);
        }
        return '';
    });
}
function format_taf(taf) {
    let s = '';
    taf.forecast.forEach((f) => {
        s += `\n${f.summary}`;
    });
    return s;
}
