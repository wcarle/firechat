(function() {
    // Set the configuration for your app
    const config = {
        apiKey: "AIzaSyCv4hm4vEZweE5B30tgT2-zVyxAIMro0eA",
        authDomain: "wcarle-firechat.firebaseapp.com",
        databaseURL: "https://wcarle-firechat.firebaseio.com",
    };
    firebase.initializeApp(config);

    const MESSAGE_COUNT = 10;

    var username = localStorage.getItem('user');

    var user = {
        name: null
    };

    // Get a reference to the database service
    var database = firebase.database();

    var messages = database.ref('messages');
    var users = database.ref('users');
    var userRef = null;

    var input = document.getElementById('message');
    var form = document.getElementById('form-message');
    var messagesList = document.getElementById('messages-list');


    function ready() {
        input.disabled = false;
    }

    function login() {
        firebase.auth().onAuthStateChanged(function(val) {
            if (val) {
                user.uid = val.uid;
                userRef = users.child(user.uid);
                userRef.once('value', function(data){
                    if (data.val() === null) {
                        user.name = prompt("What's your name?");
                        users.child(user.uid).set(user);
                    }
                    else {
                        user = data.val();
                        if (!user.name) {
                            user.name = prompt("What's your name?");
                            users.child(user.uid).set(user);
                        }
                    }
                    ready();
                });
            }
            else {
                // User logout
            }
        });
        firebase.auth().signInAnonymously().catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ': ' + error.message);
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value.trim() === '') {
            alert('Your message is blank!');
            return;
        }
        messages.push({
            user: user.name,
            text: input.value
        }).then(function () {
            // On Success
            input.value = '';
        }, function () {
            // On Failure
        });
    });

    // Listen to firebase list add and remove events
    messages.limitToLast(MESSAGE_COUNT).on('child_added', function (data, prev) {
        var val = data.val();
        var newMessage = messageTemplate(data.key, val.user, val.text)
        messagesList.prepend(newMessage);
    });
    messages.limitToLast(MESSAGE_COUNT).on('child_removed', function(data){
        document.getElementById(data.key).remove();
    });
    messages.limitToLast(MESSAGE_COUNT).on('child_changed', function(data){
        var val = data.val();
        document.getElementById(data.key).innerHTML = '<span class="badge badge-primary">' + val.user + '</span> - ' + val.text;;
    });

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

    login();

})();