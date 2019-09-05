//import { createBrotliDecompress } from "zlib";

var verifier = "";
var tenant = "";
var popup = null

var currentGradeIndex = 0
var totalGrades = 0
var all_courses = []

Array.prototype.chunk = function (chunkSize) {
    var R = [];
    for (var i = 0; i < this.length; i += chunkSize) {
        var chunkArr = this.slice(i, i + chunkSize);
        var chunk = {}
        chunk.array = chunkArr
        chunk.gradeIndex = 0
        R.push(chunk)
    }

    return R;

};

function getLoginInfo() {
    return {
        username: $('#login-username').val(),
        password: $('#login-password').val(),
        school: schools[$('#login-school').val()]
    }
}

// Array.prototype.forEach

function onDeviceReady() {
    //alert("poep");

}

function generateRandomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function generateCodeVerifier() {
    logConsole(`Code verifier gegenereerd!`)
    var code_verifier = generateRandomString(128)
    return code_verifier;
}

function generateRandomBase64(length) {
    logConsole(`Base64 identifier gegenereerd!`)
    var text = "";
    var possible = "abcdef0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function generateRandomState(length) {
    var text = "";
    var possible = "abcdefhijklmnopqrstuvwxyz";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function generateCodeChallenge(code_verifier) {
    logConsole(`Code challenger gegenereerd!`)
    return code_challenge = base64URL(CryptoJS.SHA256(code_verifier))
}

function base64URL(string) {
    return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function openLoginWindow(school) {
    console.log("Tenant: ", tenant)
    tenant = school
    if (cordova === undefined) return
    verifier = base64URL(generateCodeVerifier());
    logConsole(`School ${tenant}`)
    //$("#login-school").val(verifier);

    var nonce = generateRandomBase64(32);
    var state = generateRandomState(16);

    var challenge = base64URL(generateCodeChallenge(verifier));
    //file:///android_asset/www/
    //alert("je moeder is een kehba");
    var url = `https://accounts.magister.net/connect/authorize?client_id=M6LOAPP&redirect_uri=m6loapp%3A%2F%2Foauth2redirect%2F&scope=openid%20profile%20offline_access%20magister.mobile%20magister.ecs&response_type=code%20id_token&state=${state}&nonce=${nonce}&code_challenge=${challenge}&code_challenge_method=S256&acr_values=tenant:${school}&prompt=select_account`
    var popup = cordova.InAppBrowser.open(url, '_system', 'location=yes,hideurlbar=yes');
}


function toast(msg, duration) {
    var snackId = Math.floor((Math.random() * 1000) + 1)
    $('body').append(`<div id="snackbar${snackId}" class="snackbar">${msg}</div>`);
    $(`#snackbar${snackId}`).css("display", "block")
    $(`#snackbar${snackId}`).animate({
        "bottom": "30px"
    }, "slow");
    if (duration) {
        setTimeout(function () {
            $(`#snackbar${snackId}`).animate({
                "bottom": "-200px"
            }, "slow", function () {
                $(`#snackbar${snackId}`).remove()
            })
        }, duration);
    }
}

function makeRequestChain(val, vals) {
    var index = vals.indexOf(val)
    if (index + 1 != vals.length) {
        return val.fill().then(makeRequestChain(vals[index + 1], vals))
    } else {
        return logConsole("endofchain")
    }

}

function fillAGrade(chunk) {
    logConsole("starting new fill: " + (chunk.gradeIndex < chunk.array.length))
    if (chunk.gradeIndex < chunk.array.length) {
        var currentGrade = chunk.array[chunk.gradeIndex]
        currentGrade.fill().then(value => {
            logConsole("filledAGrade")
            chunk.gradeIndex += 1
            totalGrades -= 1
            $("#grades-remaining").text(totalGrades)
            //logConsole(fillAGrade)
            fillAGrade(chunk)
            if (totalGrades == 0) {
                localStorage.setItem("courses", JSON.stringify(all_courses))
                window.location = '../index.html'
            }
        }).catch(err => {
            if (err == 429) {
                setTimeout(function () {
                    fillAGrade(chunk)
                }, 21000)
            }
        })
    }
}
async function validateLogin(code, codeVerifier) {
    logConsole(`Login valideren...`)
    var settings = {
        "error": function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        },
        "dataType": "json",
        "async": true,
        "crossDomain": true,
        "url": "https://accounts.magister.net/connect/token",
        "method": "POST",
        "headers": {
            "X-API-Client-ID": "EF15",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "accounts.magister.net"
        },
        "data": `code=${code}&redirect_uri=m6loapp%3A%2F%2Foauth2redirect%2F&client_id=M6LOAPP&grant_type=authorization_code&code_verifier=${codeVerifier}`,
    }

    $.ajax(settings).done((response) => {
        $("#login").hide()
        $("#loader").show()
        logConsole(`Succesvol oauth tokens binnengehaald!`)
        addLoader(3)
        var tokens = {
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            id_token: response.id_token
        }
        localStorage.setItem("tokens", JSON.stringify(tokens));
        localStorage.setItem("school", tenant);
        var config = {
            "isDesktop": false,
            "tention": 0.3,
            "passed": 5.5,
            "darkTheme": false,
            "exclude": []
        }
        localStorage.setItem("config", JSON.stringify(config));
        logConsole("Succesvol config bestanden opgeslagen!")
        addLoader(1)

        var m = new Magister(tenant, response.access_token)
        logConsole(JSON.stringify(m))
        m.getInfo()
            .then(person => {
                logConsole(`Succesvol leerlingid (${person.id}) opgehaald!`)
                addLoader(3)
                m.getCourses()
                    .then(async courses => {
                        all_courses = courses
                        logConsole(`Succesvol ${courses.length} leerjaren opgehaald!`)
                        addLoader(7)
                        const requests = await courses.map(async course => {
                            const [grades, classes] = await Promise.all([course.getGrades({
                                fillGrades: false,
                                latest: false
                            }), course.getClasses()]);
                            course.grades = grades
                            course.courses = classes
                            return course
                        })

                        Promise.all(requests)
                            .then(values => {
                                logConsole("donerequests")
                                addLoader(8) // 12% total, 88% remaining
                                var years = values.length
                                var all = []

                                values.forEach(value => {
                                    totalGrades += value.grades.length
                                    value.grades.forEach(grade => {
                                        all.push(grade)
                                    })
                                })
                                all_grades = all
                                logConsole(`Totaal ${totalGrades} cijfers!`)
                                var remaining = Math.round(((years + 1) * 0.5) * 10) / 10
                                $("#time-remaining").text(`${remaining} ${remaining >= 2 ? "minuten" : "minuut"}`)
                                $("#grades-remaining").text(totalGrades)
                                var chunkedGrades = all_grades.chunk(6)
                                chunkedGrades.forEach(element => {
                                    fillAGrade(element)
                                });


                                // logConsole("ahnee")
                                // var promiseChain = makeRequestChain(all[0], all)
                                // logConsole("madeChain")
                                // promiseChain.then(logConsole("gotAll"))
                                //     value.promises = value.grades.map(async grade => {
                                //         const filled = await grade.fill()
                                //         grade = filled
                                //         return filled
                                //     })
                            }).catch(err => errorConsole(err))
                        // var loader_total = totalGrades / 88


                        // values.forEach((value, index) => {
                        //     // var timeout = (index == 0) ? 0 : index * 30500
                        //     // logConsole("This timeout is: " + timeout)
                        //     // setTimeout(async () => {
                        //     var filled = await Promise.all(value.promises)
                        //     value.grades = filled
                        //     logConsole(filled.length)
                        //     years--
                        //     filled.length
                        //     var remaining = Math.round(((years + 1) * 0.5) * 10) / 10
                        //     $("#time-remaining").text(`${remaining} ${remaining >= 2 ? "minuten" : "minuut"}`)
                        //     $("#grades-remaining").text(totalGrades - filled.length)
                        //     addLoader(((filled.length / totalGrades) * 100), true)
                        //     // }, timeout)
                        // })
                    }).catch(err => {
                        errorConsole(err + " 420")
                    })
            }).catch(err => {
                errorConsole(err)
            })
    }).catch(err => {
        errorConsole(err)
    })
    // window.location = '../index.html';);
}

function handleOpenURL(url) {
    var code = url.split("code=")[1].split("&")[0];
    validateLogin(code, verifier);
}

function addLoader(val, set) {
    if (!set) var val = val + parseInt($(".progress-bar").attr("aria-valuenow"))
    $(".progress-bar").css("width", val + "%").attr("aria-valuenow", val)
}

document.addEventListener("deviceready", onDeviceReady, false);

$(document).ready(function () {
    $(function () {
        $.ui.autocomplete.prototype._renderMenu = function (ul, items) {
            var self = this;
            $("#schools-table").empty()
            $.each(items, function (index, item) {
                self._renderItemData(ul, $("#schools-table"), item);
            });
        };
        $.ui.autocomplete.prototype._renderItemData = function (ul, table, item) {
            return this._renderItem($("#schools-table"), item).data("ui-autocomplete-item", item);
        };
        $.ui.autocomplete.prototype._renderItem = function (table, item) {
            return $("<tr role='presentation'></tr>")
                //.data( "item.autocomplete", item )
                .append(
                    `<td onclick="openLoginWindow('${item.value}')"><span class="font-weight-bold">${item.label}</span><br>${item.value}<hr class="mb-1 mt-1"></td>`
                )
                .appendTo($("#schools-table"));
        };
        $("#login-school").autocomplete({
            minLength: 1,
            source: scholen,
        })
    });
});

var schools = {
    "De Faam": "zaam",
    "CVO 't Gooi College de OpMaat": "cvotgooi",
    "De Maat": "demaat",
    "Maarten van Rossem": "20tz",
    "Maaslandcollege": "maaslandcollege",
    "SG Maarsbergen": "vakcollege-osgs",
    "Sint-Maartenscollege": "sintmaartens",
    "Sint-Maartenscollege Maastricht": "smc",
    "Sint-Maartenscollege Voorburg": "sintmaartens",
    "SMC Maastricht": "smc",
    "Stedelijk Dalton College Alkmaar": "sovon",
    "Vakcollege Maarsbergen": "vakcollege-osgs",
    "VMBO Maastricht": "smc",
    "OSG Hengelo Bataafs Lyceum": "osghengelo",
    "VierTaal College Schagen": "hendrikmol",
    "Tabor College": "tabor",
    "Eemsdeltacollege": "eemsdelta",
    "Maria Immaculata Lyceum": "mil",
    "Maria Immaculata Lyceum (MIL)": "mil",
    "Chr. Mavo \"De Saad\"": "desaad",
    "Citadel College": "citadel",
    "Interconf. Hofstadcollege Heldring VMBO": "hofstadcollege",
    "Interconf. Hofstadcollege Hofstad Lyceum": "hofstadcollege",
    "Interconf. Hofstadcollege Hofstad Mavo": "hofstadcollege",
    "LVO Parkstad": "parkstad",
    "OVO Zaanstad": "sovozaanstad",
    "SG Lelystad": "svol",
    "Stad en Esch": "stadenesch",
    "Stadslyceum": "o2groningen",
    "Stichting voor VO Lelystad": "svol",
    "Stichting voor Voortgezet Onderwijs Lelystad": "svol",
    "Talentstad": "landstedevo",
    "Amadeus Lyceum": "amadeus",
    "Dongemond college Made": "dongemond",
    "Fons Vitae Lyceum": "fonsvitae",
    "Maerlant College Brielle": "maerlant",
    "Maerlant Lyceum Den Haag": "maerlantlyceum",
    "Van Maerlantlyceum": "vanmaerlantlyceum",
    "Van Maerlantlyceum Eindhoven": "vanmaerlantlyceum",
    "Arentheem College locatie Leerpark Presikhaaf": "arentheem",
    "Daaf Gelukschool": "daafgeluk",
    "Graaf Engelbrecht": "engelbrecht",
    "Graaf Huyn College": "ghc",
    "Graafschap College": "gc",
    "Dalton Den Haag": "daltondenhaag",
    "De Haagse": "sgdenhaag",
    "De Vrije School Den Haag": "vszh",
    "Deutsche internationale Schule Den Haag": "disdh",
    "Haags Montessori Lyceum": "hml",
    "Het Haagsch Vakcollege": "sgdenhaag",
    "Scholengroep Den Haag Zuid-West": "sgdenhaag",
    "Tobiasschool Den Haag": "vszh",
    "debrug.magister.net": "debrug",
    "Gomarus College Groningen Magnolia": "gomarus",
    "pro-roermond.magister.net": "petrusdonders",
    "RSG Magister Alvinus": "alvinus",
    "Maimonides SG": "maimonides",
    "Esloo Onderwijsgroep Montaigne Lyceum": "esloo",
    "De Zwaaikom": "dezwaaikom",
    "Topsport Talentschool": "o2groningen",
    "Wolfert van Borselen scholengroep Wolfert Tweetalig": "wolfert",
    "Chr. Lyceum Veenendaal": "clv",
    "CSV Veenendaal": "decsv",
    "Elzendaalcollege Boxmeer": "elzendaalboxmeer",
    "Elzendaalcollege Gennep": "elzendaalgennep",
    "J.C. Pleysierschool Transvaal College": "pleysier",
    "OMO SG De Langstraat Dr. Mollercollege Waalwijk": "delangstraat",
    "RSG Het Rhedens Rozendaal": "rhedens",
    "Metameer": "metameer",
    "Dongemond college Raamsdonksveer": "dongemond",
    "Het Westeraam": "20tz",
    "ZAAM": "zaam",
    "Bonnefanten College": "bonnefanten",
    "Johannes Fontanus College": "jfc",
    "Sint-Stanislascollege": "stanislas",
    "Stanislascollege": "stanislas",
    "ARH - Adriaan Roland Holstschool": "vsvonh",
    "Baanderherencollege": "bhc",
    "Christiaan Huygens College": "huygenscollege",
    "De Baander": "baander",
    "De Viaan": "viaan",
    "Erasmiaans Gymnasium": "erasmiaans",
    "Esprit Scholen Mondriaan": "esprit",
    "Lodewijk College - locatie Zeldenrustlaan": "zsc",
    "Meridiaan College": "zaam",
    "Meridiaan College `t Hooghe Landt": "meridiaan-college",
    "Meridiaan College Amersfoort": "meridiaan-college",
    "Meridiaan College Het Nieuwe Eemland": "meridiaan-college",
    "Meridiaan College Mavo Muurhuizen": "meridiaan-college",
    "Meridiaan College Vakcollege Amersfoort": "meridiaan-college",
    "ROC Mondriaan MBO": "rocmondriaanmbo",
    "Scholen aan Zee": "scholenaanzee",
    "School voor Praktijkonderwijs De Baanbreker": "baanbreker",
    "Zaanlands Lyceum": "sovozaanstad",
    "Bogerman Balk": "cvozwfryslan",
    "Bogerman Koudum": "cvozwfryslan",
    "Bogerman Sneek": "cvozwfryslan",
    "Bogerman Wommels": "cvozwfryslan",
    "Commanderij College": "commanderij",
    "CSG Anna Maria van Schurman": "ams",
    "CVO 't Gooi Savornin Lohman": "cvotgooi",
    "De Goudse SG Leo Vroman": "gsgleovroman",
    "de GSG Leo Vroman": "gsgleovroman",
    "Esloo Onderwijsgroep Diamant College": "esloo",
    "GSG Leo Vroman": "gsgleovroman",
    "Hermann Wesselink College": "hermannwesselink",
    "Newmancollege": "newman",
    "Pontes Pieter Zeeman": "pontessg",
    "Purmerendse SG Nelson Mandela": "psg",
    "Werkman VMBO": "o2groningen",
    "Niftarlake College": "niftarlake",
    "RSG Pantarijn": "pantarijn",
    "Staring College": "staring",
    "Esprit Scholen Marcanti College": "esprit",
    "Gomarus College Assen": "gomarus",
    "Gomarus College Drachten": "gomarus",
    "Gomarus College Groningen Praktijkonderwijs": "gomarus",
    "Gomarus College Groningen Vondelpad 1": "gomarus",
    "Gomarus College Groningen Vondelpad 2": "gomarus",
    "Gomarus College Groningen Vondelpad 3": "gomarus",
    "Gomarus College Leeuwarden": "gomarus",
    "Gomarus College Zuidhorn": "gomarus",
    "Lyceum Sancta Maria": "sanctamaria",
    "Marecollege Leiden": "vszh",
    "Maris College": "maris",
    "Maritieme Academie Harlingen": "mch",
    "Marne College": "cvozwfryslan",
    "Marnix College": "marnix",
    "Martinuscollege": "martinus",
    "Sancta Maria MAVO": "desancta",
    "Stella Maris College": "stellamaris",
    "Technisch en Maritiem College Velsen": "tmcv",
    "CSG De Lage Waard": "delagewaard",
    "De Goudse Waarden": "ozhw",
    "De Heemgaard": "heemgaard",
    "De Zeven Linden Dedemsvaart": "capellen",
    "Haarlem College": "haarlemcollege",
    "Haarlemmermeer Lyceum": "hlml",
    "Hoofdvaart College": "hoofdvaart",
    "Huygens College Heerhugowaard": "huygens",
    "Krimpenerwaard College": "kwcollege",
    "Laar en Berg": "atscholen",
    "Lodewijk College - locatie Oude Vaart": "derede",
    "Onderwijsgroep Zuid-Hollandse Waarden Barendrecht": "ozhw",
    "Openbaar Onderwijs Groningen": "o2groningen",
    "RSC - Rudolf Steiner College Haarlem": "vsvonh",
    "Scheepvaart en Transport College": "stc",
    "St.-Jozefmavo Vlaardingen": "sjm",
    "St.-Jozefschool voor MAVO Vlaardingen": "sjm",
    "Stedelijk Gymnasium Haarlem": "sghaarlem",
    "Farel en Oostwende College": "farel",
    "CSG Gaasterland": "cvozwfryslan",
    "Sint-Nicolaaslyceum": "nicolaas",
    "Arentheem College locatie Thomas a Kempis": "arentheem",
    "Bonifatius mavo": "bonifatiusmavo",
    "St. Bonifatiuscollege": "bonifatius",
    "Gymnasium Juvenaat": "juvenaat",
    "OMO Scholengroep De Langstraat": "delangstraat",
    "OMO SG De Langstraat d'Oultremontcollege": "delangstraat",
    "OMO SG De Langstraat Walewyc": "delangstraat",
    "SG De Overlaat": "overlaat",
    "Almata": "almata",
    "CSG Prins Maurits": "csgpm",
    "Emmauscollege": "emmaus",
    "Maurick College": "maurick",
    "2College Jozefmavo": "2college",
    "Alberdingk Thijm Mavo": "atscholen",
    "Bredero Mavo": "vova",
    "Charles de Foucauld Mavo": "lmc-vo",
    "CSG Groene Hart Topmavo": "groenehart",
    "De Amsterdamse Mavo": "deamsterdamsemavo",
    "De Mavo voor Theater MT010": "lmc-vo",
    "De Toorop Mavo": "lmc-vo",
    "deamsterdamsemavo": "deamsterdamsemavo",
    "Duin en Kruidberg mavo": "duinenkruid",
    "Frits Philips Lyceum Mavo": "huygenscollege",
    "Hildegardis Mavo": "lmc-vo",
    "Lucius Petrus Mavo": "lmc-vo",
    "lvo-Mavo": "helmond",
    "Mavo Roermond": "mavoroermond",
    "Mavo Schravenlant XL": "mavoschravenlant",
    "Mgr. A.E. Rientjes Mavo": "rientjes",
    "Paulus Mavo/Vmbo": "paulus",
    "Roncalli Mavo": "lmc-vo",
    "St.-Jozefmavo": "sjm",
    "MaxX": "maxx",
    "Raayland College": "raayland",
    "ROC West-Brabant": "rocwb",
    "ROC West-Brabant (ROCWB)": "rocwb",
    "Calvijn College Krabbendijke": "calvijn",
    "Scholen Combinatie Zoetermeer": "scz",
    "Scholencombinatie Delfland": "sc-delfland",
    "Symbion": "symbion",
    "Chr. VMBO-Harderwijk": "morgencollege",
    "Griendencollege-VMBO": "grienden",
    "Haemstede Barger VMBO-T": "barger",
    "HMC MBO Vakschool": "hmlc",
    "MBO Terra": "aocterra",
    "SiNTLUCAS VMBO": "sintlucas-vmbo",
    "Trias VMBO": "sovozaanstad",
    "VMBO De Krijtenburg": "krijtenburg",
    "VMBO Het Venster": "geldersmozaiek",
    "VMBO Ichthus Almere": "via",
    "Kwadrant Scholengroep Cambreur College": "sgkwadrant",
    "Rembrandt College": "rembrandt",
    "Strabrecht College": "strabrecht",
    "VAVO Noord- en Midden- Limburg": "vavo-nml",
    "Montessori College Arnhem (MCA)": "mca",
    "DaCapo College": "dacapo",
    "Accent Amersfoort": "accentamersfoort",
    "Accent Nijkerk": "accent",
    "UMCG Wenckebach Instituut": "wenckebach",
    "Arentheem College locatie Middachten": "arentheem",
    "Wim Gertenbach College": "gertenbach",
    "Eckartcollege": "eckart",
    "Merletcollege": "merlet",
    "Reynaertcollege": "reynaert",
    "Wellantcollege": "wellantcollege",
    "Zeldenrust-Steelantcollege": "zsc",
    "Blariacumcollege": "blariacum",
    "Bonaventuracollege": "bonaventura",
    "Dockingacollege": "dockinga",
    "dr. Aletta Jacobs College": "aletta",
    "Jacob-Roelandslyceum": "jacob-roelands",
    "Jacobus Fruytier SG": "jfsg",
    "Mediacollege Amsterdam": "mediacollege",
    "Ulenhofcollege": "ulenhof",
    "Actief College - Hoeksch Lyceum": "hoekschlyceum",
    "Vechtdal College": "vechtdal",
    "Kath. SG Hoofddorp": "ksgh",
    "Adelbert College": "adelbert",
    "Atlas College SG De Triade": "atlas",
    "Purmerendse SG W.J. Bladergroen": "psg",
    "RSG Simon Vestdijk": "vestdijk",
    "Het Kwadrant": "hetkwadrant",
    "Het Kwadrant Bergen op Zoom": "hetkwadrant",
    "Kwadrant Scholengroep": "sgkwadrant",
    "Kwadrant Scholengroep Dongen": "sgkwadrant",
    "Kwadrant Scholengroep Hanze College": "sgkwadrant",
    "LVO Weert Het Kwadrant": "weert",
    "Radulphus College": "radulphus",
    "SWPTeam": "swpteam",
    "Meander College": "landstedevo",
    "CSG Dingstede": "dingstede",
    "Damstede": "zaam",
    "Drechtsteden College": "drechtstedencollege",
    "Het Stedelijk Lyceum Enschede": "hetstedelijk",
    "Het Stedelijk Lyceum Scholingsboulevard Enschede": "hetstedelijk",
    "Hofstede Praktijkschool": "hofstede",
    "Landstede Groep VO Zwolle eo": "landstedevo",
    "Landstede Groep Volwasseneneducatie Gelderland": "landstedevavo",
    "Stedelijk College Zoetermeer": "scz",
    "Stedelijk Dalton Lyceum": "daltondordrecht",
    "Stedelijk Gymnasium Arnhem": "sga",
    "Stedelijk Gymnasium Breda": "gymnasiumbreda",
    "Stedelijk Gymnasium Den Bosch": "sgdenbosch",
    "Stedelijk Gymnasium Johan van Oldenbarnevelt": "jvo",
    "Stedelijk Gymnasium Leiden": "sgleiden",
    "Stedelijk Gymnasium Schiedam": "sgymschiedam",
    "Stedelijke SG De Rede": "derede",
    "Stedelijke SG Nijmegen": "ssgn",
    "Drenthe College Steenwijk": "dc",
    "Het Ravelijn Steenbergen": "mollerlyceum",
    "Praedinius Gymnasium": "o2groningen",
    "Bindelmeer College": "zaam",
    "Burgemeester Walda SG": "sgwalda",
    "Christelijke Scholengemeenschap Vincent van Gogh": "csvvg",
    "College de Meer": "zaam",
    "Gemeentelijk Gymnasium": "ggh",
    "Gemeentelijk Gymnasium Hilversum": "ggh",
    "Het Atrium Zoetermeer": "scz",
    "Nijmeegse Sg Groenewoud": "groenewoud",
    "Open Schoolgemeenschap Bijlmer": "openschoolgemeenschapbijlmer",
    "Picasso Lyceum Zoetermeer": "scz",
    "RSG Tromp Meesters": "trompmeesters",
    "Scholengemeenschap Were Di": "weredi",
    "Karel de Grote College Nijmegen": "sgvvs",
    "Pro College regio Nijmegen": "procollege",
    "ROC Nijmegen": "vavoroc-nijmegen",
    "Tobiasschool Nijmegen": "sgvvs",
    "Cals College IJsselstein": "cals",
    "Esloo Onderwijsgroep I.C.Edith Stein": "esloo",
    "Praktijkschool De Steiger": "desteiger",
    "Rudolf Steiner College Rotterdam": "vszh",
    "Van Lodenstein College": "lodenstein",
    "Van Lodensteincollege": "lodenstein",
    "Amstellyceum": "msa",
    "Christelijk College Groevenbeek": "groevenbeek",
    "Christelijk College Nassau-Veluwe": "ccnv",
    "Christelijk Gymnasium": "cgu",
    "Christelijk Gymnasium Utrecht": "cgu",
    "Christelijk Lyceum Apeldoorn": "cl-apeldoorn",
    "Christelijk Lyceum Delft": "chrlyceumdelft",
    "christelijk lyceum Zandvliet": "zandvliet",
    "Eerste Christelijk Lyceum": "eclh",
    "Francois Vatelschool": "francoisvatel",
    "Instelling VO Deurne": "ivodeurne",
    "Instelling VO Deurne Alfrinkcollege": "ivodeurne",
    "Instelling VO Deurne Hub van Doornecollege": "ivodeurne",
    "Instelling VO Deurne Peellandcollege": "ivodeurne",
    "SiNTLUCAS Boxtel": "sintlucas",
    "Stellingwerf College": "swc",
    "Vrijzinnig-Christelijk Lyceum": "vcl",
    "Gymnasium Felisenum": "felisenum",
    "Chr. College de Noordgouw Hattem": "noordgouw",
    "CSG Het Noordik Almelo": "noordik",
    "Emelwerda College": "emelwerda",
    "Murmellius Gymnasium": "murmellius",
    "2College Durendael": "2college",
    "St. Michael College": "michael",
    "Agnieten College": "landstedevo",
    "Almere College Dronten": "almerecollege",
    "Aloysius De Roosten": "sghetplein",
    "CSG Buitenveldert": "buitenveldert",
    "CSG Ulbe van Houten": "cvo-nf",
    "Drenthe College Winschoten": "dc",
    "Gwendoline van Puttenschool": "gwendoline",
    "Hartenlustschool": "hartenlustmavo",
    "Het Perron Dronten": "hetperron",
    "Houtens": "houtens",
    "KSE Etten-Leur": "kse",
    "Reconvalescentenschool": "recon",
    "Tender College": "tender",
    "Tender Wellant": "tenderwellant",
    "Almende College Bluemers": "almende",
    "Almende College Isala": "almende",
    "Almende College Wesenthorst": "almende",
    "BC Broekhin Swalmen": "broekhinsw",
    "Comenius Lyceum Amsterdam": "zaam",
    "CSG Comenius": "cvo-nf",
    "CVO 't Gooi Comenius College": "cvotgooi",
    "Drenthe College Emmen": "dc",
    "Esdal College Emmen": "esdal",
    "Het Segment": "segmentgouda",
    "Mencia de Mendoza": "mencia",
    "Mendelcollege": "mendel",
    "Menno Reitsma": "menno",
    "Palmentuin": "lmc-vo",
    "ROC Menso Alting": "mensoalting",
    "Thamen": "thamen",
    "Thamen RKSG": "thamen",
    "Compaen College": "sovozaanstad",
    "Saenredam College": "sovozaanstad",
    "Saenstroom OPDC": "sovozaanstad",
    "Drenthe College Meppel": "dc",
    "Greijdanus Meppel": "greijdanus",
    "College Den Hulster": "denhulster",
    "De Amsterdamsche School": "amsterdamsche",
    "De Bolster": "bolster",
    "De Jutter": "krijtenburg",
    "De Theaterhavo/vwo": "lmc-vo",
    "Esdal College Oosterhesselen": "esdal",
    "GGCA - Geert Groote College Amsterdam": "vsvonh",
    "Grafisch Lyceum Rotterdam": "glr",
    "Het Amsterdams Lyceum": "amsterdams",
    "Het Lyceum Rotterdam": "lmc-vo",
    "Het Schoter": "20rc",
    "Het Wateringse Veld College": "sgdenhaag",
    "Horeca Vakschool Rotterdam": "lmc-vo",
    "Hout- en Meubileringscollege HMC Amsterdam": "hmlc",
    "Hout- en Meubileringscollege HMC Rotterdam": "hmlc",
    "Interconf. Scholengroep Westland": "isw",
    "International School Almere": "atscholen",
    "International School Hilversum": "atscholen",
    "J.C. Pleysierschool Westerbeek College": "pleysier",
    "Montessori Lyceum Amsterdam": "msa",
    "Montessori Lyceum Rotterdam": "rml",
    "OCL Het Waterland": "waterland",
    "Oost-ter-Hout School voor Praktische Vorming": "15NE",
    "Oosterlicht College": "oosterlicht",
    "Over Betuwe College De Heister": "obc",
    "Pieter Nieuwland College": "zaam",
    "Pieter Zandt sg.": "pieterzandt",
    "ROC van Amsterdam": "vavojokesmit",
    "RSG Ter Apel": "rsgterapel",
    "Schoter SG": "20rc",
    "Sint-Laurenscollege Rotterdam": "slc",
    "Sterren College": "sterrencollege",
    "Terra Nigra": "terranigra",
    "VO Terra": "voterra",
    "Voortgezet Onderwijs van Amsterdam": "vova",
    "Waterlant College IJdoorn": "zaam",
    "Young Business School Rotterdam": "lmc-vo",
    "Esprit Scholen Cartesius Lyceum": "esprit",
    "Jordan - Montessori Lyceum Utrecht": "hermanjordan",
    "Metis Montessori Lyceum": "msa",
    "Montessori College Aerdenhout": "02YH",
    "Montessori College Oost": "msa",
    "Montessori Lyceum Groningen": "o2groningen",
    "Montessori Lyceum Utrecht": "hermanjordan",
    "Montessori Vaklyceum": "o2groningen",
    "OSG Hengelo Montessori College": "osghengelo",
    "Pontes Scholengroep": "pontessg",
    "Tessenderlandt": "tessenderlandt",
    "Bonhoeffer College": "bonhoeffer",
    "CVO 't Gooi Hilfertsheem-Beatrix": "cvotgooi",
    "Wolfert van Borselen scholengroep": "wolfert",
    "Wolfert van Borselen scholengroep Wolfert College": "wolfert",
    "Wolfert van Borselen scholengroep Wolfert Dalton": "wolfert",
    "Wolfert van Borselen scholengroep Wolfert ISK": "wolfert",
    "Wolfert van Borselen scholengroep Wolfert Lyceum": "wolfert",
    "Wolfert van Borselen scholengroep Wolfert PRO": "wolfert",
    "Wolfert van Borselen scholengroep Wolfert RISS": "wolfert",
    "Almere College": "almerecollege",
    "Almere College Kampen": "almerecollege",
    "Kamerlingh Onnes": "o2groningen",
    "Kennemer College": "kennemer",
    "Kennemer Lyceum Overveen": "kennemerlyceum",
    "OPDC Noord-Kennemerland": "opdcnk",
    "OSG De Amersfoortse Berg": "amersfoortseberg",
    "Purmerendse SG": "psg",
    "Purmerendse SG Anton Gaudi": "psg",
    "Purmerendse SG Da Vinci College": "psg",
    "Purmerendse SG Gerrit Rietveld": "psg",
    "Purmerendse SG Jan van Egmond Lyceum": "psg",
    "t Atrium Amersfoort": "atrium",
    "Chr. College Schaersvoorde": "schaersvoorde",
    "Corlaer College": "corlaer",
    "Het Reinaert": "zaam",
    "SG De Waerdenborch": "waerdenborch",
    "Calvijn met Junior College": "zaam",
    "Metzo College": "metzo",
    "Nimeto": "nimeto",
    "Carolus Borromeus College": "helmond",
    "OSG Willem Blaeu": "sovon",
    "CSG Reggesteyn": "reggesteyn",
    "OPDC Griffioen": "griffioen",
    "Montfort College": "lmc-vo",
    "Praktijkschool Westfriesland": "praktijkschoolwf",
    "Gymnasium Haganum": "haganum",
    "2College Cobbenhagen": "2college",
    "Atheneum College Hageveld": "hageveld",
    "Esprit Scholen Berlage Lyceum": "esprit",
    "Erfgooiers College": "erfgooiers",
    "Mgr. Frencken College": "frencken",
    "Sint-Oelbertgymnasium": "oelbert",
    "Arentheem College locatie Baken Warnsborn": "arentheem",
    "Arentheem College locatie Titus Brandsma": "arentheem",
    "Drenthe College": "dc",
    "Drenthe College Assen": "dc",
    "Drenthe College Coevorden": "dc",
    "Drenthe College Hardenberg": "dc",
    "Drenthe College Hoogeveen": "dc",
    "Drenthe College Roden": "dc",
    "Drenthe College Ruinen": "dc",
    "Drenthe College Zwolle": "dc",
    "Pallas Athene College": "pac",
    "Theresialyceum": "theresia",
    "Alberdingk Thijm College": "atscholen",
    "Jac. P. Thijsse College": "jpthijsse",
    "Heyerdahl College": "o2groningen",
    "Calvijn College Tholen": "calvijn",
    "Praktijkschool Uithoorn": "emma",
    "Rythovius College": "rythovius",
    "Thorbecke SG": "thorbecke",
    "Thorbecke SG Zwolle": "thorbecke",
    "Thorbecke VO": "tvo-rotterdam",
    "Vathorst College": "vathorst",
    "Het Hogeland College Uithuizen": "hogeland",
    "Ichthus College": "ichthus",
    "Ichthus Lyceum": "ichthuslyceum",
    "J.C. Pleysierschool Het Palmhuis": "pleysier",
    "Prakticum": "prakticum",
    "Stichting CVO Apeldoorn": "cl-apeldoorn",
    "Stichting Kolom": "kolom",
    "Stichting Kolom De Atlant": "kolom",
    "Stichting Kolom De Dreef": "kolom",
    "Stichting Kolom Het Plein": "kolom",
    "Stichting Kolom Noord": "kolom",
    "Stichtse Vrije School": "sgvvs",
    "Esprit Scholen AICS": "esprit",
    "Calvijn College Middelburg": "calvijn",
    "Edudelta Onderwijsgroep Middelharnis": "edudelta",
    "Middelharnis": "middelharnis",
    "VSO De Piramide": "piramide",
    "Atlas Onderwijsgroep Locatie Rijswijk": "aog",
    "J.C. Pleysierschool Zefier": "pleysier",
    "Scholengroep Gelders Mozaiek": "geldersmozaiek",
    "Bernard Nieuwentijt College": "zaam",
    "Chr. Praktijkschool De Boog": "deboog",
    "De Pijler School voor Praktijkonderwijs": "depijler",
    "Esloo Onderwijsgroep Esloo Praktijkonderwijs": "esloo",
    "Het Praktijkcollege Centrum": "lmc-vo",
    "Het Praktijkcollege Charlois": "lmc-vo",
    "Het Praktijkcollege Zuidwijk": "lmc-vo",
    "Instituut Blankestijn": "blankestijn",
    "Laurentius Praktijkschool": "laurentius",
    "LUCA Praktijkschool": "vova",
    "Praktijk College": "sluis",
    "Praktijk College Spijkenisse": "sluis",
    "Praktijkonderwijs Roermond": "petrusdonders",
    "Praktijkonderwijs Zutphen": "zutphen",
    "Praktijkschool Apeldoorn": "praktijkschoolapeldoorn",
    "Praktijkschool De Brug": "sovozaanstad",
    "Praktijkschool De Einder": "einder",
    "Praktijkschool de Linie": "linie",
    "Praktijkschool De Poort": "depoort",
    "Praktijkschool Eindhoven": "sghetplein",
    "Praktijkschool Focus": "polsstok",
    "Praktijkschool Helmond": "pshelmond",
    "Praktijkschool Het Bolwerk": "bolwerk",
    "Pronova Praktijkonderwijs": "pronova",
    "Mijnschool": "mijnschool",
    "De Rooi Pannen Tilburg": "derooipannen",
    "Onderwijsgroep Tilburg": "onderwijsgroeptilburg",
    "Mill Hillcollege": "mill-hill",
    "Jan Tinbergen College": "tinbergen",
    "Dominicus College": "dominicus",
    "Gemini College Lekkerkerk": "ozhw",
    "Gemini College Ridderkerk": "ozhw",
    "Minkema College": "minkema",
    "Fioretti College": "fioretti",
    "Lorentz Casimir Lyceum": "lcl",
    "SG Bonaire": "sgbonaire",
    "Joke Smit VAVO": "vavojokesmit",
    "SG Ubbo Emmius": "ubboemmius",
    "Baudartius College": "baudartius",
    "Grotius College": "grotiuscollege",
    "Grotius College Delft": "grotiuscollege",
    "Grotius College Heerlen": "parkstad",
    "St. Ignatiusgymnasium": "ignatius",
    "Vakcollege Eindhoven": "sghetplein",
    "Vakcollege Helmond": "helmond",
    "Vakcollege Noordoostpolder": "noordoostpolder",
    "RSG Goeree-Overflakkee": "middelharnis",
    "Bossche Vakschool": "bosschevakschool",
    "College de Heemlanden": "heemlanden",
    "Atlas College": "atlas",
    "Atlas College Copernicus SG": "atlas",
    "Atlas College OSG West-Friesland": "atlas",
    "Atlas College SG De Dijk": "atlas",
    "Atlas College SG Newton": "atlas",
    "Atlas Onderwijsgroep": "aog",
    "Atlas Onderwijsgroep Lyceum Ypenburg": "aog",
    "SG de Rietlanden": "rietlanden",
    "Walburg College Zwijndrecht": "ozhw",
    "ISG Ibn Ghaldoun": "avicennacollege",
    "SG Groenewald": "groenewald",
    "Flex College": "flexcollege",
    "Alfrink College": "alfrink",
    "Lyceum Kralingen": "lmc-vo",
    "Novalis College": "sgvvs",
    "Alkwin Kollege": "alkwin",
    "CS Vincent van Gogh Salland": "csvvg",
    "Roncalli SG Bergen op Zoom": "roncalli",
    "Aloysius College": "aloysius",
    "St. Aloysius College Hilversum": "atscholen",
    "Cals College": "cals",
    "Cals College Nieuwegein": "cals",
    "Kalsbeek College": "kalsbeek",
    "Dalton Lyceum Barendrecht": "ozhw",
    "Dalton Voorburg": "daltonvoorburg",
    "SG Dalton": "daltonvoorburg",
    "SG Dalton Voorburg": "daltonvoorburg",
    "Valuascollege": "valuas",
    "SiNTLUCAS": "sintlucas",
    "SiNTLUCAS Eindhoven": "sintlucas",
    "Calvijn College Goes": "calvijn",
    "Kromme Rijn College": "krommerijncollege",
    "Havo Notre Dame des Anges": "notredame",
    "De Campus": "decampus",
    "ICT Campus Hilversum": "atscholen",
    "Chr. Gymnasium Beyers Naud?": "cgbn",
    "Chr. Gymnasium Beyers Naude": "cgbn",
    "Chr. Gymnasium Sorghvliet": "sorghvliet",
    "Cygnus Gymnasium": "zaam",
    "Esprit Scholen Het 4e Gymnasium": "esprit",
    "Gymnasium Beekvliet": "beekvliet",
    "Gymnasium Bernrode": "bernrode",
    "Gymnasium Celeanum": "celeanum",
    "Gymnasium Novum": "novum",
    "Vossius Gymnasium": "vossius",
    "Willem Lodewijk Gymnasium": "wlg",
    "Porta Mosana College": "portamosana",
    "2College Wandelbos": "2college",
    "Bertrand Russel College": "sovozaanstad",
    "Broeckland College": "broeckland",
    "Heerenlanden College": "heerenlanden",
    "Het Hogeland College": "hogeland",
    "Het Hogeland College Wehe-den Hoorn": "hogeland",
    "Iedersland College": "zaam",
    "Kandinsky College": "kandinsky",
    "OSG Singelland": "singelland",
    "VeenLanden College": "veenlanden",
    "Kranenburgschool": "kranenburg",
    "Evang. School voor VO \"De Passie\"": "passie",
    "Evang. School voor VO \"De Passie\" de Passie Utrecht": "passie",
    "Canisius College": "canisius",
    "Petrus Canisius College": "pcc",
    "CSG Willem van Oranje": "dewillem",
    "Oranje Nassau College": "onc",
    "Anna van Rijn College": "annavanrijn",
    "De Rooi Pannen": "rooipannen",
    "De Rooi Pannen Breda": "derooipannen",
    "De Rooi Pannen Eindhoven": "derooipannen",
    "Colegio Arubano": "colegioarubano",
    "Libanon Lyceum": "llr",
    "Hans Petrischool": "hanspetri",
    "Havo/vwo voor Muziek en Dans": "lmc-vo",
    "Sint-Janslyceum": "sintjans",
    "Antoon Schellenscollege": "sghetplein",
    "Groot Goylant": "atscholen",
    "Hogelant": "zaam",
    "Lyceum Schravenlant": "schravenlant",
    "RSG Wiringherlant": "wiringherlant",
    "Greijdanus": "greijdanus",
    "Greijdanus Enschede": "greijdanus",
    "Greijdanus Hardenberg": "greijdanus",
    "Greijdanus Zwolle": "greijdanus",
    "Sophianum": "sophianum",
    "Trevianum Scholengroep": "trevianum",
    "Tobiasschool": "vova",
    "Mollercollege": "mollerlyceum",
    "Mollerlyceum": "mollerlyceum",
    "VSO Hendrik Mol": "hendrikmol",
    "BC Broekhin Roermond": "broekhinrm",
    "De Zwengel - Helmond": "zwengel",
    "Dongemond college": "dongemond",
    "Mondial College": "mondial",
    "Niekee Roermond": "niekee",
    "OMO Scholengroep Helmond": "helmond",
    "Simon van Hasselt": "o2groningen",
    "Fontys Hogescholen": "fontys",
    "OMO SG Tongerlo": "sgtongerlo",
    "OMO SG Tongerlo Da Vinci College": "sgtongerlo",
    "OMO SG Tongerlo Gertrudiscollege": "sgtongerlo",
    "OMO SG Tongerlo Norbertuscollege": "sgtongerlo",
    "Morgen College": "morgencollege",
    "Winford B.V.": "winford",
    "Koninklijk Conservatorium": "svjt",
    "Scholengroep Gelders Moza?ek": "geldersmozaiek",
    "Kempenhorst College": "vobo",
    "Capellenborg Wijhe": "capellen",
    "Van der Capellen SG": "capellen",
    "Willem de Zwijger College Papendrecht": "willemdezwijger",
    "Vrijeschool Zutphen": "vsz",
    "De Apollo": "zaam",
    "Olympus College": "olympus",
    "ISG Arcus": "svol",
    "Parcival College": "pcg",
    "Parcival College Groningen": "pcg",
    "Lennard van Ekris": "lennard",
    "Leonardo College": "davinci",
    "SG Leonardo Da Vinci": "davinci",
    "Willem de Zwijger College Hardinxveld-Giessendam": "willemdezwijger",
    "CSG Jan Arentsz": "ja",
    "Edudelta Onderwijsgroep Barendrecht": "edudelta",
    "Harens Lyceum": "o2groningen",
    "Keizer Karel College": "keizerkarel",
    "Varendonck-College": "varendonck",
    "CSG Het Streek": "hetstreek",
    "De Utrechtse School": "utrechtse",
    "OPDC Utrecht": "utrechtse",
    "Gerrit Komrij College": "gerritkomrijcollege",
    "CS Vincent van Gogh Lariks": "csvvg",
    "'t Atrium": "atrium",
    "Beatrix College": "beatrix",
    "Het Atrium": "hetatrium",
    "Trivium College": "triviumcollege",
    "CSG Groene Hart Leerpark": "groenehart",
    "Zuiderpark": "lmc-vo",
    "Carolus Clusius College": "landstedevo",
    "Carré College": "lmc-vo",
    "CSG Groene Hart": "groenehart",
    "CSG Groene Hart Lyceum": "groenehart",
    "CSG Groene Hart Rijnwoude": "groenehart",
    "Petrus Dondersschool": "petrusdonders",
    "CVO Zuid-West Fryslan": "cvozwfryslan",
    "Vereniging voor CVO in Noord Fryslan": "cvo-nf",
    "MSA": "msa",
    "MSA IVKO": "msa",
    "Pascal College": "zaam",
    "Pascal Zuid": "zaam",
    "CSG Het Noordik Vroomshoop": "noordik",
    "Erasmus College": "erasmus",
    "Erasmus VO": "erasmusvo",
    "Het Erasmus": "osgerasmus",
    "Chr. College Nassau-Veluwe": "ccnv",
    "De Nassau SG": "denassau",
    "Het Passer College": "piloot",
    "Vox-klassen": "vova",
    "Esloo Onderwijsgroep College St. Paul": "esloo",
    "Esprit scholen Mundus college": "esprit",
    "Kaj Munk College": "kajmunk",
    "Munnikenheide College": "munnikenheide",
    "Futura College": "futura",
    "Hubertus & Berkhoff": "vova",
    "Sint Vituscollege": "sv",
    "Over Betuwe College": "obc",
    "Over Betuwe College Elst": "obc",
    "Over Betuwe College Huissen": "obc",
    "Over Betuwe College Junior": "obc",
    "Esdal College Klazienaveen": "esdal",
    "s Gravendreef College": "sgravendreef",
    "Gerrit Rietveld College": "grc",
    "Rietveld Lyceum": "rietveldlyceum",
    "Avicenna College": "avicennacollege",
    "De nieuwe Havo": "vova",
    "Havo De Hof": "zaam",
    "Mytylschool De Brug": "debrug",
    "Chr. College Groevenbeek": "groevenbeek",
    "Dr.-Knippenbergcollege": "helmond",
    "Groevenbeek": "groevenbeek",
    "Leeuwenborgh Opleidingen": "leeuwenborgh",
    "Rodenborch-College": "rodenborch",
    "Nuborgh College": "nuborgh",
    "Segbroek College": "segbroek",
    "Lyceum Ypenburg": "ypenburg",
    "Vespucci College": "vespucci",
    "CS Vincent van Gogh": "csvvg",
    "Da Vinci College": "davinci",
    "Sweelinck College": "zaam",
    "Pleincollege Nuenen": "eckart",
    "Pleincollege Sint Joris 20AT": "sghetplein",
    "Veurs Lyceum Leidschendam": "veurslyceum",
    "Edudelta Onderwijsgroep": "edudelta",
    "Edudelta Onderwijsgroep Goes": "edudelta",
    "Esloo Onderwijsgroep Corbulo College": "esloo",
    "Linde College": "lindecollege",
    "Lyceum Schondeln": "schondeln",
    "Sondervick College": "sondervick",
    "Udens College": "udens",
    "Ludger College": "ludger",
    "G.K. van Hogendorp": "lmc-vo",
    "Dendron College": "dendron",
    "Hendrik Pierson College": "hpc",
    "Connect College": "connectcollege",
    "OSG De Hogeberg": "dehogeberg",
    "RSG Lingecollege": "rsglc",
    "Beekdal Lyceum": "geldersmozaiek",
    "Heerbeeck College": "vobo",
    "Lyceum Bisschop Bekkers": "bisschopbekkers",
    "De Zwengel - Veldhoven": "zwengel",
    "De Zwengel - Vught": "zwengel",
    "Leon van Gelder": "o2groningen",
    "OSG Hengelo": "osghengelo",
    "OSG Hengelo Het Genseler": "osghengelo",
    "OSG Hengelo Het Gilde College": "osghengelo",
    "Sprengeloo": "sprengeloo",
    "Helicon Opleidingen": "helicon",
    "Huygens College": "zaam",
    "IVA Driebergen": "ivadriebergen",
    "Luzac Opleidingen": "luzac",
    "OMO Scholengroep Bergen op Zoom e.o.": "mollerlyceum",
    "Van Kinsbergen college Elburg": "capellen",
    "Berechja College": "berechja",
    "Berger SG": "bsg",
    "Bredero Beroepscollege": "vova",
    "Herbert Vissers College": "hvc",
    "Rosa Beroepscollege": "zaam",
    "Vak College Hillegersberg": "lmc-vo",
    "CSG Willem de Zwijger": "zwijger",
    "CSG Willem de Zwijger Schoonhoven": "zwijger",
    "Esdal College Borger": "esdal",
    "Gerrit van der Veen College": "zaam",
    "GSG 't Schylger Jouw": "schylgerjouw",
    "RSG Slingerbos": "rsgslingerbos",
    "Willem de Zwijger College": "willemdezwijger",
    "Willem de Zwijger College Bussum": "wdz",
    "VO Best Oirschot": "vobo",
    "SG Groenewoud": "groenewoud",
    "CSG Eekeringe": "eekeringe",
    "ORS Lek en Linge": "lekenlinge",
    "Slinge": "lmc-vo",
    "OSG Hugo de Groot": "boor",
    "Esprit Scholengroep": "esprit",
    "Johan de Witt Scholengroep": "jdw",
    "Scholengroep Het Plein": "sghetplein",
    "Prof. Dr. Gunningschool": "18ec",
    "Coornhert Lyceum": "20RF",
    "Het Schoonhovens College": "schoonhovens",
    "2College De Nieuwste School": "2college",
    "De Nieuwste School": "denieuwsteschool",
    "SG Het Nieuwe Lyceum": "nieuwelyceum",
    "De Zuiderpoort": "cvozwfryslan",
    "GSG Guido De Bres": "guido",
    "Hervormd Lyceum Zuid": "hlz",
    "Het Zuid-West College": "sgdenhaag",
    "Zuiderlicht College": "zaam",
    "Zuiderzee College": "zuiderzee-college",
    "Koning Willem I College": "vavo-kw1c",
    "Koning Willem II College": "willem2",
    "Esprit scholen DENISE": "esprit",
    "2College Ruiven": "2college",
    "RSG Enkhuizen": "rsgenkhuizen",
    "OSG Winkler Prins": "winkler",
    "Insula College": "insula",
    "SG Sint Ursula": "ursula",
    "Chr. College De Populier": "depopulier",
    "Globe College": "globe",
    "Sint Odulphuslyceum": "odulphus",
    "Het Goese Lyceum": "pontessg",
    "Bouwens van der Boije College": "bbc",
    "Bouwens van der Boijecollege": "hetbouwens",
    "CVO 't Gooi": "cvotgooi",
    "Chr. College de Noordgouw": "noordgouw",
    "Chr. College de Noordgouw Heerde": "noordgouw",
    "CSG Het Noordik": "noordik",
    "CSG Het Noordik Vriezenveen": "noordik",
    "Noorderlicht": "zaam",
    "Noorderpoort LBS": "noorderpoortlbs",
    "OSG Schoonoord": "osgschoonoord",
    "Veenoord": "lmc-vo",
    "BOOR": "boor",
    "St-Gregorius College": "gregorius",
    "Don Bosco College": "donbosco",
    "Jeroen Bosch College": "jeroenbosch",
    "ROC Nova College": "novacollege",
    "Nuovo": "nuovo",
    "Spinoza Lyceum": "spinoza",
    "KSG De Breul": "debreul",
    "Cburg College": "vova",
    "IJburg College": "ijburg",
    "Veurs Voorburg": "veursvoorburg",
    "BC Broekhin": "broekhinsw",
    "BC Broekhin Reuver": "broekhinsw",
    "RSG Broklede": "broklede",
    "Veurs Lyceum": "veurslyceum",
    "Pleinschool Helder": "sghetplein",
    "Vinse School": "zaam",
    "NSG": "groenewoud",
    "Lorentz Lyceum": "20tz",
    "SGVVS": "sgvvs",
    "Dorenweerd College": "dorenweerd",
    "Onze Lieve Vrouwelyceum": "olvbreda",
    "RSG NO Veluwe": "rsgno",
    "OSG Sevenwolden": "sevenwolden",
    "Zuyderzee Lyceum": "zuyderzee",
    "Luzac": "luzac",
    "De School van HIP": "deschoolvanhip",
    "Philips van Horne Sg.": "weert",
    "Oscar": "oscar",
    "Produs": "symbion",
    "OdyZee College": "odyzee",
    "RSG Het Rhedens": "rhedens",
    "RSG Het Rhedens Dieren": "rhedens",
    "Vecht-College": "vecht-college",
    "helpdesk": "helpdesk",
    "Vellesan College": "20EK",
    "Wildveld": "wildveld",
    "Hervormd Lyceum West": "hlw",
    "Het College Vos": "collegevos",
    "LVO Weert Het College": "weert",
    "Over-Y College": "zaam",
    "Hyperion Lyceum": "vova",
    "Ir. Lely Lyceum": "lelylyceum",
    "Lyceum Elst": "20tz",
    "Orion Lyceum": "orion",
    "Visser 't Hooft Lyceum": "vhl",
    "OSG Schiedam": "mavoschravenlant",
    "Esprit Scholen": "esprit",
    "Esprit Scholen Wissel": "esprit",
    "J.C. Pleysierschool": "pleysier",
    "Stg Vrije Scholen voor VO N-H": "vsvonh",
    "2College": "2college",
    "Corderius College": "corderius",
    "Ds. Pierson College": "dspierson",
    "Elde College": "elde",
    "Esdal College": "esdal",
    "ID College": "idcollege",
    "IJsselcollege": "ijsselcollege",
    "MY college": "mycollege",
    "Prisma College": "prisma",
    "Reeshof College": "reeshof",
    "Sint Joriscollege": "sghetplein",
    "Sint-Joriscollege": "sghetplein",
    "SOMA College": "soma",
    "Zone.college": "zone",
    "Zwijsen College": "zwijsen",
    "Zwin College": "zwin",
    "OPDCNK": "opdcnk",
    "SVOL": "svol",
    "De Piloot": "piloot",
    "Cor": "cor",
    "LVO Weert": "weert",
    "De Delta": "dedelta",
    "SWV de Delta": "dedelta",
    "De Rijzert": "rijzert",
    "ISW": "isw",
    "KSE": "kse"
}
var scholen = Object.keys(schools).map(s => s = {
    label: s,
    value: (schools[s] + ".magister.net")
})

//https://accounts.magister.net/account/login?sessionId=1934dbf3472a440592931cee427e6344&returnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3DM6LOAPP%26redirect_uri%3Dm6loapp%253A%252F%252Foauth2redirect%252F%26scope%3Dopenid%2520profile%2520offline_access%2520magister.mobile%2520magister.ecs%26response_type%3Dcode%2520id_token%26state%3Dqodmwkubaafcntmz%26nonce%3D643f293da9ea55c13d99a485d3e2ba82%26code_challenge%3DTP52UMRqrzurvKwdB0O_WPE4bP_f6AqKy3RZmHGJq7U%26code_challenge_method%3DS256%26acr_values%3Dtenant%253Akajmunk.magister.net#!/rswp