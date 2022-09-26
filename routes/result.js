var Mood = require('../model/mood');

module.exports = (req, res) => {
    // make a query for current user's data
    Mood.Time.find({'userId': req.user.id, 'date':{ $gte: req.body.startDate, $lte: req.body.endDate}}, '-_id date moods', function(err, docs){
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('results', { results: docs });
        }
    }).sort({'date': 1});
}