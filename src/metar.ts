
import { config } from 'dotenv';
import axios from 'axios';

config()

const token = process.env.WEATHER_AUTH_TOKEN

export const get_metar = async function get_metar(code) {
    console.log(`Getting metar for ${code}.`)
    const resp = await axios.get(`https://avwx.rest/api/metar/${code}?format=json&onfail=cache`, {
        params: {
            token: token,
        }
    });
    return resp.data
}

// todo: see what summary flag does
export const get_taf = async function get_taf(code) {
    console.log(`Getting TAF for ${code}.`)
    const resp = await axios.get(`https://avwx.rest/api/taf/${code}?options=summary&format=json&onfail=cache`, {
        params: {
            token: token,
        }
    })
    return resp.data
}

