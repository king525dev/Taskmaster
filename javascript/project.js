/*============================
     [  PROJECT  ].html
=============================*/ 

const projectTitle = document.getElementById("prj-title");
const projectBody = document.getElementById("prj-body");
const pageID = localStorage.getItem("clickID");
const deleteBtn = document.getElementById("delete-btn");
const saveBtn = document.getElementById("save-btn");

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

console.log(`Doc: ${pageID}`)

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

//Getting  Status
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

function renderData(individualDoc){
     if(individualDoc.id == pageID){
          projectTitle.value = individualDoc.data().title;
          projectBody.value = individualDoc.data().note;
          checkingStatus(individualDoc.data().status);

     //Updating Notes
     saveBtn.addEventListener("click", () =>{
          updatedTitle = projectTitle.value;
          updatedNote = projectBody.value; 
          updatedDate = fullDate;
          updatedStatus = statusOutput();
          auth.onAuthStateChanged(user => {
               if(user) {
                    fs.collection(user.uid + "_notes").doc(pageID).update({
                         title: updatedTitle,
                         note: updatedNote,
                         status: updatedStatus,
                         lastEdited: updatedDate
                    }).then(() => {
                         console.log("note updated");
                    });
                    
               }
          })
     });

     //Delete Note
     deleteBtn.addEventListener("click", () => {
          if(confirm("Are you sure you want to DELETE this Project")){
               let id = pageID;
               auth.onAuthStateChanged(user => {
                    if(user) {
                         fs.collection(user.uid + "_notes").doc(id).delete().then(() => {
                              projectTitle.value = "";
                              projectBody.value = "";
                              todoOption.checked = false;
                              doneOption.checked = false;
                              doingOption.checked = false;
                              console.log("note deleted");
                         });
                    }
               })
          }
     });
     }
}

//Real time Event Listeners
auth.onAuthStateChanged(user => {
     if(user){
          fs.collection(user.uid + "_notes").onSnapshot((snapshot) => {
                    let changes = snapshot.docChanges();
                    changes.forEach(change => {
                         if(change.type == 'added'){
                              renderData(change.doc);
                         }else if(change.type == 'removed'){
                              let di = board.querySelector('[data-id=' + change.doc.id + ']');
                              board.removeChild(di);
                         }
                    })
          })
     }
})

//Shortcuts
document.addEventListener('keydown', e => { // Save Shortcut
     if(e.key.toLowerCase() == "s" && e.altKey){
          e.preventDefault();
          updatedTitle = projectTitle.value;
          updatedNote = projectBody.value; 
          updatedDate = fullDate;
          updatedStatus = statusOutput();
          auth.onAuthStateChanged(user => {
               if(user) {
                    fs.collection(user.uid + "_notes").doc(pageID).update({
                         title: updatedTitle,
                         note: updatedNote,
                         status: updatedStatus,
                         lastEdited: updatedDate
                    }).then(() => {
                         console.log("note updated");
                    });
                    
               }
          })
     }
});

document.addEventListener('keydown', e => { //Delete Shortcut
     if(e.key.toLowerCase() == "d" && e.altKey){
          e.preventDefault();
          if(confirm("Are you sure you want to DELETE this Project")){
               let id = pageID;
               auth.onAuthStateChanged(user => {
                    if(user) {
                         fs.collection(user.uid + "_notes").doc(id).delete().then(() => {
                              projectTitle.value = "";
                              projectBody.value = "";
                              todoOption.checked = false;
                              doneOption.checked = false;
                              doingOption.checked = false;
                              console.log("note deleted");
                         });
                    }
               })
          }
     }
});

document.addEventListener('keydown', e => { //Home Shortcut
     if(e.key.toLowerCase() == "h" && e.altKey){
          e.preventDefault();
          location = "dashboard.html";
     }
});