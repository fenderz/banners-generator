var express = require('express');
var swig = require('swig');
var app = express();

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/app/assets'));


app.set('view cache', false);
swig.setDefaults({ cache: false });

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(8000);
console.log('Application Started on http://localhost:8000/');