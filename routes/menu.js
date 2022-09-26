var Mood = require('../model/mood');

module.exports = (req, res) => {
    // make a query for the latest datapoint that has been submitted
    Mood.Time.findOne({'userId': req.user.id}, function(err, time){
        if (err) {
            console.log(err);
            res.render('error');
        } else if (time === null) {
            // new user => prompt user to submit first data point
            res.render('submit');
        } else {
            res.render('index', { latest: time });
        }
    }).sort({'date': -1});
}