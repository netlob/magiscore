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
    for (key of Object.keys(localStorage)) {
        var account = JSON.parse(localStorage.getItem(key) ?? JSON.stringify({}))
        if (JSON.parse(account['config']).currentviewed == true) {
            return key
        }
    }
}

function changeActiveAccount(to) {
    for (key of Object.keys(localStorage)) {
        var obj = JSON.parse(getObject("config", key));
        if (key == to) {
          obj.currentviewed = true;
          setObject("config",JSON.stringify(obj),key);
        } else {
          obj.currentviewed = false;
          setObject("config",JSON.stringify(obj),key);
        }
    }
}