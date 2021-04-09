# Google Authentication, and Writing Data to Realtime Database using Firebase

## Objectives
- Students will create a Firebase project and initialize a Firebase app in their project directory
- Students will use Firebase authentication to sign-in Google users
- Students will verify users authentication state upon navigating to a new page within the app
- Students will use the Firebase API to write and save new records to their Realtime Database

**Key Vocabulary: authentication, writing data, event handler**

## What We're Building
Over the next three days, we will be building a note-taking application similiar to Google Keep. Today we'll focus on adding the functionality to sign-in Google users, and write and save new records to our Realtime Database. 

## Starter Code
This branch contains all of the code we will need to get started building our sign-in flow and writing data to our Realtime Database. 
Most of our code will be written in the two JS files `signIn.js` and `writeNote.js`. 
There are a couple of other files we should be aware of: `index.html` is the starting point of our app, and where we will inject our Sign In logic. `writeNote.html` contains input fields where users can write and submit notes. Here is where we'll inject the logic to write data to our Firebase RTDB. 

## Stepped Solution

1. Create and initialize a new Firebase project
2. Steps in Firebase console…
3. In Firebase console enable Google Sign-In (Authentication > Sign-In Method)
4. Fork and clone the `firebase-notes-app` github repository
5. Checkout to branch `day11_starter`
6. In the command line:
    * npm install -g firebase-tools
    * firebase login
    * firebase init
7. Firebase init will add items in green to your directory
8. Terminal prompts:
    * Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter to confirm your choices.  Database, Hosting, Emulators
    * First, let's associate this project directory with a Firebase project. You can create multiple project aliases by running firebase use  --add, but for now we'll just set up a default project. ? Please select an option: Use an existing project > Notes App
    * What file should be used for Realtime Database Security Rules? (database.rules.json)
    * Hosting Setup: What do you want to use as your public directory? (public)
    * Configure as a single-page app (rewrite all urls to /index.html)? (y/N)
    * Set up automatic builds and deploys with GitHub? (y/N)
    * File public/index.html already exists. Overwrite? N
    * Emulators Setup: Which Firebase emulators do you want to set up? Press Space to select emulators, then Enter to confirm your choices.   Authentication, Database, Hosting
    * Which port do you want to use for the auth emulator? (9099)
    * Which port do you want to use for the database emulator? (9000)
    * Which port do you want to use for the hosting emulator? (5000)
    * Would you like to enable the Emulator UI? (Y/n)
    * Which port do you want to use for the Emulator UI (leave empty to use any available port)? default/press Enter
    * Would you like to download the emulators now? (y/N)
9. In HTML page add a button with an onclick handler (onclick = “signIn()”)
10. Link the signIn.js script file
11. In the signIn.js script create a signIn() function
12. Inside the signIn function add this line of code: .auth is available to us through the Firebase Authentication library which has been preloaded into our HTML files for us. .GoogleAuthProvider() calls an instance of Google Sign-In Authentication provider. Provider identifies users
    ```js
    var provider = new firebase.auth.GoogleAuthProvider();
    ```
13. In the Firebase documentation we can find the code we need to sign in a user using Google Sign-In
  ```js
  firebase.auth()
    // triggers a Google Sign-in pop up to render and allows users to login using a Google account
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API. We won’t be using it here, but it’s good to know that it’s available to you 
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
  ```
14. Inside of the `.then()` method we can add some code to tell our app what to do once a user has logged in via their Google account. We want to redirect them to the form where they can create a note so we'll add this like to the end of our `.then()` method call:
  ```js
  window.location = 'noteForm.html';
  ```
15. We want to get some data back if we do get an error, so we can add this code to the end of our `.catch()` method call:
  ```js
    const err = {
      errorCode,
      errorMessage,
      email,
      credential
    }
    console.log(err)
  ```
16. By now our `signIn()` function should look like this:
  ```js
  function signIn() {
    console.log('test')
    var provider = new firebase.auth.GoogleAuthProvider();
    console.log(provider)

    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        console.log('result')
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log('USER', user)
        window.location = 'writeNote.html';
    }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        const err = {
            errorCode,
            errorMessage,
            email,
            credential
        }
        console.log(err)
    });
  }
  ```
17. Let's test out or code up to this point. We should be able to simulate logging in through Google and be redirected to another HTML page with a form for creating a note. If we open our emulators UI and look under the authentication tab we can see the user that we just logged in as.
18. Currently, none of our buttons our working. We need to write the code that will trigger the functionality to write and view notes. Today we'll continue by learning how to create a new note.
19. Give students a chance to explore documentation to see if they can figure it out themselves. 
20. We'll be writing our code in `writeNote.js`.
21. We want the user state to persist between all of our HTML pages. To do that we can trigger a function as soon as the page loads to see whether or not a user is logged in. If we want to trigger some functionality as soon as the page loads we will call the window.onload event, like so:
  ```js
    window.onload = event => {

    }
  ```
22. Inside of our `window.onload` event we'll add the following. This allows us to observe whether or not a user is signed in: if so, we can access data for that user, if not we can redirect that user back to the sign in page to log in.
  ```js
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
  ```
23. So far our `writeNote.js` file should have this code.
  ```js
  window.onload = (event) => {
  // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('Logged in as: ' + user.displayName);
        googleUser = user;
      } else {
        window.location = 'index.html'; // If not logged in, navigate back to login page.
      }
    });
  };
  ```
24. We'll need to use our `googleUser` in our next function, so let's declare it at the top of our `writeNote.js` script.
  ```js
  let googleUser
  ```
25. Now we can write the function that will handle submitting a new note and actually persist this data to our RTDB.
  ```js
  const handleNoteSubmit = () => {

  }
  ```
26. Inside of our function we need to do a couple of things. We can add some comments to make things more clear.
  ```js
  const handleNoteSubmit = () => {
    // 1. Capture the form data
    // 2. Format the data and write it to our database
    // 3. Clear the form so that we can write a new note
  }
  ```
27. Let's start with the first bullet.
  ```js
  const handleNoteSubmit = () => {
    // 1. Capture the form data
    const noteTitle = document.getElementById('noteTitle');
    const noteText = document.getElementById('noteText');
    // 2. Format the data and write it to our database
    firebase.database().ref(`users/${googleUser.uid}`).push({
      title: noteTitle.value,
      text: noteText.value
    })
    // 3. Clear the form so that we can write a new note
  }
  ```
28. 
  ```js
  const handleNoteSubmit = () => {
    // 1. Capture the form data
    const noteTitle = document.getElementById('noteTitle');
    const noteText = document.getElementById('noteText');
    // 2. Format the data and write it to our database
    firebase.database().ref(`users/${googleUser.uid}`).push({
      title: noteTitle.value,
      text: noteText.value
    })
    // 3. Clear the form so that we can write a new note
    .then(() => {
      noteTitle.value = "";
      noteText.value = "";
    });
  }
  ```

## Extensions
