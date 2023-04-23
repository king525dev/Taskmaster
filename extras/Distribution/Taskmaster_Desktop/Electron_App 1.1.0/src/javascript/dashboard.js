/*============================
     [  DASHBOARD  ].html
=============================*/ 

const todoList = document.getElementById("todo-list");

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
                    location = "login.html";
               },
               oncancel: function () {
                    location = "login.html";
               }
          });
     }
});

//Retrieving Todos
function renderData(individualDoc){
     let li = document.createElement("li");
     li.className = "todo-item";
     li.setAttribute("data-id", individualDoc.id);
     li.textContent = individualDoc.data().todos; 
     todoList.appendChild(li);

     //Showing Statuses
     auth.onAuthStateChanged(user => {
          let id = individualDoc.id;
          if(user){
               fs.collection(user.uid).doc(id).get().then(snapshot => {
                    status = snapshot.data().status;
                    if(status == 'completed'){
                         li.classList.add("completed");  
                    }
               });
               
          }
     });

     //Adding delete event to a dblclick
     li.addEventListener('dblclick', e => {
          let id = e.target.getAttribute('data-id');
          auth.onAuthStateChanged(user => {
               if(user) {
                    fs.collection(user.uid).doc(id).delete();
                    console.log("todo deleted");
               }
          })
     });

     //Adding completed event to click
     li.addEventListener('click', e => {
          let id = e.target.getAttribute('data-id');
          auth.onAuthStateChanged(user => {
               if(user){
                    fs.collection(user.uid).doc(id).get().then(snapshot => {
                         status = snapshot.data().status;
                         if (status !== 'completed'){
                              fs.collection(user.uid).doc(id).update({status: "completed"});
                              li.classList.add("completed"); 
                              console.log("status updated -c");
                         }else {
                              fs.collection(user.uid).doc(id).update({status: "incompleted"});
                              li.classList.remove("completed");
                              console.log("status updated -inc");
                         }
                    });
               }
          })
     });
}

//Retrieving User's Name
auth.onAuthStateChanged(user => {
     const username = document.getElementById("usname");
     if(user){
          fs.collection('users').doc(user.uid).get().then((snapshot) => {
               username.innerText = snapshot.data().Fname;
          });
     }
});

//Adding todos
const form = document.getElementById("todo-input-form");
const date = new Date();
const time = date.getTime();
let counter = time;
form.addEventListener('submit', e => {
     e.preventDefault();
     const todos = form["todos"].value;
     let id = counter += 1;
     form.reset();
     auth.onAuthStateChanged(user => {
          if(user){
               fs.collection(user.uid).doc('_' + id).set({
                    id: '_' + id,
                    todos,
                    status: 'incompleted'
               }).then(() => {
                    console.log('todo added');
               }).catch( err => {
                    console.log(err.message);
               })
          }
     })
})

//Loging Out
function logOut() {
     auth.signOut();
     Toast.open({
          type: "info",
          message: "User Logged Out", 
          timer: 5000
     });
     location = "login.html";
}

//Deleting Account
function deleteAcc() {
     auth.onAuthStateChanged(user => {
          if(user){
               Confirm.open({
                    title: "Delete Project",
                    message: "Are you sure you want to permanemtly delete your Account?",
                    okText: "OK",
                    cancelText: "Cancel",
                    preffered: false,
                    onok: function() {
                         fs.collection('users').doc(user.uid).delete()
                         .then(() => {
                              const user = firebase.auth().currentUser;
                              user.delete().then(() => {
                                   Toast.open({
                                        type: "warning",
                                        message: "Account Deleted", 
                                        timer: 5000
                                   });
                                   setTimeout(5000, () => {location = "login.html"});
                                   console.log("user deleted");
                              }).catch((err) => {
                                   console.log(err.message);
                              });
                         })
                    }
               })
          }
     });
}

//Setting Theme
let themeCount = 0;

function themeSetter(){

     if(themeCount < 5){
          themeCount++;
     }else{
          themeCount = 0;
     }

     switch(themeCount){
          case 0:
               localStorage.setItem("theme", "default");
               break;
          case 1:
               localStorage.setItem("theme", "orange");
               break;
          case 2:
               localStorage.setItem("theme", "blue");
               break;
          case 3:
               localStorage.setItem("theme", "minimalist-light");
               break;
          case 4:
               localStorage.setItem("theme", "minimalist-dark");
               break;
          case 5:
               localStorage.setItem("theme", "animated");
               break;
          default:
               localStorage.setItem("theme", "default");
               break;
     }

     themeReader();
}

//Real time Event Listeners
auth.onAuthStateChanged(user => {
     if(user){
          fs.collection(user.uid).onSnapshot((snapshot) => {
                    let changes = snapshot.docChanges();
                    changes.forEach(change => {
                         if(change.type == 'added'){
                              renderData(change.doc);
                         }else if(change.type == 'removed'){
                              let di = todoList.querySelector('[data-id=' + change.doc.id + ']');
                              todoList.removeChild(di);
                         }
                    })
          })
     }
})