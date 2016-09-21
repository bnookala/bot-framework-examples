var builder = require('botbuilder');
var restify = require('restify');

// STEP 1: Create a connector, a REST HTTP server, and a bot as we would normally.
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var server = restify.createServer();

server.listen(3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

// STEP 2: Our root level dialog here contains some logic that
// deals with collecting information from the user, a very classic bot scenario.
bot.dialog('/', function (session) {
    let user = session.message.user.name;
    let isGroup = session.message.address.conversation.isGroup;

    // we don't want to spam groups with messages, do we?
    if (isGroup) {
        console.log('detected a group conversation!');
        return;
    }

    session.send('hi ' + user + '!');

    // Here's an example of using the convenient state functionality that
    // the bot framework provides. We can attach arbitrary properties onto
    // the userData object.
    if (!session.userData.age || !session.userData.city) {
        // Here's an example of a jump to a different dialog.
        session.beginDialog('askQuestions');
    } else {
        printUserData(user, session);
    }
});

// A dialog can either be a single function, or composed of multiple functions.
// In the latter case, we call it a Waterfall.
//
// Waterfalls provide an abstract method to think about what actually composes conversation.
bot.dialog('askQuestions', [
    function (session, args, next) {
        if (session.userData.age) {
            // The next function passed as an argument calls the next function within the waterfall. 
            // If this dialog is initiated and the user's age is already known, it's not necessary
            // to prompt the user again for their age, so we can skip immediately.
            next();
        }

        // A prompt is a built in object that removes much of the boilerplate around asking questions
        // and receiving answers. Many of the existing prompts also provide validation. Inputting a string
        // to a number prompt will cause it to fail, for example.
        builder.Prompts.number(session, 'What is your age?');
    },
    function (session, results, next) {
        if (results.response) {
            session.userData.age = results.response;
        }

        if (session.userData.city) {
            next();
        }

        builder.Prompts.text(session, 'What is your city?');
    },
    function (session, results, next) {
        if (results.response) {
            session.userData.city = results.response;
        }

        let userInfoString = 'Age: ' + session.userData.age + ' City: ' + session.userData.city;
        builder.Prompts.confirm(session, 'Is this correct? ' + userInfoString);
    }, 
    function (session, results) {
        if (results.response) {
            session.send('Ok! Setting your city and age');
        } else {
            session.send('Ok! Refusing to save your city and age');
            session.userData.age = undefined;
            session.userData.city = undefined;
        }

        // Ending a dialog returns the flow of control back to where the dialog was initiated.
        session.endDialog();
    }
]);

// This is just a convenience function for printing some information about our user.
function printUserData (user, session) {
    session.send(user + ', this is what I know about you: ');
    session.send('Your age is: ' + session.userData.age);
    session.send('Your city is: ' + session.userData.city);
}