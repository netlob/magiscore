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
    for (key of Object.keys(localStorage).filter((key) => !isNaN(key))) {
        var account = JSON.parse(localStorage.getItem(key) ?? JSON.stringify({}))
        if (account.hasOwnProperty('config') && JSON.parse(account['config']).currentviewed == true) {
            return key
        }
    }
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