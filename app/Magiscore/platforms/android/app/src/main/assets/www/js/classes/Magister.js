class Magister {
    /**
     * @private
     * @param {String} tenant
     * @param {String} token
     * 
     */
    constructor(tenant, token) {
        /**
         * @type {String}
         * @readonly
         */
        this.tenant = tenant.replace("\"", "").replace("\"", "")
        /**
         * @type {String}
         * @readonly
         */
        this.token = token
        /**
         * @type {Object}
         * @readonly
         */
        this.person = {}

        /**
         * @type {Object}
         * @readonly
         */
        this.account = {}

        this.timedOut = false
    }

    /**
     * @returns {Promise<Object[]>}
     */
    getInfo() {
        return new Promise((resolve, reject) => {
            // logConsole(`https://${this.tenant}/api/account?noCache=0`)
            // logConsole("Bearer " + this.token)
            $.ajax({
                    "cache": false,
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": `https://${this.tenant}/api/account?nocache=${Date.parse(new Date())}`,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + this.token,
                        "noCache": (new Date()).getTime()
                    },
                    "error": function (XMLHttpRequest, textStatus, errorThrown) {
                        // alert("error: " + XMLHttpRequest.statusText)
                        if (XMLHttpRequest.readyState == 4) {
                            logConsole("[ERROR] HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)")
                            // alert("first: " + XMLHttpRequest.statusText)
                        } else if (XMLHttpRequest.readyState == 0) {
                            logConsole("[ERROR] Network error (i.e. connection refused, access denied due to CORS, etc.)")
                            // alert("second: " + XMLHttpRequest.statusText)
                            reject("no internet")
                        } else {
                            logConsole("[ERROR] something weird is happening")
                            // alert("third: " + XMLHttpRequest.statusText)
                        }
                    },
                    "timeout": 5000
                })
                .done((res) => {
                    this.person.isParent = res.Groep[0].Privileges.some(x =>
                        x.Naam.toLowerCase() === "kinderen" &&
                        x.AccessType.some(a => a.toLowerCase() === "read")
                    )
                    var res = res.Persoon || res.persoon
                    this.person.id = res.Id || res.id
                    this.person.firstName = res.Roepnaam || res.roepnaam
                    this.person.lastName = res.Achternaam || res.achternaam
                    this.namePrefix = res.Tussenvoegsel || res.tussenvoegsel
                    //this.fullName = res.Persoon.Naam || res.persoon.naam
                    //this.description = res.Persoon.Omschrijving || res.Persoon.Naam || res.Persoon.naam
                    //this.group = res.Persoon.Groep || res.persoon.groep)
                    resolve(this.person)
                })
        })
    }

    /**
     * @returns {Promise<Object>}
     */
    getAccountInfo() {
        return new Promise((resolve, reject) => {
            $.ajax({
                    "cache": false,
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": `https://${this.tenant}/api/sessions/current?nocache=${Date.parse(new Date())}`,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + this.token,
                        "noCache": (new Date()).getTime()
                    },
                    "error": function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.readyState == 4) {
                            logConsole("[ERROR] HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)")
                        } else if (XMLHttpRequest.readyState == 0) {
                            logConsole("[ERROR] Network error (i.e. connection refused, access denied due to CORS, etc.)")
                            reject("no internet")
                        } else {
                            logConsole("[ERROR] something weird is happening")
                        }
                    },
                    "timeout": 5000
                })
                .done((res) => {
                    // logConsole(JSON.stringify(res))
                    // logConsole(`[INFO]  https://${this.tenant}${res.links.account.href}?noCache=0`)
                    $.ajax({
                            "cache": false,
                            "dataType": "json",
                            "async": true,
                            "crossDomain": true,
                            "url": `https://${this.tenant}${res.links.account.href}?nocache=${Date.parse(new Date())}`,
                            "method": "GET",
                            "headers": {
                                "Authorization": "Bearer " + this.token,
                                "noCache": (new Date()).getTime()
                            },
                            "error": function (XMLHttpRequest, textStatus, errorThrown) {
                                if (XMLHttpRequest.readyState == 4) {
                                    logConsole("[ERROR] HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)")
                                } else if (XMLHttpRequest.readyState == 0) {
                                    logConsole("[ERROR] " + textStatus)
                                    logConsole("[ERROR] Network error (i.e. connection refused, access denied due to CORS, etc.)")
                                    reject("no internet")
                                } else {
                                    logConsole("[ERROR] something weird is happening")
                                }
                            },
                            "timeout": 5000
                        })
                        .done((res2) => {
                            // logConsole(JSON.stringify(res2))
                            this.account = {
                                "id": res2.id,
                                "name": res2.naam,
                                "uuId": res2.uuid,
                            }
                            resolve(this.account)
                        })
                })
        })
    }

    /**
     * @returns {Promise<Course[]>}
     */
    getCourses() {
        return new Promise((resolve, reject) => {
            if (this.person.id == undefined) reject("Person.id is undefined!")
            //logConsole(`https://${this.tenant}/api/personen/${this.person.id}`)
            $.ajax({
                    "cache": false,
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": `https://${this.tenant}/api/personen/${this.person.id}/aanmeldingen?geenToekomstige=false&nocache=${Date.parse(new Date())}`,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + this.token,
                        "noCache": (new Date()).getTime()
                    },
                    "error": function (XMLHttpRequest, textStatus, errorThrown) {
                        // alert("error: " + XMLHttpRequest.statusText)
                        if (XMLHttpRequest.readyState == 4) {
                            logConsole("[ERROR] HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)")
                            // alert("first: " + XMLHttpRequest.statusText)
                        } else if (XMLHttpRequest.readyState == 0) {
                            logConsole("[ERROR] Network error (i.e. connection refused, access denied due to CORS, etc.)")
                            // alert("second: " + XMLHttpRequest.statusText)
                            reject("no internet")
                        } else {
                            logConsole("[ERROR] something weird is happening")
                            // alert("third: " + XMLHttpRequest.statusText)
                        }
                    },
                    "timeout": 5000
                })
                .done((res) => {
                    var res = res.items || res.Items
                    resolve(_.sortBy(res.map(c => new Course(this, c)), 'start'))
                })
        })
    }

    setTimeOut() {
        setTimeout(function () {
            this.timedOut = false;
            logConsole("[INFO]   Timeout ended")
        }, 31000);
    }
}