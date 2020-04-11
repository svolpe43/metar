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
const dotenv_1 = require("dotenv");
const axios_1 = require("axios");
dotenv_1.config();
const token = process.env.WEATHER_AUTH_TOKEN;
exports.get_metar = function get_metar(code) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Getting metar for ${code}.`);
        const resp = yield axios_1.default.get(`https://avwx.rest/api/metar/${code}?format=json&onfail=cache`, {
            params: {
                token: token,
            }
        });
        return resp.data;
    });
};
// todo: see what summary flag does
exports.get_taf = function get_taf(code) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Getting TAF for ${code}.`);
        const resp = yield axios_1.default.get(`https://avwx.rest/api/taf/${code}?options=summary&format=json&onfail=cache`, {
            params: {
                token: token,
            }
        });
        return resp.data;
    });
};
