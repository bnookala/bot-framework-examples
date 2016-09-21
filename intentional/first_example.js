const builder = require('botbuilder');
const restify = require('restify');

// STEP 1: Create a connector, a REST HTTP server, and a bot as we would normally.
let connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

let server = restify.createServer();

server.listen(3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

server.post('/api/messages', connector.listen());

let bot = new builder.UniversalBot(connector);

// STEP 2: Create LUIS recognizer that points at our model and add it as the root '/' dialog for bot.
let modelUri = 'https://api.projectoxford.ai/luis/v1/application?id=dac1c298-abd7-4341-81a8-fe407f15508f&subscription-key=f69f3ef0bd804033b57fdd7f0e0254ba';
let recognizer = new builder.LuisRecognizer(modelUri);
let dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

// STEP 3: When an intention is recognized, do something about it. 
// Imagine matching on an intent, and then jumping from there into a waterfall.
dialog.matches('Pay', builder.DialogAction.send('Payment intent'));
dialog.matches('Travel', builder.DialogAction.send('Travel intent'));
dialog.matches('CostQuery', builder.DialogAction.send('Cost Query intent'));
dialog.matches('Locate', builder.DialogAction.send('Location intent'));
dialog.matches('ChangeAddress', builder.DialogAction.send('Changing address'));
dialog.matches('ScheduleAppointment', builder.DialogAction.send('Scheduling an appointment'));

// It's useful to have a 'default' bucket, so that  messages that aren't recognized still send back a 
dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand that. Can you rephrase the question?"));