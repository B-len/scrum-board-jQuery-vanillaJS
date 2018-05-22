let fs = require('fs');

let saveTask = (req, res) => {
    let listId = req.params.listID;
    let task = req.body;
        // res.send('recibido')
    fs.readFile('backend/board.json', 'utf-8', (e, file) => {
        let found = false;
        let board = JSON.parse(file);
        for (let list of board.lists) {
            if (list.listId === listId) {
                list.tasks.push(task);
                found = true;
                break;              
            }
        }
        if (!found) {
            res.sendStatus(404);
            return;
        }
        fs.writeFile('backend/board.json', JSON.stringify(board), (e) => {
            if(e) {
                console.log(e);
                res.sendStatus(500);
                return
            }
            res.sendStatus(200);
        })
        

    })
}
module.exports = saveTask;