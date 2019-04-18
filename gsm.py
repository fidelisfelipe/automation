import RPi.GPIO as gpio
import serial
import os, time, sys

SERIAL_PORT = "/dev/ttyS0"

ser = serial.Serial(SERIAL_PORT, baudrate=9600, timeout=1)

#enviando sms
ser.write("AT+CMGF=1\r")
time.sleep(3)
ser.write('AT+CMGS="991425764"\r')
msg="teste message rpi"
print("enviando mensagem...")
time.sleep(3)
ser.write(msg+chr(7))
time.sleep(3)
print("enviada")

#ligando
ser.write("ATD991425764;\r");
print("ligando...")
time.sleep(10)
ser.write("ATH\r")
print("atendeu")

