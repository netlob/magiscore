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
        this.person = null
    }

    /**
     * @returns {Promise<Object[]>}
     */
    info() {
        $.ajax({
                "dataType": "json",
                "async": true,
                "crossDomain": true,
                "url": `https://${this.tenant}.magister.net/api/account/${this.person.id}?noCache=0`,
                "method": "GET",
                "headers": {
                    "Authorization": "Bearer " + this.token
                }
            })
            .done(function (res) {
                this.person.id = res.Persoon.Id || res.persoon.id
                this.person.firstName = res.Persoon.Voornaam || res.persoon.voornaam
                this.person.lastName = res.Persoon.Achternaam || res.persoon.achternaam
                this.namePrefix = res.Persoon.Tussenvoegsel || res.persoon.tussenvoegsel
                this.fullName = res.Persoon.Naam || res.persoon.naam
                this.description = res.Persoon.Omschrijving || res.Persoon.Naam || res.Persoon.naam
                this.group = res.Persoon.Groep || res.persoon.groep
                return this.person
            })
    }

    /**
     * @returns {Promise<Course[]>}
     */
    courses() {
        $.ajax({
                "dataType": "json",
                "async": true,
                "crossDomain": true,
                "url": `https://${this.tenant}.magister.net/api/leerlingen/${this.person.id}/aanmeldingen`,
                "method": "GET",
                "headers": {
                    "Authorization": "Bearer " + this.token
                }
            })
            .done(function (res) {
                Promise.resolve(res.Items.map(c => new Course(this, c)))
            })
    }
}