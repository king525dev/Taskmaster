/*============================
     [  PROJECT  ].html
=============================*/ 

const title = document.getElementById("prj-title");
const body = document.getElementById("prj-body");

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

// //Updating Project page
// function pageTransfer(prjTitle, prjContent, prjStatus){
//      location = "project.html";
//      const title = document.getElementById("prj-title");
//      const body = document.getElementById("prj-body");
//      console.log(prjTitle);
//      console.log(prjContent);
//      console.log(prjTitle);
//      title.value = prjTitle;
//      body.textContent = prjContent;
//      checkingStatus(prjStatus);
// }

//Checking If User is logged in
auth.onAuthStateChanged(user => {
     if(user){
          console.log("User is signed in to Taskmaster");
     }else{
          console.log("User is not signed in to Taskmaster");
          alert("Your login session has expired or you have logged out, login again to continue");
          location = "login.html";
     }
});


auth.onAuthStateChanged(user => {
     if(user){
          fs.collection(user.uid + "_notes").doc(window.prjID)
               .onSnapshot((doc) => {
                    console.log("Current data: ", doc.data());
                    projectTitle.textContent = doc.data().title;
                    projectBody.textContent = doc.data().note;
          }), (error) => {
               console.log(error.message);
          }
     }
});
function renderData(individualDoc){
     if(individualDoc.id == prjID){
          projectTitle.value = individualDoc.data().title;
          projectBody.value = individualDoc.data().note;
     }
}

//Retrieving note list
// function renderData(individualDoc){
//      function contentShortening(str){
//           let result = "";
//           if(str.length > 20){
//                for(let i = 0; i < 10; i++){
//                     result += str[i];
//                }
//                return `${result}...`;
//           }else{
//                result = str;
//                return result;
//           }
//      }

//      let parentDiv = document.createElement("div");
//      parentDiv.className = "project-m";
//      parentDiv.setAttribute("data-id", individualDoc.id);

//      let prjTitle = document.createElement("p");
//      prjTitle.className = "prj-title";
//      prjTitle.textContent = contentShortening(individualDoc.data().title);

//      let prjStatus = document.createElement("span");
//      prjStatus.className = "prj-status";
//      prjStatus.textContent = individualDoc.data().status;
     
//      parentDiv.appendChild(prjTitle);
//      parentDiv.appendChild(prjStatus);
//      board.appendChild(parentDiv);

//      parentDiv.addEventListener('click', () => {
//           prjId = individualDoc.id;
//           location = "project.html";
//      });

//      //Delete Note
//      parentDiv.addEventListener("dblclick", (e) => {
//           if(confirm("Are you sure you want to DELETE this Project")){
//                let id = e.target.getAttribute('data-id');
//                auth.onAuthStateChanged(user => {
//                     if(user) {
//                          fs.collection(user.uid + "_notes").doc(id).delete().then(() => {
//                               console.log("project deleted");
//                          });
//                     }
//                })
//           }
//      });
// }

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