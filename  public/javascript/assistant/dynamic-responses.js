/*============================
     DEEP THINKING
=============================*/

/*
 * Credits: Indently on YT [ https://www.youtube.com/@Indently ]
 * Link: [ https://www.youtube.com/watch?v=CkkjXTER2KE ]
 */

const dynamicBaseFile = './javascript/assistant/dynamic-responses.json';
var dynamicBase = [];
let dynamicRemember = false;
let dynamicMessage;

// Load the knowledge base from a JSON file
async function loadKnowledgeBase() {
     if (localStorage.getItem("myAiData")){
          const dynamicResponses = localStorage.getItem("myAiData");
          const data = JSON.parse(dynamicResponses);
          dynamicBase = data.questions;
     }else{
          try{
               const response = await fetch(dynamicBaseFile);
               const data = await response.json();
               dynamicBase = data.questions;
               const jsonString = JSON.stringify(data);
               localStorage.setItem("myAiData", jsonString)
          }catch (error){
               console.log("Error loading Dynamic base: " + error);
          }
     }
}

// Find the closest matching question
function findBestMatch(userQuestion) {
     const matches = dynamicBase.filter(question =>
          question.question.toLowerCase().includes(userQuestion.toLowerCase())
     );
     return matches.length > 0 ? matches[0].question : null;
}

//Get answer for corresponding question
function getAnswerForQuestion(question) {
     const match = dynamicBase.find(
          q => q.question.toLowerCase() === question.toLowerCase()
     );
     return match ? match.answer : null;
}

function searchDynamicBase(msg){
     const bestMatch = findBestMatch(msg);
          if (bestMatch) {
               const answer = getAnswerForQuestion(bestMatch);
               return answer;
          } else {
               return false;
          }

}

function teachDynamicBase(msg){
     function genereteRando(max) { return Math.floor(Math.random() * max) }
     const learntThanks = [
          "Thank you! I've learnt something new.",
          "Thanks for teaching me 😁",
          "Training Data has been added to database, thank you for your contribution",
          "Just got smarter 🤓"
     ]
     if(dynamicRemember){
          const newAnswer = msg;
          dynamicBase.push({ question: dynamicMessage, answer: newAnswer });
          const newDynamicBase = JSON.stringify(dynamicBase)
          localStorage.setItem("myAiData", newDynamicBase);
          dynamicRemember = false;
          dynamicMessage = "";
          return learntThanks[genereteRando(learntThanks.length)];
     }else{
          const bestMatch = findBestMatch(msg);
          if (bestMatch) {
               const answer = getAnswerForQuestion(bestMatch);
               dynamicRemember = true;
               return answer;
          } else {
               dynamicMessage = msg;
               dynamicRemember = true;
               return "/>not-included-in-db</";
          }
     }
}

// Load the knowledge base and start the dynamic chatbot
loadKnowledgeBase();