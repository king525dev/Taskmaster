const board = document.getElementById("main-dashboard");

//Shortening Content
function contentShortening(str){
     const strLen = str.length;
     let result = "";
     if(strLen > 20){
          for(let i = 0; i < 10; i++){
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

//Retrieving note list
function actData(individualDoc){
     if(board.children.length < 6){
          let parentDiv = document.createElement("div");
          parentDiv.className = "project";
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

          //Delete Note
          parentDiv.addEventListener("dblclick", (e) => {
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

     // parentDiv.addEventListener('click', () => {
     //      window.prjId = individualDoc.id;
     //      location = "project.html";
     // });
}

//Real time Event Listeners
auth.onAuthStateChanged(user => {
     if(user){
          fs.collection(user.uid + "_notes").onSnapshot((snapshot) => {
                    let changes = snapshot.docChanges();
                    changes.forEach(change => {
                         if(change.type == 'added'){
                              actData(change.doc);
                         }else if(change.type == 'removed'){
                              let di = board.querySelector('[data-id=' + change.doc.id + ']');
                              board.removeChild(di);
                         }
                    })
          })
     }
})