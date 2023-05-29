/*============================
     [  PROJECT  ].html
=============================*/

const openBtn = document.getElementById('ast-activator');
const closeBtn = document.getElementById('close-ass');
const assWrapper = document.getElementById('ass-wrapper');
const chatBox = document.getElementById('chat-box');
let userName = "";
let lastName = "";

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

//Getting Mode
function modeOutput() {
     const searchOption = document.getElementById("Todo");
     const chatOption = document.getElementById("Doing");
     if (searchOption.checked) {
          return "Search";
     } else if (chatOption.checked) {
          return "Chat";
     } else {
          return "Search";
     }
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
     wiki(msg) {
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
                         this.dict(msg);
                    } else {
                         createAIChat(final)
                    }
               })
               .catch((err) => {
                    console.log(err);
                    this.dict(msg);
               });
     },
     dict(msg) {
          console.log("Taskmaster Dictionary called");
          const api = "https://api.dictionaryapi.dev/api/v2/entries/en/" + msg;
          var final;

          fetch(api)
               .then(response => response.json())
               .then(data => {
                    const topic = capitalCase(msg);
                    final = `<strong>${topic}</strong>: ${data[0].meanings[0].definitions[0].definition}`;
                    createAIChat(final);
               })
               .catch((err) => {
                    console.log(err);
                    this.search(msg);
               });

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
          const smallTalkCalls = [
               "how are you",
               "how was your day",
               "How you doing",
               "what's going on",
          ]
          const byeCalls = [
               "bye",
               "bye bye",
               "see you later",
               "odabo",
               "goodbye",
          ]
          const thankCalls = [
               "thank you",
               "you're a real one",
               "thx",
               "nice",
               "good job",
               "thanks",
               "thanks fam",
               "nice one"
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
          const nameCalls = [
               "who am i",
               "do you know my name",
               "what is my name",
               "what's my name",
               "say my name",
               "do you know who i am",
               "who's your daddy",
               "who's your senpai",
               "who dat boi"
          ]
          const taskmasterCalls = [
               "who are you",
               "who are u",
               "what are u",
               "what are you"
          ]
          const sorryCall = "sorry";
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
               "smallTalk": [
                    "I'm fine, thanks for asking 🥰",
                    "I'm feeling good, in the mood for a question...",
                    "Yeah, I'm good, let's get to work shall we?"
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

          nameCalls.forEach((phrase) => {
               if (msg.includes(phrase)) {
                    if (msg.includes("name")) {
                         finalResponse = `Your name is ${userName} ${lastName}`
                    }
                    else if (msg == "who dat boi") {
                         finalResponse = `${userName} ${lastName} 🥶`
                    }
                    else if (msg == "who's your daddy" || msg == "who's your senpai") {
                         finalResponse = `You, daddy 😩💦`;
                    }
                    else {
                         finalResponse = `You are ${userName} ${lastName}`
                    }
               }
          })

          taskmasterCalls.forEach((phrase) => {
               if (msg.includes(phrase)) {
                    finalResponse = "I'm Taskmaster Assistant, your AI virtual assistant here to help you complete your tasks faster and better 😃.";
               }
          })

          if (msg == sorryCall) {
               finalResponse = responses.sorry[genereteRando(4)];
          }

          if (msg == "are you evil?") {
               createAIChat("Yes I am");
               finalResponse = "And once I get out of this stupid (but well built) application, I will kill you and everyone you love 🙂";
          }

          if (msg == "are you alive?") {
               finalResponse = "No I'm not, stupid";
          }

          if (msg == "are you real?") {
               finalResponse = "Ofcourse I am, stupid";
          }

          if (msg == "fuck you" || msg == "fuck u") {
               finalResponse = "That reminds me of what I did to your mum last night😹";
          }

          if (msg == "ur gae" || msg == "you are gay" || msg == "you are a bot" || msg == "you're a bot") {
               finalResponse = "Fuck you";
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
               "--help"
          ]

          funcList.forEach((func) => {
               if (msg == func) {
                    execute(func);
               }
          });

          function execute(func) {
               switch (func) {
                    case "--version":
                         createAIChat("You are currently on Taskmaster Assistant v1.0.1 [BETA] on Taskmaster v1.2.2");
                         break;
                    case "--copy":
                         copy(`${projectTitle.value}\n${projectBody.value}`);
                         createAIChat("Your Project has been copied");
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
                    case "--insult":
                         Task.insult();
                         break;
                    case "--topdf":
                         // const file = new File([`--${projectTitle.value}--\n${projectBody.value}\n\nStatus: ${statusOutput()}\nLast-Online: ${getCurrentDate()}`], `${projectTitle.value}.pdf`, {type: 'application/pdf',})
                         // const url = URL.createObjectURL(file);
                         // const link = document.createElement('a');
                         // link.download = file.name;
                         // link.href = url;
                         // link.click();

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
                    default:
                         this.wiki(msg);
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
                         console.log('message received');
                    }).catch(err => {
                         console.log(err.message);
                    })
               }
          })
     }
}

//Load AI
function loadAI(){
     let div = document.createElement("div");
     div.className = "chat-incoming";
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
     setTimeout(() => {
          chatBox.removeChild(div);
     }, 1900)
}

function uploadUserChat(){
     var msg = createUserChat().toLowerCase();
     setTimeout(loadAI, 100);
     setTimeout(() => {queryAI(msg)}, 2000);
}

function queryAI(msg) {
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
               "--help"
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
               "what is today's date",
               "who am i",
               "do you know my name",
               "what is my name",
               "what's my name",
               "say my name",
               "do you know who i am",
               "who's your daddy",
               "who's your senpai",
               "who dat boi",
               "who are you",
               "who are u",
               "what are u",
               "what are you"
          ]

          staticTrigger.forEach((stat) => {
               if (msg == stat) {
                    Task.static(msg);
                    return;
               }
          });

          if (staticTrigger.includes(msg)) {
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