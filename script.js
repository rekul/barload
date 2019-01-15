$( document ).ready(function() {
	var collars = false;
	var kgs = true;
	$('#big-increase').click(function(){
		console.log("big increase clicked");
		changeLoad(5);
	});

	$('#increase').click(function(){
		console.log("increase clicked");
		changeLoad(0.5);
	});

	$('#decrease').click(function(){
		console.log("decrease clicked");
		changeLoad(-0.5);
	});

	$('#big-decrease').click(function(){
		console.log("big-decrease clicked");
		changeLoad(-5);
	});

	$('#radio-kg').click(function(){
		console.log("kg clicked");
		if($('.unit-display').text() == 'lb'){
			$('.weight-display').text(Math.round(2*(1/2.205)*parseFloat($('.weight-display').text()))/2);
		}
		$('.unit-display').text("kg");
		kgs = true;
		changeLoad(0);
	});

	$('#radio-lb').click(function(){
		console.log("lb clicked");
		if($('.unit-display').text() == 'kg'){
			$('.weight-display').text(Math.round(2*(2.205)*parseFloat($('.weight-display').text()))/2);
		}
		$('.unit-display').text("lb");
		kgs = false;
		changeLoad(0);
	});
	$('#collars').change(function(){
		collars = this.checked;
		changeLoad(0);
	});

	function changeLoad(weightChange){
		let currentWeight = $('.weight-display').text();
		currentWeight = parseFloat(currentWeight) + parseFloat(weightChange);
		$('.weight-display').text(currentWeight);

		//animate plates
		resetAnimationContainer();
		if($('.unit-display').text() == 'lb'){
			currentWeight *= (1/2.205);
		}
		let idealWeight = currentWeight;
		//subtract barbell
		currentWeight -= (45 * (1/2.205));
		//if collars, subtract 5kg
		if(collars){
			currentWeight -= 5.0;
		}
		var error = loadPlates(currentWeight);
		if(kgs){
			$('.actual-load').text("Actual Load: " + (Math.round(10*(idealWeight - error))/10) + "kg (-" + Math.round(10*error)/10 + "kg)");
		}else{
			$('.actual-load').text("Actual Load: " + (Math.round(2.205*10*(idealWeight - error))/10) + "lbs (-" + Math.round(10*error*(2.205))/10 + "lbs)");	
		}
		if(collars){
			$('.plate-text').text($('.plate-text').text() + " 2.5kg collars ");
			loadCollars();
		}
	}

	function resetAnimationContainer(){
		$('.animation-container').empty();
		currentOffset = 0;
		currentPlate = 0;
		currentDelay = 0;
	}

	function loadPlates(load){
		$('.plate-text').empty();
		return loadReds(load);
	}

	function addPlateText(number, text){
		if(number === 0){
			return;
		}
		if(number === 1){
			$('.plate-text').text($('.plate-text').text() + number + " " + text + " ");
			return true;
		}
		if(number > 1){
			$('.plate-text').text($('.plate-text').text() + number + " " + text + "s ");
			return true;
		}
	}
	function loadCollars(){
		if(collars){
			var plates = ["<div class='collar' id='plate"+currentPlate+"'></div>"].join('');
			$('.animation-container').append(plates);
			TweenMax.fromTo($('#plate'+currentPlate), 0.3, {x:(currentOffset+180), scale:0, ease:Power3.easeOut}, {scale:0.5,x:currentOffset, delay:currentDelay});
		}
	}
	function loadReds(load){
		var plates = 0;
		while(load > 50){
			plates++;
			load-=50;
		}
		addWeight('red', plates, 1);
		return loadBlues(load);
	}

	function loadBlues(load){
		var plates = 0;
		while(load > 40){
			plates++;
			load-=40;
		}
		addWeight('blue', plates, 1);
		return loadGreens(load);
	}

	function loadGreens(load){
		var plates = 0;
		while(load > 20){
			plates++;
			load-=20;
		}
		addWeight('green', plates, 1);
		return loadWhites(load);
	}

	function loadWhites(load){
		var plates = 0;
		while(load > 10){
			plates++;
			load-=10;
		}
		addWeight('white', plates, 1);
		return loadFives(load);
	}

	function loadFives(load){
		var plates = 0;
		if(load > 4.54){
			plates++;
			load-=4.54;
		}
		addWeight('fivelb', plates, 0.5);
		return loadTwos(load);
	}

	function loadTwos(load){
		var plates = 0;
		if(load > 2.27){
			plates++;
			load-=2.27;
		}
		addWeight('twolb', plates, 0.5);
		return loadOnes(load);
	}

	function loadOnes(load){
		var plates = 0;
		if(load > 1.13){
			plates++;
			load-=1.13;
		}
		addWeight('onelb', plates, 0.5);
		return load;
	}






function updateIdealWeightLb(weight){
	updateIdealWeight(weight * 0.453592);
}

var currentOffset = 0;
var currentPlate = 0;
var currentDelay = 0;

function addWeight(plate, howMany, thin){
	if(howMany > 0){
		addPlateText(howMany, plate);
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

});
// changeLoad(0);
