var sorted = {}

function logCijfers(){
    var cijfers = localStorage.getItem("cijfers");
    if(cijfers.length > 30) {
        cijfers = JSON.parse(cijfers)
        console.dir(cijfers)
    
        cijfers.forEach(grade => {
        // for(var grade in cijfers) {
            if(sorted[grade.class.description]==null){sorted[grade.class.description]=[]}
            if(sorted[grade.class.description][grade.type.header]==null){sorted[grade.class.description][grade.type.header]=[]}
            sorted[grade.class.description][grade.type.header].push(grade)
        })
    
        updateNav()
    }
}

function showClass(vak){
    if(vak == 'general'){
        
    }
}

function updateNav(){
    var vakken = Object.keys(sorted)
    var HTML = `<li class="nav-item">
                        <a class="nav-link" onclick="showClass('general')">
                            <span>gemiddeld</span>
                        </a>
                    </li>`
        document.getElementById('subjectsNav').insertAdjacentHTML('beforeend', HTML)
    vakken.forEach(vak =>{
        var HTML = `<li class="nav-item">
                        <a class="nav-link" onclick="showClass(${vak})">
                            <span>${vak}</span>
                        </a>
                    </li>`
        document.getElementById('subjectsNav').insertAdjacentHTML('beforeend', HTML)
    })
}

logCijfers()