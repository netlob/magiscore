class Course {
    /**
     * @private
     * @param {Magister} magister
     * @param {Object} raw
     */
    constructor(magister, raw) {

        //super(magister)
        this._magister = magister

        /**
         * @type {String}
         * @readonly
         */
        this.id = toString(raw.Id)

        /**
         * @type {Date}
         * @readonly
         */
        this.start = parseDate(raw.Start)
        /**
         * @type {Date}
         * @readonly
         */
        this.end = parseDate(raw.Einde)

        /**
         * The school year of this course, e.g: '1617'
         * @type {String}
         * @readonly
         */
        this.schoolPeriod = raw.Lesperiode

        /**
         * Basic type information of this course, e.g: { description: "VWO 6", id: 420 }
         * @type {{ description: String, id: Number }}
         * @readonly
         */
        this.type = ({
            id: raw.Studie.Id,
            description: raw.Studie.Omschrijving,
        })

        /**
         * The group of this course, e.g: { description: "Klas 6v3", id: 420, locationId: 0 }
         * @type {{ description: String, id: Number, LocatieId: Number }}
         * @readonly
         */
        this.group = ({
            id: raw.Groep.Id,
            get description() {
                const group = raw.Groep.Omschrijving
                return group != null ?
                    group.split(' ').find(w => /\d/.test(w)) || group :
                    null
            },
            locationId: raw.Groep.LocatieId,
        })

        /**
         * @type {String[]}
         * @readonly
         */
        this.curricula = _.compact([raw.Profiel, raw.Profiel2])

        /**
         * @type {Object[]}
         * @readonly
         */
        this.raw = raw

        logConsole("-----------")
        logConsole(JSON.stringify(this.raw))
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
        latest = false,
        firstTime = false
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
                    logConsole("got grades")
                    grades = _.reject(grades, raw => raw.CijferId === 0)
                    logConsole("reject works")
                    const promises = grades.map(raw => {
                        const grade = new Grade(this._magister, raw)
                        grade._fillUrl = `${urlPrefix}/extracijferkolominfo/${_.get(raw, 'CijferKolom.Id')}`
                        //errorConsole(grade._fillUrl)
                        return fillGrades ? grade.fill() : grade
                    })
                    logConsole("making promises works")
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