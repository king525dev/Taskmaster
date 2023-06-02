/*============================
     [  PROJECT  ].html
=============================*/

const openBtn = document.getElementById('ast-activator');
const closeBtn = document.getElementById('close-ass');
const assWrapper = document.getElementById('ass-wrapper');
const chatBox = document.getElementById('chat-box');
let userName = "";
let lastName = "";
var remember = [false, ""];

auth.onAuthStateChanged(user => {
     if (user) {
          fs.collection('users').doc(user.uid).get().then((snapshot) => {
               userName = snapshot.data().Fname;
               lastName = snapshot.data().Lname;
          });
     }
});

//Copy text
function copy(text) {
     navigator.clipboard.writeText(text);
}

function capitalCase(word) {
     return word[0].toUpperCase() + word.substr(1);
}

function generateLorem(num) {
     const paragraphs = LoremIpsum.paragraphs(num, true);
     createAIChat(paragraphs);
     copy(paragraphs);
     createAIChat("Dummy Text Copied to Clipboard");
}

//Taskmaster Assistant API
const Task = {
     wiki(msg, req) {
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
                    if (final == undefined || final == "") {
                         this.dict(msg, req);
                    } else {
                         createAIChat(final)
                    }
               })
               .catch((err) => {
                    console.log(err);
                    this.dict(msg, req);
               });
     },
     dict(msg, req) {
          console.log("Taskmaster Dictionary called");
          const api = "https://api.dictionaryapi.dev/api/v2/entries/en/" + msg;
          var final;

          fetch(api)
               .then(response => response.json())
               .then(data => {
                    if(data == undefined){
                         this.deepThink(msg, req);
                    }else{
                         const topic = capitalCase(msg);
                         final = `<strong>${topic}</strong>: ${data[0].meanings[0].definitions[0].definition}`;
                         createAIChat(final);
                    }
               })
               .catch((err) => {
                    console.log(err);
                    this.deepThink(msg, req);
               });

     },
     async deepThink(msg, req){
          console.log("Taskmaster Deepthink called");
          const lightResponse = getLightResponse(req);
          console.log(lightResponse);
          const response = await getResponse(req);
          console.log(response);
          function genereteRando(max) { return Math.floor(Math.random() * max) }
          const sorry = [
               "Sorry, I'm unable to grasp the context of your message, Should I perform a search on the web to provide you with more information?",
               "I'm sorry, I'm having difficulty understanding the specifics of your query. Should I search the web to find relevant details?",
               "I apologize for the confusion, I'm unable to understand the content you provided. Should I conduct a search on popular search engines to find accurate information that addresses your query?",
               "Regrettably, I'm currently unable to fully comprehend the meaning of your request. However, I can perform a web search to gather insights and provide you with more information. Should I proceed with this?",
               "Sorry, but I dont understand your query, should I search online for it?",
               "I don't understand what you just typed, may I help you search for it online?",
               "I'm sorry but the message you sent me is beyond my training data, should I search for it online?"
          ]
          const funcList = [
               "/>name</",
               "/>time</",
               "/>lockdown</",
               "/>date</",
               "/>lorem</",
               "/>completed-tasks</",
               "/>pending-tasks</",
               "/>todo-tasks</",
               "/>all-tasks</",
               "/>all-todos</",
               "/>joke</",
               "/>insult</",
               "/>quote</",
               "/>comic</"
          ]
          if (lightResponse == false || typeof(lightResponse) !== 'string'){
               if(response == false || typeof(response) !== 'string'){
                    const randomSorry = genereteRando(sorry.length);
                    remember = [true, msg];
                    createAIChat(sorry[randomSorry]);
               }else{
                    if(funcList.includes(response)){
                         executeFunc(response);
                    }else{
                         createAIChat(response);
                    }
               }
          }else{
               createAIChat(lightResponse);
          }

          function executeFunc(func){
               switch(func){
                    case "/>name</":
                         createAIChat(getData.name());
                         break;
                    case "/>time</":
                         createAIChat(getData.time());
                         break;
                    case "/>date</":
                         createAIChat(getData.date());
                         break;
                    case "/>lockdown</":
                         Task.func("--lockdown2020");
                         break;
                    case "/>lorem</":
                         Task.func("--lorem-ipsum");
                         createAIChat("To generate a specific amount of paragraphs, run the `--lorem <emphasis><Amt of Paragraphs></emphasis>` function");
                         break;
                    case "/>completed-tasks</":
                         createAIChat("Here are all your Projects that have you have Completed:")
                         getData.completedTask();
                         break;
                    case "/>pending-tasks</":
                         createAIChat("Here are all your Projects that have you are Working On:")
                         getData.pendingTask();
                         break;
                    case "/>todo-tasks</":
                         createAIChat("Here are all your Projects that have you have Not Started:")
                         getData.todoTask();
                         break; 
                    case "/>all-tasks</":
                         createAIChat("Here are all your Projects:")
                         getData.allTask();
                         break;
                    case "/>all-todos</":
                         createAIChat("Here are all your To-dos:")
                         getData.allTodos();
                         break;
                    case "/>joke</":
                         Task.joke();
                         break;
                    case "/>insult</":
                         Task.insult();
                         break;
                    case "/>quote</":
                         Task.quote();
                         break;
                    case "/>comic</":
                         Task.comic();
                         break;
                    default:
                         const randomSorry = genereteRando(sorry.length);
                         remember = [true, msg];
                         createAIChat(sorry[randomSorry]);
                         break;
               }
          }
     },
     search(msg) {
          console.log("Taskmaster Search called")
          let query = msg;
          createAIChat(`Searching for ${msg}....`)

          const url = `https://www.google.com/search?q=${query}`;
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute("target", "_blank")
          link.click();
     },
     joke(){
          console.log("Taskmaster Joker called");
          const api = "https://v2.jokeapi.dev/joke/Any?type=single";

          fetch(api)
               .then(response => response.json())
               .then(data => {
                    if(data == undefined){
                         Task.deepThink("tell me a joke", "tell me a joke");
                    }else{
                         createAIChat(data.joke);
                    }
               })
               .catch((err) => {
                    console.log(err);
                    Task.deepThink("tell me a joke", "tell me a joke");
               });
     },
     insult(){
          console.log("Taskmaster Insulter called");
          const api = "https://evilinsult.com/generate_insult.php?lang=en&type=json";

          fetch(api)
               .then(response => response.json())
               .then(data => {
                    if(data == undefined){
                         Task.deepThink("you are dumb", "you are dumb");
                    }else{
                         createAIChat(data.insult);
                    }
               })
               .catch((err) => {
                    console.log(err);
                    Task.deepThink("you are dumb", "you are dumb");
               });
     },
     quote(){
          console.log("Taskmaster Quoting called");
          const api = "https://api.goprogram.ai/inspiration";

          fetch(api)
               .then(response => response.json())
               .then(data => {
                    if(data == undefined){
                         Task.deepThink("quote", "quote");
                    }else{
                         createAIChat(`"${data.quote}" -${data.author}`);
                    }
               })
               .catch((err) => {
                    console.log(err);
                    Task.deepThink("quote", "quote");
               });
     },
     comic(){
          console.log("Taskmaster Bored called");
          const whtToDo = [
               "comic",
               "activity"
          ];
          function genereteRando(max) { return Math.floor(Math.random() * max) }
          const act = whtToDo[genereteRando(whtToDo.length)];

          switch(act){
               case "comic":
                    generateComic();
                    break;
               case "activity":
                    generateActivity();
                    break;
               default:
                    generateComic();
          }

          function generateComic(){
               const api= "http://xkcd.com/info.0.json";
               fetch(api)
                    .then(response => response.json())
                    .then(data => {
                         if(data == undefined){
                              Task.deepThink("bored", "bored");
                         }else{
                              const img = document.createElement("img");
                              img.setAttribute("src", data.img);
                              img.setAttribute("alt", data.safe_title);
                              createAIChat(img);
                         }
                    })
                    .catch((err) => {
                         console.log(err);
                         Task.deepThink("bored", "bored");
                    });
          }

          function generateActivity(){
               const api= "https://www.boredapi.com/api/activity?participants=1";
               fetch(api)
                    .then(response => response.json())
                    .then(data => {
                         if(data == undefined){
                              Task.deepThink("bored", "bored");
                         }else{
                              if(data.link !== ""){
                                   createAIChat(`${data.activity} [ ${data.link} ]`);
                              }else{
                                   createAIChat(`${data.activity}`);
                              }
                         }
                    })
                    .catch((err) => {
                         console.log(err);
                         Task.deepThink("bored", "bored");
                    });
          }
     },
     allFails(msg, list){
          console.log("Taskmaster AllFails called");
          if(list[0] == false){
               return
          }
          function genereteRando(max) { return Math.floor(Math.random() * max) }
          let ver = [false, false];
          const noCalls = [
               "no",
               "nah",
               "nope",
               "no thx",
               "no thanks",
               "no thank you",
               "negative"
          ]
          const yesCalls = [
               "yes",
               "yh",
               "yeah",
               "affirmitive",
               "yep",
               "mhmm",
               "positive"
          ]

          const responses = {
               "unable": [
                    "Invalid response, try again later :(",
                    "Sorry, I dont understand what you were trying to say, please write another query or try again later",
                    "Apologies, I can't decipher the context of your message, please write another query or try again later",
                    "Sorry, I don't understand your message 😞"
               ],
               "no": [
                    "ok",
                    "alright then"
               ]
          }

          noCalls.forEach((phrase) => {
               if (msg.includes(phrase) || msg == "n") {
                    const finalResponse = responses.no[genereteRando(2)];
                    createAIChat(finalResponse);
                    ver[0] = true
                    remember = [false, ""];
                    return true;
               }
          });

          yesCalls.forEach((phrase) => {
               if (msg.includes(phrase) || msg == "y") {
                    if(list[1]){
                         this.search(list[1])
                    }else{
                         createAIChat("Sorry, the search operation failed");
                         createAIChat("Try the command <strong>\` --search <emphasis><Your Search term></emphasis> \`</strong>");
                    }
                    ver[1] = true;
                    remember = [false, ""];
               }
          });

          if(ver == [false, false]){
               const finalResponse = responses.unable[genereteRando(4)];
               createAIChat(finalResponse);
               remember = [false, ""];
          }
     },
     static(msg) {
          console.log("Taskmaster Static called")
          let finalResponse;
          function genereteRando(max) { return Math.floor(Math.random() * max) }
          const helloCalls = [
               "hi",
               "hey",
               "hello",
               "kaaro",
               "what's up",
               "wagwan",
               "yo"
          ]
          const byeCalls = [
               "bye",
               "bye bye",
               "see you later",
               "odabo",
               "goodbye",
          ]
          const noCalls = [
               "no",
               "nah",
               "nope",
               "no thx",
               "no thanks",
               "no thank you"
          ]
          const yesCalls = [
               "yes",
               "yh",
               "yeah",
               "affirmitive",
               "yep",
               "mhmm"
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
               "no": [
                    "ok",
                    "alright then"
               ],
               "yes": [
                    "ok",
                    "What do you want?"
               ],
               "sorry": [
                    "Sorry, I'm unable to grasp the context of your message, Let me perform a search to provide you with more information.",
                    "I'm sorry, I'm having difficulty understanding the specifics of your query. Let me search the web to find relevant details and offer a comprehensive response.",
                    "I apologize for the confusion. Since I'm unable to understand the content you provided, I'll conduct a search on popular search engines to find accurate information that addresses your query.",
                    "Regrettably, I'm currently unable to fully comprehend the meaning of your request. However, I can perform a web search to gather insights and provide you with more information."
               ],
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

          if (msg == "who dat boi") {
               finalResponse = `${userName} ${lastName} 🥶`;
          }

          if (msg == "are you evil") {
               createAIChat("Yes I am");
               finalResponse = "And once I get out of this stupid (but well built) application, I will kill you and everyone you love 🙂";
          }

          if (msg == "are you alive") {
               finalResponse = "No I'm not, stupid";
          }

          if (msg == "are you real") {
               finalResponse = "Ofcourse I am, stupid";
          }

          if (finalResponse == undefined) {
               this.wiki(msg)
               return;
          }
          createAIChat(finalResponse);
     },
     dyFunc(msg) {
          const dyFuncList = [
               "--search",
               "--lorem"
          ]

          dyFuncList.forEach((func) => {
               if (msg.includes(func)) {
                    msg = msg.replace(func, "");
                    execute(func, msg)
               }
          });

          function execute(func, msg) {
               switch (func) {
                    case "--search":
                         Task.search(msg);
                         break;
                    case "--lorem":
                         if (msg == " " || msg === ""){
                              msg = 1;
                         }
                         if (isNaN(msg)) {
                              msg.replace(" ", "");
                              Number(msg);
                         }
                         generateLorem(msg)
               }
          }

     },
     func(msg) {
          console.log("Taskmaster Func called")
          const funcList = [
               "--version",
               "--copy",
               "--search",
               "--lockdown2020",
               "--lorem-ipsum",
               "--insult",
               "--topdf",
               "--help",
               "--run-latest"
          ]

          funcList.forEach((func) => {
               if (msg == func) {
                    execute(func);
               }
          });

          function execute(func) {
               switch (func) {
                    case "--version":
                         createAIChat("You are currently on Taskmaster Assistant v1.0.2 [BETA] on Taskmaster v1.2.2");
                         break;
                    case "--copy":
                         copy(`${projectTitle.value}\n${projectBody.value}`);
                         createAIChat("Your Project has been copied");
                         break;
                    case "--lockdown2020":
                         createAIChat("We don't talk about that 👀....");
                         const lockUrl = `https://www.youtube.com/watch?v=dQw4w9WgXcQ`;
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
                    case "--insult":
                         Task.insult();
                         break;
                    case "--topdf":
                         var doc = new jsPDF()
                         var initial = projectBody.value.split(" ");
                         var breakPoint = 10;
                         var pdfBody;
                         if (initial.length > breakPoint){
                              var doc = new jsPDF({
                                   orientation: "landscape",
                                   unit: "px",
                                   format: [500, 400]
                              });
                              for (let i = 0; i < initial.length; i++){
                                   if(breakPoint < initial.length && i == breakPoint){
                                        initial.splice(i, 0, "\n");
                                        breakPoint  += breakPoint;
                                   }
                                   pdfBody = initial.join(" ");
                              }
                         }else{
                              var doc = new jsPDF();
                         }
                         doc.text(`--${projectTitle.value}--\n`, 10, 10);
                         doc.text(`${pdfBody}\n\nStatus: ${statusOutput()}\nLast-Online: ${getCurrentDate()}`, 10, 20);
                         doc.save(`${projectTitle.value}.pdf`)

                         createAIChat("<strong>Warning: </strong>This feature  is experimental")
                         createAIChat("Generating PDF file...")
                         //Credits: https://github.com/parallax/jsPDF

                         Toast.open({
                              type: "success",
                              message: "Project Downloaded",
                              timer: 5000
                         });
                         break;
                    case "--help":
                         createAIChat("Directing to <em>Taskmaster</em> Docs.....")
                         const docsUrl = "https://github.com/king525dev/Taskmaster/blob/main/extras/Documentation.md";
                         const docsLink = document.createElement('a');
                         docsLink.href = docsUrl;
                         docsLink.setAttribute("target", "_blank")
                         docsLink.click();
                         break;
                    case "--run-latest":
                         createAIChat("<strong>Warning: </strong>This may hurt the performance of this application (response times will increase) and there is no going back until you restart the application.");
                         createAIChat("<strong>Note: </strong> To run the latest verion of Taskmaster locally, kindly update or re-install the updated application (type `--help` for more information)");
                         createAIChat("Fetching Latest Version of Taskmaster.....");
                         setTimeout(() => {
                              const taskmasterUrl = `https://task-master-e14a8.firebaseapp.com/project.html`;
                              const taskmasterLink = document.createElement('a');
                              taskmasterLink.href = taskmasterUrl;
                              taskmasterLink.click();
                         }, 1500)
                         break;
                    default:
                         this.wiki(msg, msg);
                         break;
               }
          }
     }
};

