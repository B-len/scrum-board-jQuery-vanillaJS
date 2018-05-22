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
    let node = $(this).parent()
    let listNode = node.parent()
    let input = node[0].children[0]; // vanilla Js
    let taskText = input.value.trim(); // vanilla Js

    // si no hay nombre no hagas nada
    if (taskText === '') {
        console.error('no valid task name');
        return;
    }

    // crear un node html
    let newTaskNode = $(createTaskItemTemplate(taskText));

    // inyectar el node creado
    listNode.append(newTaskNode);
    // borrar el value;
    input.value = ''; // vanilla Js

};
let removeTask = function () {
    // borra el nodo desde el que se haya llamado
    let node = $(this).parent();
    node.remove();

};
let addList = (evento, listName) => {
    if (!listName) {
        // recoger el nombre de la lista
        listName = $('.addList input').val().trim();

    }
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
    return newList;

};
let removeList = function (event) {
    // borra el nodo desde el que se haya llamado
    let node = $(this).parent().parent().parent();
    node.remove();

};
let paintListsOnStart = (response) => {

    let lists = response.data.lists;
    for (const list of lists) {
        paintIndividualList(list);
    }
}

let paintIndividualList = (list) => {
    // pinta la list
    console.log(list);
    let listNode = addList({}, list.name);
    for (const task of list.tasks) {
        addTask({}, listNode, task);
    }

}

let callbackOnReady = () => {
    var promesa = axios.get('http://127.0.0.1:3000/api/lists', {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })

    promesa.then(paintListsOnStart).catch(console.error)

    $('.addList button').on('click', addList);
    $('.lists').on('click', '.listHeader button', removeList);
    $('.lists').on('click', '.addTask button', addTask);
    $('.lists').on('click', '.taskItem button', removeTask);
}
$(document).ready(callbackOnReady);