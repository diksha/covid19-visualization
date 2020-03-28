function recalculate() {
	var masksSelected = document.getElementById('masks').checked;
	var ventilatorsSelected = document.getElementById('ventilators').checked;
	var bedsSelected  = document.getElementById('beds').checked;
	var kitsSelected  = document.getElementById('kits').checked;
	calculate(getWeight(masksSelected), getWeight(ventilatorsSelected), getWeight(bedsSelected), getWeight(kitsSelected));
}
function calculate(masksWeight,ventiatorsWeight, bedsWeight, kitsWeight) {
	var values = [['ChIJxYu-ZtK2j4ARpLis1OcKNDM',-37,35,27,-25],
	["ChIJ_3X2kATNj4ARJq22N-TR2io",0,-5,15,29],
	["ChIJn43dqhnLj4ARaHaMv8hRGmY",-41,-48,34,-7]];
	for(i=0;i<values.length;i++) {
		var weight = (values[i][1] * bedsWeight) + (values[i][2] * masksWeight) + (values[i][3] * ventiatorsWeight) + (values[i][4] * kitsWeight) ;
		console.log(i, weight);
	}
}

function getWeight (selected) {
	return selected?1:0;
}