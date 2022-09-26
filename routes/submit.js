var Mood = require('../model/mood');

module.exports = (req, res) => {
    let keywords = [];
    if (req.body.keyword0 != '') {
        keywords.push(req.body.keyword0);
        if (req.body.keyword1 != '') {
            keywords.push(req.body.keyword1);
        }
    }
    var currentMood = new Mood.Mood({
        time: req.body.time,
        mood: req.body.mood,
        keywords: keywords
    });
    
    Mood.Time.findOne({'userId': req.user.id, 'date': req.body.date}, function(err, results) {
        // if no results, create new time document
        if (results === null) {
            // create new document
            var currentDate = new Mood.Time({
                userId: req.user.id,
                date: req.body.date,
                moods: currentMood
            });
            // save new document
            currentDate.save(function(err) {
                if (err) {
                    console.log(err);
                    res.render('error');
                } else {
                    console.log('Date and mood saved successfully');
                    res.render('thanks');
                }
            });
        }
        // if there are results, add current mood to moods array
        else if (results != null) {
            // define change request
            results.moods.push(currentMood);
            // save change request
            results.save(function(err) {
                if (err) {
                    console.log(err);
                    res.render('error');
                } else {
                    console.log('Mood saved successfully');
                    // thanks page will redirect to main menu, check file /static/javascript/app.js, function home()
                    res.render('thanks');
                }
            });
        // if something went wrong, throw error
        } else {
            console.log(err);
            res.render('error');
        }
    });
};