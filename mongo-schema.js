var mongoose = require('mongoose'), Schema = mongoose.Schema;

var KeepCountSchema = Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        default: 0
    }
});

var keepCount = mongoose.model('keepCount', KeepCountSchema);

var UrlSchema = new Schema({
    id: {
        type: Number,
        default: 0
    },
    url: String
});

UrlSchema.pre('save', function(next) {
    var self = this;
    keepCount.findByIdAndUpdate(
        {
            _id: 'urlid'
        },
        {
            $inc: {
                seq: 1
            }
        },
        function(error, keepCount) {
            if (error) {
                return next(error);
            }
            self.id = keepCount.seq;
            next();
        }
    );
});

module.exports = mongoose.model('urls', UrlSchema);
