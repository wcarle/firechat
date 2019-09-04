const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Filter = require('bad-words');

const bannedWords = ['nbc', 'ign', 'gizmodo', 'wirecutter', 'eater'];

exports.checkMessage = functions.database.ref('/messages/{messageId}/')
    .onWrite((change, context) => {
      var message = change.after;
      var text = message.child('text').val();

      filter = new Filter({ emptyList: true, placeHolder: '💩' });
      filter.addWords(bannedWords);

      if (text && filter.isProfane(text)) {
        return message.ref.update({ text: filter.clean(text) });
      }
      return true;
    });
