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
    let newTask = {
        "taskId": createId('task'),
        "text": taskText,
        "completed": false,
        "color": "tomato"

    }
    
    let listId = listNode[0].dataset.listid
    // save task to the backend
    saveTask(newTask, listId)
        .then((response) => {
            console.log(response);
            
            // crear un node html
            let newTaskNode = $(createTaskItemTemplate(taskText, newTask.taskId));

            // inyectar el node creado
            listNode.append(newTaskNode);
            // borrar el value;
            input.value = ''; // vanilla Js
        })
        .catch((e) => {
            console.error('no se pudo guardar la tarea, inténtelo de nuevo:', e)
        })



};
let removeTask = function () {
    // borra el nodo desde el que se haya llamado
    let node = $(this).parent();
    node.remove();

};
let addList = (evento, listName, listID) => {
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
    let newList = $(createListTemplate(listName, listID));

    // inyectarlo
    $('.lists').append(newList);
    return newList;

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
        let listNode = addList({}, list.name, list.listId);
        paintTasks(listNode, list.tasks);
    }
}
let saveTask = function (task, listId) {
    

   return axios.post(`http://127.0.0.1:3000/api/list/${listId}/${task.taskId}`, task)

}

let callbackOnReady = () => {
    let config = {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };

    axios.get('http://127.0.0.1:3000/api/lists', config).then(paintListsOnStart).catch(console.error)



    $('.addList button').on('click', addList);
    $('.lists').on('click', '.listHeader button', removeList);
    $('.lists').on('click', '.addTask button', addTask);
    $('.lists').on('click', '.taskItem button', removeTask);
}
$(document).ready(callbackOnReady);