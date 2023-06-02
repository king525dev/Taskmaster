const lightResponses = [
     {
          "response_type": "greeting",
          "user_input": [
               "hello",
               "hi",
               "hey",
               "kaaro",
               "what's",
               "up",
               "wagwan",
               "yo",
               "hii",
               "wags"
          ],
          "bot_response": [
               "Hey there!",
               "Hii",
               "Hello",
               "Hii, what can I do for you? 😁",
               "Hey, what's up, need any help?",
               "Hello, what can I do for you today?",
               "What's up?, got any questions for me? 🤓"
          ],
          "required_words": []
     },
     {
          "response_type": "greeting",
          "user_input": [
               "see you",
               "goodbye",
               "bye",
               "bye bye",
               "later",
               "odabo"
          ],
          "bot_response": [
               "See you later!",
               "Byee",
               "Byee 👋",
               "Goodbye, see you soon",
               "Thank for your time 🙋‍♀️",
               "See you later!",
               "Bye Bye, hate to see you go 😢"
          ],
          "required_words": []
     },
     {
          "response_type": "greeting",
          "user_input": [
               "you",
               "your",
               "day",
               "how",
               "was",
               "are",
               "you",
               "doing",
               "what's",
               "going",
               "on",
               "been"
          ],
          "bot_response": [
               "I'm fine, thanks for asking 🥰",
               "I'm feeling good, in the mood for a question...",
               "Yeah, I'm good, let's get to work shall we?",
               "I'm great! Thanks for asking."
          ],
          "required_words": ["how", "what's", "you"]
     },
     {
          "response_type": "greeting",
          "user_input": [
               "nice",
               "to",
               "meet",
               "finally",
               "you"
          ],
          "bot_response": [
               "The pleasure is all mine!",
               "Nice to meet you too 🥰"
          ],
          "required_words": [
               "nice"
          ]
     },
     {
          "user_input": [
               "how",
               "was",
               "your",
               "day",
               "doing",
               "today",
               "feeling",
               "good"
          ],
          "bot_response": [
               "It's been quite delightful so far. How about yours? Any interesting highlights?",
               "Pretty good! Anything exciting happening with you?",
               "Very Productive 🤓",
               "Pretty good so far, thanks for asking"
          ],
          "response_type": "conversation",
          "required_words": [
               "day",
               "how"
          ]
     },
]

function getLightResponse(input){
     const responseData = lightResponses;
     const splitMsg = input.toLowerCase().split(/\s+|[,;?!.\-]\s*/);
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
          }else if(requiredScore == (requiredWords.length/2)){
               splitMsg.forEach(word => {
                    //If the word is in the response, add the score
                    if (response["user_input"].includes(word)){
                         responseScore += 2;
                    }
               });
          }else if(requiredScore > (requiredWords.length/3)){
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