/*============================
     [  NOTE  ].html
=============================*/ 

const dragDropArea = document.getElementById('drag-drop');
const dropPad = document.getElementById('download-btn');
const fileTypes = [
     "text/plain", 
     "text/css", 
     "text/html", 
     "text/javascript", 
     "multipart/byteranges",
     "multipart/form-data",
     "text/calendar",
     "text/markdown",
     "text/rtf",
     "text/strings",
     "text/vtt",
     "text/xml",
     "text/csv",
     "multipart/report",
     "application/json",
     "application/batch-SMTP"
]

function handleDragOver(event) {
     event.preventDefault();
     dropPad.style.transform = 'scale(1.2)';
     dropPad.style.zIndex = '7';
     dragDropArea.style.display = 'flex';
}

function handleDragLeave(event) {
     event.preventDefault();
     dragDropArea.style.display = 'none';
}

function handleDrop(event) {
     event.preventDefault();
     dragDropArea.style.display = 'none';
     console.log('upload received');

     var file = event.dataTransfer.files[0];
     var reader = new FileReader();

     reader.onload = function() {
          if (fileTypes.includes(file.type) || file.name.endsWith(".txt")){
               var fileContents = reader.result;
               const date = new Date();
               const time = date.getTime();
               let counter = time;
               let id = counter += 1;
               auth.onAuthStateChanged(user => {
                    if(user){
                         fs.collection(user.uid + "_notes").doc('nb_' + id).set({
                              id: 'nb_' + id,
                              title: file.name,
                              note: fileContents,
                              status: "Todo",
                              lastEdited: fullDate,
                              listRank: date
                         }).then(() => {
                              sortByDate();
                              Toast.open({
                                   type: "success",
                                   message: "Project Added", 
                                   timer: 5000
                              });
                              console.log('note added');
                              notesList.children[0].click();
                         }).catch( err => {
                              console.log(err.message);
                         })
                    }
               })
          }else{
               Alert.open({
                    title: "Invalid File Type",
                    message: "The file type you have uploaded is not supported on this application. We reccomend you upload Plain Text files.",
                    okText: "OK"
               });
          }
          // dropPad.style.transform = 'scale(1)';
          // dropPad.style.zIndex = '1';
     };

     reader.readAsText(file);
}

dropPad.addEventListener("onmouseover", () => {
     dropPad.style.transform = 'scale(1.2)';
     dropPad.style.zIndex = '2';
});

dropPad.addEventListener('dragleave', handleDragLeave);
dropPad.addEventListener('dragenter', handleDragOver);
dropPad.addEventListener('dragover', handleDragOver);
dropPad.addEventListener('drop', handleDrop);