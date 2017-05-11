const express = require('express'),
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    validurl = require('valid-url'),
    mongoPath = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/',
    db = mongoose.connection,
    URLS = require('./mongo-schema.js'),
    fileName = path.join(__dirname, 'index.html'),
    app = express();

app.set('port', process.env.PORT);

mongoose.connect(mongoPath);

db.on('error', err => {
    console.error(`${err.message}`);
});

app.listen(app.get('port'), () => {
    console.log('Node.js Server is listening on port ' + app.get('port'));
});

app.get('/', (req, res) => {
    res.sendFile(fileName, err => {
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

    URLS.find(
        {
            id: id
        },
        (err, rec) => {
            if (err) {
                res.status(404).send(err);
            } else if (rec && rec.length) {
                res.redirect(rec[0].url);
            } else {
                res.status(404).send('Invalid Short URL');
            }
        }
    );
});

app.get('/new/*?', function(req, res) {
    var urlInput = req.params[0];

    if (urlInput && validurl.isUri(urlInput)) {
        URLS.find(
            {
                url: urlInput
            },
            (err, docs) => {
                if (err) {
                    res.send(err);
                }
                if (docs && docs.length) {
                    res.status(201).json({
                        original_url: urlInput,
                        short_url: 'https://possible-need.glitch.me/' +
                            docs[0].id
                    });
                }

                URLS.create(
                    {
                        url: urlInput
                    },
                    (err, newUrl) => {
                        if (err) {
                            res.send(err);
                        }
                        return res.json({
                            original_url: urlInput,
                            short_url: 'https://possible-need.glitch.me/' +
                                newUrl.id
                        });
                    }
                );
            }
        );
    } else {
        res.status(400).json({
            error: 'URL Invalid'
        });
    }
});
