class Magister {
  /**
   * @private
   * @param {String} tenant
   * @param {String} token
   *
   */
  constructor(tenant, token) {
    /**
     * @type {String}
     * @readonly
     */
    this.tenant = tenant.replace('"', "").replace('"', "");
    /**
     * @type {String}
     * @readonly
     */
    this.token = token;
    /**
     * @type {Object}
     * @readonly
     */
    this.person = {};

    /**
     * @type {Object}
     * @readonly
     */
    this.account = {};

    this.timedOut = false;
  }

  /**
   * @returns {Promise<Object[]>}
   */
  getInfo() {
    return new Promise((resolve, reject) => {
      // logConsole(`https://${this.tenant}/api/account?noCache=0`)
      // logConsole("Bearer " + this.token)
      $.ajax({
        cache: false,
        dataType: "json",
        async: true,
        crossDomain: true,
        url: `https://cors.sjoerd.dev/https://${this.tenant}/api/account?nocache=${Date.parse(
          new Date()
        )}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.token,
          noCache: new Date().getTime()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
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
        success: async (data) => {
          var res = data;
          this.person.isParent = res.Groep[0].Privileges.some(
            (x) =>
              x.Naam.toLowerCase() === "kinderen" &&
              x.AccessType.some((a) => a.toLowerCase() === "read")
          );
          var res = res.Persoon || res.persoon;
          this.person.id = res.Id || res.id;
          this.person.firstName = res.Roepnaam || res.roepnaam;
          this.person.lastName = res.Achternaam || res.achternaam;
          this.namePrefix = res.Tussenvoegsel || res.tussenvoegsel;
          if (this.person.isParent) {
            this.person.children = await this.getChildren();
          }
          //this.fullName = res.Persoon.Naam || res.persoon.naam
          //this.description = res.Persoon.Omschrijving || res.Persoon.Naam || res.Persoon.naam
          //this.group = res.Persoon.Groep || res.persoon.groep)
          resolve(this.person);
        },
      });
    });
  }

  /**
   * @returns {Promise<Object[]>}
   */
   getChildren() {
    return new Promise((resolve, reject) => {
      if (this.person.id == undefined) reject("Person.id is undefined!");
      //logConsole(`https://${this.tenant}/api/personen/${this.person.id}`)
      $.ajax({
        cache: false,
        dataType: "json",
        async: true,
        crossDomain: true,
        url: `https://cors.sjoerd.dev/https://${this.tenant}/api/personen/${
          this.person.id
        }/kinderen?openData=%27%27`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.token,
          noCache: new Date().getTime()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
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
        timeout: 5000
      }).done(res => {
        var res = res.items || res.Items;
        resolve(res);
      });
    });
  }  

  /**
   * @returns {Promise<Object>}
   */
  getAccountInfo() {
    return new Promise((resolve, reject) => {
      $.ajax({
        cache: false,
        dataType: "json",
        async: true,
        crossDomain: true,
        url: `https://cors.sjoerd.dev/https://${this.tenant}/api/sessions/current?nocache=${Date.parse(
          new Date()
        )}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.token,
          noCache: new Date().getTime()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          if (XMLHttpRequest.readyState == 4) {
            logConsole(`[ERROR] HTTP error (${textStatus})`);
          } else if (XMLHttpRequest.readyState == 0) {
            logConsole(`[ERROR] Network error (${textStatus})`);
          } else {
            logConsole("[ERROR] something weird is happening");
          }
          reject("no internet");
        },
        timeout: 5000
      }).done(res => {
        // logConsole(JSON.stringify(res))
        // logConsole(`[INFO]  https://${this.tenant}${res.links.account.href}?noCache=0`)
        $.ajax({
          cache: false,
          dataType: "json",
          async: true,
          crossDomain: true,
          url: `https://cors.sjoerd.dev/https://${this.tenant}${
            res.links.account.href
          }?nocache=${Date.parse(new Date())}`,
          method: "GET",
          headers: {
            Authorization: "Bearer " + this.token,
            noCache: new Date().getTime()
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.readyState == 4) {
              logConsole(`[ERROR] HTTP error (${textStatus})`);
            } else if (XMLHttpRequest.readyState == 0) {
              logConsole(`[ERROR] Network error (${textStatus})`);
            } else {
              logConsole("[ERROR] something weird is happening");
            }
            reject("no internet");
          },
          timeout: 5000
        }).done(res2 => {
          // logConsole(JSON.stringify(res2))
          this.account = {
            id: res2.id,
            name: res2.naam,
            uuId: res2.uuid
          };
          resolve(this.account);
        });
      });
    });
  }

  /**
   * @returns {Promise<Course[]>}
   */
  getCourses(childindex = -1) {
    return new Promise((resolve, reject) => {
      if (this.person.id == undefined) reject("Person.id is undefined!");
      var personid = (childindex >= 0 && this.person.isParent) ? this.person.children[childindex].Id : this.person.id
      //logConsole(`https://${this.tenant}/api/personen/${this.person.id}`)
      $.ajax({
        cache: false,
        dataType: "json",
        async: true,
        crossDomain: true,
        url: `https://cors.sjoerd.dev/https://${this.tenant}/api/personen/${
          personid
        }/aanmeldingen?geenToekomstige=false&nocache=${Date.parse(new Date())}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.token,
          noCache: new Date().getTime()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
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
        timeout: 5000
      }).done(res => {
        var res = res.items || res.Items;
        resolve(
          _.sortBy(
            res.map(c => new Course(this, c)),
            "start"
          )
        );
      });
    });
  }

  setTimeOut() {
    setTimeout(function() {
      this.timedOut = false;
      logConsole("[INFO]   Timeout ended");
    }, 31000);
  }
}
