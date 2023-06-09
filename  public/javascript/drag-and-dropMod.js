/*============================
     UPLOAD AND MODIFY PROJECT
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
     "application/rtf",
     "application/xml",
     "text/ecmascript",
     "application/java",
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
     dropPad.style.transform = 'scale(1)';
     dropPad.style.zIndex = '1';
}

function handleDrop(event) {
     event.preventDefault();
     dragDropArea.style.display = 'none';
     dropPad.style.transform = 'scale(1)';
     dropPad.style.zIndex = '1';
     console.log('upload received');

     var file = event.dataTransfer.files[0];
     var reader = new FileReader();

     reader.onload = function () {
          if (fileTypes.includes(file.type) || file.name.endsWith(".txt")) {
               var fileContents = reader.result;
               function getFileName() {
                    const fileName = file.name;
                    const fileArray = fileName.split("");
                    const cutOff = fileArray.lastIndexOf(".");
                    const editedArray = fileArray.splice(0, cutOff);
                    const editedName = editedArray.join("");
                    return editedName;
               }
               Confirm.open({
                    title: "Modify Project",
                    message: "Are you sure you want to change the contents this Project?",
                    okText: "OK",
                    cancelText: "Cancel",
                    preffered: false,
                    onok: function () {
                         projectTitle.value = getFileName();
                         projectBody.value = fileContents;
                         Toast.open({
                              type: "success",
                              message: "Project Modified",
                              timer: 5000
                         });
                    }
               });
          } else {
               Alert.open({
                    title: "Invalid File Type",
                    message: "The file type you have uploaded is not supported on this application. We reccomend you upload Plain Text files.",
                    okText: "OK"
               });
          }
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

/*
 * FOR: [  PROJECT  ].html
 */