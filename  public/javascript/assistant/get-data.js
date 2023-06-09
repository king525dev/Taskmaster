/*==============================
	GET DATA [ASSISTANT API]
================================*/

const getData = {
     time() {
          const dater = new Date();
          let hours = dater.getHours();
          let minute = dater.getMinutes();
          let mer;
          if (hours == 0) { hours = 12 }
          if (hours < 10) { hours = `0${hours}` }
          if (minute < 10) { minute = `0${minute}` }
          if (hours > 11) {
               mer = "PM";
          } else {
               mer = "AM";
          }
          if (hours > 12) {
               hours = hours - 12
               if (hours < 10) { hours = `0${hours}` }
          }

          let fullTime = `${hours}:${minute} ${mer}`;

          return `The time is currently ${fullTime}`;
     },
     date() {
          const dater = new Date();
          let myDate = dater.getDate();
          const day = dater.toLocaleDateString('default', { weekday: 'long' });
          const month = dater.toLocaleDateString('default', { month: 'long' });
          const year = dater.getFullYear();
          switch (myDate) {
               case 1:
                    myDate = `${myDate}st`;
                    break;
               case 2:
                    myDate = `${myDate}nd`;
                    break;
               case 3:
                    myDate = `${myDate}rd`;
                    break;
               case 21:
                    myDate = `${myDate}st`;
                    break;
               case 22:
                    myDate = `${myDate}nd`;
                    break;
               case 23:
                    myDate = `${myDate}rd`;
                    break;
               case 31:
                    myDate = `${myDate}st`;
                    break;
               default:
                    myDate = `${myDate}th`;
                    break;
          }

          const fullDate = `${day}, ${myDate} of ${month}, ${year}.`

          return `Today is ${fullDate}`;
     },
     name() {
          return auth.onAuthStateChanged(user => {
               if (user) {
                    fs.collection('users').doc(user.uid).get().then((snapshot) => {
                         const userName = snapshot.data().Fname;
                         const lastName = snapshot.data().Lname;

                         const fullName = `Your name is ${userName} ${lastName}`;

                         return fullName;
                    });
               }
          });
     },
     allTodos() {
          const tempArray = [];
          auth.onAuthStateChanged(user => {
               if (user) {
                    const db = fs.collection(user.uid);
                    db.get().then(snapshot => {
                         snapshot.forEach(doc => {
                              const template = `--> ${doc.data().todos} => [ ${doc.data().status} ]<br>`;
                              tempArray.push(template);
                         });
                         let tempString = tempArray.join("");
                         if (tempString == undefined || tempString == "") {
                              tempString = "Sorry, I can't find any of your To-dos";
                         }
                         createAIChat(tempString);
                    });
               }
          });
     },
     allTask() {
          auth.onAuthStateChanged(user => {
               if (user) {
                    const tempArray = [];
                    const db = fs.collection(user.uid + "_notes")
                    db.get().then(snapshot => {
                         snapshot.forEach(doc => {
                              const template = `--> ${doc.data().title} => [ ${doc.data().status} ]<br>`;
                              tempArray.push(template);
                         });
                         let tempString = tempArray.join("");
                         if (tempString == undefined || tempString == "") {
                              tempString = "Sorry, I can't find any of your Projects";
                         }
                         createAIChat(tempString);
                    });
               }
          });
     },
     todoTask() {
          const tempArray = [];
          auth.onAuthStateChanged(user => {
               if (user) {
                    const db = fs.collection(user.uid + "_notes")
                    db.where("status", "==", "Todo").get().then(snapshot => {
                         snapshot.forEach(doc => {
                              const template = `--> ${doc.data().title} => [ ${doc.data().status} ]<br>`;
                              tempArray.push(template);
                         });
                         let tempString = tempArray.join("");
                         if (tempString == undefined || tempString == "") {
                              tempString = "Sorry, I can't find any of your Projects that are Not Started";
                         }
                         createAIChat(tempString);
                    });
               }
          });
     },
     pendingTask() {
          const tempArray = [];
          auth.onAuthStateChanged(user => {
               if (user) {
                    const db = fs.collection(user.uid + "_notes")
                    db.where("status", "==", "Doing").get().then(snapshot => {
                         snapshot.forEach(doc => {
                              const template = `--> ${doc.data().title} => [ ${doc.data().status} ]<br>`;
                              tempArray.push(template);
                         });
                         let tempString = tempArray.join("");
                         if (tempString == undefined || tempString == "") {
                              tempString = "Sorry, I can't find any of your Projects that are being Worked on";
                         }
                         createAIChat(tempString);
                    });
               }
          });
     },
     completedTask() {
          const tempArray = [];
          auth.onAuthStateChanged(user => {
               if (user) {
                    const db = fs.collection(user.uid + "_notes")
                    db.where("status", "==", "Done").get().then(snapshot => {
                         snapshot.forEach(doc => {
                              const template = `--> ${doc.data().title} => [ ${doc.data().status} ]<br>`;
                              tempArray.push(template);
                         });
                         let tempString = tempArray.join("");
                         if (tempString == undefined || tempString == "") {
                              tempString = "Sorry, I can't find any of your Projects that are Completed";
                         }
                         createAIChat(tempString);
                    });
               }
          });
     },
};

/*
 * FOR: [  MAIN  ].js
 */