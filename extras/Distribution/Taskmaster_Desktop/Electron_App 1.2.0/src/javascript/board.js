/*============================
     [  BOARD  ].html
=============================*/ 

const filter = document.getElementById('filter');
const board = document.getElementById("board");
const addNoteBtn = document.getElementById("more-dash");
const boardWrapper = document.querySelector(".board-wrapper");

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

//Sort Board
function sortByDate(){
     const list = board.querySelectorAll(".project-m");

     [...list].sort( (a, b) => {
               const aRank = a.getAttribute("rank");
               const bRank = b.getAttribute("rank");
     
               if(aRank > bRank){
                    return -1;
               }else{
                    return 1;
               }
          }).map(sortedPrj => board.appendChild(sortedPrj)); 
}

//Shortening Content
function contentShortening(str){
     let result = "";
     if(str.length > 20){
          for(let i = 0; i < 20; i++){
               result += str[i];
          }
          return `${result}...`;
     }else{
          result = str;
          return result;
     }
}

//Getting Status
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

//Retrieving note list
function renderData(individualDoc){
     let parentDiv = document.createElement("div");
     parentDiv.className = "project-m";
     parentDiv.setAttribute("rank", individualDoc.data().listRank);
     parentDiv.setAttribute("data-id", individualDoc.id);

     let prjTitle = document.createElement("p");
     prjTitle.className = "prj-title";
     prjTitle.textContent = contentShortening(individualDoc.data().title);

     let prjStatus = document.createElement("span");
     prjStatus.className = "prj-status";
     prjStatus.textContent = individualDoc.data().status;
     
     parentDiv.appendChild(prjTitle);
     parentDiv.appendChild(prjStatus);
     board.appendChild(parentDiv);

     sortByDate();

     //Adding onclick event
     parentDiv.addEventListener('click', () => {
          localStorage.setItem("clickID", individualDoc.id)
          location = "project.html";
     });

     //Delete Note
     parentDiv.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          Confirm.open({
               title: "Delete Project",
               message: "Are you sure you want to permanemtly delete this Project?",
               okText: "OK",
               cancelText: "Cancel",
               preffered: false,
               onok: function() {
                    let id = e.target.getAttribute('data-id');
                    auth.onAuthStateChanged(user => {
                         if(user) {
                              fs.collection(user.uid + "_notes").doc(id).delete().then(() => {
                                   Toast.open({
                                        type: "info",
                                        message: "Project Deleted", 
                                        timer: 5000
                                   });
                                   console.log("project deleted");
                              });
                         }
                    })
               },
               oncancel: function() {}
          });
     });
}

//Adding notes
const date = new Date();
const time = date.getTime();
let counter = time;
function addNote(){
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
                    Toast.open({
                         type: "success",
                         message: "Project Added", 
                         timer: 5000
                    });
                    boardWrapper.scrollTo(0, 0);
                    console.log('note added');
               }).catch( err => {
                    console.log(err.message);
               })
          }
     })
}

//Filter Function
filter.addEventListener('keyup', filterItems);
function filterItems(e){
     const text = e.target.value.toLowerCase();
     const items = document.getElementsByClassName("project-m");

     addNoteBtn.style.display = 'none';

     Array.from(items).forEach(function(item){
          const itemName = item.firstChild.textContent;
          if(itemName.toLowerCase().indexOf(text) != -1){
               item.style.display = 'flex';
          }else{
               item.style.display = 'none';
          }
     })

     if(filter.value == "" || filter.value == null || filter.value == undefined){
          addNoteBtn.style.display = 'flex';
     }
     
     function checkDisplay(){
          let counter = 0;
          [...board.children].forEach((element) => {
               if(element.style.display == "none" && element !== document.getElementById("no-results")){
                    counter++
               }
          });
          return counter
     }

     function checkLength(){
          let list1 = board.querySelectorAll("div.more-dash");
          let list2 = board.querySelectorAll("div.project-m");

          let list = [...list1].concat([...list2]);

          return list.length
     }

     const noResults = document.createElement("span");
     noResults.id = "result"
     noResults.className = "no-results";
     noResults.textContent = "No Results";

     let displayLength = checkDisplay();
     let boardLength = checkLength();

     if(displayLength == boardLength && document.getElementById("result") == null){
               board.appendChild(noResults);
     }
     
     if(displayLength !== boardLength){
          board.removeChild(document.querySelector("#result"));
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
document.addEventListener('keydown', e => { // Add Note Shortcut
     if(e.key.toLowerCase() == "a" && e.altKey){
          e.preventDefault();
          addNoteBtn.click();
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