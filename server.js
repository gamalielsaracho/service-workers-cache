var bodyParser =  require('body-parser')

var express = require('express')
var app = express()

app.use(express.static('app'));

app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
	res.sendfile('./app/index.html')
})

app.listen(3000, function(err) {
	if(err) {
		console.log('Error al correr el servidor 3000')
	}

	console.log('Corriendo en el puerto 3000')
})

