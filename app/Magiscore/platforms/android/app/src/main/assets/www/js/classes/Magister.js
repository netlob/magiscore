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
    }

    /**
     * @returns {Promise<Object[]>}
     */
    getInfo() {
        return new Promise((resolve, reject) => {
            // logConsole(`https://${this.tenant}.magister.net/api/account?noCache=0`)
            $.ajax({
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": `https://${this.tenant}.magister.net/api/account?noCache=0`,
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
            $("#loader pre").append("<small>https://${this.tenant}.magister.net/api/personen/${this.person.id}<small>\n")
            $.ajax({
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": `https://${this.tenant}.magister.net/api/personen/${this.person.id}/aanmeldingen?geenToekomstige=false`,
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
                    // logConsole("Courses.length: " + res.length)
                    res.splice(-1, 1) // DIT HAALT DE LAATSTE UIT HET ARRAY




                    // logConsole(JSON.stringify(res[0]))
                    // logConsole("---------------")
                    // logConsole(JSON.stringify(res[1]))
                    // logConsole("---------------")
                    // logConsole(JSON.stringify(res[2]))
                    // logConsole("---------------")
                    // logConsole(JSON.stringify(res[3]))
                    // logConsole("---------------")
                    // logConsole(JSON.stringify(res[4]))
                    _.sortBy(res.map(course => new Course(this, course), 'start'))
                })
        })
    }
}