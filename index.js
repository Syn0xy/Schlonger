const Discord = require('discord.js');
const client = new Discord.Client();

const cron = require('node-cron');
const fs = require('fs');

let tokenData = fs.readFileSync('./res/token.json');
let configData = fs.readFileSync('./res/config.json');
let channelData = fs.readFileSync('./res/channel.json');
let commandData = fs.readFileSync('./res/command.json');
let token = JSON.parse(tokenData);
let config = JSON.parse(configData);
let channel = JSON.parse(channelData);
let command = JSON.parse(commandData);

const TOKEN = token.token;
const PREFIX = config.prefix;
const SEPARATOR = " ";

const playerPictures = [];

client.login(TOKEN);

client.on('ready', () => {
	log("Je suis connecte !");
	
	cron.schedule('* * * * *', () => { daily(); });
});

client.on("message", (msg) => {
	if (msg.author.id === client.user.id) return;
	if(msg.content.substring(0, PREFIX.length) !== PREFIX) return;
	log("author : " + msg.author.username + ", content : " + msg.content);
	const args = msg.content.toLowerCase().substring(PREFIX.length).split(SEPARATOR);
    switch(args[0]){
        case command.command_1: commande1(msg); break;
		case command.command_2: commande2(msg); break;
    }
});

const daily = () => {
	clearPictures();
	dailyMessage();
}

function clearPictures(){
	playerPictures.length = 0;
}

function dailyMessage(){
	const CHANNEL_PICTURES = client.channels.cache.get(channel.pictures_id);
	sendMessage(CHANNEL_PICTURES, currentTime());
	if(playerPictures.length > 0){
		sendCurrentImages();
		const random = randomPicture();
		sendImage(CHANNEL_PICTURES, "Joueur aleatoire : " + random.player, random.picture);
	}else{
		sendMessage(CHANNEL_PICTURES, "Il n'y a pas assez de joueur :(");
	}
}

function currentTime(){
	const time = new Date();
	const day = time.getDate(), month = time.getMonth() + 1, year = time.getFullYear();
	const hours = time.getHours(), minutes = time.getMinutes(), seconds = time.getSeconds();
	return "Date : ${day}/${month}/${year}\nTime : ${hours}:${minutes}:${seconds}";
}

function sendCurrentImages(){
	const CHANNEL_PICTURES = client.channels.cache.get(channel.pictures_id);
	const msg = "Voici toutes les images enregistrées pour le moment :";
	sendImagesUrl(CHANNEL_PICTURES, msg, allImagesUrl());
}

function log(msg){
	const CHANNEL_LOG = client.channels.cache.get(channel.log_id);
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
			msg.reply("Image enregistree !");
		}else{
			msg.reply("L'image n'a pas pu etre enregistree, reessaie plus tard.");
		}
	}else if (nb > 1){
		msg.reply("Il ne doit y avoir qu'une seule image !");
	}else{
		msg.reply("Veuillez joindre une image.");
	}
}

async function sendMessage(channel, msg){
	await channel.send(msg);
}

async function sendImage(channel, msg, url){
	await channel.send({
		content: msg,
		files: [url]
	});
}

async function sendImages(channel, msg, attachments){
	sendImagesUrl(channel, msg, attachments.map(attachment => attachment.url));
}

async function sendImagesUrl(channel, msg, urls){
	await channel.send({
		content: msg,
		files: urls
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

function allImagesUrl(){
	const imagesUrl = [];
	for (const id in playerPictures) {
		if (playerPictures.hasOwnProperty(id)){
			imagesUrl.unshift(playerPictures[id]);
			console.log(id);
		}
	}
	return imagesUrl;
}

function randomPicture(){
	const playersId = Object.keys(playerPictures);
	const randomId = playersId[Math.floor(Math.random() * playersId.length)];
	const picture = playerPictures[randomId];
	return { player: randomId, picture: picture };
}