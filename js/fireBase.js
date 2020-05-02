var app_fireBase = {};
(function () {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAjsNe5ZFPKZwoQ-a86b62ed4leWql_9EQ",
    authDomain: "productivitytool-1fa16.firebaseapp.com",
    databaseURL: "https://productivitytool-1fa16.firebaseio.com",
    projectId: "productivitytool-1fa16",
    storageBucket: "productivitytool-1fa16.appspot.com",
    messagingSenderId: "255873667718",
    appId: "1:255873667718:web:84f8b3f33672a0f69f7707",
    measurementId: "G-H1WBKP9M53"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  app_fireBase = firebase;
})()
