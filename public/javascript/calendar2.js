// constants that are not affected by query results
const startMonth = document.getElementById('startMonth');
const endMonth = document.getElementById('endMonth');
const monthNames = {
    '01': 'Tammikuu',
    '02': 'Helmikuu',
    '03': 'Maaliskuu',
    '04': 'Huhtikuu',
    '05': 'Toukokuu',
    '06': 'Kesäkuu',
    '07': 'Heinäkuu',
    '08': 'Elokuu',
    '09': 'Syyskuu',
    '10': 'Lokakuu',
    '11': 'Marraskuu',
    '12': 'Joulukuu'
};
const modal = document.getElementById('resultsModal');
const modalContent = document.getElementById('modal-keywords');

// database query results
let results = document.getElementById('hidden').getElementsByClassName('result');
let ids = [];
for (i = 0; i < results.length; i++) {
    ids.push(results[i].innerHTML);
}

// create months array from query results
let months = [];
let firstYear = parseInt(ids[0].slice(0, 4));
let firstMonth = parseInt(ids[0].slice(5, 7));
let lastYear = parseInt(ids[ids.length - 1].slice(0, 4));
let lastMonth = parseInt(ids[ids.length - 1].slice(5, 7));
// check that query results are in the right format
if (firstYear === NaN || lastYear === NaN || firstMonth === NaN || lastMonth === NaN) {
    alert('Tapahtui virhe');
    home();
}
if (lastYear > firstYear) {
    // query result has dates from more than one calendar year
    let years = [];
    for (let i = firstYear; i <= lastYear; i++) {
        years.push(i);
    }
    let i = 0;
    while (i < years.length) {
        if (i == 0) {
            // what to do for the first year
            for (let j = firstMonth; j < 13; j++) {
                months.push(years[i] + '-' + addZero(j));
            }
        } else if (i == years.length - 1) {
            // what to do for the last year
            for (let j = 1; j <= lastMonth; j++) {
                months.push(years[i] + '-' + addZero(j));
            }
        } else {
            // years between the first and the last
            for (let j = 1; j < 13; j++) {
                months.push(years[i] + '-' + addZero(j));
            }
        }
        i++;
    }
} else {
    // query result has dates from only one calendar year
    let i = firstMonth;
    while (i <= lastMonth) {
        months.push(lastYear + '-' + addZero(i));
        i++;
    }
}

createMenu('start');
createMenu('end');
showCalendar('start');
showCalendar('end');

// create month select menu
function createMenu(para) {
    for (let i = 0; i < months.length; i++) {
        let opt = months[i];
        let el = document.createElement('option');
        el.text = monthNames[opt.slice(5, 7)] + ' ' + opt.slice(0, 4);
        el.value = opt;
        document.getElementById(para + 'Month').appendChild(el);
        if (para == 'start') {
            if (i == months.length - 4) {
                let optAtt = document.createAttribute('selected');
                el.setAttributeNode(optAtt);
            }
        } else {
            if (i == months.length - 1) {
                let optAtt = document.createAttribute('selected');
                el.setAttributeNode(optAtt);
            }
        }        
    }
}

function showCalendar(para) {
    if (para === 'start' || para === 'end') {
        let para1;
        if (para === 'start') {
            para1 = startMonth.value;
        } else {
            para1 = endMonth.value;
        }
        // split para1 into year and month
        let arr = para1.split('-');
        // check that arr is a two-length array of string objects that can be parsed into integers
        if (arr.length != 2 || Number.isInteger(parseInt(arr[0])) === false || Number.isInteger(parseInt(arr[1])) === false) {
            alert('Tapahtui virhe');
            home();
        }
        // parse year and month
        let year = parseInt(arr[0]);
        let month = parseInt(arr[1]) - 1;
        let queryMonth = String(arr[1]);
        // find the weekday index # of the first day of the month
        let weekday = (new Date(year, month)).getDay();
        // since Finnish week starts on Monday, use a weekday index # that reflects that for table creation
        let firstDay;
        if (weekday == 0) {
            firstDay = 6;
        } else {
            firstDay = weekday - 1;
        }
        // calculate the number of days in a month
        let daysInMonth = 32 - new Date(year, month, 32).getDate();
        // body of the calendar
        let id = 'calendar-body-' + para;
        let tbl = document.getElementById(id);
        // clears all previous cells
        tbl.innerHTML = '';
        // creates all cells
        let date = 1;
        for (let i = 0; i < 6; i++) {
            // creates a table row
            let row = document.createElement('tr');

            // creates individual cells and fills them up with data
            for (let j = 0; j < 7; j++) {
                // leave empty all cells before day 1
                if (i === 0 && j < firstDay) {
                    let cell = document.createElement('td');
                    let cellText = document.createTextNode('');
                    let cellAtt = document.createAttribute('class');
                    cellAtt.value = 'nohover';
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    cell.setAttributeNode(cellAtt);
                }
                // stop filling calendar once all dates are done
                else if (date > daysInMonth) {
                    break;
                }
                // fill cell with date information and assign required attributes (cell id, onclick function, mouseover info)
                else {
                    let cell = document.createElement('td');
                    let cellText = document.createTextNode(date);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    let resultId = [year, queryMonth, addZero(date)].join('-');
                    // is there a query result for current date?
                    if (document.getElementById(resultId)) {
                        let cellId = document.createAttribute('id');
                        cellId.value = para + 'day' + resultId;
                        let cellAtt = document.createAttribute('onclick');
                        cellAtt.value = para + 'Query(\'' + resultId + '\')';
                        let cellData = document.createAttribute('title');
                        cellData.value = 'Merkintöjä ' + document.getElementById(resultId).getElementsByClassName('moods').length + ' kpl';
                        cell.setAttributeNode(cellId);
                        cell.setAttributeNode(cellAtt);
                        cell.setAttributeNode(cellData);
                    } else {
                        let cellAtt = document.createAttribute('class');
                        cellAtt.value = 'nohover';
                        let cellData = document.createAttribute('title');
                        cellData.value = 'Ei merkintöjä';
                        cell.setAttributeNode(cellAtt);
                        cell.setAttributeNode(cellData);
                    }
                    date++;
                }
            }
            // appends each row into calendar body
            tbl.appendChild(row); 
        }
    }
}

