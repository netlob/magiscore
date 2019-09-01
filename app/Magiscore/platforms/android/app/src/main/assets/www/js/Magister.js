class Magister {
    /**
     * @private
     * @param {String} school
     * 
     */
    constructor(tenant, token) {
        /**
         * @type {String}
         * @readonly
         */
        this.tenant = tenant
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
    info() {
        return new Promise((resolve, reject) => {
            $.ajax({
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": `https://${this.tenant}.magister.net/api/account?noCache=0`,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + this.token
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
                    //this.group = res.Persoon.Groep || res.persoon.groep
                    logConsole(this.person)
                    resolve(this.person)
                })
        })
    }

    /**
     * @returns {Promise<Course[]>}
     */
    courses() {
        return new Promise((resolve, reject) => {
            $.ajax({
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": `https://${this.tenant}.magister.net/api/personen/${this.person.id}/aanmeldingen?geenToekomstige=false`,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + this.token
                    }
                })
                .done((res) => {
                    var res = res.items || res.Items
                    logConsole("Courses.length: " + res.length)
                    logConsole(JSON.stringify(res))
                    resolve(res.map(c => new Course(this, c)))
                })
        })
    }
}