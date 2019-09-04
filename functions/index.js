const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Filter = require('bad-words');

// Our list of naughty words that will get censored
const bannedWords = ['nbc', 'ign', 'gizmodo', 'wirecutter', 'eater'];

/**
 * Check the message that was just submitted for bad words
 * @type {boolean}
 */
exports.checkMessage = functions.database.ref('/messages/{messageId}/')
    .onWrite((change, context) => {
      // The message value after the current change is applied
      var message = change.after;
      // The text of that message
      var text = message.child('text').val();

      // Add the banned words defined above to our filter
      filter = new Filter({ emptyList: true, placeHolder: '💩' });
      filter.addWords(bannedWords);

      // If the text is profane clean it up
      if (text && filter.isProfane(text)) {
        return message.ref.update({ text: filter.clean(text) });
      }
      return true;
    });
