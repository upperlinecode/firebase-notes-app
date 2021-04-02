# firebase-notes-app

We left off having built out the logic for the sign in page and to create a new note. Let's build the functionality to read from our database and render the data as HTML.

1. We'll be writing most of our code in `viewNotes.js`. We'll start by adding another `window.onload` event:
```js
window.onload = event => {

}
```

2. Inside of this function, we'll add some code to check the authentication state of our user:
```js
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Console log the user to confirm they are logged in 
      console.log('Logged in as: ' + user.displayName);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
```

3. After verifying that our user is logged in, we want to store their id, so that we can later query for their data. We can add this line at the end of our `if` block:
```js
const googleUserId = user.uid;
```

4. We'll want to pass this user Id into our `getNotes` function so that we can append it to our query url. At this point our `window.onload` event should look like this:
```js
window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};
```

5. We need to add the functionality to retrieve the notes from the database. 
```js
const getNotes = (userId) => {

}
```

6. First we want to connect to to our database and reference our users inside of our `getNotes()` function:
```js
  const notesRef = firebase.database().ref(`users/${userId}`);
```

7. Next we'll write the code to read from the database and store the data that is returned in a variable:

```js
notesRef.on('value', (snapshot) => {
  const data = snapshot.val();
});
```

8. At this point our `getNotes()` function should look like this:

```js
const getNotes = () => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
  });
}
```

9. We now need to add the functionality to render our data as HTML. Let's write a function `renderDataAsHtml()` that will loop over our notes, create a card, and render it onto our `viewNotes.html` HTML page.

```js
const renderDataAsHtml = data => {

};
```

10. The simplest way to do this for now, is to create a large string of HTML. When we render it onto our DOM, it will be formatted and displayed as valid HTML. 

```js
const renderDataAsHtml = data => {
  let cards = ``;

};
```

11. Because we are dealing with objects, we can't loop over them in exactly the same way we might an array. We have to use a `for...in` loop. 

```js
const renderDataAsHtml = data => {
  let cards = ``;
  for(const noteItem in data) {
    const note = data[noteItem];
    // For each note create an HTML card
    }
};
```

12. We need to add some code that will create an HTML card for us. We could to that inside of our `renderDataAsHtml()` function, and that would work fine, but for the sake of readability and seperating concerns, let's try to keep our code as modular as possible. Instead we'll create a new function that just recieves data, formats it as HTML, and returns it. We can then call this function from inside `renderDataAsHtml()`.

```js
const createCard = (note) => {
  let innerHTML = "";
  innerHTML += `<div class="column is-one-quarter">`
  innerHTML += `<div class="card">`
  innerHTML += `<header class="card-header">`
  innerHTML += `<p class="card-header-title">`
  innerHTML += `${note.title}`
  innerHTML += `</p>`
  innerHTML += `</header>`
  innerHTML += `<div class="card-content">`
  innerHTML += `<div class="content">`
  innerHTML += `${note.text}`
  innerHTML += `</div>`
  innerHTML += `</div>`
  innerHTML += `</div>`
  innerHTML += `</div>`
  return innerHTML;
}
```

13. Now that we have the functionality written to create a card, we can call this in our `renderDataAsHtml()` function. Every time we iterate over a new piece of data, our `createCard()` function will format that data as an HTML string. We can concatenate this string onto our cards variable, then append it to our `viewNotes.html` page. 

```js
const renderDataAsHtml = data => {
  let cards = ``;
  for(const noteItem in data) {
    const note = data[noteItem];
    // For each note create an HTML card
    cards += createCard(note);
  };
  // Inject our string of HTML into our viewNotes.html page
  document.getElementById('app').innerHTML = cards;
};
```

At this point we've written all of the code to authenticate Google users, write to our Realtime Database, read from our Realtime Database, and render data as HTML. 

