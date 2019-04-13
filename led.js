var gpio = require('rpi-gpio');

var LED = 7;

gpio.setup(LED, gpio.DIR_OUT);

gpio.write(LED, true, function (err){
		console.log('show light');
	return 0;
});