class Course {
  /**
   * @private
   * @param {Magister} magister
   * @param {Object} raw
   */
  constructor(magister, raw) {
    //super(magister)
    this._magister = magister;

    /**
     * @type {String}
     * @readonly
     */
    this.id = toString(raw.Id);

    /**
     * @type {Date}
     * @readonly
     */
    this.start = parseDate(raw.Start);
    /**
     * @type {Date}
     * @readonly
     */
    this.end = parseDate(raw.Einde || raw.end);

    /**
     * The school year of this course, e.g: '1617'
     * @type {String}
     * @readonly
     */
    this.schoolPeriod = raw.Lesperiode || raw.schoolPeriod;

    /**
     * Basic type information of this course, e.g: { description: "VWO 6", id: 420 }
     * @type {{ description: String, id: Number }}
     * @readonly
     */
    this.type = {
      id: raw.Studie.Id || raw.type.id,
      description: raw.Studie.Omschrijving || raw.type.description,
    };

    var group = raw.Groep ? raw.Groep.Omschrijving : raw.group.description;

    /**
     * The group of this course, e.g: { description: "Klas 6v3", id: 420, locationId: 0 }
     * @type {{ description: String, id: Number, LocatieId: Number }}
     * @readonly
     */
    this.group = {
      id: raw.Groep.Id || raw.group.id,
      // description: raw.Groep.Omschrijving, code: raw.Groep.code, description() {
      //  const group = raw.Groep.Omschrijving     return group //  != undefined ?
      // //group.split(' ').find(w => /\d/.test(w)) || group :     //undefined }
      description:
        group == undefined
          ? undefined
          : group.split(" ").find((w) => /\d/.test(w)) || group,
      locationId: raw.Groep ? raw.Groep.LocatieId : raw.group.locationId,
    };
    // logConsole(JSON.stringify(this.group))

    /**
     * @type {String[]}
     * @readonly
     */
    this.curricula = raw.curricula || _.compact([raw.Profiel, raw.Profiel2]);
    //logConsole("curricula " + this.curricula)

    /**
     * @type {Object[]}
     * @readonly
     */
    this.raw = raw;

    /**
     * @type {Object[]}
     * @readonly
     */
    this.classes = raw.classes || [];

    /**
     * @type {Object[]}
     * @readonly
     */
    this.grades = raw.grades || [];
  }

  static create() {
    return Object.create(this.prototype);
  }

  /**
   * @type {boolean}
   * @readonly
   */
  current() {
    const now = new Date();
    return this.start <= now && now <= this.end;
  }

  /**
   * @returns {Promise<Object[]>}
   */
  getClasses(childindex = -1) {
    return new Promise((resolve, reject) => {
      // logConsole("person id " + this._magister.person.id)
      var personid =
        childindex >= 0 && this._magister.person.isParent
          ? this._magister.person.children[childindex].Id
          : this._magister.person.id;
      const url = `https://${
        this._magister.tenant
      }/api/personen/${personid}/aanmeldingen/${
        this.id
      }/vakken?nocache=${Date.parse(new Date())}`;
      $.ajax({
        cache: false,
        dataType: "json",
        async: true,
        crossDomain: true,
        url: url,
        method: "GET",
        headers: {
          Authorization: "Bearer " + tokens.access_token,
          noCache: new Date().getTime(),
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          if (XMLHttpRequest.readyState == 4) {
            logConsole(`[ERROR] HTTP error (${textStatus})`);
          } else if (XMLHttpRequest.readyState == 0) {
            logConsole(`[ERROR] Network error (${textStatus})`);
          } else {
            logConsole("[ERROR] something weird is happening");
          }
          reject("no internet");
        },
        timeout: 5000,
      }).done((res) => {
        resolve(res.map((c) => new Class(this._magister, c)));
      });
    });
  }

