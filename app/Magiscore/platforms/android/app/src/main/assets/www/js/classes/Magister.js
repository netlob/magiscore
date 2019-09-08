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
        this.timedOut = false
    }

    /**
     * @returns {Promise<Object[]>}
     */
    getInfo() {
        return new Promise((resolve, reject) => {
            // logConsole(`https://${this.tenant}/api/account?noCache=0`)
            $.ajax({
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": `https://${this.tenant}/api/account?noCache=0`,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + this.token
                    },
                    "error": function (request, status, error) {
                        reject(error)
                    }
                })
                .done((res) => {
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
     * @returns {Promise<Course[]>}
     */
    getCourses() {
        return new Promise((resolve, reject) => {
            if (this.person.id == undefined) reject("Person.id is undefined!")
            logConsole(`https://${this.tenant}/api/personen/${this.person.id}`)
            $.ajax({
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": `https://${this.tenant}/api/personen/${this.person.id}/aanmeldingen?geenToekomstige=false`,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + this.token
                    },
                    "error": function (request, status, error) {
                        reject(error)
                    }
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
            logConsole("stopped timeout")
        }, 31000);
    }
}