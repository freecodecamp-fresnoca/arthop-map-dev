'use strict';

// Initializes ArtHop.
function ArtHop() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.loginButton = document.getElementById('login');
  this.logoutButton = document.getElementById('logout');
  this.nameDisplay = document.getElementById('sample-text');
  this.venues = [];

  //Button listeners
  this.loginButton.addEventListener('click', this.signIn.bind(this));
  this.logoutButton.addEventListener('click', this.signOut.bind(this));

  this.initFirebase();
  this.loadVenues();
  this.loadTopUsers();
}

ArtHop.prototype.loadVenues = function() {
  this.venuesRef = this.database.ref('venues');
  this.venuesRef.off();
  var self = this;
  var venues = [];

  this.venuesRef.once('value').then(function(data) {
    self.venues = data.val(); 
  });
}

ArtHop.prototype.loadTopUsers = function() {
  this.topUsersRef = this.database.ref('users');
  this.topUsersRef.off();
  var self = this;

  function appendUsers(data) {
    self.users = data.val();
    console.log('...', self.users)
  }

  this.topUsersRef.once('value').then(appendUsers);
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
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
ArtHop.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.

    this.logoutButton.style.display = 'block';
    this.loginButton.style.display = 'none';
    this.nameDisplay.textContent = "Logged in as " + user.displayName;
  } else { // User is signed out!
    
    this.logoutButton.style.display = 'none';
    this.loginButton.style.display = 'block';
    this.nameDisplay.textContent = '';
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
