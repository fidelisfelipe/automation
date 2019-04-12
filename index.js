var express = require('express'); 
var app = express();
var path = require('path');
var gpio = require('rpi-gpio');
var MPU6050 = require('i2c-mpu6050');
var i2c = require('i2c-bus');

var LED = 7;
var ECHO = 17;
var TRIGGER = 11;

var SCL = 3;
var SDA = 5;

var address = 0x68; // Adresse du capteur

var statusLed = "Press Button";
var statusPulse = "Press Button";
var statusAcel = "Press Button";

//definições
gpio.setup(LED, gpio.DIR_OUT);
//sonar
gpio.setup(ECHO, gpio.DIR_IN);
gpio.setup(TRIGGER, gpio.DIR_IN);
//gpio.setup(SCL, gpio.DIR_OUT);
//gpio.setup(SDA, gpio.DIR_OUT);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'));
app.get('/', function(req, res){ 
  res.render('index',{statusLed:statusLed, statusPulse:statusPulse, statusAcel:statusAcel});
});

app.post('/led/on', function(req, res){
	gpio.write(LED, true, function(err) {
        	if (err) throw err;
        	console.log('Written True to pin');
		console.log(path.join(__dirname, 'public'));
		statusLed = "Led is On";
		return res.render('index', {statusLed: statusLed, statusPulse: statusPulse, statusAcel:statusAcel});
	});
});

app.post('/led/off', function(req, res){
	gpio.write(LED, false, function(err) {
		if (err) throw err;
        	console.log('Written False to pin');
		console.log(path.join(__dirname, 'public'));
		statusLed = "Led is Off";
		return res.render('index',{statusLed: statusLed, statusPulse: statusPulse, statusAcel:statusAcel});
	});
});

app.post('/pulse/on', function (req, res){
	console.log('pulse send');

	gpio.write(LED, true, function (err){
		if (err) throw err;
		console.log('Senden Pulse to pin');

		var ID = 1;
		
		var bus = i2c.openSync(ID); // CrÃ©ation d'une connexion au bus I2C
		//bus.writeByteSync(address, 0x6b, 0); // On rÃ©veille le capteur
		bus.writeByteSync(address, 0x6b, 0); // On rÃ©veille le capteur

		var i2c1 = i2c.openSync(ID);

		var sensor = new MPU6050(i2c1, address);

		var data = sensor.readSync();
		console.log(data);

		statusAcel = JSON.stringify(data);
		console.log(statusAcel);
		console.log('------------------------');
		console.log(data);
		//getDataAcel();
                return res.render('index', {statusLed: statusLed, statusPulse: statusPulse, statusAcel:statusAcel});
	});

});

function getDataAcel(){
	// Instantiate and initialize.
	var mpu = new mpu6050();
	mpu.initialize();

	// Test the connection before using.
	mpu.testConnection(function(err, testPassed) {
	  if (testPassed) {
	    mpu.getMotion6(function(err, data){
	      console.log(data);
	    });
	    // Put the MPU6050 back to sleep.
	    mpu.setSleepEnabled(1);
	  }
	});
}

function getX(){
	var address = 0x68; // Adresse du capteur
	var bus = i2c.openSync(1); // CrÃ©ation d'une connexion au bus I2C
	bus.writeByteSync(address, 0x6b, 0); // On rÃ©veille le capteur
	bus.writeByteSync(address, 0x6b, 0); // On rÃ©veille le capteur
	var register = 0x3b; // Registre correspondant Ã  la composante X de l'accÃ©lÃ©romÃ¨tre
	var high = bus.readByteSync(address, register); // Lecture du premier octet
	var low = bus.readByteSync(address, register + 1); // Lecture du deuxiÃ¨me octet
	// Conversion de la valeur reprÃ©sentÃ©e avec le complÃ©ment Ã  deux
	var val = (high << 8) + low;
	if (val >= 0x8000) {
		val = -((65535 - val) + 1);
	}

	console.log('Accelerometer X:', val);
	return val;
}


app.listen(3000, function () {
  console.log('Server Started on Port: 3000!')
})