  /**
   * @param {Object} [options={}]
   * 	@param {boolean} [options.fillGrades=true]
   *  @param {boolean} [options.latest=false]
   * @returns {Promise<Grade[]>}
   */
  getGrades({ fillGrades = false, latest = false } = {}, childindex = -1) {
    return new Promise((resolve, reject) => {
      // logConsole("RAW:") logConsole(JSON.stringify(this.raw))
      var date = this.current() ? formatDate(new Date()) : this.raw.Einde;
      var personid =
        childindex >= 0 && this._magister.person.isParent
          ? this._magister.person.children[childindex].Id
          : this._magister.person.id;
      const urlPrefix = `https://cors.gemairo.app/https://${this._magister.tenant}/api/personen/${personid}/aanmeldingen/${this.id}/cijfers`;
      const url = latest
        ? `https://cors.gemairo.app/https://${
            this._magister.tenant
          }/api/personen/${
            this._magister.person.id
          }/cijfers/laatste?top=50&skip=0&nocache=${Date.parse(new Date())}`
        : `${urlPrefix}/cijferoverzichtvooraanmelding?actievePerioden=false&alleenBerekendeKolommen=false&alleenPTAKolommen=false&peildatum=${date}&nocache=${Date.parse(
            new Date()
          )}`;
      // logConsole("URL: " + url)

      $.ajax({
        cache: false,
        dataType: "json",
        async: true,
        crossDomain: true,
        url: url,
        method: "GET",
        headers: {
          Authorization: "Bearer " + tokens.access_token,
          noCache: new Date().getTime(),
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // alert("error: " + XMLHttpRequest.statusText)
          if (XMLHttpRequest.readyState == 4) {
            logConsole(`[ERROR] HTTP error (${textStatus})`);
          } else if (XMLHttpRequest.readyState == 0) {
            logConsole(`[ERROR] Network error (${textStatus})`);
          } else {
            logConsole("[ERROR] something weird is happening");
          }
          reject("no internet");
        },
        timeout: 5000,
      }).done((res) => {
        var grades = res.Items || res.items;
        grades = _.reject(grades, (raw) => raw.CijferId === 0);
        grades = grades
          .filter((raw) => {
            if (
              raw.CijferKolom &&
              raw.CijferKolom.Id > 0 &&
              raw.CijferKolom.KolomNaam &&
              raw.CijferKolom.KolomNummer
            )
              return true;
            else return false;
          })
          .map((raw) => {
            const grade = new Grade(this._magister, raw, this.id);
            grade._fillUrl = `${urlPrefix}/extracijferkolominfo/${_.get(
              raw,
              "CijferKolom.Id"
            )}`;
            raw = grade;
            return grade;
          });
        resolve(grades);
        // logConsole(JSON.stringify(grades[0])) grades.forEach(grade => {
        // grade._filled = false;     grade._filling = false;     while (!grade._filled)
        // {         if (!grade._filling && !this._magister.timedOut) {
        // grade.fill()         }     } }); const promises = grades.map(raw => {
        // const grade = new Grade(this._magister, raw, this.id)     //grade._fillUrl =
        // `${urlPrefix}/extracijferkolominfo/${raw._fillUrl}`     grade._fillUrl =
        // raw._fillUrl     logConsole(JSON.stringify(grade))
        // //errorConsole(grade._fillUrl)     return fillGrades ? grade.fill() : grade
        // }) Promise.all(promises).then(grades => {     resolve(grades) })
      });
    });
  }

  sortGrades() {
    var sorted = {};
    this.grades.forEach((grade) => {
      if (grade != undefined && grade != null) {
        //logConsole(grade)
        var vak = grade.class.description.capitalize();
        if (sorted[vak] == null || sorted[vak] == undefined) {
          sorted[vak] = [];
        }
        if (
          sorted[vak][grade.type.header] == null ||
          sorted[vak][grade.type.header] == undefined
        ) {
          sorted[vak][grade.type.header] = [];
        }
        if (
          sorted[vak]["Grades"] == null ||
          sorted[vak]["Grades"] == undefined
        ) {
          sorted[vak]["Grades"] = [];
        }
        sorted[vak][grade.type.header].push(grade);
        if (
          grade.type._type == 1 &&
          round(grade.grade) > 0 &&
          round(grade.grade) < 11
        ) {
          // if (viewController.config.exclude.includes(grade.id))
          // alert(JSON.stringify(grade))
          grade.exclude = viewController.config.exclude.includes(grade.id);
          //lessonController.allGrades.push(grade)
          sorted[vak]["Grades"].push(grade);
        }
      }
    });
    for (var vak in sorted) {
      var data = sorted[vak];
      var grades = data["Grades"];
      sorted[vak]["Lesson"] = new Lesson(
        vak,
        data,
        grades,
        lessonController,
        this
      );
    }
    return sorted;
  }
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}
