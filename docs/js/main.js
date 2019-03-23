var sorted = {}

function logCijfers(){
    var cijfers = localStorage.getItem("cijfers");
    if(cijfers.length > 30) {
        cijfers = JSON.parse(cijfers)
        console.dir(cijfers)
    
        cijfers.forEach(grade => {
        // for(var grade in cijfers) {
            var vak = grade.class.description.capitalize()
            if(sorted[vak]==null){sorted[vak]=[]}
            if(sorted[vak][grade.type.header]==null){sorted[vak][grade.type.header]=[]}
            sorted[vak][grade.type.header].push(grade)
        })
    
        updateNav()
    }
}

function showClass(vak){
    if(vak == 'general'){
        document.getElementById('General').style.display = 'block';
        document.getElementById('subjectSpecific').style.display = 'none';
    } else {
        
        var subjectDiv = document.getElementById('subjectSpecific')
        while (subjectDiv.firstChild){
            subjectDiv.removeChild(subjectDiv.firstChild)
        }
        subjectDiv.insertAdjacentHTML('beforeend', generateHTML(vak))
        document.getElementById('General').style.display = 'none';
        document.getElementById('subjectSpecific').style.display = 'block';
    }
}

function updateNav(){
    var vakken = Object.keys(sorted)
    var HTML = `<li class="nav-item">
                    <a class="nav-link" onclick="showClass('general')">
                        <span>Gemiddeld</span>
                    </a>
                </li>`
        document.getElementById('subjectsNav').insertAdjacentHTML('beforeend', HTML)
    vakken.forEach(vak =>{
        var HTML = `<li class="nav-item">
                        <a class="nav-link" onclick="showClass('${vak}')">
                            <span>${vak.capitalize()}</span>
                        </a>
                    </li>`
        document.getElementById('subjectsNav').insertAdjacentHTML('beforeend', HTML)
    })
}

function getAverage(vak){
    if (sorted[vak]['Gem. cijfer']){
        return sorted[vak]['Gem. cijfer'][0]['grade']
    } else {
        return "Niet beschikbaar"
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

logCijfers()