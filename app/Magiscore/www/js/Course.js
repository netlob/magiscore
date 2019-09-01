class Course {
    /**
     * @private
     * @param {Magister} magister
     * @param {Object} raw
     */
    constructor(magister, raw) {

        //super(magister)

        /**
         * @type {String}
         * @readonly
         */
        this.id = toString(raw.id || raw.Id)

        this._magister = magister

        /**
         * @type {Date}
         * @readonly
         */
        this.start = parseDate(raw.Start || raw.start)
        /**
         * @type {Date}
         * @readonly
         */
        this.end = parseDate(raw.Einde || raw.start)

        /**
         * The school year of this course, e.g: '1617'
         * @type {String}
         * @readonly
         */
        this.schoolPeriod = raw.Lesperiode || raw.lesperiode

        /**
         * Basic type information of this course, e.g: { description: "VWO 6", id: 420 }
         * @type {{ description: String, id: Number }}
         * @readonly
         */
        this.type = ({
            id: raw.studie.id || raw.Studie.Id,
            description: raw.studie.omschrijving || raw.Studie.Omschrijving,
        })

        /**
         * The group of this course, e.g: { description: "Klas 6v3", id: 420, locationId: 0 }
         * @type {{ description: String, id: Number, LocatieId: Number }}
         * @readonly
         */
        this.group = ({
            id: raw.groep.id || raw.Groep.Id,
            get description() {
                const group = raw.Groep.Omschrijving || raw.groep.omschrijving
                return group != null ?
                    group.split(' ').find(w => /\d/.test(w)) || group :
                    null
            },
            locationId: raw.Groep.LocatieId || raw.groep.locatieid,
        })

        /**
         * @type {String[]}
         * @readonly
         */
        this.curricula = _.compact([(raw.Profiel || raw.profiel), (raw.Profiel2 || raw.profiel2)])

        /**
         * @type {Object[]}
         * @readonly
         */
        this.raw = raw
    }

    /**
     * @type {boolean}
     * @readonly
     */
    current() {
        const now = new Date()
        return this.start <= now && now <= this.end
    }

    /**
     * @returns {Promise<Object[]>}
     */
    classes() {
        logConsole(raw)
        return new Promise((resolve, reject) => {
            // logConsole("person id " + this._magister.person.id)
            const url = `https://${this._magister.tenant}.magister.net/api/personen/${this._magister.person.id}/aanmeldingen/${this.id}/vakken`
            $.ajax({
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": url,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + this._magister.token
                    },
                    "error": function (request, status, error) {
                        errorConsole(request.status)
                        errorConsole(error)
                        errorConsole(status)
                    }
                })
                .done((res) => {
                    resolve(res.map(c => new Class(this._magister, c)))
                })
        })
    }

    /**
     * @param {Object} [options={}]
     * 	@param {boolean} [options.fillGrades=true]
     *  @param {boolean} [options.latest=false]
     * @returns {Promise<Grade[]>}
     */
    grades({
        fillGrades = true,
        latest = false
    } = {}) {
        return new Promise((resolve, reject) => {
            logConsole("RAW:")
            logConsole(JSON.stringify(this.raw))
            var date = this.current() ? formatDate(new Date()) : this.raw.Einde
            const urlPrefix = `https://${this._magister.tenant}.magister.net/api/personen/${this._magister.person.id}/aanmeldingen/${this.id}/cijfers`
            const url = latest ?
                `https://${this._magister.tenant}.magister.net/api/personen/${this._magister.person.id}/cijfers/laatste?top=50&skip=0` :
                `${urlPrefix}/cijferoverzichtvooraanmelding?actievePerioden=false&alleenBerekendeKolommen=false&alleenPTAKolommen=false&peildatum=${date}`
            // logConsole(url)
            $.ajax({
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": url,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + this._magister.token
                    },
                    "error": function (request, status, error) {
                        errorConsole(request.status)
                        errorConsole(error)
                        errorConsole(status)
                    }
                })
                .done((res) => {
                    var grades = res.Items
                    grades = _.reject(grades, raw => raw.CijferId === 0)

                    const promises = grades.map(raw => {
                        const grade = new Grade(this._magister, raw)
                        grade._fillUrl = `${urlPrefix}/extracijferkolominfo/${_.get(raw, 'CijferKolom.Id')}`
                        return fillGrades ? grade.fill() : grade
                    })
                    Promise.all(promises).then(grades => {
                        resolve(grades)
                    })
                })
        })

    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}