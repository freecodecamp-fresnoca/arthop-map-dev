'use strict';

// Initializes ArtHop.
function ArtHop() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.loginButton = document.getElementById('login');
  this.logoutButton = document.getElementById('logout');
  
  //Button listeners
  this.loginButton.addEventListener('click', this.signIn.bind(this));
  this.logoutButton.addEventListener('click', this.signOut.bind(this));

  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
ArtHop.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Signs-in Friendly Chat.
ArtHop.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Signs-out of Friendly Chat.
ArtHop.prototype.signOut = function() {
  // Sign out of Firebase.
  console.log('you should be logged out')
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
ArtHop.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    console.log(user, "logged in")
  } else { // User is signed out!
    console.log('user is logged out')
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
ArtHop.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
  } else if (config.storageBucket === '') {
    window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
        'actually a Firebase bug that occurs rarely. ' +
        'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
        'and make sure the storageBucket attribute is not empty. ' +
        'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
        'displayed there.');
  }
};

window.onload = function() {
  window.artHop= new ArtHop();
};
