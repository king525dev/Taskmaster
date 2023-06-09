/*============================
     [ DASHBOARD-BOARD ].js
=============================*/

const board = document.getElementById("main-dashboard");
let boardList = [];

//Shortening Content
function contentShortening(str) {
     const strLen = str.length;
     let result = "";
     if (strLen > 20) {
          for (let i = 0; i < 10; i++) {
               result += str[i];
          }
          return `${result}...`;
     } else {
          result = str;
          return result;
     }
}

//Sort List
function sortByDate(list) {
     return list.sort((a, b) => {
          const aRank = a.getAttribute("rank");
          const bRank = b.getAttribute("rank");

          if (aRank > bRank) {
               return -1;
          } else {
               return 1;
          }
     })
}

//Getting Status
function checkingStatus(status) {
     const todoOption = document.getElementById("Todo");
     const doingOption = document.getElementById("Doing");
     const doneOption = document.getElementById("Done");
     if (status == "Todo") {
          todoOption.checked = true;
     } else if (status == "Doing") {
          doingOption.checked = true;
     } else if (status == "Done") {
          doneOption.checked = true;
     } else {
          todoOption.checked = true;
     }
}

//Retrieving note list
function actData(individualDoc) {
     let parentDiv = document.createElement("div");
     parentDiv.className = "project";
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
     boardList.push(parentDiv);


     //Adding onclick event
     parentDiv.addEventListener('click', () => {
          localStorage.setItem("clickID", individualDoc.id);
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
               onok: function () {
                    let id = e.target.getAttribute('data-id');
                    auth.onAuthStateChanged(user => {
                         if (user) {
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
               }
          })
     });

     //Append Sorted Projects
     auth.onAuthStateChanged(user => {
          if (user) {
               fs.collection(user.uid + "_notes").get().then(
                    (querySnapshot) => {
                         let dataCount = 0;
                         querySnapshot.forEach((doc) => {
                              dataCount++
                         });
                         if (boardList.length == dataCount) {
                              sortByDate(boardList).map((sortedPrj) => {
                                   board.appendChild(sortedPrj)
                              });
                         }
                    }
               );
          }
     });
}

while (board.children.length > 4) {
     let length = board.children.length;
     let lastElement = board.children[length--];
     board.removeChild(lastElement);
}

//Real time Event Listeners
auth.onAuthStateChanged(user => {
     if (user) {
          fs.collection(user.uid + "_notes").onSnapshot((snapshot) => {
               let changes = snapshot.docChanges();
               changes.forEach(change => {
                    if (change.type == 'added') {
                         actData(change.doc);
                    } else if (change.type == 'removed') {
                         let di = board.querySelector('[data-id=' + change.doc.id + ']');
                         board.removeChild(di);
                    }
               })
          })
     }
});

/*
 * FOR: [  DASHBOARD  ].html
 */