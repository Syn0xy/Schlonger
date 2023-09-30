const Discord = require('discord.js');
const client = new Discord.Client();

const cron = require('node-cron');
const fs = require('fs');
let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);

const TOKEN = config.token;
const PREFIX = config.prefix;
const SEPARATOR = " ";

const CHANNEL_LOG_ID = '1157601117736275998';
const CHANNEL_PICTURES_ID = '1157607727544156270';

const commande1 = "ping";

client.login(TOKEN);

client.on('ready', () => {
	log("Je suis connecte !");
	
	cron.schedule('* * * * *', () => {
		sendMessage();
	});
});

client.on("message", (msg) => {
	if (msg.author.id === client.user.id) return;
	if(msg.content.substring(0, PREFIX.length) !== PREFIX) return;
	log("author : " + msg.author.username + " , content : " + msg.content);
	const args = msg.toLowerCase().content.substring(PREFIX.length).split(SEPARATOR);
	log(args[0]);
    switch(args[0]){
        case commande1:
          log("pong !");
          msg.reply("pong !");
            break;
    }
});

const sendMessage = () => {
	const CHANNEL_PICTURES = client.channels.cache.get(CHANNEL_PICTURES_ID);
	const currentTime = new Date();
	const msg = "Date:" + currentTime.getDate() + ", heures:" + currentTime.getHours() + ", minutes:" + currentTime.getMinutes() + ", secondes:" + currentTime.getSeconds();
	CHANNEL_PICTURES.send(msg);
}

function log(msg){
	const CHANNEL_LOG = client.channels.cache.get(CHANNEL_LOG_ID);
	CHANNEL_LOG.send(msg);
	console.log(msg);
}