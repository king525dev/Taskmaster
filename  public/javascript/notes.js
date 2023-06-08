/*============================
     [  NOTE  ].html
=============================*/ 

const title = document.getElementById("notes-title");
const body = document.getElementById("notes-body");
const deleteBtn = document.getElementById("delete-btn");
const saveBtn = document.getElementById("save-btn");
const downloadBtn = document.getElementById("download-btn");
let notesList = document.getElementById("notes-list");
const todoOption = document.getElementById("Todo");
const doingOption = document.getElementById("Doing");
const doneOption = document.getElementById("Done");

//Content Shortening
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

// Check if project is clicked
function checkPreview(){
     const todoOption = document.getElementById("Todo");
     const doingOption = document.getElementById("Doing");
     const doneOption = document.getElementById("Done");

     if(todoOption.checked || doingOption.checked || doneOption.checked){
          var isTodo = true;
     }else{
          var isTodo = false;
     }

     if(isTodo){
          return true;
     }else{
          return false;
     }
}

//Sort List
function sortByDate(){
     const list = notesList.querySelectorAll(".notes-list-item");

     [...list].sort( (a, b) => {
               const aRank = a.getAttribute("rank");
               const bRank = b.getAttribute("rank");
     
               if(aRank > bRank){
                    return -1;
               }else{
                    return 1;
               }
          }).map(sortedPrj => notesList.appendChild(sortedPrj)); 
}

function topList(item){
     const list = [...notesList.children];
     const itemIndex = list.indexOf(item);

     list.splice(itemIndex, 1)
     list.unshift(item);
     list.map(listItem => notesList.appendChild(listItem));
}

//Getting Status
function statusOutput(){
     const todoOption = document.getElementById("Todo");
     const doingOption = document.getElementById("Doing");
     const doneOption = document.getElementById("Done");
     if(todoOption.checked){
          return "Todo";
     }else if(doingOption.checked){
          return "Doing";
     }else if(doneOption.checked){
          return "Done";
     }else{
          return "Todo";
     }
}

function checkingStatus(status){
     const todoOption = document.getElementById("Todo");
     const doingOption = document.getElementById("Doing");
     const doneOption = document.getElementById("Done");
     if(status == "Todo"){
          todoOption.checked = true;
     }else if(status == "Doing"){
          doingOption.checked = true;
     }else if(status == "Done"){
          doneOption.checked = true;
     }else{
          todoOption.checked = true;
     }
}

function getCurrentDate(){
     const dater = new Date();
     let myDate = dater.getDate();
     let month = dater.getMonth();
     const year = dater.getFullYear();
     let hours = dater.getHours();
     let minute =  dater.getMinutes();
     let mer;
     if(hours == 0){hours = 12}
     if(hours < 10){hours = `0${hours}`}
     if(minute < 10){minute = `0${minute}`}
     if(myDate < 10){myDate = `0${myDate}`}
     if(month < 10){month = `0${month}`}
     if(hours > 11){
          mer = "PM"
     }else{
          mer = "AM"
     }
     if(hours > 12){
          hours = hours - 12
          if(hours < 10){hours = `0${hours}`}
     }

     let fullTime = `${hours}:${minute} ${mer}`;
     const arrDate = `${myDate}/${month}/${year} @ ${fullTime}`

     return arrDate;
}

//Date 
const dater = new Date();
const myDate = dater.getDate();
const day = dater.toLocaleDateString('default', { weekday: 'long' });
let hours = dater.getHours();
let minute =  dater.getMinutes();
if(minute < 10){minute = `0${minute}`}

fullDate = `${myDate} ${day} ${hours}:${minute}`;
console.log(fullDate);

//Checking If User is logged in
auth.onAuthStateChanged(user => {
     if(user){
          console.log("User is signed in to Taskmaster");
     }else{
          console.log("User is not signed in to Taskmaster")
          Alert.open({
               title: "No User Detected",
               message: "Your login session has expired or you have logged out, login again to continue",
               okText: "OK",
               onok: function () {
                    location = "index.html";
               },
               oncancel: function () {
                    location = "index.html";
               }
          });
     }
});

//Retrieving note list
function renderData(individualDoc){
     let parentDiv = document.createElement("div");
     parentDiv.className = "notes-list-item";
     parentDiv.setAttribute("data-id", individualDoc.id);
     parentDiv.setAttribute("rank", individualDoc.data().listRank);
     parentDiv.id = "project-item";

     let noteTitle = document.createElement("div");
     noteTitle.className = "notes-small-title";
     noteTitle.textContent = individualDoc.data().title;

     let noteContent = document.createElement("div");
     noteContent.className = "notes-small-body";
     noteContent.textContent = contentShortening(individualDoc.data().note);

     let noteFooter = document.createElement("div");
     noteFooter.className = "small-bottom";

     let noteStatus = document.createElement("div");
     noteStatus.className = "small-status";
     noteStatus.textContent = individualDoc.data().status;

     let noteDate = document.createElement("div");
     noteDate.className = "notes-small-updated";
     noteDate.textContent = individualDoc.data().lastEdited;
     
     noteFooter.appendChild(noteStatus);
     noteFooter.appendChild(noteDate);
     parentDiv.appendChild(noteTitle);
     parentDiv.appendChild(noteContent);
     parentDiv.appendChild(noteFooter);
     notesList.appendChild(parentDiv);

     sortByDate();
     notesList.children[0].click();

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
               auth.onAuthStateChanged(user => {
                    if(user){
                         fs.collection(user.uid + "_notes").doc(individualDoc.id).get().then(
                              (doc) => {
                                   const dataTitle = doc.data().title;
                                   const dataBody = doc.data().note;
                                   const dataStatus = doc.data().status;
                                   title.value = dataTitle;
                                   body.value = dataBody;
                                   checkingStatus(dataStatus);
                              }
                         );
                    }
               });
               parentDiv.classList.add("selected");
          }          
     });
}

