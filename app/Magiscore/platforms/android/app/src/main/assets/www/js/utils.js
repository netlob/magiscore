function parseDate(val) {
    //logConsole(val)
    const n = Date.parse(val)
    if (!isNaN(n)) {
        return new Date(n)
    }
}

function toString(val) {
    if (val == null) {
        return val
    } else {
        return val.toString()
    }
}

function setObject(key,value,index) {
    var json = JSON.parse(localStorage.getItem(index) ?? JSON.stringify({}))
    json[key] = value;
    localStorage.setItem(index, JSON.stringify(json));
}

function getObject(key,index) {
    try {
        if (!JSON.parse(localStorage.getItem(index)).hasOwnProperty(key)) { return null }
        return (JSON.parse(localStorage.getItem(index)))[key] 
    } catch (e) {
        return null;
    }
}

function clearObject(index) {
    localStorage.removeItem(index);
}

function getActiveAccount() {
    try {
    var storage = Object.entries(localStorage).filter((key) => !isNaN(key[0])).filter((account) => JSON.parse(JSON.parse(account[1]).config).currentviewed == true)
    if (storage.length > 0) {
        return storage[0][0]
    } else if (localStorage.length != 0 && Object.entries(localStorage).filter((key) => !isNaN(key[0])).length > 0) {
        //Er is iets helemaal mis en geen enkel account is actief.
        var accountWithCourses = Object.entries(localStorage).filter((key) => !isNaN(key[0])).filter((account) => JSON.parse(account[1]).hasOwnProperty('courses'))
        if (accountWithCourses.length > 0) {changeActiveAccount(accountWithCourses[0][0]); return accountWithCourses[0][0]} else {ForceSetFromStorage()}
    }} catch(e) {}
}

async function ForceSetFromStorage() {
    //Er is geen elke account dat nog cijfers heeft, dus wordt er een poging gedaan om de cijfers uit de opslag van de telefoon te halen.
    var userkey = Object.entries(localStorage).filter((key) => !isNaN(key[0]))[0][0];
    var allfiles = await listFiles();
    var file = (await allfiles.filter((file) => file.name == `${userkey}.json`))[0];
    localStorage.setItem(userkey, await readFile(file));
    window.location = './index.html';
}

function getActiveChildAccount() {
    return JSON.parse(getObject('config', parseInt(getActiveAccount()))).childActiveViewed
}

function changeActiveAccount(to, childindex = -1) {
    for (key of Object.keys(localStorage).filter((key) => !isNaN(key))) {
        var obj = JSON.parse(getObject("config", key));
        if (key == to) {
          obj.currentviewed = true;
          setObject("config",JSON.stringify(obj),key);
        } else {
          obj.currentviewed = false;
          setObject("config",JSON.stringify(obj),key);
        }
        if (childindex >= 0) {
            var activeaccountindex = Object.entries(localStorage).filter((key) => !isNaN(key[0])).filter((account) => JSON.parse(JSON.parse(account[1]).config).currentviewed == true)[0][0];
            var obj = JSON.parse(getObject("config", activeaccountindex));
            if (key == to) {
              obj.childActiveViewed = childindex;
              setObject("config",JSON.stringify(obj), activeaccountindex);
            }
        }
    }
}