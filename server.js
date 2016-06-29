var express = require('express');
var fs = require('fs');
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
    fs.readFile('./app/json/data.json', 'utf8', function (err, data) {
        if (err) {
            res.render('index', { error: JSON.stringify(err) });
        } else {
            try {
                var parsedData = JSON.parse(data);
                res.render('index', { data: parsedData });
            } catch (err) {
                res.render('index', { error: JSON.stringify(err) });
            }
        }
    })
});

app.listen(8000);
console.log('Application Started on http://localhost:8000/');