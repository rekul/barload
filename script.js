$(document).ready(function() {
	//settings
    var collars = false;
    var kgs = true;
    var kgBar = true;

    //animation values
    var currentOffset = 0;
    var currentPlate = 0;
    var currentDelay = 0;

    //init
    changeLoad(0);

    $('#increase').click(function() {
        console.log("increase clicked");
        changeLoad(2.5);
    });

    $('#decrease').click(function() {
        console.log("decrease clicked");
        changeLoad(-2.5);
    });

    $('.weight-display').change(function() {
        changeLoad(0);
    });

    $('#radio-kg').click(function() {
        console.log("kg clicked");
        if ($('.unit-display').text() == 'lb') {
            $('.weight-display').val(Math.round(2 * (1 / 2.205) * parseFloat($('.weight-display').val())) / 2);
        }
        $('.unit-display').text("kg");
        kgs = true;
        changeLoad(0);
    });

    $('#radio-lb').click(function() {
        console.log("lb clicked");
        if ($('.unit-display').text() == 'kg') {
            $('.weight-display').val(Math.round(2 * (2.205) * parseFloat($('.weight-display').val())) / 2);
        }
        $('.unit-display').text("lb");
        kgs = false;
        changeLoad(0);
    });

    $('#collars').change(function() {
        collars = this.checked;
        changeLoad(0);
    });

    $('#kg-bar').change(function() {
        kgBar = this.checked;
        changeLoad(0);
    });

    function roundToTen(number){
    	return Math.round(10*number)/10;
    }
    function changeLoad(weightChange) {
        resetAnimationContainer();

        //get & update displayed weight
        let currentWeight = $('.weight-display').val();
        currentWeight =	roundToTen(parseFloat(currentWeight) + parseFloat(weightChange));
        $('.weight-display').val(currentWeight);

        //convert to lbs if displaying lbs
        if ($('.unit-display').text() == 'lb') {
            currentWeight *= (1 / 2.205);
            currentWeight = roundToTen(currentWeight);
        }

        //store ideal weight for later
        let idealWeight = currentWeight;

        //subtract barbell weight
        if (kgBar) {
            currentWeight -= 20;
        } else {
            currentWeight -= (45 * (1 / 2.205));
        }

        //if collars, subtract 5kg collar weight, add them last
        if (collars) {
            currentWeight -= 5.0;
        }

        //calculate and display exact load & error
        var error = loadPlates(currentWeight);
        if (kgs) {
            $('.actual-load').text("Actual Load: " + roundToTen(idealWeight - error) + "kg (" + roundToTen((idealWeight - error)*2.205) + "lbs)");
            $('.error').text("Error: -" + roundToTen(error) + "kg (-" + roundToTen(2.205*error) + "lbs)");
        } else {
            $('.actual-load').text("Actual Load: " + roundToTen((idealWeight - error)*2.205) + "lbs (" + roundToTen(idealWeight - error) + "kg)");
            $('.error').text("Error: -" + roundToTen(error*2.205) + "lb (-" + roundToTen(error) + "kg)");
        }


        //add collars last
        if (collars) {
            $('.plate-text').text($('.plate-text').text() + " 2.5kg collars ");
            loadCollars();
        }else{
        	 $('.plate-text').text($('.plate-text').text().substring(0, $('.plate-text').text().length - 2));
        }


    }

    function resetAnimationContainer() {
        $('.animation-container').empty();
        currentOffset = 0;
        currentPlate = 0;
        currentDelay = 0;
    }

    function loadPlates(load) {
        $('.plate-text').empty();
        return loadReds(load);
    }

    function addPlateText(number, text) {
    	switch(text){
    		case "red":
	    		text = "Red";
	    		break;
	    	case "blue":
	    		text = "Blue";
	    		break;
	    	case "green":
	    		text = "Green";
	    		break;
	    	case "white":
	    		text = "White";
	    		break;
	    	case "fivelb":
	    		text = "5lb";
	    		break;
    		case "twolb":
	    		text = "2.5lb";
	    		break;
	    	case "onelb":
	    		text = "1.25lb";
	    		break;
	    	default:
	    		break;
    	}
        if (number === 0) {
            return;
        }
        if (number === 1) {
            $('.plate-text').text($('.plate-text').text() + " " + text + ", ");
            return true;
        }
        if (number > 1) {
            $('.plate-text').text($('.plate-text').text() + number + " " + text + "s, ");
            return true;
        }
    }

    function loadCollars() {
        if (collars) {
            var plates = ["<div class='collar' id='plate" + currentPlate + "'></div>"].join('');
            $('.animation-container').append(plates);
            TweenMax.fromTo($('#plate' + currentPlate), 0.3, {
                x: (currentOffset + 180),
                scale: 0,
                ease: Power3.easeOut
            }, {
                scale: 0.3,
                x: currentOffset-10,
                delay: currentDelay
            });
        }
    }

    function loadReds(load) {
        var plates = 0;
        while (load >= 50 && plates < 3) {
            plates++;
            load -= 50;
        }
        addWeight('red', plates, 1);
        return loadBlues(load);
    }

    function loadBlues(load) {
        var plates = 0;
        while (load >= 40 && plates < 2) {
            plates++;
            load -= 40;
        }
        addWeight('blue', plates, 1);
        return loadGreens(load);
    }

    function loadGreens(load) {
        var plates = 0;
        if (load >= 20) {
            plates++;
            load -= 20;
        }
        addWeight('green', plates, 1);
        return loadWhites(load);
    }

    function loadWhites(load) {
        var plates = 0;
        if (load >= 10) {
            plates++;
            load -= 10;
        }
        addWeight('white', plates, 1);
        return loadFives(load);
    }

    function loadFives(load) {
        var plates = 0;
        if (load >= 4.54) {
            plates++;
            load -= 4.54;
        }
        addWeight('fivelb', plates, 0.5);
        return loadTwos(load);
    }

    function loadTwos(load) {
        var plates = 0;
        if (load >= 2.27) {
            plates++;
            load -= 2.27;
        }
        addWeight('twolb', plates, 0.5);
        return loadOnes(load);
    }

    function loadOnes(load) {
        var plates = 0;
        if (load >= 1.13) {
            plates++;
            load -= 1.13;
        }
        addWeight('onelb', plates, 0.5);
        return load;
    }



    function addWeight(plate, howMany, thin) {
        if (howMany > 0) {
            addPlateText(howMany, plate);
            var added = 0;

            while (added < howMany) {
                console.log("addweight(" + plate + ");")
                var plates = ["<div class='" + plate + "' id='plate" + currentPlate + "'></div>"].join('');
                $('.animation-container').append(plates);
                TweenMax.fromTo($('#plate' + currentPlate), 0.3, {
                    x: (currentOffset + 200),
                    scale: 0,
                    ease: Power3.easeOut
                }, {
                    x: currentOffset,
                    scale: 0.3,
                    delay: currentDelay
                });
                currentPlate++;
                currentOffset += 10 * thin;
                added++;
                currentDelay += 0.25;
            }

        }
    }

});