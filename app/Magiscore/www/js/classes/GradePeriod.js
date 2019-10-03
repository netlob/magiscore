class GradePeriod {
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
        this.id = toString(raw.Id)
        /**
         * @type {Date}
         * @readonly
         */
        this.begin = parseDate(raw.Start)
        /**
         * @type {Date}
         * @readonly
         */
        this.end = parseDate(raw.Einde || raw.end)
        /**
         * @type {String}
         * @readonly
         * @default ''
         */
        this.name = _.trim(raw.Naam || raw.name)
        /**
         * @type {String}
         * @readonly
         * @default ''
         */
        this.description = _.trim(raw.Omschrijving || raw.description)
    }
}