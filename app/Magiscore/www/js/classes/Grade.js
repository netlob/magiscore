class Grade {
  /**
   * @private
   * @param {Magister} magister
   * @param {Object} raw
   * @param {String} courseId
   */
  constructor(magister, raw, courseId) {
    //super(magister)

    /**
     * Should be set by {@link Course.grades}!
     * @type {String}
     * @private
     */
    this._fillUrl = undefined;
    this._magister = magister;

    this.courseId = courseId;

    /**
     * @type {String}
     * @readonly
     */
    this.id = toString(raw.CijferId);
    /**
     * @type {String}
     * @readonly
     */
    this.grade = raw.CijferStr;
    /**
     * @type {Boolean}
     * @readonly
     */
    this.passed = raw.IsVoldoende;
    /**
     * @type {Date}
     * @readonly
     */
    this.dateFilledIn = parseDate(raw.DatumIngevoerd);

    /**
     * @type {Class}
     * @readonly
     */
    if (raw.Vak == undefined) {
      // errorConsole(JSON.stringify(raw))
    } else {
      // logConsole(JSON.stringify(raw))
      this.class = new Class(magister, raw.Vak);
    }

    /**
     * @type {Boolean}
     * @readonly
     */
    this.atLaterDate = raw.Inhalen;
    /**
     * @type {Boolean}
     * @readonly
     */
    this.exemption = raw.Vrijstelling;
    /**
     * @type {Boolean}
     * @readonly
     */
    this.counts = raw.TeltMee;

    /**
     * @type {GradePeriod}
     * @readonly
     * @default null
     */
    this.period =
      raw.Periode == null ? null : new GradePeriod(magister, raw.Periode);

    /**
     * @type {GradeType}
     * @readonly
     * @default null
     */
    this.type =
      raw.CijferKolom == null ? null : new GradeType(magister, raw.CijferKolom);

    /**
     * @type {String}
     * @readonly
     */
    this.assignmentId = toString(raw.CijferKolomIdEloOpdracht);

    /**
     * @type {Person}
     * @readonly
     */
    this.teacher = new Person(
      magister,
      {
        Docentcode: raw.Docent
      },
      3
    );

    /**
     * @type {Boolean}
     * @readonly
     */
    this.classExemption = raw.VakDispensatie || raw.VakVrijstelling;

    /**
     * Value will be set by {@link fill}
     * @type {String}
     * @default ''
     */
    this.description = "";
    /**
     * Value will be set by {@link fill}
     * @type {String}
     * @default 0
     */
    this.weight = 0;
    /**
     * Value will be set by {@link fill}
     * @type {Date}
     * @default undefined
     */
    this.testDate = undefined;

    this._filled = false;
    this._filling = false;
  }

  /**
   * @returns {Promise<Grade>}
   */
  fill(logId) {
    if (logId) logConsole(`[INFO]  Resuming grade            (${this.id})`);
    this._filling = true;
    return new Promise((resolve, reject) => {
      if (this._filled) {
        resolve(this);
      }
      $.ajax({
        cache: false,
        dataType: "json",
        async: true,
        crossDomain: true,
        url: `https://${this._magister.tenant}/api/personen/${this._magister.person.id}/aanmeldingen/${this.courseId}/cijfers/extracijferkolominfo/${this.type.id}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + tokens.access_token,
          noCache: new Date().getTime()
        },
        error: jqXHR => {
          this._filling = false;
          if (jqXHR.status == 429) {
            var secs =
              jqXHR.responseText.isJSON() &&
              JSON.parse(jqXHR.responseText).SecondsLeft > -1
                ? parseInt(JSON.parse(jqXHR.responseText).SecondsLeft) + 3
                : 30;
            fillTimeout(secs); //parseInt(JSON.parse(jqXHR.responseText).SecondsLeft) + 2
            this._filling = false;
            logConsole(
              `[ERROR] Grade fill timeout (${this.id}) (${jqXHR.responseText})`
            );
            setTimeout(() => {
              this.fill(true).then(grade => {
                hideTimeout();
                resolve(grade);
              });
            }, secs * 1000);
          } else {
            reject(jqXHR.status);
          }
        }
      }).done(res => {
        try {
          this.testDate = parseDate(res.WerkinformatieDatumIngevoerd);
          this.description = _.trim(
            res.WerkInformatieOmschrijving || res.KolomOmschrijving
          );
          this.weight = (Math.round(Number.parseFloat(res.Weging, 10) * 100) / 100) || 0; // 0.50 --> 0.5 + 1.477 --> 1.48

          this.type["level"] = res.KolomNiveau;
          this.type["description"] = _.trim(res.KolomOmschrijving);

          this._filled = true;
          if (logId)
            logConsole(`[INFO]  Grade succesfuly refilled (${this.id})`);
          resolve(this);
          return this;
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
/**
 * @private
 */
String.prototype.isJSON = function(str) {
  try {
    JSON.parse(this);
  } catch (e) {
    return false;
  }
  return true;
};
