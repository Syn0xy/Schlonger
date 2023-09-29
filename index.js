const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);

const token = config.token;

console.log(token);

client.login(token);

// client.on('ready', function () {
//   console.log("Je suis connecté !");
// });

// client.on('message', message => {
// 	if (message.content === 'ping') {
// 		message.reply('pong !');
// 	}
// });