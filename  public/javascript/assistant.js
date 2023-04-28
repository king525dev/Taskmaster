/*============================
     [  PROJECT  ].html
=============================*/ 

const openBtn = document.getElementById('ast-activator');
const closeBtn = document.getElementById('close-ass');
const assWrapper = document.getElementById('ass-wrapper');
const chatBox = document.getElementById('chat-box');
let userName = "";

auth.onAuthStateChanged(user => {
     if(user){
          fs.collection('users').doc(user.uid).get().then((snapshot) => {
               userName = snapshot.data().Fname;
          });
     }
});

//Copy text
let copy = (text) => {
     document.execCommand("copy");
};

//Getting Mode
function modeOutput(){
     const searchOption = document.getElementById("Todo");
     const chatOption = document.getElementById("Doing");
     if(searchOption.checked){
          return "Search";
     }else if(chatOption.checked){
          return "Chat";
     }else{
          return "Search";
     }
}

function generateLorem(paragraphs){
     createAIChat("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor. Mauris nunc congue nisi vitae suscipit tellus mauris a. Mi in nulla posuere sollicitudin aliquam. Quis vel eros donec ac odio tempor. Sit amet massa vitae tortor condimentum lacinia quis vel eros. Nec ultrices dui sapien eget mi. Tristique senectus et netus et malesuada fames ac turpis. Pharetra vel turpis nunc eget. Tristique sollicitudin nibh sit amet commodo. Varius duis at consectetur lorem donec. Vitae suscipit tellus mauris a diam.")
}

