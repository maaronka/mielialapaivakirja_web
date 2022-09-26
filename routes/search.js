var Mood = require('../model/mood');

module.exports = (req, res) => {
    // make a query for all of current user's data
    Mood.Time.find({'userId': req.user.id}, '-_id date moods', function(err, docs){
        if (err) {
            console.log(err);
            res.render('error');
        } else if (docs === null) {
            res.render('error');
        } else {
            res.render('search_heavy', { results: docs });
        }
    }).sort({'date': 1});
}