function showDetails() {
    // remove search view
    let holder = document.getElementById('resultsholder');
    holder.innerHTML = '';
    document.getElementById('h1').innerHTML = 'Hakutulokset';

    // create a new array that includes only specified dates
    function findStart(id) {
        return id == query['startDate'];
    }
    function findEnd(id) {
        return id == query['endDate'];
    }
    let startId = ids.findIndex(findStart);
    let endId = ids.findIndex(findEnd);
    let arr = ids.slice(startId, endId + 1);
    
    // create detailed results view
    for (let i = 0; i < arr.length; i++) {
        // create date header
        let header = document.createElement('h2');
        header.textContent = [arr[i].slice(8), arr[i].slice(5, 7), arr[i].slice(0, 4)].join('.');
        holder.appendChild(header);
        // create dateholder div
        let div = document.createElement('div');
        let divClass = document.createAttribute('class');
        divClass.value = 'dateholder';
        holder.appendChild(div);
        div.setAttributeNode(divClass);
        // create individual mood divs
        let moods = document.getElementById(arr[i]).getElementsByClassName('moods');
        for (let j = 0; j < moods.length; j++) {
            // get detailed information from query results
            let details = moods[j].getElementsByClassName('array');
            let keywords = details[0].innerHTML;
            let time = details[1].innerHTML.slice(0, 5);
            let mood = details[2].innerHTML;
            // create stamp div
            let stamp = document.createElement('div');
            let stampClass = document.createAttribute('class');
            stampClass.value = 'stamp ' + mood;
            stamp.setAttributeNode(stampClass);
            // create paragraphs with detailed info
            let p1 = document.createElement('p');
            p1.textContent = time;
            stamp.appendChild(p1);
            let p2 = document.createElement('p');
            if (keywords == '') {
                p2.textContent = moodNames[mood];
                stamp.appendChild(p2);
            } else {
                let keywordClass = arr[i] + 'T' + details[1].innerHTML;
                let specMood = document.getElementsByClassName(keywordClass)[0].innerText;
                p2.innerHTML = escapeHTML(specMood);
                stamp.appendChild(p2);
                let button = document.createElement('button');
                let buttonClass = document.createAttribute('class');
                buttonClass.value = 'seeKeywords'
                button.setAttributeNode(buttonClass);
                let buttonId = document.createAttribute('id');
                buttonId.value = keywordClass;
                button.setAttributeNode(buttonId);
                button.textContent = '+';
                stamp.appendChild(button);
            }
            // append stamp to dateholder
            div.appendChild(stamp);
        }
    }
    // add event listeners to buttons that show keywords
    let buttons = document.getElementsByClassName('seeKeywords');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            modal.style.visibility = 'visible';
            modalContent.innerHTML = '';
            let modalText = escapeHTML(document.getElementsByClassName(this.id)[1].innerText);
            let p = document.createElement('p');
            p.innerHTML = modalText;
            modalContent.appendChild(p);
        });
    }
    // change button functionality
    let button = document.getElementById('button');
    button.title = 'Palaa etusivulle';
    button.setAttribute('onclick', 'home()');
}

function escapeHTML(str) {
    for (let i = 0; i < str.length; i++) {
        if (str[i] == '&') {
            if (str[i + 1] == '#') {
                // do nothing, this is an html entity
            } else {
                str[i] = '&amp;';
            }
        }
    }
    let str2 = str.replace(/</g, '&lt;');
    let str3 = str2.replace(/>/g, '&gt;');
    let str4 = str3.replace(/"/g, '&quot;');
    let newStr = str4.replace(/'/g, '&#x27;')
    for (let i = 0; i < newStr.length; i++) {
        if (newStr[i] == '/') {
            newStr[i] = '&#x2F;';
        }
    }
    return newStr;
}

// close modal if user clicks outside modal content box
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.visibility = 'hidden';
    }
});