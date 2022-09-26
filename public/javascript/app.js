var query = {
    startDate: '',
    endDate: ''
};

const moodNames = {
    'color1': 'Vihainen',
    'color2': 'Ärtynyt',
    'color3': 'Hilpeä',
    'color4': 'Iloinen',
    'color5': 'Apea',
    'color6': 'Synkkä',
    'color7': 'Ahdistunut',
    'color8': 'Turtunut'
}

function validateForm() {
    let username = document.forms['userForm']['username'].value;
    let password = document.forms['userForm']['password'].value;
    if (username.trim() == '') {
        document.getElementsByClassName('basic')[0].innerHTML = 'Käyttäjätunnus puuttuu';
        return false;
    }
    if (password == '') {
        document.getElementsByClassName('basic')[0].innerHTML = 'Salasana puuttuu';
        return false;
    }
}

function checkLatest() {
    let latest = document.getElementById('color3').getElementsByTagName('p')[0].innerHTML;
    let latestDate = latest.slice(20, 30);
    let arr = latestDate.split('.');
    let compare = new Date(arr[2], parseInt(arr[1]) - 1, parseInt(arr[0]));
    let now = new Date();
    if (compare > now) {
        let link = document.getElementById('color3').getElementsByTagName('a')[0];
        link.removeAttribute('href');
        let linkClass = document.createAttribute('class');
        linkClass.value = 'disabled';
        link.setAttributeNode(linkClass);
    }
}

function startQuery(date) {
    // fill out start date for database query
    query['startDate'] = date;
    // remove highlight from previously chosen date
    let classList = document.getElementsByClassName('chosenstart');
    let i = 0;
    while (i < classList.length) {
        classList[i].removeAttribute('class', 'chosenstart')
    };
    // highlight chosen date
    document.getElementById('startday' + date).setAttribute('class', 'chosenstart');
    // check that query dates are in order
    if (query['endDate'] !== '') {
        checkDates('Aloituspäivämäärä ei voi olla myöhemmin kuin lopetuspäivämäärä!');
    }
}

function endQuery(date) {
    // fill out end date for database query
    query['endDate'] = date;
    // remove highlight from previously chosen date
    let classList = document.getElementsByClassName('chosenend');
    let i = 0;
    while (i < classList.length) {
        classList[i].removeAttribute('class', 'chosenend')
    };
    // highlight chosen date
    document.getElementById('endday' + date).setAttribute('class', 'chosenend');
    // check that query dates are in order
    if (query['startDate'] !== '') {
        checkDates('Lopetuspäivämäärä ei voi olla aiemmin kuin aloituspäivämäärä!');
    }
}

function checkDates(warning) {
    let button = document.getElementById('button');
    // establish variables for running checks
    let startyear = query['startDate'].slice(0, 4);
    let startmonth = parseInt(query['startDate'].slice(5, 7));
    let startday = parseInt(query['startDate'].slice(8, 10));
    let endyear = query['endDate'].slice(0, 4);
    let endmonth = parseInt(query['endDate'].slice(5, 7));
    let endday = parseInt(query['endDate'].slice(8, 10));
    // check that end date is not earlier than start date
    if (endyear < startyear) {
        alert(warning);
        button.disabled = true;
        button.title = warning;
    } else if (endyear === startyear) {
        if (endmonth < startmonth) {
            alert(warning);
            button.disabled = true;
            button.title = warning;
        } else if (endmonth === startmonth) {
            if (endday < startday) {
                alert(warning);
                button.disabled = true;
                button.title = warning;
            } else {
                // same year, same month, startday not later than endday; query submittal possible
                button.disabled = false;
                button.title = 'Katso tarkemmat tiedot';
            }
        } else {
            // same year, endmonth is larger than startmonth; query submittal possible
            button.disabled = false;
            button.title = 'Katso tarkemmat tiedot';
        }
    } else {
        // endyear is larger than startyear; query submittal possible
        button.disabled = false;
        button.title = 'Katso tarkemmat tiedot';
    }
}

function showResults(path) {
    // submit data stored in query to database
    sendToDatabase(path, query);
}

function home() {
    window.location.replace('/');
}

function sendToDatabase(path, params, method='post') {
    // create an invisible form and send a post request to the address of path
    const form = document.createElement('form');
    form.method = method;
    form.action = path;
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];
            form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    form.submit();
}

function addZero(num) {
    // if number is between 0-9 add 0 to string
    return (num >= 0 && num < 10) ? '0' + num : num;
}