//Updating Notes
saveBtn.addEventListener("click",() => {
     const selNotes = document.getElementsByClassName("selected");
     const selNote = selNotes[0];
     let id = selNote.getAttribute('data-id');
     let updatedTitle = title.value;
     let updatedNote = body.value; 
     let updatedDate = fullDate;
     let updatedRank = new Date();
     let updatedStatus = statusOutput();
     auth.onAuthStateChanged(user => {
          if(user) {
               fs.collection(user.uid + "_notes").doc(id).update({
                    title: updatedTitle,
                    note: updatedNote,
                    status: updatedStatus,
                    lastEdited: updatedDate,
                    listRank: updatedRank
               }).then(() => {
                    selNote.children[0].textContent = updatedTitle;
                    selNote.children[1].textContent = contentShortening(updatedNote);
                    selNote.children[2].children[0].textContent = updatedStatus;
                    selNote.children[2].children[1].textContent = updatedDate;
                    selNote.setAttribute("rank", updatedRank);
                    Toast.open({
                         type: "success",
                         message: "Project Updated", 
                         timer: 5000
                    });
                    console.log("note updated");
                    topList(selNote);
                    sideBar.scrollTo(0, 0);
               });
               
          }
     })
     
});
setInterval(
     () =>{
          if(checkPreview()){
               const selNotes = document.getElementsByClassName("selected");
               const selNote = selNotes[0];
               let id = selNote.getAttribute('data-id');
               let updatedTitle = title.value;
               let updatedNote = body.value; 
               let updatedDate = fullDate;
               let updatedRank = new Date();
               let updatedStatus = statusOutput();
               auth.onAuthStateChanged(user => {
                    if(user) {
                         fs.collection(user.uid + "_notes").doc(id).update({
                              title: updatedTitle,
                              note: updatedNote,
                              status: updatedStatus,
                              lastEdited: updatedDate,
                              listRank: updatedRank
                         }).then(() => {
                              selNote.children[0].textContent = updatedTitle;
                              selNote.children[1].textContent = contentShortening(updatedNote);
                              selNote.children[2].children[0].textContent = updatedStatus;
                              selNote.children[2].children[1].textContent = updatedDate;
                              console.log("note updated");
                         });
                         
                    }
               })
          }
     }
,5000)

//Delete Note
deleteBtn.addEventListener("click", () => {
     Confirm.open({
          title: "Delete Project",
          message: "Are you sure you want to permanemtly delete this Project?",
          okText: "OK",
          cancelText: "Cancel",
          preffered: false,
          onok: function() {
               const selNotes = document.getElementsByClassName("selected");
               const selNote = selNotes[0];
               let id = selNote.getAttribute('data-id');
               auth.onAuthStateChanged(user => {
                    if(user) {
                         fs.collection(user.uid + "_notes").doc(id).delete().then(() => {
                              title.value = "";
                              body.value = "";
                              todoOption.checked = false;
                              doneOption.checked = false;
                              doingOption.checked = false;          
                              sortByDate();
                              deleteBtn.diabled = false;
                              Toast.open({
                                   type: "info",
                                   message: "Project Deleted", 
                                   timer: 5000
                              });
                              notesList.children[0].click();
                              console.log("note deleted");
                         });
                    }
               })
          }
     });
});

//Download Note
downloadBtn.addEventListener("click", () => {
     const file = new File([`--${title.value}--\n${body.value}\n\nStatus: ${statusOutput()}\nLast-Online: ${getCurrentDate()}`], `${title.value}.txt`, {type: 'text/plain',})

     const url = URL.createObjectURL(file);
     const link = document.createElement('a');
     link.download = file.name;
     link.href = url;
     link.click();
     Toast.open({
          type: "success",
          message: "Project Downloaded", 
          timer: 5000
     });
});

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
                    title: "New Project",
                    note: "",
                    status: "Todo",
                    lastEdited: fullDate,
                    listRank: date
               }).then(() => {
                    sortByDate();
                    Toast.open({
                         type: "success",
                         message: "Project Added", 
                         timer: 5000
                    });
                    console.log('note added');
               }).catch( err => {
                    console.log(err.message);
                    Toast.open({
                         type: "error",
                         message: "Action Failed", 
                         timer: 5000
                    });
               })
          }
     })
});

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

//Shortcuts
document.addEventListener('keydown', e => { // Save Shortcut
     if(e.key.toLowerCase() == "s" && e.altKey){
          e.preventDefault();
          saveBtn.click();
     }
});

document.addEventListener('keydown', e => { //Delete Shortcut
     if(e.key.toLowerCase() == "d" && e.altKey){
          e.preventDefault();
          deleteBtn.click();
     }
});

document.addEventListener('keydown', e => { // Add Note Shortcut
     if(e.key.toLowerCase() == "a" && e.altKey){
          e.preventDefault();
          addNoteButton.click();
     }
});

document.addEventListener('keydown', e => { // Download Shortcut
     if(e.key.toLowerCase() == "c" && e.altKey){
          e.preventDefault();
          downloadBtn.click()
     }
});

document.addEventListener('keydown', e => { //Home Shortcut
     if(e.key.toLowerCase() == "h" && e.altKey){
          e.preventDefault();
          location = "dashboard.html";
     }
});

document.addEventListener('keydown', e => { // Reload Shortcut
     if(e.key.toLowerCase() == "r" && e.altKey){
          e.preventDefault();
          location.reload();
     }
});

let projectTitle = false;
let projectBody = false;