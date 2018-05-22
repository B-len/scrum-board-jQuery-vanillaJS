let fs = require('fs');
let onFileRead =  (error, file) => {
        if(error) {
            res.status(500).send('problem reading  the file');
            return;
        } else {
            try {
                fileObj = JSON.parse(file);
                res.json(fileObj)
            } catch (error) {
                res.status(500).send('problem parsing the file ');
            }
        }
    }
let getBoard = (req, res) => {
    // read board.json from fs and parse it to JS object and send it back as JSON
    fs.readFile('backend/board.json', 'utf-8', onFileRead)
}
module.exports = getBoard;