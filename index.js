const Discord = require('discord.js');
const client = new Discord.Client();

const cron = require('node-cron');
const fs = require('fs');
let rawdata = fs.readFileSync('./res/config.json');
let config = JSON.parse(rawdata);

const TOKEN = config.token;
const PREFIX = config.prefix;
const SEPARATOR = " ";

const CHANNEL_LOG_ID = '1157601117736275998';
const CHANNEL_PICTURES_ID = '1157607727544156270';

const cmd1 = "ping";
const cmd2 = "play";

const playerPictures = [];

client.login(TOKEN);

client.on('ready', () => {
	log("Je suis connecte !");
	
	cron.schedule('* * * * *', () => { dailyMessage(); });
});

client.on("message", (msg) => {
	if (msg.author.id === client.user.id) return;
	if(msg.content.substring(0, PREFIX.length) !== PREFIX) return;
	log("author : " + msg.author.username + ", content : " + msg.content);
	const args = msg.content.toLowerCase().substring(PREFIX.length).split(SEPARATOR);
    switch(args[0]){
        case cmd1: commande1(msg); break;
		case cmd2: commande2(msg); break;
    }
});

const dailyMessage = () => {
	const CHANNEL_PICTURES = client.channels.cache.get(CHANNEL_PICTURES_ID);
	const currentTime = new Date();
	let msg = "Date:" + currentTime.getDate() + ", heures:" + currentTime.getHours() + ", minutes:" + currentTime.getMinutes() + ", secondes:" + currentTime.getSeconds();
	msg += "\nVoici toutes les images enregistrées pour le moment :";
	sendImagesArray(CHANNEL_PICTURES, msg, playerPictures.map());
}

function log(msg){
	const CHANNEL_LOG = client.channels.cache.get(CHANNEL_LOG_ID);
	CHANNEL_LOG.send(msg);
	console.log(msg);
}

function commande1(msg){
	log("pong !");
	msg.reply("pong !");
}

function commande2(msg){
	const nb = msg.attachments.size;
	if(nb === 1){
		const attachment = msg.attachments.array()[0];
		if(savePicture(msg.author.id, attachment.url)){
			log("Image enregistrée !");
		}else{
			log("L'image n'a pas pu être enregistrée, réessaie plus tard.");
		}
	}else if (nb > 1){
		msg.reply("Il ne doit y avoir qu'une seule image !");
	}else{
		msg.reply("Veuillez joindre une image.");
	}
}

async function sendImages(channel, msg, url){
	await channel.send({
		content: msg,
		files: [url]
	});
}

async function sendImagesArray(channel, msg, attachments){
	await channel.send({
		content: msg,
		files: attachments.map(attachment => attachment.url)
	});
}

function savePicture(playerId, pictureUrl){
	// playerPictures.unshift(attachment);
	if(!playerPictures[playerId]){
		playerPictures[playerId] = pictureUrl;
		return true;
	}
	return false;
}