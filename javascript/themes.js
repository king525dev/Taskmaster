/*============================
     GLOBAL  
=============================*/

const styleLink = document.getElementById("pg-style");

function themeReader(){
     const theme = localStorage.getItem("theme");
     switch(theme){
          case "default":
               styleLink.setAttribute("href", "css/styles.css");
               break;
          case "dark":
               styleLink.setAttribute("href", "css/theme-dark.css");
               break;
          case "minimalist-light":
               styleLink.setAttribute("href", "css/theme-min-light.css");
               break;
          case "minimalist-dark":
               styleLink.setAttribute("href", "css/theme-min-dark.css");
               break;
          default:
               styleLink.setAttribute("href", "css/styles.css");
               break;
     }
}