class Grade {
    /**
     * @private
     * @param {Magister} magister
     * @param {Object} raw
     */
    constructor(magister, raw) {
        //super(magister)

        /**
         * Should be set by {@link Course.grades}!
         * @type {String}
         * @private
         */
        this._fillUrl = undefined
        this._magister = magister

        /**
         * @type {String}
         * @readonly
         */
        this.id = toString(raw.CijferId)
        /**
         * @type {String}
         * @readonly
         */
        this.grade = raw.CijferStr
        /**
         * @type {Boolean}
         * @readonly
         */
        this.passed = raw.IsVoldoende
        /**
         * @type {Date}
         * @readonly
         */
        this.dateFilledIn = parseDate(raw.DatumIngevoerd)

        /**
         * @type {Class}
         * @readonly
         */
        this.class = new Class(magister, raw.Vak)

        /**
         * @type {Boolean}
         * @readonly
         */
        this.atLaterDate = raw.Inhalen
        /**
         * @type {Boolean}
         * @readonly
         */
        this.exemption = raw.Vrijstelling
        /**
         * @type {Boolean}
         * @readonly
         */
        this.counts = raw.TeltMee

        /**
         * @type {GradePeriod}
         * @readonly
         * @default null
         */
        this.period = raw.Periode == null ? null : new GradePeriod(magister, raw.Periode)

        /**
         * @type {GradeType}
         * @readonly
         * @default null
         */
        this.type = raw.CijferKolom == null ? null : new GradeType(magister, raw.CijferKolom)

        /**
         * @type {String}
         * @readonly
         */
        this.assignmentId = toString(raw.CijferKolomIdEloOpdracht)

        /**
         * @type {Person}
         * @readonly
         */
        this.teacher = new Person(magister, {
            Docentcode: raw.Docent
        }, 3)

        /**
         * @type {Boolean}
         * @readonly
         */
        this.classExemption = raw.VakDispensatie || raw.VakVrijstelling

        /**
         * Value will be set by {@link fill}
         * @type {String}
         * @default ''
         */
        this.description = ''
        /**
         * Value will be set by {@link fill}
         * @type {String}
         * @default 0
         */
        this.weight = 0
        /**
         * Value will be set by {@link fill}
         * @type {Date}
         * @default undefined
         */
        this.testDate = undefined
    }

    // TODO: add ability to fill persons
    /**
     * @returns {Promise<Grade>}
     */
    fill() {
        return new Promise((resolve, reject) => {
            if (this._filled) {
                resolve(this)
            }
            //errorConsole(this._magister.token)
            $.ajax({
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "url": this._fillUrl,
                    "method": "GET",
                    "headers": {
                        "Authorization": "Bearer " + this._magister.token
                    },
                    "error": function (jqXHR, statusCode, error) {
                        errorConsole(status)
                        // reject(error)
                    },
                    "statusCode": {
                        429: function () {
                            errorConsole("429: too many requests")
                        }
                    }
                })
                .done((res) => {
                    this.testDate = parseDate(res.WerkinformatieDatumIngevoerd)
                    this.description = _.trim(res.WerkInformatieOmschrijving)
                    this.weight = Number.parseInt(res.Weging, 10) || 0

                    this.type.level = res.KolomNiveau
                    this.type.description = _.trim(res.KolomOmschrijving)

                    this._filled = true
                    resolve(this)
                })
        })

    }
}