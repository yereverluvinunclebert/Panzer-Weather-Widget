# Panzer-Weather-YWidget
 
Panzer Weather Gauge Yahoo Widget, written in Javascript and XML for the Yahoo 
Widget (Konfabulator) Engine. Created for XP, Vista, Win7, 8, 10+ as well as  Apple Mac Sierra.

![panzerWeather650](https://github.com/yereverluvinunclebert/Panzer-Weather-Widget/assets/2788342/73c299e9-b8f6-422d-9a95-5f70a16183e3)

This Panzer weather widget is an attractive set of dieselpunk Yahoo widgets for 
your desktop. It is a set of weather gauges. The widget consists of five gauges, 
a clipboard display and a tape reading device. The five gauges are: a barometer for telling 
the pressure; an anemometer for displaying the wind speed and direction; a 
thermometer for the temperature; a humidity gauge. The use of the five gauges 
will allow you to determine the weather in your local area and the likelihood of 
change. The fifth gauge shows the current weather in iconised form, this is be a 
summary of the information derived from the weather or the current weather 
forecast...

![weather-icon-01](https://github.com/yereverluvinunclebert/Panzer-Weather-Widget/assets/2788342/ff953574-718b-47d1-84af-b425771a7db1)

![background](https://github.com/yereverluvinunclebert/Panzer-Weather-Widget/assets/2788342/07b0c7b4-a4e9-4b6c-89d3-fde55b0b735b)


It takes the weather from forecasts provided by airports and airfields. If you 
can find an airfield nearby that has an ICAO code then it will supply local 
weather data. You enter your local town name and if it has an airfield then it 
will have a forecast. The data feed is provided by Aviation Weather GOV - 

	aviationweather.gov/  

In addition there is a clipboard which tells you the weather in textual form.
Double-click on a gauge to get the latest weather. 

![panzer-weather-help](https://github.com/yereverluvinunclebert/Panzer-Weather-Widget/assets/2788342/23582667-4a0d-4719-b6a0-b1a1407ccf7f)
 
These Widget gauges are moveable widgets that you can move anywhere around the 
desktop as you require.The widgets can be resized - Hover the cursor over each 
widget. Press the CTRL key and use your mousewheel up or down. The widget will 
resize dynamically.

![panzer-weather-gauges](https://github.com/yereverluvinunclebert/Panzer-Weather-Widget/assets/2788342/9d1fb5ee-0e4e-467a-a337-36fd2fa9bc64)


All javascript widgets need an engine to function, in this case the widget uses 
the Yahoo Widget Konfabulator engine. The engine interprets the javascript and 
creates the widget according to the XML description and using the images you 
provide. 

![panzer-temperature-icon](https://github.com/yereverluvinunclebert/Panzer-Weather-Widget/assets/2788342/f4b3b246-c895-4458-ab29-57a5f84e0d26)

Built using: 

	RJTextEd Advanced Editor  https://www.rj-texted.se/  
	Adobe Photoshop CS ver 8.0 (2003)  https://www.adobe.com/uk/products/photoshop/free-trial-download.html  

Tested on :

	ReactOS 0.4.14 32bit on virtualBox    
	Windows 7 Professional 32bit on Intel    
	Windows 7 Ultimate 64bit on Intel    
	Windows 7 Professional 64bit on Intel    
	Windows XP SP3 32bit on Intel    
	Windows 10 Home 64bit on Intel    
	Windows 10 Home 64bit on AMD    
	Windows 11 64bit on Intel  
	
Dependencies:

o A windows-alike o/s such as Windows XP, 7-11 or Apple Mac OSX Sierra.    	

o Installation of the yahoo widget SDK runtime engine  

	Yahoo widget engine for Windows - http://g6auc.me.uk/ywidgets_sdk_setup.exe  
	Yahoo widget engine for Mac - https://rickyromero.com/widgets/downloads/yahoo-widgets-4.5.2.dmg

Running the widget using a javascript engine frees javascript from running only 
within the captivity of a browser, you will now be able to run these widgets on 
your Windows desktop as long as you have the correct widget engine installed.

![panzer-clipboard-help](https://github.com/yereverluvinunclebert/Panzer-Weather-Widget/assets/2788342/91ef78ab-c7c6-4836-a9b1-d01e78014116)

 
Instructions for running Yahoo widgets on Windows
=================================================

1. Install yahoo widget SDK runtime engine
2. Download the gauge from this repo.
3. Unzip it
4. Double-click on the resulting .KON file and it will install and run

Instructions for running Yahoo widgets on Mac OS/X ONLY
========================================================

1. Install yahoo widget SDK runtime engine for Mac
2. Download the gauge from this repo.
3. Unzip it
4. For all all recent versions of Mac OS/X including Sierra, edit the following 
file:

com.yahoo.widgetengine.plist which is in /Users/xxx/Library/Preferences. Look 
for these lines: 
   
	<key>DockOpen</key>  
	<string>false</string>  

Change to false if it is true.

5. Double-click on the widgets .KON file and it will install and run

Wit these instructions you should be able to start Yahoo! Widgets and the 
menubar item should appear. Widgets can then be started from the menubar or by 
double-clicking on the KON file in the usual way.

![weather](https://github.com/yereverluvinunclebert/Panzer-Weather-Widget/assets/2788342/4ab9945b-f460-43c9-b2d2-92a0643c50d0)


LICENCE AGREEMENTS:

Copyright 2023 Dean Beedell

In addition to the GNU General Public Licence please be aware that you may use
any of my own imagery in your own creations but commercially only with my
permission. In all other non-commercial cases I require a credit to the
original artist using my name or one of my pseudonyms and a link to my site.
With regard to the commercial use of incorporated images, permission and a
licence would need to be obtained from the original owner and creator, ie. me.
