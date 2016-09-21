const builder = require('botbuilder');
const restify = require('restify');

// STEP 1:
// Create a Chat Connector! This will use allow the bot to talk to multiple
// channels supported by the bot framework.
let connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// STEP 2:
// Create a REST server! This will allow the bot to respond 
// to incoming messages received at an endpoint. You can use 
// any HTTP server you would like.
let server = restify.createServer();
server.listen(3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

server.post('/api/messages', connector.listen());

// STEP 3:
// Create our bot! This will define the interactions and how the bot
// should behave when it hears/sees conversation.
let bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session) {
    let user = session.message.user.name;
    let isGroup = session.message.address.conversation.isGroup;

    // we don't want to spam groups with messages, do we?
    if (isGroup) {
        console.log('detected a group conversation!');
        return;
    }

    session.send('hi ' + user + '!');
});