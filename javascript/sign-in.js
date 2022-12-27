/*============================
     [  LOGIN  ].html
=============================*/ 

const signInForm = document.getElementById('sign-in-form');

signInForm.addEventListener('submit', e => {
     e.preventDefault();

     const signInEmail = signInForm["email"].value;
     const signInPassword = signInForm["password"].value;
     auth.signInWithEmailAndPassword(signInEmail, signInPassword).then(() => {
          console.log("login invoked");
          location = "dashboard.html";
     }).catch( err => {
          const signInError = document.getElementById('error-txt');
          signInError.style.display = 'block';
          signInError.innerText = err.message;
     })
});