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
          alert("Your login session has expired or you have logged out, login again to continue");
          location = "login.html";
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
}

//Deleting Account
function deleteAcc() {
     auth.onAuthStateChanged(user => {
          if(user){
               if(confirm("Are you sure you want to DELETE your Account?")){
                    fs.collection('users').doc(user.uid).delete()
                         .then(() => {
                              const user = firebase.auth().currentUser;

                              user.delete().then(() => {
                                   console.log("user deleted");
                              }).catch((err) => {
                                   console.log(err.message);
                              });
                         })
               }
          }
     });
}

//Setting Theme
let themeCount = 0;

function themeSetter(){

     if(themeCount < 3){
          themeCount++;
     }else{
          themeCount = 0;
     }

     switch(themeCount){
          case 0:
               localStorage.setItem("theme", "default");
               console.log("Theme: default");
               break;
          case 1:
               localStorage.setItem("theme", "dark");
               console.log("Theme: dark");
               break;
          case 2:
               localStorage.setItem("theme", "minimalist-light");
               console.log("Theme: minimalist-light");
               break;
          case 3:
               localStorage.setItem("theme", "minimalist-dark");
               console.log("Theme: minimalist-dark");
               break;
          default:
               localStorage.setItem("theme", "default");
               console.log("Theme: default");
               break;
     }

     themeReader();
}

console.log(themeCount);

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