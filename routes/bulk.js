var Mood = require('../model/mood');
var insert = create(2018, 3, 25, 730);
// note that this function quite regularly produces undefined times, and therefore is not completely useful
function create(year, month, day, repeats) {
    let times = [];
    let hours = ['00', '01', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    for (let i = 0; i < repeats; i++) {
        // run here with testi2 userId
        let userId = '5e9e876eca5b480468c19f33';
        let date = new Date(year, month, day + i);
        let dateId = date.toJSON().slice(0, 10);
        let moodRepeats = Math.round(Math.random() * 5);
        if (moodRepeats > 0) {
            let moods = [];
            for (let j = 0; j < moodRepeats; j++ ) {
                let stamp = {};
                let keywords = [];
                let moodHour = hours.slice((j * Math.round(19 / moodRepeats)), ((j + 1) * Math.round(19 / moodRepeats)));
                let hour = moodHour[Math.floor(Math.random() * 19 / moodRepeats)];
                let time = hour + ':' + addZero(Math.floor(Math.random() * 60));
                let mood = 'color' + Math.ceil(Math.random() * 8);
                stamp.keywords = keywords;
                stamp.time = time;
                stamp.mood = mood;
                moods.push(stamp);
            }
            let timestamp = {
                'userId': userId,
                'date': dateId,
                'moods': moods
            }
            times.push(timestamp);
        }
    }
    return times; 
}

function addZero(num) {
    // if number is between 0-9 add 0 to string
    return (num >= 0 && num < 10) ? '0' + num : num;
}

module.exports = (req, res) => {
    Mood.Time.insertMany(insert, (err) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('thanks');
        }
    });
}