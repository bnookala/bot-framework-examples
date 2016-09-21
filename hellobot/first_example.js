var builder = require('botbuilder');

// STEP 1:
// Create a Console Connector! This is mostly used for testing,
// and won't require you to use a Bot Framework App ID or App Password.
// It also will *only* work from console based chat 
// (ie: PowerShell, your regular terminal).
var connector = new builder.ConsoleConnector().listen();

// STEP 2:
// Create our bot! Our bot takes a connector as it's only argument.
var bot = new builder.UniversalBot(connector);

// STEP 3:
// Define what our bot actually does! When we create dialogs, we define
// them at routes, much like we would define HTTP routes.. The '/' route
// is always the first to be hit.
bot.dialog('/', function (session) {
    session.send('Hello World');
});