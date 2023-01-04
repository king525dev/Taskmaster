/*============================
     GLOBAL  
=============================*/

const styleLink = document.getElementById("pg-style");

function themeReader(){
     const theme = localStorage.getItem("theme");
     switch(theme){
          case "default":
               styleLink.setAttribute("href", "css/styles.css");
               console.log("Theme: default");
               break;
          case "dark":
               styleLink.setAttribute("href", "css/theme-dark.css");
               console.log("Theme: dark");
               break;
          case "minimalist-light":
               styleLink.setAttribute("href", "css/theme-min-light.css");
               console.log("Theme: minimalist-light");
               break;
          case "minimalist-dark":
               styleLink.setAttribute("href", "css/theme-min-dark.css");
               console.log("Theme: minimalist-dark");
               break;
          case "animated":
               styleLink.setAttribute("href", "css/theme-anime.css");
               console.log("Theme: animated");
               break;
          default:
               styleLink.setAttribute("href", "css/styles.css");
               console.log("Theme: default");
               break;
     }
}