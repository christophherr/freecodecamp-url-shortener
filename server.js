var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    validurl = require('valid-url'),
    mongoPath = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/',
    db = mongoose.connection,
    URLS = require('./mongo-schema.js'),
    app = express();

app.set('port', process.env.PORT);

// app.get('/', function (req, res) {res.send("Freecodecamp URL Shortener Microservice Coming Soon")});

//app.use(function(req, res){res.sendStatus(404);});

mongoose.connect(mongoPath);

db.on('error', console.error.bind(console, 'connection error:'));

app.listen(app.get('port'), function() {
    console.log('Node.js Server is listening on port ' + app.get('port'));
});

app.get('/', function(req, res) {
    var fileName = path.join(__dirname, 'index.html');
    //var fileName = './views/index.html';
    res.sendFile(fileName, function(err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        console.log('Sent:', fileName);
    });
});

app.get('/:id', function(req, res) {
    var id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        res.status(404).send('Invalid Short URL');
    }

    URLS.find({ id: id }, function(err, recs) {
        if (err) {
            res.status(404).send(err);
        }

        if (recs && recs.length) {
            res.redirect(recs[0].url);
        }

        res.status(404).send('Invalid Short URL');
    });

    app.get('/new/*?', function(req, res) {
        var theUrl = req.params[0];

        if (theUrl && validurl.isUri(theUrl)) {
            URLS.find({ url: theUrl }, function(err, recs) {
                if (err) {
                    res.send(err);
                }

                if (recs && recs.length) {
                    res.status(201).json({
                        original_url: theUrl,
                        short_url: 'https://url-shortener-free-code-camp.herokuapp.com/' +
                            recs[0].id
                    });
                }
            });

            URLS.create({ url: theUrl }, function(err, newUrl) {
                if (err) {
                    res.send(err);
                }

                return res.status(201).json({
                    original_url: theUrl,
                    short_url: 'https://url-shortener-free-code-camp.herokuapp.com/' +
                        newUrl.id
                });
            });
        } else {
            res.status(400).json({
                error: 'URL Invalid'
            });
        }
    });
});
