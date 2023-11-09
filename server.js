const { stat } = require('fs');
const http = require('http');

const todos = [
    {id: 1, text: 'Todo One'},
    {id: 2, text: 'Todo Two'},
    {id: 3, text: 'Todo Three'},
]

const server = http.createServer((req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    // res.setHeader('X-Powered-By', 'Node.js');

    
    const {method, url} = req;
    let body = [];

    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        let status = 404;
        const response = {
            succes: false,
            results: [],
            error: ''
        };

        if (method === 'GET' && url === '/todos') {

            status = 200;
            response.succes = true;
            response.results = todos;

        } else if (method === 'POST' && url === '/todos') {

            const {id, text} = JSON.parse(body);

            if (!id || !text) {
                status = 400;
                response.error = 'Please add id and text';
            } else {
                todos.push({id, text});
                status = 201;
                response.succes = true;
                response.results = todos;
            }
        }

        res.writeHead(404,  {
            'Content-Type': 'application/json',
            'X-Powered-By': 'Node.js',
        });    

        res.end(JSON.stringify(response));
    });
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));