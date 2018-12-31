function updateIdealWeight(weight){
	document.querySelector('#ideal_weight_display_kg').value =  Math.round(weight * 10)/10;
	document.querySelector('#ideal_weight_display_lb').value = Math.round(weight * 2.205);
	document.querySelector('#loading_scheme_easy').innerHTML = getEasiestLoad(weight);
}

function updateIdealWeightLb(weight){
	updateIdealWeight(weight * 0.453592);
}

var currentOffset = 0;
var currentPlate = 0;
var currentDelay = 0;

function addWeight(plate, howMany, thin){
	if(howMany > 0){
		var added = 0;
		
		while(added < howMany){
			console.log("addweight(" + plate + ");")
			var plates = ["<div class='"+plate+"' id='plate"+currentPlate+"'></div>"].join('');
			$('.animation-container').append(plates);
			TweenMax.fromTo($('#plate'+currentPlate), 0.3, {x:(currentOffset+200), scale:0, ease:Power3.easeOut}, {scale:0.5,x:currentOffset, delay:currentDelay});
			currentPlate++;
			currentOffset+=16*thin;
			added++;
			currentDelay+=0.15;
		}
	}	
}



function loadPlates(plateWeight, availablePlates, weightNeeded, error){
	var plateSetsUsed = 0;
	var totalPlateWeight = 0;
	while(true){
		plateSetsUsed ++;
		totalPlateWeight = plateSetsUsed * 2 * plateWeight;
		if(totalPlateWeight > weightNeeded || plateSetsUsed*2 > availablePlates){
			break;
		}
	}
	if(plateSetsUsed*2 > availablePlates){
		//using more plates than we have
		return plateSetsUsed-1;
	}
	if(weightNeeded - totalPlateWeight > -error){
		//over, but close enough, smaller than smallest jump
		return plateSetsUsed;
	}else{
		//over by more than smallest jump, we can do better
		return plateSetsUsed-1;
	}
}

function getEasiestLoad(weight){
	$('.animation-container').empty();
	currentOffset = 0;
	currentPlate = 0;
	currentDelay = 0;
	plateSets = 0;
	var returnString = "";

	var idealWeight = weight;
	//bar weight
	weight -= 20.41;

	//6 total reds
	var plateSets = loadPlates(25, 6, weight, 2.5);
	if(plateSets > 0){
		returnString += plateSets + " reds, ";
		weight -= 50*plateSets;
		addWeight('red', plateSets, 1);
	}


	//2 total kg blues, 2 total lb blues
	plateSets = loadPlates(20, 4, weight, 2.5);
	if(plateSets > 0){
		returnString += plateSets + " blues, ";
		weight -= 40*plateSets;
		if(plateSets > 1){
			//special case of lb blues
			weight -= 0.81;
		}
		addWeight('blue', plateSets, 1);
	}

	//2 total kg greens
	plateSets = loadPlates(10, 2, weight, 2.5);
	if(plateSets > 0){
		returnString +=  " green, ";
		weight -= 20*plateSets;
		addWeight('green', plateSets, 0.9);
	}

	//2 total kg whites
	plateSets = loadPlates(5, 2, weight, 2.0);
	if(plateSets > 0){
		returnString += " white, ";
		weight -= 10*plateSets;
		addWeight('white', plateSets, 0.9);
	}

	//2 total 5lb plates
	plateSets = loadPlates(2.26796, 2, weight, 1.5);
	if(plateSets > 0){
		returnString += " 5lbs, ";
		weight -= 4.53592*plateSets;
		addWeight('fivelb', plateSets, 0.45);
	}

	//2 total 2.5lb plates
	plateSets = loadPlates(1.13398, 2, weight, 0.6);
	if(plateSets > 0){
		returnString += " 2.5lbs, ";
		weight -= 2.26796*plateSets;
		addWeight('twolb', plateSets, 0.2);
	}

	//2 total chips
	plateSets = loadPlates(0.5669905, 2, weight, 0.3);
	if(plateSets > 0){
		returnString += " 1.25lbs, ";
		weight -= 1.13398*plateSets;
		addWeight('onelb', plateSets, 0.1);
	}

	//chop off comma
	returnString = returnString.substring(0, returnString.length - 2);

	returnString += "<br><br> Actual: " + Math.round((idealWeight - weight)*100)/100 + "kg/" + 
	Math.round(2.20462*(idealWeight - weight)*100)/100 + "lb <br> Error (+/-): " + (Math.round(100*weight)/100) + "kg/" +((Math.abs(Math.round(2.20462*100*weight)/100)))+"lb"

	addWeight('red');

	return returnString;
}

document.addEventListener("DOMContentLoaded", function(event) {
	getEasiestLoad(160);
  });
