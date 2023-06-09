/*============================
     SHOW OR HIDE PASSWORD 
=============================*/

const pswrdField = document.getElementById('password');
const toggleBtn = document.getElementById('toggle');

toggleBtn.onclick = () => {
     if (pswrdField.type == "password") {
          pswrdField.type = "text";
          toggleBtn.classList.add("active");
     } else {
          pswrdField.type = "password";
          toggleBtn.classList.remove("active");
     }
}

//Credits: Coding Nepal on YT

/*
 * FOR: [  INDEX and SIGN-UP  ].html
 */