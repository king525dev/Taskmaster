/*============================
     [  DASHBOARD  ].html
=============================*/ 

//Global Variables
const todoForm = document.getElementById('todo-input-form'); 
const todoList = document.getElementById('todo-list');

//Events
// document.getElementById('todo-input-form').addEventListener("submit", addTodo);

//Add TodoItem
function addTodo(event){
     event.preventDefault();
     const newTodo = document.getElementById('todo-input').value;
     console.log(newTodo)
     const li = document.createElement('li');
     li.className = 'todo-item';
     li.appendChild(document.createTextNode(newTodo));
     todoList.appendChild(li);
     newTodo = "";
}