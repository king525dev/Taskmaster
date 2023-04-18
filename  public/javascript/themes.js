/*============================
     GLOBAL  
=============================*/

const styleLink = document.getElementById("pg-style");
const signLogo = document.getElementById("logo");

function themeReader(){
     const theme = localStorage.getItem("theme");
     switch(theme){
          case "default":
               styleLink.setAttribute("href", "css/default-style.css");
               console.log("Theme: default");
               break;
          case "orange":
               styleLink.setAttribute("href", "css/theme-orange.css");
               signLogo.setAttribute("src", "resources/Taskmaster Brand Kit/Taskmaster-logo-dark.png");
               console.log("Theme: orange");
               break;
          case "blue":
               styleLink.setAttribute("href", "css/theme-blue.css");
               console.log("Theme: blue");
               break;
          case "minimalist-light":
               styleLink.setAttribute("href", "css/theme-min-light.css");
               console.log("Theme: minimalist-light");
               break;
          case "minimalist-dark":
               styleLink.setAttribute("href", "css/theme-min-dark.css");
               signLogo.setAttribute("src", "resources/Taskmaster Brand Kit/Taskmaster-logo-dark.png");
               console.log("Theme: minimalist-dark");
               break;
          case "animated":
               styleLink.setAttribute("href", "css/theme-anime.css");
               console.log("Theme: animated");
               break;
          default:
               styleLink.setAttribute("href", "css/default-style.css");
               console.log("Theme: default");
               break;
     }
}