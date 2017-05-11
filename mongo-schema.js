const mongoose = require('mongoose'), Schema = mongoose.Schema;

const KeepCountSchema = Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        default: 0
    }
});

const keepCount = mongoose.model('keepCount', KeepCountSchema);

const UrlSchema = new Schema({
    id: {
        type: Number,
        default: 0
    },
    url: String
});

UrlSchema.pre('save', function(next) {
    var doc = this;
    keepCount.findByIdAndUpdate(
        {
            _id: 'urlid'
        },
        {
            $inc: {
                seq: 1
            }
        },
        {
            upsert: true,
            new: true
        },
        function(error, keepCount) {
            if (error) {
                return next(error);
            }
            doc.id = keepCount.seq;
            next();
        }
    );
});

module.exports = mongoose.model('urls', UrlSchema);
