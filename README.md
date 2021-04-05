# firebase-notes-app

### Final Code for CSSI 102 Day 12 (Week 3, Day 2)
We want to be able to edit or delete our notes.

Pass item to our createCard function call in the renderDataAsHtml function definition

Add noteId as a parameter to our renderDataAsHtml function

We'll update the footer of our cards to add buttons to edit or delete our note. We'll go into our create card function in our viewNotes.js file to add that functionality. We can update our Edit button with this code


```js
innerHTML +=  `<a id="${noteId}" href="#" class="card-footer-item" onclick="deleteNote(this.id)">Delete</a>`
```

2. Create an delete note function
```js
const deleteNote = (noteId) => {

}
```

3. Deleting a note in Firebase RTDB is simple. We just need to reference that record in our database and call `.remove()` on it. We can add this code inside our `deleteNote()` function:
```js
firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
```

4. To update a note we need to also add an edit button to our card footer and add an onclick handler, much like we did with our delete button.
```js
innerHTML +=  `<a id="${noteId}" class="card-footer-item" onclick="editNote(this.id)">Edit</a>`
```

5. We also need to add an `editNote()` function:
```js
const editNote = (noteId) => {
  let note = document.getElementById(noteId);
  
}
```

6. Create a modal with a form

7. Populate the modal with note title and text

8. onClick call Firebase RTDB update  function 

9. If update is successful, window should automatically reload and update data should be available.

10.  Now we can add the ability to edit our notes. First we'll create a modal in the `viewNotes.html` page.

```html
<div id="editNoteModal" class="modal">
  <div class="modal-background"></div>
  <div class="modal-card">
    <section class="modal-card-body">
      <input class="input is-normal" id="editTitleInput" type="text">
      <input class="input is-normal" id="editTextInput" type="text">
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" id="saveEdit">Save changes</button>
      <button class="button" onclick="closeEditModal()">Cancel</button>
    </footer>
  </div>
</div>
```

11. Toggle Modal open and populate with note content. To make it easier to edit our note we'll first populate our modals input with the note text. then after editing it you can submit your changes to the RTDB.
```js
const editNote = (noteId) => {
  const editNoteModal = document.getElementById('editNoteModal');
  const notesRef = firebase.database().ref(`users/${googleUserId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const noteDetails = data[noteId];
    document.getElementById('editTitleInput').value = noteDetails.title;
    document.getElementById('editTextInput').value = noteDetails.text;

  });
  editNoteModal.classList.toggle('is-active'); 
};
```

12. Add functionality to push edits to RTDB. Add code to dynamically handle clicking the Save Changes button on the modal. 

```js
  const saveEditBtn = document.getElementById('saveEdit');
  saveEditBtn.onclick = handleSaveEdit.bind(this, noteId);
```

`editNote()` function now looks like this:
```js
const editNote = (noteId) => {
  const editNoteModal = document.getElementById('editNoteModal');
  const notesRef = firebase.database().ref(`users/${googleUserId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const noteDetails = data[noteId];
    document.getElementById('editTitleInput').value = noteDetails.title;
    document.getElementById('editTextInput').value = noteDetails.text;

  });
  const saveEditBtn = document.getElementById('saveEdit');
  saveEditBtn.onclick = handleSaveEdit.bind(this, noteId);
  editNoteModal.classList.toggle('is-active');
};
```

13. Now we need to write the `handleSaveEdit()` function
```js
const handleSaveEdit = (noteId) => {
  // Write the new post's data simultaneously in the posts list and the user's post list.
  const noteTitle = document.getElementById('editTitleInput').value;
  const noteText = document.getElementById('editTextInput').value;
  var noteEdits = {
    title: noteTitle,
    text: noteText
  };
  firebase.database().ref(`users/${googleUserId}/${noteId}`).update(noteEdits);
}
```

14. After submitting edits we want to close the modal. We can write a seperate function for that and call it in our `saveEdit()` function. If we call it `closeEditModal()` it will also trigger when we click the cancel button on the modal. 
```js
const closeEditModal = () => {
  const editNoteModal = document.getElementById('editNoteModal');
  editNoteModal.classList.toggle('is-active');
};
```

```js
// Updated handleSaveEdit 
const handleSaveEdit = (noteId) => {
  // Write the new post's data simultaneously in the posts list and the user's post list.
  const noteTitle = document.getElementById('editTitleInput').value;
  const noteText = document.getElementById('editTextInput').value;
  var noteEdits = {
    title: noteTitle,
    text: noteText
  };
  firebase.database().ref(`users/${googleUserId}/${noteId}`).update(noteEdits);
  closeEditModal();
}
```
