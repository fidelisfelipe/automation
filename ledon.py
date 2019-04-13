import RPi.GPIO as GPIO
import time
 
pin = 7          # The pin connected to the LED
 
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
GPIO.setup(pin, GPIO.OUT)
 
GPIO.output(pin, GPIO.HIGH)
print "On LED "