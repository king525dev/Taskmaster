/*============================
     [  INDEX ].html
=============================*/ 

const signUpForm = document.getElementById('sign-up-form');

auth.signOut();

signUpForm.addEventListener('submit', e => {
     e.preventDefault();
     const fname = signUpForm['fname'].value;
     const lname = signUpForm['lname'].value;
     const email = signUpForm['email'].value;
     const password = signUpForm['password'].value;

     signUpForm.reset();
     auth.createUserWithEmailAndPassword(email, password).then(cred =>{
          return fs.collection('users').doc(cred.user.uid).set({
               Fname: fname,
               Lname: lname,
               Email: email,
               Password: password
          }).then(() => {
               console.log('success');
               auth.signInWithEmailAndPassword(email, password).then(() => {
                    Toast.open({
                         type: "success",
                         message: "Welcome", 
                         timer: 5000
                    });
                    console.log("login invoked");
                    location = "dashboard.html";
               }).catch( err => {
                    const signUpError = document.getElementById('error-txt');
                    console.log(err.message);
                    signUpError.style.display = 'block';
                    signUpError.innerText = err.message;
               })
               // location = "login.html";
          }).catch(err => {
               const signUpError = document.getElementById('error-txt');
               Toast.open({
                    type: "error",
                    message: "Sign-in Failed", 
                    timer: 5000
               });
               console.log(err.message);
               signUpError.style.display = 'block';
               signUpError.innerText = err.message;
          })
     }).catch(err => {
          console.log(err.message);
          const signUpError2 = document.getElementById('error-txt2');
          signUpError2.style.display = 'block';
          signUpError2.innerText = err.message;
     })
});