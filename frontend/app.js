
const SERVER_URI = 'http://127.0.0.1:3000';

let createId = (namespace) => `${namespace}-${Date.now()}-${Math.round(Math.random() * 100)}`

let createListTemplate = (text, id) =>
    `
<div class="list" data-listId="${id}">
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
let createTaskItemTemplate = (text, id) =>
    `
<div class="taskItem" data-taskId="${id}">
    <button>X</button>
    <div class="taskText">
        ${text}
    </div>
</div>
`
let addTask = function (evento) {
    let node = $(evento.target).parent()
    let listNode = node.parent();
    let input = node[0].children[0]; // vanilla Js
    let taskText = input.value.trim(); // vanilla Js
    // si no hay nombre no hagas nada
    if (taskText === '') {
        console.error('no valid task name');
        return;
    }
    let listId = listNode[0].dataset.listid;

    let newTask = {
        "taskId": createId('task'),
        "text": taskText,
        "completed": false,
        "color": "tomato",
        "listId": listId
    }

    // REQUEST to save task to the backend before injecting a new node
    axios.post(`${SERVER_URI}/api/lists/${listId}`, newTask)
        .then((response) => {
            // if the backend succeeds 

            // crear un node html
            let newTaskNode = $(createTaskItemTemplate(taskText, newTask.taskId));

            // inyectar el node creado
            listNode.append(newTaskNode);
            // borrar el value;
            input.value = ''; // vanilla Js
        })
        .catch((e) => {
            // if the backend failed
            console.error('no se pudo guardar la tarea, inténtelo de nuevo:', e)
        })



};
let removeTask = function () {
    // borra el nodo desde el que se haya llamado
    let node = $(this).parent();
    node.remove();

};
let paintList = (list) => {
     // borrar el input
     $('.addList input').val('')
     // crear el nodo
     let newList = $(createListTemplate(list.name, list.listId));

     // inyectarlo
     $('.lists').append(newList);
     return newList;
} 
let addList = (evento) => {
        // recoger el nombre de la lista
    let listName = $('.addList input').val().trim();
    // si no hay nombre no hagas nada
    if (listName === '') {
        console.error('no valid list name')
        return;
    }
    let newList = {
        "listId": createId('list'),
        "name": listName,
        "tasks": []
    }
    // REQUEST to save list to backend
    axios.post(`${SERVER_URI}/api/lists`, newList)
        .then((response) => {
            // if the backend succeeds
            console.log('list saved, response:', response);
            
            paintList(newList);
        }).catch((error) => {
            // if the backend fails
            console.error('list can\'t be saved, error:', error)
        });
   

};
let removeList = function (event) {
    // borra el nodo desde el que se haya llamado
    let node = $(this).parent().parent().parent();
    node.remove();

};
let paintTasks = (listNode, tasks) => {
    for (const task of tasks) {
        // crear un node html
        let newTaskNode = $(createTaskItemTemplate(task.text, task.taskId));

        // inyectar el node creado
        listNode.append(newTaskNode);
    }
}
let paintListsOnStart = (response) => {
    let lists = response.data.lists;
    for (const list of lists) {
        let listNode = paintList(list);
        paintTasks(listNode, list.tasks);
    }
}


let callbackOnReady = () => {
    let config = {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    // REQUEST to fetch saved lists from the backend
    axios.get(`${SERVER_URI}/api/lists`, config).then(paintListsOnStart).catch(console.error)



    $('.addList button').on('click', addList);
    $('.lists').on('click', '.listHeader button', removeList);
    $('.lists').on('click', '.addTask button', addTask);
    $('.lists').on('click', '.taskItem button', removeTask);
}
$(document).ready(callbackOnReady);