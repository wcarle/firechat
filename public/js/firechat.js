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

    var user = {
        name: null
    };

    // Get a reference to the database service
    var database = firebase.database();

    // Reference to the /messages endpoint of our firebase database
    var messages = database.ref('messages');
    var users = database.ref('users');
    var userRef = null;

    // The input field on the page
    var input = document.getElementById('message');

    // The form the input lives in
    var form = document.getElementById('form-message');

    // The list of messages on the page where we will be rendering our messages
    var messagesList = document.getElementById('messages-list');

    /**
     * Call when user is done logging in
     */
    function ready() {
        // Allow them to submit a message
        input.disabled = false;
    }

    /**
     * Log the user in using firebase anonymous auth
     */
    function login() {
        // Listen for changes to the auth state
        // When a user logs in or out
        // This is simple with anonymous auth and can be easily replaced with more involved auth methods
        firebase.auth().onAuthStateChanged(function(val) {
            // If we have a value then the user is logging in
            if (val) {
                user.uid = val.uid;
                userRef = users.child(user.uid);

                // Get the user details from the /users path in our database
                userRef.once('value', function(data){
                    // This is the first time the user is logging in so we need to ask them to enter their name
                    if (data.val() === null) {
                        user.name = prompt("What's your name?");
                        users.child(user.uid).set(user);
                    }
                    // The user has logged in before, just update their user record locally
                    else {
                        user = data.val();
                    }
                    // User is now logged in, we can now allow them to chat
                    ready();
                });
            }
            else {
                // User logout
            }
        });
        // Trigger the actual "login" here is where we'd update things with a JWT token or a social login instead of anonymous authentication
        firebase.auth().signInAnonymously().catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ': ' + error.message);
        });
    }

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

    // We're done setting up, login the user
    login();

})();