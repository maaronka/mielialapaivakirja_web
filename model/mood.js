var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moodSchema = new Schema({
    time: {type: String, required: true},
    mood: {type: String, required: true},
    keywords: Array
}, { _id: false });

var dateSchema = new Schema({
    userId: {type: String, required: true},
    date: {type: String, required: true},
    moods: [moodSchema]
});

exports.Mood = mongoose.model('Mood', moodSchema);
exports.Time = mongoose.model('Time', dateSchema);