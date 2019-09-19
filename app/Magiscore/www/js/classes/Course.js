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

        var group = raw.Groep.Omschrijving

        /**
         * The group of this course, e.g: { description: "Klas 6v3", id: 420, locationId: 0 }
         * @type {{ description: String, id: Number, LocatieId: Number }}
         * @readonly
         */
        this.group = {
            id: raw.Groep.Id,
            // description: raw.Groep.Omschrijving,
            // code: raw.Groep.code,
            // description() {
            //     const group = raw.Groep.Omschrijving
            //     return group //  != undefined ?
            //     //group.split(' ').find(w => /\d/.test(w)) || group :
            //     //undefined
            // }
            description: group == undefined ? undefined : (group.split(' ').find(w => /\d/.test(w)) || group),
            locationId: raw.Groep.LocatieId,
        }
        // logConsole(JSON.stringify(this.group))

        /**
         * @type {String[]}
         * @readonly
         */
        this.curricula = _.compact([raw.Profiel, raw.Profiel2])
        //logConsole("curricula " + this.curricula)

        /**
         * @type {Object[]}
         * @readonly
         */
        this.raw = raw

        /**
         * @type {Object[]}
         * @readonly
         */
        this.classes = []

        /**
         * @type {Object[]}
         * @readonly
         */
        this.grades = []
    }
    static create() {
        return Object.create(this.prototype);
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
    getClasses() {
        return new Promise((resolve, reject) => {
            // logConsole("person id " + this._magister.person.id)
            const url = `https://${this._magister.tenant}/api/personen/${this._magister.person.id}/aanmeldingen/${this.id}/vakken`
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
                        reject(error)
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
    getGrades({
        fillGrades = false,
        latest = false
    } = {}) {
        return new Promise((resolve, reject) => {
            // logConsole("RAW:")
            // logConsole(JSON.stringify(this.raw))
            var date = this.current() ? formatDate(new Date()) : this.raw.Einde
            const urlPrefix = `https://${this._magister.tenant}/api/personen/${this._magister.person.id}/aanmeldingen/${this.id}/cijfers`
            const url = latest ?
                `https://${this._magister.tenant}/api/personen/${this._magister.person.id}/cijfers/laatste?top=50&skip=0` :
                `${urlPrefix}/cijferoverzichtvooraanmelding?actievePerioden=false&alleenBerekendeKolommen=false&alleenPTAKolommen=false&peildatum=${date}`
            logConsole("URL: " + url)


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
                        reject(request.status)
                    }
                })
                .done((res) => {
                    var grades = res.Items || res.items
                    grades = _.reject(grades, raw => raw.CijferId === 0)
                    grades = grades.map(raw => {
                        const grade = new Grade(this._magister, raw, this.id)
                        grade._fillUrl = `${urlPrefix}/extracijferkolominfo/${_.get(raw, 'CijferKolom.Id')}`
                        raw = grade
                        return grade
                    })
                    resolve(grades)
                    //logConsole(JSON.stringify(grades[0]))
                    // grades.forEach(grade => {
                    //     grade._filled = false;
                    //     grade._filling = false;
                    //     while (!grade._filled) {
                    //         if (!grade._filling && !this._magister.timedOut) {
                    //             grade.fill()
                    //         }
                    //     }

                    // });

                    // const promises = grades.map(raw => {
                    //     const grade = new Grade(this._magister, raw, this.id)
                    //     //grade._fillUrl = `${urlPrefix}/extracijferkolominfo/${raw._fillUrl}`
                    //     grade._fillUrl = raw._fillUrl
                    //     logConsole(JSON.stringify(grade))
                    //     //errorConsole(grade._fillUrl)
                    //     return fillGrades ? grade.fill() : grade
                    // })
                    // Promise.all(promises).then(grades => {
                    //     resolve(grades)
                    // })
                })
        })

    }

    sortGrades() {
        var sorted = {}
        this.grades.forEach(grade => {
            //logConsole(grade)
            var vak = grade.class.description.capitalize()
            if (sorted[vak] == null) {
                sorted[vak] = []
            }
            if (sorted[vak][grade.type.header] == null) {
                sorted[vak][grade.type.header] = []
            }
            if (sorted[vak]['Grades'] == null) {
                sorted[vak]['Grades'] = []
            }
            if (sorted[vak]['Completed'] == null) {
                sorted[vak]['Completed'] = []
            }
            sorted[vak][grade.type.header].push(grade)
            if (grade.type._type == 1 && round(grade.grade) > 0 && round(grade.grade) < 11) {
                grade.exclude = viewController.config.exclude.includes(grade.id);
                //lessonController.allGrades.push(grade)
                sorted[vak]['Grades'].push(grade)
            }
            if (grade.type._type == 12 || grade.type._type == 4 && round(grade.grade) > -1 && round(grade.grade) < 101) {
                sorted[vak]['Completed'].push(grade)
            }

        })
        for (var vak in sorted) {
            var data = sorted[vak]
            var grades = data["Grades"]
            sorted[vak]["Lesson"] = new Lesson(vak, data, grades, lessonController, this)
        }
        return sorted
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