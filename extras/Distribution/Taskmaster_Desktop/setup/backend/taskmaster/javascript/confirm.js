/*============================
     CONFIRM/ALERT UI
=============================*/ 

const Confirm = {
     open (options){
          options = Object.assign({}, {
               title: '',
               message: '',
               okText: 'OK',
               cancelText: 'Cancel',
               preffered: true,
               onok: function () {},
               oncancel: function () {}
          }, options);
          
          const html = `
               <div class="confirm">
                    <div class="confirm-window">
                         <div class="confirm-titlebar">
                              <span class="confirm-title">${options.title}</span>
                              <button class="confirm-close">&times;</button>
                         </div>
                         <div class="confirm-content">${options.message}</div>
                         <div class="confirm-buttons">
                              <button class="confirm-button ok-button">${options.okText}</button>
                              <button class="confirm-button cancel-button">${options.cancelText}</button>
                         </div>
                    </div>
               </div>
          `;

          const template = document.createElement('template');
          template.innerHTML = html;

          // Elements
          const confirmEl = template.content.querySelector('.confirm');
          const btnClose = template.content.querySelector('.confirm-close');
          const btnOk = template.content.querySelector('.ok-button');
          const btnCancel = template.content.querySelector('.cancel-button');

          //Determine Preffered Option
          if(options.preffered == true){
               btnOk.classList.add("preffered");
          }else{
               btnCancel.classList.add("preffered");
          }

          //Cancel if click outside
          confirmEl.addEventListener('click', e => {
               if (e.target === confirmEl) {
                    options.oncancel();
                    this._close(confirmEl);
               }
          });

          //Perform action if clicked 'true'
          btnOk.addEventListener('click', () => {
               options.onok();
               this._close(confirmEl);
          });

          //Perform action if clicked 'false' or close
          [btnCancel, btnClose].forEach(el => {
               el.addEventListener('click', () => {
                    options.oncancel();
                    this._close(confirmEl);
               });
          });

          document.body.appendChild(template.content);
     },

     _close (confirmEl) {
          confirmEl.classList.add('close');

          confirmEl.addEventListener('animationend', () => {
               document.body.removeChild(confirmEl);
          });
     }
};

const Alert = {
     open(options) {
          options = Object.assign({}, {
               title: '',
               message: '',
               okText: 'OK',
               onok: function () {}
          }, options);

          const html = `
               <div class="confirm">
                    <div class="confirm-window">
                         <div class="confirm-titlebar">
                              <span class="confirm-title">${options.title}</span>
                              <button class="confirm-close">&times;</button>
                         </div>
                         <div class="confirm-content">${options.message}</div>
                         <div class="confirm-buttons">
                              <button class="confirm-button ok-button">${options.okText}</button>
                         </div>
                    </div>
               </div>
          `;

          const template = document.createElement('template');
          template.innerHTML = html;

          // Elements
          const confirmEl = template.content.querySelector('.confirm');
          const btnClose = template.content.querySelector('.confirm-close');
          const btnOk = template.content.querySelector('.ok-button');

          //Cancel if click outside
          confirmEl.addEventListener('click', e => {
               if (e.target === confirmEl) {
                    options.oncancel();
                    this._close(confirmEl);
               }
          });

          //Perform action if clicked 'true'
          btnOk.addEventListener('click', () => {
               options.onok();
               this._close(confirmEl);
          });

          //Perform action if clicked 'false' or close
          btnClose.addEventListener('click', () => {
               options.oncancel();
               this._close(confirmEl);
          });

          document.body.appendChild(template.content);
     },

     _close (confirmEl) {
          confirmEl.classList.add('close');

          confirmEl.addEventListener('animationend', () => {
               document.body.removeChild(confirmEl);
          });
     }
}

const ForcedMessage = {
     open(options) {
          options = Object.assign({}, {
               title: '',
               message: ''
          }, options);

          const html = `
               <div class="confirm">
                    <div class="confirm-window">
                         <div class="confirm-titlebar">
                              <span class="confirm-title">${options.title}</span>
                         </div>
                         <div class="confirm-content">${options.message}</div>
                    </div>
               </div>
          `;

          const template = document.createElement('template');
          template.innerHTML = html;

          document.body.appendChild(template.content);
     },

     _close () {
          const confirmEl = document.querySelector('.confirm');
          confirmEl.classList.add('close');

          confirmEl.addEventListener('animationend', () => {
               document.body.removeChild(confirmEl);
          });
     }
}

//Credits: Dcode on YT