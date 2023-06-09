/*============================
     NETWORK STATUS 
=============================*/

window.addEventListener('online', (e) => {
     // User is online
     if (document.querySelector('.confirm') !== undefined) {
          ForcedMessage._close();
     };
});

window.addEventListener('offline', (e) => {
     // User is offline
     if (document.querySelector('.confirm') == undefined) {
          ForcedMessage.open({
               title: 'No Internet Connection',
               message: 'We\'re sorry, but it appears that you are not currently connected to the internet. Please check your internet connection and try again.'
          });
     };
});

/*
 * FOR: GLOBAL
 */