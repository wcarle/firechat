(function() {
    // Set the configuration for our app
    // We got these values from the firebase project at https://console.firebase.google.com
    const config = {
        apiKey: "AIzaSyCv4hm4vEZweE5B30tgT2-zVyxAIMro0eA",
        authDomain: "wcarle-firechat.firebaseapp.com",
        databaseURL: "https://wcarle-firechat.firebaseio.com",
    };
    firebase.initializeApp(config);

    // The number of messages we will render at one time on the page
    const MESSAGE_COUNT = 10;

    // Check to see if we have a locally stored user record
    // TODO: Use firebase auth
    var username = localStorage.getItem('user');

    // Prompt the user for their name
    if (!username) {
        username = prompt('What\'s your name?');
        username = username ? username : 'anonymous';
        localStorage.setItem('user', username);
    }

    var user = {
        name: username
    };

    // Get a reference to the database service
    var database = firebase.database();

    // Reference to the /messages endpoint of our firebase database
    var messages = database.ref('messages');

    // The input field on the page
    var input = document.getElementById('message');

    // The form the input lives in
    var form = document.getElementById('form-message');

    // The list of messages on the page where we will be rendering our messages
    var messagesList = document.getElementById('messages-list');

    // Listen for form submit indicating the user submitted a message
    form.addEventListener('submit', function (e) {
        // Don't perform a full page form submit
        e.preventDefault();

        // Make sure the message isn't blank
        if (input.value.trim() === '') {
            alert('Your message is blank!');
            return;
        }

        // Push the message to the /messages ref in our database
        messages.push({
            user: user.name,
            text: input.value
        }).then(function () {
            // On Success blank out the input so they can type another message
            input.value = '';
        }, function () {
            // On Failure do nothing so the user doesn't have to retype their message and can try to submit it again
        });
    });

    // Listen to firebase list add and remove events to update our list of messages
    messages.limitToLast(MESSAGE_COUNT).on('child_added', function (data, prev) {
        var val = data.val();
        var newMessage = messageTemplate(data.key, val.user, val.text)
        messagesList.prepend(newMessage);
    });
    // Remove the message if it is removed from the database, this also keeps the list on the page limited to the last MESSAGE_COUNT messages
    messages.limitToLast(MESSAGE_COUNT).on('child_removed', function(data){
        document.getElementById(data.key).remove();
    });

    /**
     * Generate a dom node for the message that we will inject into the page
     * @param  {string} key  Unique ID of this message
     * @param  {string} user Username of the user that submitted the message
     * @param  {string} text Content of the message
     * @return {Element}     DOM Node to insert
     */
    function messageTemplate(key, user, text) {
        var newMessage = document.createElement('li');
        var badge = document.createElement('span')
        badge.className = 'badge badge-primary';
        badge.innerText = user;
        var messageText = document.createElement('span');
        messageText.innerText = ' - ' + text;
        newMessage.appendChild(badge);
        newMessage.appendChild(messageText);
        newMessage.className = 'list-group-item';
        newMessage.id = key;
        return newMessage;
    }

})();