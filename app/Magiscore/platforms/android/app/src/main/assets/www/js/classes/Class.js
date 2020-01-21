class Class {
  /**
   * @private
   * @param {Magister} magister
   * @param {Object} raw
   * @param {Object} grade
   */
  constructor(magister, raw, grade) {
    if (raw == undefined) logConsole("Undefined -> " + JSON.stringify(grade));

    /**
     * @type {String}
     * @readonly
     */
    // logConsole(JSON.stringify(raw))
    this.id = toString(raw.id || raw.Id);
    /**
     * @type {Date}
     * @readonly
     */
    this.beginDate = parseDate(raw.begindatum);
    /**
     * @type {Date}
     * @readonly
     */
    this.endDate = parseDate(raw.einddatum);
    /**
     * @type {String}
     * @readonly
     */
    this.abbreviation = raw.afkorting || raw.Afkorting;
    /**
     * @type {String}
     * @readonly
     */
    this.description = raw.omschrijving || raw.Omschrijving;
    /**
     * @type {Number}
     * @readonly
     */
    this.number = raw.volgnr || raw.Volgnr;
    /**
     * @type {Person}
     * @readonly
     */
    this.teacher = raw.docent;
    /**
     * @type {Boolean}
     * @readonly
     */
    this.hasClassExemption = raw.VakDispensatie || raw.VakVrijstelling;
  }
}
