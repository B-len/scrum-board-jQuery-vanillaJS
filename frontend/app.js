let createListTemplate = (text) =>
    `
<div class="list">
    <div class="listHeader">
    <h4>${text}
        <button>X</button>
    </h4>
        
    </div>
    <div class="addTask">
        <input type="text">
        <button>add task</button>
    </div>
</div>
`
let createTaskItemTemplate = (text) =>
    `
<div class="taskItem">
    <button>X</button>
    <div class="taskText">
        ${text}
    </div>
</div>
`
let addTask = function () {
    // acceder a la node llamado
    let node = $(this).parent();
    let input = node[0].children[0]; // vanilla Js

    // recoger el valor de input
    let taskText = input.value.trim(); // vanilla Js
    // si no hay nombre no hagas nada
    if (taskText === '') {
        console.error('no valid task name');
        return;
    }

    // crear un node html
    let newTaskNode = $(createTaskItemTemplate(taskText));

    // inyectar el node creado
    node.parent().append(newTaskNode);
    // borrar el value;
    input.value = ''; // vanilla Js

};
let removeTask = function () {
    // borra el nodo desde el que se haya llamado
    let node = $(this).parent();
    node.remove();

};
let addList = () => {
    // recoger el nombre de la lista
    let listName = $('.addList input').val().trim();

    // si no hay nombre no hagas nada
    if (listName === '') {
        console.error('no valid list name')
        return;
    }
    // borrar el input
    $('.addList input').val('')
    // crear el nodo
    let newList = $(createListTemplate(listName));

    // inyectarlo
    $('.lists').append(newList);

};
let removeList = function (event) {
    // borra el nodo desde el que se haya llamado
    let node = $(this).parent().parent().parent();
    node.remove();

};

let callbackOnReady = () => {
    var config = {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    axios.get('http://127.0.0.1:3000/api/lists', config)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(console.error)

    $('.addList button').on('click', addList);
    $('.lists').on('click', '.listHeader button', removeList);
    $('.lists').on('click', '.addTask button', addTask);
    $('.lists').on('click', '.taskItem button', removeTask);
}
$(document).ready(callbackOnReady);