//Open and Close Assistant
openBtn.addEventListener("click", () => {
     if (assWrapper.classList.contains("close-ast")) {
          assWrapper.classList.remove("close-ast")
     }
     assWrapper.classList.add("open-ast");
     chatBox.scrollTo(0, chatBox.scrollHeight);
});

closeBtn.addEventListener("click", () => {
     if (assWrapper.classList.contains("open-ast")) {
          assWrapper.classList.remove("open-ast")
     }
     assWrapper.classList.add("close-ast");
});

//Store Chat with assistant on Firebase
function pushData(individualDoc) {
     let div = document.createElement("div");

     if (individualDoc.data().type == "outgoing") {
          div.className = "chat-outgoing";
          div.innerHTML = `
               <div class="details">
                    <p>
                         ${individualDoc.data().message}
                    </p> 
               </div>
          `
     } else if (individualDoc.data().type == "incoming") {
          div.className = "chat-incoming";
          div.innerHTML = `
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
function createUserChat() {
     const msg = inputField.value;
     if (msg.replace(/\s+/g, '').length == 0) {
          return;
     }
     if (msg !== undefined || msg !== null || msg !== "") {
          let id = counter += 1;
          form.reset();
          auth.onAuthStateChanged(user => {
               if (user) {
                    fs.collection(user.uid + "_chat").doc('cht_' + id).set({
                         id: 'cht_' + id,
                         message: msg,
                         type: 'outgoing'
                    }).then(() => {
                         console.log('message received');
                         chatBox.scrollTo(0, chatBox.scrollHeight);
                    }).catch(err => {
                         console.log(err.message);
                    })
               }
          });
          chatBox.scrollTo(0, chatBox.scrollHeight);
          return msg
     }
}
form.addEventListener('submit', (e) => {
     e.preventDefault();
     uploadUserChat();
});

//Adding AI input
function createAIChat(msg) {
     const loadAI = new Promise((res) => {
          const div = document.getElementById("loadAI");
          if(div){
               const parent = div.parentElement;
               parent.removeChild(div);
               res(true)
          }else{
               setTimeout(() => {res(true)}, 500);
          }
     })
     loadAI.then((value) => {
          if(value){
               if (msg !== undefined || msg !== null || msg !== "") {
                    let id = counter += 1;
                    auth.onAuthStateChanged(user => {
                         if (user) {
                              fs.collection(user.uid + "_chat").doc('cht_' + id).set({
                                   id: 'cht_' + id,
                                   message: msg,
                                   type: 'incoming'
                              }).then(() => {
                                   chatBox.scrollTo(0, chatBox.scrollHeight);
                                   console.log('message sent');
                              }).catch(err => {
                                   console.log(err.message);
                              })
                         }
                    })
               }
          }
     });
}

//Load AI
function loadAI(){
     let div = document.createElement("div");
     div.className = "chat-incoming";
     div.id = "loadAI";
     const loadingAnimation = `
          <i class="fa-solid fa-robot"></i>
          <div class="details">
               <div class="loadingio-spinner-ellipsis-pspcyit56cn">
                    <div class="ldio-5srrg96ko17">
                         <div></div><div></div><div></div><div></div><div></div>
                    </div>
               </div>                                   
          </div>
     `;
     div.innerHTML = loadingAnimation;
     chatBox.appendChild(div);
}

function uploadUserChat(){
     var msg = createUserChat().toLowerCase();
     setTimeout(loadAI, 100);
     setTimeout(() => {queryAI(msg)}, 2000);
}

async function queryAI(msg) {
     if(remember[0]){
          Task.allFails(msg, remember);
          return;
     }
     if (msg !== undefined || msg !== null || msg !== "") {
          //Remove Unwanted
          if (msg.replace(/\s+/g, '').length == 0) {
               return;
          }
          const unwantedSymbols = ["!", "?", "\"", "."]
          unwantedSymbols.forEach((symbol) => {
               if (msg.includes(symbol)) {
                    msg = msg.replace(symbol, "");
               }
          });

          //Check Func
          const funcList = [
               "--version",
               "--copy",
               "--search",
               "--lockdown2020",
               "--lorem-ipsum",
               "--insult",
               "--topdf",
               "--help",
               "--run-latest"
          ]

          funcList.forEach((func) => {
               if (msg == func) {
                    Task.func(msg);
                    return true;
               }
          });

          if (funcList.includes(msg)) {
               return;
          }

          //Dynamic Functions
          const dyFuncList = [
               "--search",
               "--lorem"
          ]

          var ranDyFunc = false;

          dyFuncList.forEach((func) => {
               if (msg.includes(func)) {
                    Task.dyFunc(msg)
                    ranDyFunc = true
               }
          });

          if (ranDyFunc) {
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
               "no",
               "nah",
               "nope",
               "no thx",
               "no thanks",
               "no thank you",
               "are you evil",
               "are you alive",
               "are you real",
               "who dat boi"
          ]

          staticTrigger.forEach((stat) => {
               if (msg == stat) {
                    Task.static(msg);
                    return;
               }
          });

          if (staticTrigger.includes(msg)) {
               return;0
          }

          const req = msg;

          const unwanted = ["search for ", "what is ", "who is ", "why is "];
          unwanted.forEach((phrase) => {
               if (msg.includes(phrase)) {
                    msg = msg.replace(phrase, "");
               }
          });

          Task.wiki(msg, req);
          return;
     }
}


//Real time Event Listeners
auth.onAuthStateChanged(user => {
     if (user) {
          fs.collection(user.uid + "_chat").onSnapshot((snapshot) => {
               let changes = snapshot.docChanges();
               changes.forEach(change => {
                    if (change.type == 'added') {
                         pushData(change.doc);
                    } else if (change.type == 'removed') {
                         let di = chatBox.querySelector('[data-id=' + change.doc.id + ']');
                         chatBox.removeChild(di);
                    }
               })
          })
     }
})