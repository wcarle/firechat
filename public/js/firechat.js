(function() {
    // Set the configuration for your app
    var config = {
        apiKey: "apiKey",
        authDomain: "wcarle-firechat.firebaseapp.com",
        databaseURL: "https://wcarle-firechat.firebaseio.com",
    };
    firebase.initializeApp(config);

    // Get a reference to the database service
    var database = firebase.database();

    database.ref('test').set({
        hello: 'world'
    });
})();