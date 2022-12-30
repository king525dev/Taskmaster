/*============================
     [  NOTES  ].html
=============================*/ 

const deter = true;
const title = document.getElementById("notes-title");
const body = document.getElementById("notes-body");
const deleteBtn = document.getElementById("delete-btn");
const saveBtn = document.getElementById("save-btn");
let notesList = document.getElementById("notes-list");

//Date 
const dater = new Date();
const myDate = dater.getDate();
const day = dater.toLocaleDateString('default', { weekday: 'long' });
let hours = dater.getHours();
let minute =  dater.getMinutes();
if(hours < 10){hours = `0${hours}`}
if(minute < 10){minute = `0${minute}`}

fullDate = `${myDate} ${day} ${hours}:${minute}`;
console.log(fullDate);



//Sort Algorithm
function sortList(list){
     list.sort((a, b) => {
          return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
     });
}

//Checking If User is logged in
auth.onAuthStateChanged(user => {
     if(user){
          console.log("User is signed in to Taskmaster");
     }else{
          console.log("User is not signed in to Taskmaster")
          alert("Your login session has expired or you have logged out, login again to continue");
          location = "login.html";
     }
});

//Retrieving note list
function renderData(individualDoc){
     function contentShortening(str){
          let result = "";
          if(str.length > 25){
               for(let i = 0; i < 25; i++){
                    result += str[i];
               }
               return `${result}...`;
          }else{
               result = str;
               return result;
          }
     }

     let parentDiv = document.createElement("div");
     parentDiv.className= "notes-list-item";
     parentDiv.setAttribute("data-id", individualDoc.id);

     let noteTitle = document.createElement("div");
     noteTitle.className= "notes-small-title";
     noteTitle.textContent = individualDoc.data().title;

     let noteContent = document.createElement("div");
     noteContent.className= "notes-small-body";
     noteContent.textContent = contentShortening(individualDoc.data().note) ;

     let noteDate = document.createElement("div");
     noteDate.className= "notes-small-updated";
     noteDate.textContent = individualDoc.data().lastEdited;
     
     parentDiv.appendChild(noteTitle);
     parentDiv.appendChild(noteContent);
     parentDiv.appendChild(noteDate);
     notesList.appendChild(parentDiv);

     //Adding selecting event to click
     parentDiv.addEventListener('click', e => {
          const selNotes = document.getElementsByClassName("selected");
          if(selNotes.length > 0){
               selNotes[0].classList.remove("selected");
          }
          
          if(parentDiv.classList.contains("selected") == true){
               title.value = "";
               body.textContent = "";
               parentDiv.classList.remove("selected");
          }else{
               title.value = individualDoc.data().title;
               body.value = individualDoc.data().note;
               parentDiv.classList.add("selected");
          }          
     });

     //Updating Notes
     saveBtn.addEventListener("click", () =>{
          const selNotes = document.getElementsByClassName("selected");
          const selNote = selNotes[0];
          let id = selNote.getAttribute('data-id');
          updatedTitle = title.value;
          updatedNote = contentShortening(body.value); 
          updatedDate = fullDate;
          console.log(noteTitle);
          console.log(updatedNote);
          console.log(updatedDate);
          auth.onAuthStateChanged(user => {
               if(user) {
                    fs.collection(user.uid + "_notes").doc(id).update({
                         title: updatedTitle,
                         note: updatedNote,
                         lastEdited: updatedDate
                    }).then(() => {
                         selNote.children[0].textContent = updatedTitle;
                         selNote.children[1].textContent = updatedNote;
                         selNote.children[2].textContent = updatedDate;
                         console.log("note updated");
                    });
                    
               }
          })
     });

     //Delete Note
     deleteBtn.addEventListener("click", () => {
          const selNotes = document.getElementsByClassName("selected");
          const selNote = selNotes[0];
          let id = selNote.getAttribute('data-id');
          auth.onAuthStateChanged(user => {
               if(user) {
                    fs.collection(user.uid + "_notes").doc(id).delete().then(() => {
                         console.log("note deleted");
                    });
               }
          })
     });
}

//Adding notes
const form = document.getElementById("note-preview");
const addNoteButton = document.getElementById("add-button");
const date = new Date();
const time = date.getTime();
let counter = time;
addNoteButton.addEventListener('click', () => {
     let id = counter += 1;
     auth.onAuthStateChanged(user => {
          if(user){
               fs.collection(user.uid + "_notes").doc('nb_' + id).set({
                    id: 'nb_' + id,
                    title: "New Note",
                    note: "",
                    lastEdited: fullDate
               }).then(() => {
                    console.log('note added');
               }).catch( err => {
                    console.log(err.message);
               })
          }
     })
})

//Real time Event Listeners
auth.onAuthStateChanged(user => {
     if(user){
          fs.collection(user.uid + "_notes").onSnapshot((snapshot) => {
                    let changes = snapshot.docChanges();
                    changes.forEach(change => {
                         if(change.type == 'added'){
                              renderData(change.doc);
                         }else if(change.type == 'removed'){
                              let di = notesList.querySelector('[data-id=' + change.doc.id + ']');
                              notesList.removeChild(di);
                         }
                    })
          })
     }
})