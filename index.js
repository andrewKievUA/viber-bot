'use strict';
//require('dotenv').config();
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const PictureMessage = require('viber-bot').Message.Picture;
const FileMessage = require('viber-bot').Message.File;
var fs = require('fs')
const ngrok = require('./get_public_url');
const cron = require("node-cron");
//const { S7Client } = require("s7client");
const axios = require('axios')
const Path = require('path')
const cloudinary = require('cloudinary').v2;




let secure_url = `https://res.cloudinary.com/dflu2shrc/image/upload/v1675688674/1.jpg`


// Configuration 
cloudinary.config({
    cloud_name: "dflu2shrc",
    api_key: "374367528427555",
    api_secret: "iWetRBXkb8bVOP7Bfnj9GsKllQE"
});


cron.schedule('0 */4 * * * *', () => {
    downloadImage()
    console.log(' downloadImage from mammon');
});


cron.schedule('30 */4 * * * *', () => {
    downloadImageToweb()
    console.log('downloadImageToweb');
});



function checkUrlAvailability(botResponse, text_received) {
    let sender_name = botResponse.userProfile.name;
    let sender_id = botResponse.userProfile.id;

    if (sender_id !== `FiFBOtd/Mz/Oo+5rlVKsyg==`) {
        fs.appendFile('users.txt', "{" + `${sender_name}` + ":" + `${sender_id}` + `":"${text_received}`, (err) => {
            if (err) throw err;
            console.log('Data has been added!');
        });

    }

    if (text_received === '') {
        say(botResponse, 'I need a Text to check');
        return;
    }

    let message;
    if (text_received === '115') {
        axios.get('http://192.168.10.254:3000/checkData')
            .then(function (response) {
                //console.log(response.data)
                message = new TextMessage(response.data);
                botResponse.send(message);
                //console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
                return
            })
    }
    else if (text_received === '1') {
        message = new PictureMessage(secure_url);
    }
    else {
        message = new TextMessage(`Добрий день ${sender_name} `);
    }

    console.log(message);
    botResponse.send(message);
}

const bot = new ViberBot({
    authToken: "506ff3cfba27e13b-1fd904b59d1e22ac-610e42d83e1d06af",
    name: " ",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVUEHs-NQ0wKtnQ23SIMDTUj04O6MZRTlh1VWzWhA&s" // It is recommended to be 720x720, and no more than 100kb.
});

// The user will get those messages on first registration
bot.onSubscribe(response => console.log(`Subscribed: ${response.userProfile.name}`));

bot.onUnsubscribe(userId => {

    console.log(`Unsubscribed: ${userId}`)
    fs.appendFile('users.txt', "{" + `${userId}` + ":" + `Unsubscribed`, (err) => {
        if (err) throw err;
        console.log('Data has been added!');
    });
})


bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) =>
	onFinish(new TextMessage(`Hi, ${userProfile.name}! Nice to meet you.`)));

bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) =>{
    onFinish(new TextMessage(`Доброго дня`))
    console.log(`userProfile`,userProfile.id,userProfile.name )
    fs.appendFile('new.txt', "{" + `${userProfile.id}` + ":" + `${userProfile.name}`, (err) => {
        if (err) throw err;
        console.log('Data has been added!');
    });

  },
     {saidThanks: true}
     ),
    
    



// Perfect! Now here's the key part:
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    // This sample bot can answer only text messages, let's make sure the user is aware of that.
    if (!(message instanceof TextMessage)) {
        // say(response, `Sorry. I can only understand text messages.`);

        if (message instanceof PictureMessage) {
            //  say(response, `You sent picture message`);
        }
    }
});

bot.onTextMessage(/./, (message, response) => {
    checkUrlAvailability(response, message.text);
});

bot.getBotProfile().then(response => console.log(`Bot Named: ${response.name}`));

// Server
if (process.env.NOW_URL || process.env.HEROKU_URL) {
    const http = require('http');
    const port = process.env.PORT || 5000;

    http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL));
} else {
    return ngrok.getPublicUrl().then(publicUrl => {
        const http = require('http');
        const port = process.env.PORT || 5000;

        console.log('publicUrl => ', publicUrl);

        http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(publicUrl));

    }).catch(error => {
        console.log('Can not connect to ngrok server. Is it running?');
        console.error(error);
        process.exit(1);
    });
}


async function downloadImage() {
    console.log("downloadImage")
    const url = 'http://192.168.10.254:3000/screen'
    const path = Path.resolve(__dirname, 'images', 'code.jpg')
    const writer = fs.createWriteStream(path)
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    response.data.pipe(writer)


}

async function downloadImageToweb() {

    const res = cloudinary.uploader.upload("C:/rezka-params/viber_bot/images/code.jpg", {
        public_id: "1",
        asset_id: '4320b7401b28b4a2bd5c57a1685eedce',
        overwrite: true,
        unique_filename: false,
        use_filename: true,
        //  signature: '9477f94575006666b24ee570d7f6384338187ecc',
        api_key: "374367528427555",
        transformation: {
            fetch_format: "jpg"

        }
    })
    res.then((data) => {
        //  console.log(data);
        console.log(data.secure_url);
        secure_url = data.secure_url
        console.log(secure_url);

    }).catch((err) => {
        console.log(err);
    })
        .catch(function (error) {
            // handle error
            console.log(error);
            return
        })

}





