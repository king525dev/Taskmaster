/*============================
     [  PROJECT  ].html
=============================*/ 

const board = document.querySelector(".prj-wrapper");
const projectTitle = document.getElementById("prj-title");
const projectBody = document.getElementById("prj-body");
const pageID = localStorage.getItem("clickID");
const deleteBtn = document.getElementById("delete-btn");
const saveBtn = document.getElementById("save-btn");
const downloadBtn = document.getElementById("download-btn");
const todoOption = document.getElementById("Todo");
const doingOption = document.getElementById("Doing");
const doneOption = document.getElementById("Done");

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

function renderData(individualDoc){
     if(individualDoc.id == pageID){
          projectTitle.value = individualDoc.data().title;
          projectBody.value = individualDoc.data().note;
          checkingStatus(individualDoc.data().status);
     }
}

//Updating Notes
setInterval(
     () =>{
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
,5000)

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
                    Toast.open({
                         type: "success",
                         message: "Project Updated", 
                         timer: 5000
                    });
               });
               
          }
     })
});

//Delete Note
deleteBtn.addEventListener("click", () => {
     Confirm.open({
          title: "Delete Project",
          message: "Are you sure you want to permanemtly delete this Project?",
          okText: "OK",
          cancelText: "Cancel",
          preffered: false,
          onok: function() {
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
                              location = "board.html";
                         });
                    }
               })
          }
     });
});

//Download Note
downloadBtn.addEventListener("click", () => {
     const file = new File([`--${projectTitle.value}--\n${projectBody.value}\n\nStatus: ${statusOutput()}\nLast-Online: ${fullDate}`], `${projectTitle.value}.txt`, {type: 'text/plain',})

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
                         }
                    })
          })
     }
})

//Shortcuts
document.addEventListener('keydown', e => { // Save Shortcut
     if(e.key.toLowerCase() == "s" && e.altKey){
          e.preventDefault();
          saveBtn.click()
     }
});

document.addEventListener('keydown', e => { //Delete Shortcut
     if(e.key.toLowerCase() == "d" && e.altKey){
          e.preventDefault();
          deleteBtn.click();
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