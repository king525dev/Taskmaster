/*============================
     DEEP THINKING
=============================*/

/*
 * Credits: Indently on YT [ https://www.youtube.com/@Indently ]
 * Link: [ https://www.youtube.com/watch?v=azP_d7SiRDg ]
 */

//Load JSON Data
async function fetchResponses(){
     let jsonData;
     try{
          const response = await fetch('./javascript/assistant/static-responses.json');
          const data = await response.json();
          jsonData = data;
     }catch (error){
          console.log("Error: " + error);
     }
     return jsonData;
}

async function getResponse(input){
     const responseData = await fetchResponses();
     const splitMsg = input.toLowerCase().split(/\s+|[,;?!.\-]\s*/);
     console.log(splitMsg);
     const scoreList = [];
     function genereteRando(max) { return Math.floor(Math.random() * max) }

     //Check all responses
     responseData.forEach(response => {
          let responseScore = 0;
          let requiredScore = 0;
          let requiredWords = response["required_words"];

          //Check if there are any required words
          if(requiredWords){
               splitMsg.forEach( word => {
                    if (requiredWords.includes(word)){
                         requiredScore += 1;
                    }
               });
          }

          //Amount of required words should match the required score
          if (requiredScore == requiredWords.length){
               //Check each word the User has typed
               splitMsg.forEach(word => {
                    //If the word is in the response, add the score
                    if (response["user_input"].includes(word)){
                         responseScore += 3;
                    }
               });
          }else if(requiredScore >= (requiredWords.length/2)){
               splitMsg.forEach(word => {
                    //If the word is in the response, add the score
                    if (response["user_input"].includes(word)){
                         responseScore += 2;
                    }
               });
          }else if(requiredScore >= (requiredWords.length/3)){
               splitMsg.forEach(word => {
                    //If the word is in the response, add the score
                    if (response["user_input"].includes(word)){
                         responseScore += 1;
                    }
               });
          }

          //Add Score to List
          scoreList.push(responseScore);
     });

     console.log(scoreList);

     const bestResponse = scoreList.reduce((a, b) => Math.max(a, b), -Infinity);
     const responseIndex = scoreList.indexOf(bestResponse);

     //Check if input sting is empty
     if(input == ""){
          return false;
     }

     //If there is no good response, return  false
     if (bestResponse > 0){
          const botAnswer = responseData[responseIndex]["bot_response"]
          return botAnswer[genereteRando(botAnswer.length)];
     }else{
          return false;
     }
}