//Taskmaster Assistant API
const Task = {
     wiki(msg){
          console.log("Taskmaster Wiki called")
          var api = "https://simple.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles=" + msg;
          var final;

          fetch(api)
          .then(response => response.json())
          .then(response => {
               response = response.query.pages;
               var pageId = Object.keys(response)[0];
               var extract = response[pageId].extract;

               final = extract;
               if (final == undefined || final == ""){
                    this.search(msg);
               }else{
                    createAIChat(final)
               }
          })
          .catch((msg) => {
               this.search(msg);
          });
     },
     search(msg){
          console.log("Taskmaster Search called")
          let query = msg;
          createAIChat(`Searching for ${msg}....`)

          const url = `https://www.google.com/search?q=${query}`;
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute("target", "_blank")
          link.click();
     },
     static(msg){
          console.log("Taskmaster Static called")
          let finalResponse;
          function genereteRando(max){return Math.floor(Math.random() * max)}
          const helloCalls =[
               "hi",
               "hey",
               "hello",
               "kaaro",
               "what's up",
               "wagwan",
               "yo"
          ]
          const smallTalkCalls =[
               "how are you",
               "how was your day",
               "How you doing",
               "what's going on",
          ]
          const byeCalls =[
               "bye",
               "bye bye",
               "see you later",
               "odabo",
               "goodbye",
          ]
          const thankCalls =[
               "thank you",
               "you're a real one",
               "thx",
               "nice",
               "good job",
               "thanks",
               "thanks fam",
               "nice one"
          ]
          const noCalls =[
               "no",
               "nah",
               "nope",
               "no thx",
               "no thanks",
               "no thank you"
          ]
          const yesCalls =[
               "yes",
               "yh",
               "yeah",
               "affirmitive",
               "yep",
               "mhmm"
          ]
          const timeCalls = [
               "what's the time",
               "what is the time",
               "tell me the time",
               "what's today's date",
               "what day is today",
               "what is today",
               "today is",
               "tell me the date and time",
               "tell me the date",
               "what is today's date"
          ]
          const responses = {
               "hello": [
                    "Hii, what can I do for you? 😁",
                    "Hey, what's up, need any help?",
                    `Hi ${userName}, need my help? 😃`,
                    "Hello, what can I do for you today?",
                    "What's up?, got any questions for me? 🤓"
               ],
               "bye": [
                    "Byee 👋",
                    "Goodbye, see you soon",
                    "Thank for your time 🙋‍♀️",
                    "See you later!",
                    "Bye Bye, hate to see you go 😢"
               ],
               "thanks": [
                    "Anytime, got anything else?",
                    "No Problem 😇",
                    "Your Welcome 😁",
                    `Happy to help anytime, ${userName}`,
                    "Your Welcome, feel free to give me more task(s) to handle, it's my job!"
               ],
               "no": [
                    "ok",
                    "alright then"
               ],
               "yes": [
                    "ok",
                    "What do you want?"
               ],
               "smallTalk":[
                    "I'm fine, thanks for asking 🥰",
                    "I'm feeling good, in the mood for a question...",
                    "Yeah, I'm good, let's get to work shall we?"
               ]
          }

          helloCalls.forEach((phrase) => {
                         if (msg.includes(phrase)) {
                              finalResponse = responses.hello[genereteRando(5)];
                         }
          });

          byeCalls.forEach((phrase) => {
               if (msg.includes(phrase)) {
                    finalResponse = responses.bye[genereteRando(5)];
               }
          });

          thankCalls.forEach((phrase) => {
               if (msg.includes(phrase)) {
                    finalResponse = responses.thanks[genereteRando(5)];
               }
          });

          noCalls.forEach((phrase) => {
               if (msg.includes(phrase)) {
                    finalResponse = responses.no[genereteRando(2)];
               }
          });

          yesCalls.forEach((phrase) => {
               if (msg.includes(phrase)) {
                    finalResponse = responses.yes[genereteRando(2)];
               }
          });

          smallTalkCalls.forEach((phrase) => {
               if (msg.includes(phrase)) {
                    finalResponse = responses.smallTalk[genereteRando(3)];
               }
          });

          timeCalls.forEach((phrase) => {
               if (msg.includes(phrase)) {
                    finalResponse = getCurrentDate();
               }
          })

          if(msg == "are you evil?"){
               createAIChat("Yes I am");
               createAIChat("And once I get out of this stupid (but well built) application, I will kill you and everyone you love 🙂");
               finalResponse = ">:-)";
          }

          if(msg == "are you alive?"){
               createAIChat("No I'm not, stupid");
               finalResponse = ">:-)";
          }

          if(msg == "are you real?"){
               createAIChat("Ofcourse I am, stupid");
               finalResponse = ">:-)";
          }

          if(msg == "fuck you" || msg == "fuck u"){
               createAIChat("That reminds me of what I did to your mum last night😹");
               finalResponse = ">:-)";
          }

          if(msg == "ur gae" || msg == "you are gay"){
               createAIChat("Fuck you");
               finalResponse = ">:-)";
          }

          if(finalResponse == undefined){
               this.wiki(msg)
               return;
          }
          createAIChat(finalResponse);
     },
     func(msg){
          console.log("Taskmaster Func called")
          const funcList = [
               "--version",
               "--copy",
               "--search",
               "--lockdown2020",
               "--lorem-ipsum"
          ]

          funcList.forEach((func) => {
               if(msg == func){
                    execute(func);
               }
          });

          function execute(func){
               switch (func){
                    case "--version":
                         createAIChat("You are currently on Taskmaster Assistant v1.0.0 [BETA] on Taskmaster v1.2.1");
                         break;
                    case "--copy":
                         copy(`${projectTitle.value}\n${projectBody.value}`);
                         createAIChat("Your Project has been copied")
                         break;
                    case "--lockdown2020":
                         const lockUrl = `https://www.google.com/`;
                         const lockLink = document.createElement('a');
                         lockLink.href = lockUrl;
                         lockLink.setAttribute("target", "_blank");
                         lockLink.click();
                         break;
                    case "--search":
                         createAIChat("Going to Google.....")
                         const serchUrl = `https://www.google.com/`;
                         const searchLink = document.createElement('a');
                         searchLink.href = serchUrl;
                         searchLink.setAttribute("target", "_blank")
                         searchLink.click();
                         break;
                    case "--lorem-ipsum":
                         generateLorem(2);
                         break;
                    default:
                         this.wiki(msg);
                         break;
               }
          }
     }
};

//Open and Close Assistant
openBtn.addEventListener("click", () => {
     if(assWrapper.classList.contains("close-ast")){
          assWrapper.classList.remove("close-ast")
     }
     assWrapper.classList.add("open-ast");
     chatBox.scrollTo(0, chatBox.scrollHeight);
});

closeBtn.addEventListener("click", () => {
     if(assWrapper.classList.contains("open-ast")){
          assWrapper.classList.remove("open-ast")
     }
     assWrapper.classList.add("close-ast");
});

