const Discord = require("discord.js");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
} = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const fs = require("fs");
const api = require("./ghibli-api.js")

const {
    token,
    testing
} = require("./config.json");

var {
    guildId,
    channelId,
    test
} = require("./config.json")

if(testing){
    guildId = test.guildId;
    channelId = test.channelId;
}

const denote_symbol = "!";
const keywords = [
    "play",
    "pause",
]

const song_links = [
    "https://www.youtube.com/watch?v=MZgBjQFMPvk&list=PLgSUL8L1_pJoSoNSxmy4biptpFFfSGdhp&index=44",
    "https://www.youtube.com/watch?v=VbRmFSQYeac&list=PLgSUL8L1_pJoSoNSxmy4biptpFFfSGdhp&index=10",
    "https://www.youtube.com/watch?v=ptwcZ574blo",
    "https://www.youtube.com/watch?v=TK1Ij_-mank",
    "https://www.youtube.com/watch?v=4iWT_j9uY0k",
    "https://www.youtube.com/watch?v=tBSthP5LTZU",
    "https://www.youtube.com/watch?v=fc_dscz6dm0",
    "https://www.youtube.com/watch?v=qYNvTX_ioYo",
    "https://www.youtube.com/watch?v=Htq2EUgcrKE",
    "https://www.youtube.com/watch?v=nBADF1LdP3g",
    "https://www.youtube.com/watch?v=1L3bkiwU5XQ"
]

var connection = null;
var player = null;


const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
});
client.login(token);

var guild = null;
var check = null;

client.once('ready', () => {
    console.log('Ready!');
    guild = client.guilds.cache.get(guildId)
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
    if(check != null){
        clearInterval(check);
    }
});

client.on('messageCreate',  async(message) => {
    let cmd = getCommand(message.content)
    console.log(cmd)
    switch(cmd){
    case "play":
        if(player != null){
            player.unpause()
        }
        break
    case "pause":
        if (player != null) {
            player.pause()
        }
        break
    default:
        console.log("Unknown command")
    }
})

function getCommand(message){
    cmd = ""
    keywords.forEach((word) => {
        if (message.includes(`${denote_symbol}${word}`)) {
            cmd = word
            return
        }
    })
    return cmd
}

function getRandSong(){
    return song_links[Math.floor(Math.random() * song_links.length)]
}

function createResource(){
    const stream = ytdl(getRandSong(), {
        filter: "audioonly"
    });
    const resource = createAudioResource(stream, {
        inlineVolume: true
    });
    resource.volume.setVolume(0.5);
    return resource
}

function joinChannel(){
    player = createAudioPlayer();
    connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: guild.voiceAdapterCreator
    })
    connection.subscribe(player)
    
    player.play(createResource())

    player.on(AudioPlayerStatus.Idle, () => {
        player.play(createResource())
    })

    player.on('error', (err) => {
        console.log(err)
    })
}

//Constantly checking to see if a user joined the channel
check = setInterval(() => {
    let channel = guild.channels.cache.get(channelId);
    let isOtherPeople = false
    for (const member of channel.members) {
        //console.log(member[1].user)
        if (member[1].user.bot == false) {
            isOtherPeople = true
            break
        }
    }

    if(isOtherPeople && client.voice.adapters.size == 0){
        joinChannel()
    } else if (!isOtherPeople && client.voice.adapters.size != 0){
        connection.destroy();
    }
}, 5000)