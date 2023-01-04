/*============================
     [  BOARD  ].html
=============================*/ 

const filter = document.getElementById('filter');
const board = document.getElementById("board");

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
          alert("Your login session has expired or you have logged out, login again to continue");
          location = "login.html";
     }
});

//Retrieving note list
function renderData(individualDoc){
     let parentDiv = document.createElement("div");
     parentDiv.className = "project-m";
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

     //Adding onclick event
     parentDiv.addEventListener('click', () => {
          localStorage.setItem("clickID", individualDoc.id)
          location = "project.html";
     });

     //Delete Note
     parentDiv.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          if(confirm("Are you sure you want to DELETE this Project")){
               let id = e.target.getAttribute('data-id');
               auth.onAuthStateChanged(user => {
                    if(user) {
                         fs.collection(user.uid + "_notes").doc(id).delete().then(() => {
                              console.log("project deleted");
                         });
                    }
               })
          }
     });
}

//Filter Function
     filter.addEventListener('keyup', filterItems);
     function filterItems(e){
          const text = e.target.value.toLowerCase();
          const items = document.getElementsByClassName("project-m");
          Array.from(items).forEach(function(item){
               const itemName = item.firstChild.textContent;
               if(itemName.toLowerCase().indexOf(text) != -1){
                    item.style.display = 'flex';
               }else{
                    item.style.display = 'none';
               }
          })
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
document.addEventListener('keydown', e => { //Home Shortcut
     e.preventDefault();
     location = "dashboard.html";
});