//Store Chat with assistant on Firebase
function pushData(individualDoc){
     let div = document.createElement("div");

     if(individualDoc.data().type == "outgoing"){
          div.className = "chat-outgoing";
          div.innerHTML=`
               <div class="details">
                    <p>
                         ${individualDoc.data().message}
                    </p> 
               </div>
          `
     }else if(individualDoc.data().type == "incoming"){
          div.className = "chat-incoming";
          div.innerHTML=`
               <i class="fa-solid fa-robot"></i>
               <div class="details">
                    <p>
                         ${individualDoc.data().message}
                    </p> 
               </div>
          `
     }
     div.setAttribute("data-id", individualDoc.id);
     chatBox.appendChild(div);
}

//Adding User input
const form = document.getElementById("typing-area");
const inputField = document.getElementById("input-field");
const sendBtn = document.getElementById("send-chat");
const date = new Date();
const time = date.getTime();
let counter = time;
function createUserChat(){
     const msg = inputField.value;
     let id = counter += 1;
     form.reset();
     if(msg !== undefined || msg !== null || msg !== ""){
          auth.onAuthStateChanged(user => {
               if(user){
                    fs.collection(user.uid + "_chat").doc('cht_' + id).set({
                         id: 'cht_' + id,
                         message: msg,
                         type: 'outgoing'
                    }).then(() => {
                         console.log('message received');
                         chatBox.scrollTo(0, chatBox.scrollHeight);
                    }).catch( err => {
                         console.log(err.message);
                    })
               }
          });
     }
     return msg
}
form.addEventListener('submit', (e) => {
     e.preventDefault();
     queryAI();
});

//Adding AI input
function createAIChat(msg){
     let id = counter += 1;
     auth.onAuthStateChanged(user => {
          if(user){
               fs.collection(user.uid + "_chat").doc('cht_' + id).set({
                    id: 'cht_' + id,
                    message: msg,
                    type: 'incoming'
               }).then(() => {
                    chatBox.scrollTo(0, chatBox.scrollHeight);
                    console.log('message received');
               }).catch( err => {
                    console.log(err.message);
               })
          }
     })
}

function queryAI(){
     var msg = createUserChat().toLowerCase();
     if (msg !== undefined || msg !== null || msg !== ""){
          //Check Func
          const funcList = [
               "--version",
               "--copy",
               "--search",
               "--lockdown2020",
               "--lorem-ipsum"
          ]

          funcList.forEach((func) => {
               if(msg == func){
                    Task.func(msg);
                    return true;
               }
          });

          if(funcList.includes(msg)){
               return;
          }

          //Check Static
          const staticTrigger = [
               "hi",
               "hey",
               "hello",
               "kaaro",
               "what's up",
               "wagwan",
               "yo",
               "bye",
               "bye bye",
               "see you later",
               "odabo",
               "goodbye",
               "thank you",
               "you're a real one",
               "thx",
               "nice",
               "good job",
               "thanks",
               "thanks fam",
               "nice one",
               "no",
               "nah",
               "nope",
               "no thx",
               "no thanks",
               "no thank you",
               "are you evil?",
               "are you alive?",
               "are you real?",
               "fuck you",
               "fuck u",
               "ur gae",
               "you are gay",
               "how are you",
               "how was your day",
               "How you doing",
               "what's going on",
               "what's the time",
               "what is the time",
               "tell me the time",
               "what's today's date",
               "what day is today",
               "what is today",
               "today is",
               "tell me the date and time",
               "tell me the date",
               "what is today's date"
          ]

          staticTrigger.forEach((stat) => {
               if(msg == stat){
                    Task.static(msg);
                    return;
               }
          });

          if(staticTrigger.includes(msg)){
               return;
          }

          const unwanted = ["search for ", "what is ", "who is ", "why is "];
          unwanted.forEach((phrase) => {
                    if (msg.includes(phrase)) {
                         msg = msg.replace(phrase, "");
                    }
               });
               Task.wiki(msg);
          return;
     }
}


//Real time Event Listeners
auth.onAuthStateChanged(user => {
     if(user){
          fs.collection(user.uid + "_chat").onSnapshot((snapshot) => {
                    let changes = snapshot.docChanges();
                    changes.forEach(change => {
                         if(change.type == 'added'){
                              pushData(change.doc);
                         }else if(change.type == 'removed'){
                              let di = chatBox.querySelector('[data-id=' + change.doc.id + ']');
                              chatBox.removeChild(di);
                         }
                    })
          })
     }
})