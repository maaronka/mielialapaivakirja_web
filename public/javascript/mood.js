var json, keyword0, keyword1;
var modal = document.getElementById('keywordsModal');
var btn = document.getElementById('keywords');


function createJson(color) {
    // store current time and mood
    let now = new Date();
    let date = [now.getFullYear(), addZero(now.getMonth() + 1), addZero(now.getDate())].join('-');
    let time = now.toTimeString().slice(0, 8);
    json = {
        date: date,
        time: time,
        mood: color,
    };
    keyword0 = '';
    keyword1 = '';
    // highlight user's choice and make database submittal possible
    let classList = document.getElementsByClassName('chosen');
    let i = 0;
    while (i < classList.length) {
        classList[i].setAttribute('class', 'circle')
    };
    document.getElementById(color).setAttribute('class', 'circle chosen')
    document.getElementById('button').disabled = false;
    document.getElementById('keywords').disabled = false;
}

function button(path) {
    // add keywords to json and strip them from special characters
    json['keyword0'] = htmlEncode(keyword0);
    json['keyword1'] = htmlEncode(keyword1);
    // submit data to database
    sendToDatabase(path, json);
}

// open modal when user clicks on add keywords button
btn.addEventListener('click', function() {
    let moodId = json['mood'];
    if (keyword0 == '') {
        document.getElementById('moodName').value = moodNames[moodId];
    } else {
        document.getElementById('moodName').value = keyword0;
    }
    document.getElementById('more').value = keyword1;
    modal.style.visibility = 'visible';
});

// close modal if user clicks outside modal content box
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.visibility = 'hidden';
    }
});

function addKeywords() {
    // grab user input from the form
    keyword0 = document.getElementById('moodName').value.replace(/\s+/g,' ').trim();
    keyword1 = document.getElementById('more').value.replace(/\s+/g,' ').trim();
    if (keyword0 == '' && keyword1 != '') {
        alert('Lisää fiilis!');
        keyword1 = '';
    } else {
        modal.style.visibility = 'hidden';
    }
}

function htmlEncode(str) {
    // replaces every non alphabetic character with its htmlcode (numeric)
    let i = str.length;
    let arr = [];
    while (i--) {
        arr.unshift(checkCharCode(str[i]));
    }
    return arr.join('');
}

function checkCharCode(para) {
    let iC = para.charCodeAt();
    if ((iC > 64 && iC < 91) || (iC > 96 && iC < 123)) {
        // htmlcodes 65-90 and 97-122 are alphabetic characters, can be added as is
        return para;
    } else {
        // add character's htmlcode (note: replaces å, ä, ö as well, among others)
        return ['&#' + iC + ';'].join('');
    }
}