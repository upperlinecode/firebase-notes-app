window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      getNotes();
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    };
  });
};

const getNotes = () => {
  const notesRef = firebase.database().ref('users');
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
}