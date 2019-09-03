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

    var messages = database.ref('messages');

    var input = document.getElementById('message');
    var form = document.getElementById('form-message');
    var messagesList = document.getElementById('messages-list');

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
        var newMessage = document.createElement('li');
        newMessage.innerHTML = '<span class="badge badge-primary">' + val.user + '</span> - ' + val.text;
        newMessage.className = 'list-group-item';
        newMessage.id = data.key;
        messagesList.prepend(newMessage);
    });
    messages.limitToLast(MESSAGE_COUNT).on('child_removed', function(data){
        document.getElementById(data.key).remove();
    });

})();