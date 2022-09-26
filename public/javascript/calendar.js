let startMonth = document.getElementById('startMonth');
let endMonth = document.getElementById('endMonth');
showCalendar(startMonth.value, 'start');
showCalendar(endMonth.value, 'end');

function showCalendar(para1, para2) {
    // para1 contains year and month in a string object 'YYYY-MM', para2 is a string containing value 'start' or 'end'
    // check that para2 is a valid string object
    if (para2 === 'start' || para2 === 'end') {
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
        let id = 'calendar-body-' + para2;
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
                // fill cell with date information and assign required attributes (cell id and onclick function)
                else {
                    let cell = document.createElement('td');
                    let cellText = document.createTextNode(date);
                    let cellId = document.createAttribute('id');
                    cellId.value = para2 + 'day' + date;
                    let cellAtt = document.createAttribute('onclick');
                    cellAtt.value = para2 + 'Query(\''+ year + '-' + queryMonth + '-' + addZero(date) + '\')';
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    cell.setAttributeNode(cellId);
                    cell.setAttributeNode(cellAtt);
                    date++;
                }
            }
            // appends each row into calendar body
            tbl.appendChild(row); 
        }
    }
}