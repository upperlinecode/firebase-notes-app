let googleUserId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
  let cards = ``;
  for(const noteItem in data) {
    const note = data[noteItem];
    // For each note create an HTML card
    cards += createCard(note, noteItem)
  };
  // Inject our string of HTML into our viewNotes.html page
  document.getElementById('app').innerHTML = cards;
};

const editNote = (noteId) => {
  console.log(noteId)
  let note = document.getElementById(noteId);
  
}

const deleteNote = (noteId) => {
  firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
}

const createCard = (note, noteId) => {
  let innerHTML = "";
  console.log(note, noteId)
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
  innerHTML +=  `<footer class="card-footer">`
  innerHTML +=  `<a id="${noteId}" class="card-footer-item" onclick="editNote(this.id)">Edit</a>`
  innerHTML +=  `<a id="${noteId}" href="#" class="card-footer-item" onclick="deleteNote(this.id)">Delete</a>`
  innerHTML +=  `</footer>`
  innerHTML += `</div>`
  innerHTML += `</div>`

  return innerHTML;
};