var noteValue; //This note the task globally available
noteText = document.getElementById("formNoteText");
addNoteButton = document.getElementById("formAddButton");
var notes = document.getElementById('notes');

//INDEXED DB 
var noteRequest = indexedDB.open("Notes Store");
noteRequest.onupgradeneeded = function() {
  // The database did not previously exist, so create object stores and indexes.
  var db = noteRequest.result;
  var store = db.createObjectStore("notes", {autoIncrement:true});
};

// Functions
function addNote() {
 if (noteText.value == "") {
  window.alert("Sorry. You cannot add an empty note.");
 }else{
  db = noteRequest.result;
  var tx = db.transaction("notes", "readwrite");
  var store = tx.objectStore("notes");
  store.put(noteText.value);
  noteText.value = '';
  displayNotes();
 }
}

var displayNotes = function(){
  db = noteRequest.result;
  var tx = db.transaction("notes", "readwrite");
  var store = tx.objectStore("notes");

  notes.innerHTML = "";
  let dbNotes = store.openCursor();
  // called for each note found by the cursor
  dbNotes.onsuccess = function() {
    let cursor = dbNotes.result;
    if (cursor) {
      var key = cursor.key; // note key (id field)
      noteValue = cursor.value; // note object

      //New note list item
      var createNewNoteElement=function(noteString){
        let note = document.createElement('div');
        let deleteNoteButton = document.createElement('span');
        let innerNoteText = document.createElement('div');

        innerNoteText.classList.add('note-text');
        note.classList.add('note');
        innerNoteText.innerHTML = noteString;
        deleteNoteButton.classList.add('note-delete');
        deleteNoteButton.innerHTML = 'DELETE';

        deleteNoteButton.id = key;
        deleteNoteButton.onclick = function(){
          //console.log(deleteNoteButton.id);
          if (window.confirm("Are you sure you want to delete this note?")) {
            db = noteRequest.result;
            var tx = db.transaction("notes", "readwrite");
            var store = tx.objectStore("notes");
            var intId = parseInt(deleteNoteButton.id);
            store.delete(intId);
            displayNotes();
          }else{
            return;
          }
        }
        //and appending.
        notes.appendChild(note);
        note.appendChild(innerNoteText); 
        note.appendChild(deleteNoteButton); 
        return note;
      }
      //Create a new note item
      var noteItem=createNewNoteElement(noteValue);
      //Append noteItem to notes
      notes.appendChild(noteItem);
      cursor.continue();
    }else {
      tx.oncomplete = function() {
        return;
      };
    } 
  };
}


//Set the click handler to the addNote function.
addNoteButton.addEventListener("click",addNote);
