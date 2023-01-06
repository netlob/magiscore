class GradePeriod2 {
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
      this.id = toString(raw.Id);
      /**
       * @type {String}
       * @readonly
       * @default ''
       */
      this.name = _.trim(raw.Naam || raw.name);
    }
  }
  