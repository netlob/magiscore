staan = parseFloat(document.getElementById("getGrade-grade").value);
var telt = parseFloat(document.getElementById("getGrade-weight").value);
var alles = 0;
for (var i = 0; i < cijfers.length; i++) {
    alles += (cijfers[i]*wegingen[i]);
}
var totaalweging = 0;
for (var i = 0; i < wegingen.length; i++) {
    totaalweging += wegingen[i];
}
res = (((totaalweging+telt)*staan)-alles)/telt;
res = Math.ceil(res*10)/10;