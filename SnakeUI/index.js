const path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
const async = require('async');
const app = express()

const solver = function(arena, callback) {
	var spawn = require('child_process').spawn
	snake_solution = spawn('python3', [path.join('..','SnakeAI','search.py')])
	result = ""
	snake_solution.stdout.on('data', function(data){
		result += data.toString();
	});

	snake_solution.stdout.on('end', function(){
		result = JSON.parse(result)
		callback(result)
	});
	snake_solution.stdin.write(arena);
	snake_solution.stdin.end()
}
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'static')))
app.get('/', (req, res) => {
	res.sendFile('views/index.html', {root: __dirname })
})
app.post('/solve', (req,res) => {
	arena = req.body.arena
	async.parallel([
		function(callback) {
			solver(arena,callback)
		}
	],
	function (response) {
		res.send(response)
	})
})
app.listen(3000, () => console.log('Listening on port 3000!'))