/*============================
     [  SIGN-IN  ].js
=============================*/

const signInForm = document.getElementById('sign-in-form');

auth.signOut();

signInForm.addEventListener('submit', e => {
     e.preventDefault();

     const signInEmail = signInForm["email"].value;
     const signInPassword = signInForm["password"].value;
     auth.signInWithEmailAndPassword(signInEmail, signInPassword).then(() => {
          Toast.open({
               type: "success",
               message: "Welcome",
               timer: 5000
          });
          console.log("login invoked");
          location = "dashboard.html";
     }).catch(err => {
          const signInError = document.getElementById('error-txt');
          Toast.open({
               type: "error",
               message: "Log in Failed",
               timer: 5000
          });
          signInError.style.display = 'block';
          signInError.innerText = err.message;
     })
});

document.addEventListener('keydown', e => { // Reload Shortcut
     if (e.key.toLowerCase() == "r" && e.altKey) {
          e.preventDefault();
          location.reload();
     }
});

/*
 * FOR: [  INDEX  ].html
 */