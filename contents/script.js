/*   ||  
	Panzer Weather Widget

	Created by Dean Beedell

	Sorted by Harry Whitfield - with anticipation of the sorting yet to come!
 
	email: dean.beedell@lightquick.co.uk
	http//lightquick.co.uk
	
//  Example ICAO codes:
//
//  EGKA 	Shoreham
//  EGKB 	Biggin Hill
//  EGTK 	Oxford / Kidlington existing airport for which no weather information is provided
//  EG23 	Greenham Common (Closed airport for which no weather information is provided)
//  KBWI        Baltimore Washington International USA (MD)
//  KBGR        Bangor USA (MAINE)
//  KBTR        Baton rouge Ryan Field USA
//
//  The icao_data.dat file originates from this site : //  http://openflights.org/data.html
//  The data resides on git hub and is updated regularly.
//  https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat

//  The file is named airports.dat, you'll need to pull down a copy to keep it up to date and place it in the
//  resources folder in place of the current version. Keep the old one just in case the data format changes.
//
//  http://ourairports.com/data/ is another location for a similar file but in a different format
//  that will not operate with this widget unless the data is massaged...

// Harry, I know the gauges should be separate objects - and they might well be when I
// have made the whole widget work.

// fixed and tested stopping gauges, added rotation and reset
// cloud cover in metres - fixed
// create new image for window entering the ICAO codes
// test icao codes/locations entering and using
// add sounds to the icao code dialogue
// add button to obtain icao list
// add button to play sound
// removed functionality to control mainScreen placement for all gauges on screen 
//      on startup using manual methods and as a percentage on landscape/portrait
// added code to get the icao codes
// added menu item to get the icao code download
// refresh metar data feed menu option - needs a busytimer call
// locking pin startup checks
// barometric date comparison on pressure drop
// percentage placement according to landscape orientation
    thermometer, barometer
     anemometer, humidity
// test the placement in portrait mode using ctrl+alt+cursor keys
// photoshop new temperature face -30
// fahrenheit temperature percentage calculation for fahrenheit face especially the black window reading
// each individual gauge receives focus as the mouse enters enabling the pop-up weather box to function on all gauges
// add useful comments on polling to busy counter
// photoshop new pressure face = inches of mercury
// photoshop new pressure face = hPa
// add a clunk when changing faces
// fixed a variable declaration bug in checkIcaoFile
// weather icon gauge - design and implement
// gave shadows to all daylight weather icons
// fixed poll return count so that when the airport provides no METAR data, is handled gracefully
// removed some obsolete code
// face for mm/Hg
// added green/red lamp functionality showing validity of the feed
// barometer history pointer initial rotation set on restart
// added barometer face selection on restart
// gave shadows to all nighttime weather icons
// add improved moon images to the nighttime icons
// replaced the wind icons with coloured wind sock
// some new preference/configuration options 
// time to next poll indicator
// time to next poll indicator tooltip
// after a sleep it ought to try to poll
// after a sleep the error message should be suppressed
// the error message should only appear after 'n' defined attempts at polling
// anemometer face for wind speed in m/sec and code to switch
// kelvin face for the temperature gauge and code to switch
// fixed the text window displaying an overload due to an undefined value 
// fixed the text window displaying an incorrect value 
// when you change the face on a gauge (knots to m/sec for example) the clipboard text should change too
// when you change the face on a gauge the tooltip text should change too as above
// fixed the storm warning drop lamp indicating too early

// Modified to run under os/x
// added development tab in prefs
// added edit field in prefs
// added edit command to the menu

// To Do:

// placement on startup - overlapping gauges - try on the Win10 box first
// record help .mp3 for the icao code box speaker using audacity
// when previously polling successfully and a new icao code/location is selected and it is a bad location - say so
// lining up the pressure numerals in the window
// inclusion of sample data to allow testing

// jslint
//
// combine the gauge code to create gauge objects, is it worth the complexity?
*/

/*jslint multivar, this */

/*property
    MouseWheelPref, altKey, busy, clockFaceSwitchPref, clockSize, ctrlKey,
    data, duration, ease, endAngle, floor, getDate, getHours, getMilliseconds,
    getMinutes, getSeconds, getTime, getTimezoneOffset, hOffset,
    hRegistrationPoint, height, kEaseOut, length, mainDLSPref, match,
    maxLength, milliseconds, minLength, onMouseDown, onMouseUp, onMouseWheel,
    opacity, option, optionListPref1, optionListPref2, platform, readFile,
    rotation, round, scrollDelta, secyDLSPref, setTime, size, soundPref, split,
    src, srcHeight, srcWidth, start, startAngle, startTime, ticks, toFixed,
    toString, tooltip, vOffset, vRegistrationPoint, value, visible, width
*/

"use strict";

var mainWindow, background, surround, switchFacesButton, ramAveText,
		hourHand, hourShadow, minuteHand, minuteShadow, secondHand, secondShadow,
	        bigReflection, windowReflection,
		startButton, stopButton, pin, prefs, tankHelp, helpbutton, ActionSwitch,
		createLicence, setmenu, theDLSdelta, lprint, smallMinuteHand,
		helpButton, showFace, mainScreen, settooltip, checkLockWidget;
		
// vars for barometer resizing		

var barometerWindowx = 785, barometerWindowy = 622;
var barometerBackxo = 0, barometerBackyo = 0, barometerBackgroundxo = 7, barometerBackgroundyo = 0;
var barometerSurroundxo = 0, barometerSurroundyo = 0;
var barometerSwitchFacesButtonxo = 710, barometerSwitchFacesButtonyo = 267;
var barometerDangerLampxo = 327, barometerDangerLampyo = 360;
var barometerStartButtonxo = 710, barometerStartButtonyo = 135;
var barometerStopButtonxo = 710, barometerStopButtonyo = 395;
var barometerSecondxo = 416, barometerSecondyo = 313, barometerSecondxr = 11.5, barometerSecondyr = 245.5;
var barometerSecondshadowxo = 416, barometerSecondshadowyo = 313, barometerSecondshadowxr = 22.5, barometerSecondshadowyr = 260.5;
var barometerShadowOffset = 0;
var barometerBigReflectionxo = 169, barometerBigReflectionyo = 69;
var barometerWindowReflectionxo = 511, barometerWindowReflectionyo = 210;
var barometerPinxo = 162, barometerPinyo = 60;
var barometerPrefsxo = 161, barometerPrefsyo = 516;
var barometerHelpButtonxo = 625, barometerHelpButtonyo = 516;
var barometerActionSwitchxo = 625, barometerActionSwitchyo = 59;
var barometerManualxo = 417, barometerManualyo = 317, barometerManualxr = 277, barometerManualyr = 277;

// windows
var barometerTextxo = 330, barometerTextyo = 209;
var barometerHighTextxo = 523, barometerHighTextyo = 403;
// macintosh
var barometerTextAreaxo = 346, barometerTextAreayo = 190;
var barometerHighTextAreaxo = 536, barometerHighTextAreayo = 383;

// vars for thermometer resizing		

var thermometerWindowx = 785, thermometerWindowy = 622;
var thermometerBackxo = 0, thermometerBackyo = 0, thermometerBackgroundxo = 7, thermometerBackgroundyo = 0;
var thermometerSurroundxo = 0, thermometerSurroundyo = 0;
var thermometerSwitchFacesButtonxo = 710, thermometerSwitchFacesButtonyo = 267;
var thermometerHotLampxo = 247, thermometerHotLampyo = 150;
var thermometerColdLampxo = 547, thermometerColdLampyo = 150;
var thermometerStartButtonxo = 710, thermometerStartButtonyo = 135;
var thermometerStopButtonxo = 710, thermometerStopButtonyo = 395;
var thermometerSecondxo = 416, thermometerSecondyo = 313, thermometerSecondxr = 11.5, thermometerSecondyr = 245.5;
var thermometerSecondshadowxo = 416, thermometerSecondshadowyo = 313, thermometerSecondshadowxr = 22.5, thermometerSecondshadowyr = 260.5;
var thermometerShadowOffset = 0;
var thermometerBigReflectionxo = 169, thermometerBigReflectionyo = 69;
var thermometerWindowReflectionxo = 511, thermometerWindowReflectionyo = 210;
var thermometerPinxo = 162, thermometerPinyo = 60;
var thermometerPrefsxo = 161, thermometerPrefsyo = 516;
var thermometerHelpButtonxo = 625, thermometerHelpButtonyo = 516;
var thermometerActionSwitchxo = 625, thermometerActionSwitchyo = 59;

// windows
var thermometerTextxo = 328, thermometerTextyo = 208;
var thermometerScaleTextxo = 523, thermometerScaleTextyo = 401;
// macintosh
var thermometerTextAreaxo = 335, thermometerTextAreayo = 189;
var thermometerScaleTextAreaxo = 530, thermometerScaleTextAreayo = 380;

// vars for humidity gauge resizing		

var humidityWindowx = 785, humidityWindowy = 622;
var humidityBackxo = 0, humidityBackyo = 0, humidityBackgroundxo = 7, humidityBackgroundyo = 0;
var humiditySurroundxo = 0, humiditySurroundyo = 0;
var humiditySwitchFacesButtonxo = 710, humiditySwitchFacesButtonyo = 267;
var humidityDangerLampxo = 247, humidityDangerLampyo = 150;
var humidityStartButtonxo = 710, humidityStartButtonyo = 135;
var humidityStopButtonxo = 710, humidityStopButtonyo = 395;
var humiditySecondxo = 416, humiditySecondyo = 313, humiditySecondxr = 11.5, humiditySecondyr = 245.5;
var humiditySecondshadowxo = 416, humiditySecondshadowyo = 313, humiditySecondshadowxr = 22.5, humiditySecondshadowyr = 260.5;
var humidityShadowOffset = 0;
var humidityBigReflectionxo = 169, humidityBigReflectionyo = 69;
var humidityWindowReflectionxo = 511, humidityWindowReflectionyo = 210;
var humidityPinxo = 162, humidityPinyo = 60;
var humidityPrefsxo = 161, humidityPrefsyo = 516;
var humidityHelpButtonxo = 625, humidityHelpButtonyo = 516;
var humidityActionSwitchxo = 625, humidityActionSwitchyo = 59;

// windows
var humidityTextxo = 330, humidityTextyo = 207;
// macintosh
var humidityTextAreaxo = 340, humidityTextAreayo = 188;

// vars for anemometer gauge resizing		

var anemometerWindowx = 785, anemometerWindowy = 622;
var anemometerBackxo = 0, anemometerBackyo = 0, anemometerBackgroundxo = 7, anemometerBackgroundyo = 0;
var anemometerSurroundxo = 0, anemometerSurroundyo = 0;
var anemometerSwitchFacesButtonxo = 710, anemometerSwitchFacesButtonyo = 267;
var anemometerLampxo = 305, anemometerLampyo = 290;
var anemometerStartButtonxo = 710, anemometerStartButtonyo = 135;
var anemometerStopButtonxo = 710, anemometerStopButtonyo = 395;
var anemometerWindHandxo = 414, anemometerWindHandyo = 313, anemometerWindHandxr = 11.5, anemometerWindHandyr = 245.5;
var anemometerSecondxo = 416, anemometerSecondyo = 313, anemometerSecondxr = 11.5, anemometerSecondyr = 245.5;
var anemometerSecondshadowxo = 416, anemometerSecondshadowyo = 313, anemometerSecondshadowxr = 22.5, anemometerSecondshadowyr = 260.5;
var anemometerTextxo = 482, anemometerTextyo = 285;
var anemometerTextAreaxo = 492, anemometerTextAreayo = 268;
var anemometerShadowOffset = 0;
var anemometerBigReflectionxo = 169, anemometerBigReflectionyo = 69;
var anemometerWindowReflectionxo = 511, anemometerWindowReflectionyo = 210;
var anemometerPinxo = 162, anemometerPinyo = 60;
var anemometerPrefsxo = 161, anemometerPrefsyo = 516;
var anemometerHelpButtonxo = 625, anemometerHelpButtonyo = 516;
var anemometerActionSwitchxo = 625, anemometerActionSwitchyo = 59;


// vars for weatherIconGaugegauge resizing		

var weatherIconGaugeWindowx = 785, weatherIconGaugeWindowy = 622;
var weatherIconGaugeBackxo = 0, weatherIconGaugeBackyo = 0, weatherIconGaugeBackgroundxo = 7, weatherIconGaugeBackgroundyo = 0;
var weatherIconGaugeSurroundxo = 0, weatherIconGaugeSurroundyo = 0;
var weatherIconGaugeSwitchFacesButtonxo = 710, weatherIconGaugeSwitchFacesButtonyo = 267;
var weatherIconGaugeLampxo = 393, weatherIconGaugeLampyo = 516;
var weatherIconGaugeStartButtonxo = 710, weatherIconGaugeStartButtonyo = 135;
var weatherIconGaugeStopButtonxo = 710, weatherIconGaugeStopButtonyo = 395;
var weatherIconGaugeShadowOffset = 0;
var weatherIconGaugeBigReflectionxo = 169, weatherIconGaugeBigReflectionyo = 69;
var weatherIconGaugeWindowReflectionxo = 511, weatherIconGaugeWindowReflectionyo = 210;
var weatherIconGaugePinxo = 162, weatherIconGaugePinyo = 60;
var weatherIconGaugePrefsxo = 161, weatherIconGaugePrefsyo = 516;
var weatherIconGaugeHelpButtonxo = 625, weatherIconGaugeHelpButtonyo = 516;
var weatherIconGaugeActionSwitchxo = 625, weatherIconGaugeActionSwitchyo = 59;
var weatherIconGaugeManualxo = 417, weatherIconGaugeManualyo = 317, weatherIconGaugeManualxr = 277, weatherIconGaugeManualyr = 277;

var weatherIconxo = 360, weatherIconyo = 245;
var windIconxo = 360, windIconyo = 245;
var fogIconxo = 360, fogIconyo = 245;
var exoticIconxo = 360, exoticIconyo = 245;
var showersIconxo = 360, showersIconyo = 245;

var infoWindowx = 950, infoWindowy = 1300;
var textBckgndxo = 0, textBckgndyo = 0;
var weatherTextxo = 47,weatherTextyo = 60;

var loc; 
var debugFlg = "1";
var busyCounter = 1;
var totalBusyCounter = 0;
var gaugeCounter = 0;
var useAlternative = false;
var wind_speed_kt; 
var theDate;	
var $measureType="imperial";
var $metarname = "";
var $wxInfo = new Array();

var uc = false;
var s = false;
var locTranslation;

var wind_dir_degrees = 0;
var compassDirection = "unknown";
var selectedGauge;
var rotateObject;

var icaoLocation1 = "";
var icaoLocation2 = "";
var icaoLocation3 = "";
var icaoLocation4 = "";
var icaoLocation5 = "";
var pressureValue;
var temperatureValue = 0;
var humidityValue = 0;
var wind_speed_kt = 0;

	var difString = "";
	var wx_string = ""; 
	var precip_in = ""; 

var gCity,
    gTemp; // for vitality

var currIcon = "Resources/images/dock.png";
var widgetName = "Panzer Weather Ywidget.widget";

var counter = "Resources/sounds/counter.mp3";
var lock = "Resources/sounds/lock.mp3";
var till = "Resources/sounds/till01.mp3";
var ting = "Resources/sounds/ting.mp3";
var mistake = "Resources/sounds/mistake.wav";
var thhhh = "Resources/sounds/thhhh.mp3";
var winding = "Resources/sounds/winding.mp3";
var click1 = "Resources/sounds/click1.mp3";
var clunk = "Resources/sounds/clunk.mp3";
var relay = "Resources/sounds/relay.mp3";
var sparks = "Resources/sounds/sparks.mp3";
var shutdown = "Resources/sounds/shutdown.mp3";

var timeLeftInSeconds = preferences.sampleIntervalPref.value;
var weatherIconGaugeTimerCount = 0;
var theClock = null;

var oldAspectRatio = "landscape";
var icaoDataFile;

include("functions.js");
include("Resources/Licence/licence.js");
include("SPclock.js");

barometerManual.rotation = -15;

preferences.infoSize.value = 100; // the clipboard is always the original size
preferences.sampleIntervalPref2.value = preferences.sampleIntervalPref.value;

//initialise the forecast time clock
theDate = new Date();
theClock = new SPclock(infoWindow, 35, 45, 1, 0.4);
theClock.displayTime(new Date());

// extract the icao_locations data file to the user data folder
icaoDataFile = widget.extractFile("Resources/icao_codes.dat");

if (preferences.langpref.value === "alternative") {
    var data = filesystem.readFile("Resources/" + preferences.langpref2.value + "/Localizable.strings");
    var useAlternative = true;
    var ro = roMap(data);
    if (debugFlg === 1) { print("%init - widget will use the language code " + preferences.langpref2.value)};
} else {
    if (debugFlg === 1) { print("%init - default system.languages: " + system.languages)};
}


//========================
// initialise all the timers
//========================


//========================
//  sleepTimer
//========================
var sleepTimer = new Timer();
sleepTimer.interval = 60;
sleepTimer.ticking=false;
// the sleep timer only functions when the system awakes from sleep
sleepTimer.onTimerFired = function () {
    sleepTimerFunction();
};
//========================
//End timer function
//========================

//========================
//  weatherIconGaugeTimer
//========================
var weatherIconGaugeTimer = new Timer();
weatherIconGaugeTimer.interval = 5;
weatherIconGaugeTimer.ticking=false;
// the weatherIconGaugeTimer only functions when the feed is good and returning valid data
weatherIconGaugeTimer.onTimerFired = function () {
    weatherIconGaugeTimerFunction();
}
//========================
//End timer function
//========================


//========================
//  positionTimer
//========================
var positionTimer = new Timer();
positionTimer.interval = 5;
positionTimer.ticking=true;
// the position timer functions regularly from the outset to record the widget position
positionTimer.onTimerFired = function () {
    positionTimerFunction();
}
//========================
//End timer
//========================



//========================

//========================
var pressureStorageTimer = new Timer();
pressureStorageTimer.interval = preferences.pressureTimerInterval.value; //3600;
pressureStorageTimer.ticking=true;
// the pressureStorage timer functions regularly from the outset to test for any large pressure drop (storm)
pressureStorageTimer.onTimerFired = function () {
    pressureStorageTimerFunction();
}
//========================
//End timer
//========================


//========================
// the gaugeTimer is here to separate the gauge animations to 1 second apart
// this is because three/four animations occurring together simultaneously fails to draw correctly
// causing pointer remnants and white widget backgrounds when the transparent mask is not maintained
// due to the widget engine giving the processor too much to do within the widget.
//========================
var gaugeTimer = new Timer();
gaugeTimer.interval = 1;
gaugeTimer.ticking=false;
// the GaugeTimer only functions when the feed is good and returning valid data
gaugeTimer.onTimerFired = function () {
    gaugeTimerFunction();
};
//========================
//End function
//========================


//========================
// the alarm timer changes the alarm icon
//========================
var alarmTimer = new Timer();
alarmTimer.interval = 0.1;
alarmTimer.ticking=false;
// the alarmTimer only functions when an alarm condition is raised by the main program
alarmTimer.onTimerFired = function () {
    alarmTimerFunction();
};
//========================
//End function
//========================

//========================
// the alarm timer changes the busy icon
//========================
var busyTimer = new Timer();
busyTimer.interval = 0.1;
busyTimer.ticking=false;
// the busy Timer only functions when the rotating hourglass is required, called in several places
busyTimer.onTimerFired = function () {
    busyTimerFunction();
};
//========================
//End function
//========================

//=====================================
// weather timer setup
//=====================================
var weatherTimer = new Timer();
weatherTimer.ticking = false;
weatherTimer.interval = preferences.sampleIntervalPref.value;
timeLeftInSeconds = preferences.sampleIntervalPref.value;
// the weather Timer functions when the main startup routine requests it
weatherTimer.onTimerFired = function () {
    weatherTimerFunction();
};
//========================
//End function
//========================

//========================
// end of timer initialisations
//========================


//=======================================================================
// this function is called when the widget loads
//=======================================================================
widget.onload = function() {
    startup();
};
//========================
//End function
//========================

//=======================================================================
// this function is called when the widget prefs are changed
//=======================================================================
widget.onPreferencesChanged = function() {
   busyStart();
 // start the busy timer a little earlier
    changePrefs();
    startup();
};
//========================
//End function
//========================

//=======================================================================
// this function is called when the widget prefs are changed
//=======================================================================
widget.onWakeFromSleep = function() {
//There is usually a delay of about 15 seconds between when the computer
//wakes and when the onWakeFromSleep event is sent. This is to give the networking stack time to recover before 
// the Widget timers start to function again.
// we add another delay (60 secs) through the sleep timer to give the wirless network enough time to wake up and connect
    busyTimer.ticking=true;
    sleepTimer.ticking=true;
};
//========================
//End function
//========================


//=======================================================================
// this function is called by widget.onload 
//=======================================================================
function startup() {
    

    setDebugState();

    sizeClock("all");
    setTextAreas();
    checkAndSetAnemometerScale();
	setAnemometerText();
    checkAndSetThermometerScale();
	setThermometerText();
    checkAndSetBarometerScale();
	setBarometerText();
    mainScreen();
    checkLockWidget();
    createLicence(mainWindow);
    confirmUpdateWeather();
    setmenu();
    settooltip();
    checkTheData();
    sethoverTextFont();
    setInfoWindow();
    zeroGauges();

        helpWindow.hoffset = screen.width / 2 - helpWindow.width / 2;
        helpWindow.voffset = screen.height / 2 - helpWindow.height / 2;
//        helpWindow.hoffset = 500;
//        helpWindow.voffset = 300;

}
//========================
//End function
//========================


//=======================================================================
// this function resizes the three gauges separately
//=======================================================================
function sizeClock(gaugeSelected) {
	var infoScale = Number(preferences.infoSize.value) / 100;
	var barometerScale = Number(preferences.barometerSize.value) / 100;
	var thermometerSize = Number(preferences.thermometerSize.value) / 100;
	var anemometerScale = Number(preferences.anemometerSize.value) / 100;
	var weatherIconGaugeScale = Number(preferences.weatherIconGaugeSize.value) / 100;
	var humidityScale = Number(preferences.humiditySize.value) / 100;


	function sc(img, hOffset, vOffset, hReg, vReg, scale) {
		img.hOffset = Math.round(hOffset * scale);
		img.vOffset = Math.round(vOffset * scale);
		img.width = Math.round(img.srcWidth * scale);
		img.height = Math.round(img.srcHeight * scale);
		if (hReg != undefined) {
			img.hRegistrationPoint = Math.round(hReg * scale);
		}
		if (vReg != undefined) {
			img.vRegistrationPoint = Math.round(vReg * scale);
		}
	}
	function s2(img, hOffset, vOffset, hReg, vReg, scale) {
		img.hOffset = Math.round(hOffset * scale);
		img.vOffset = Math.round(vOffset * scale);
		img.width = Math.round(img.srcWidth * 2.2 * scale);
		img.height = Math.round(img.srcHeight * 2.2 * scale);
		if (hReg != undefined) {
			img.hRegistrationPoint = Math.round(hReg * scale);
		}
		if (vReg != undefined) {
			img.vRegistrationPoint = Math.round(vReg * scale);
		}
	}
	
	//===================================
	// resize the clipboard
	//===================================
	//print("gaugeSelected "+ gaugeSelected);
   if (gaugeSelected === "clipboard" || gaugeSelected === "all") {
		infoWindow.width = Math.round(infoWindowx * infoScale);
		infoWindow.height = Math.round(infoWindowy * infoScale);
		sc(textBckgnd, textBckgndxo, textBckgndyo,null,null,infoScale);
		weatherText.size = Math.round(8 * infoScale);
		weatherText.width = Math.round(150 * infoScale);
		weatherText.hOffset = Math.round(weatherTextxo * infoScale);
		weatherText.vOffset = Math.round(weatherTextyo * infoScale);
   }
	//===================================
	// resize the humidity gauge
	//===================================
	//print("gaugeSelected "+ gaugeSelected);
   if (gaugeSelected === "humidity" || gaugeSelected === "all") {
		humidityWindow.width = Math.round(humidityWindowx * humidityScale);
		humidityWindow.height = Math.round(humidityWindowy * humidityScale);

		sc(humidityBackground, humidityBackgroundxo, humidityBackgroundyo,null,null,humidityScale);
		sc(humiditySurround, humiditySurroundxo, humiditySurroundyo,null,null,humidityScale);
		sc(humiditySwitchFacesButton, humiditySwitchFacesButtonxo, humiditySwitchFacesButtonyo,null,null,humidityScale);
		sc(humidityDangerLamp, humidityDangerLampxo, humidityDangerLampyo,null,null,humidityScale);
		sc(humidityStartButton, humidityStartButtonxo, humidityStartButtonyo,null,null,humidityScale);
		sc(humidityStopButton, humidityStopButtonxo, humidityStopButtonyo,null,null,humidityScale);
		sc(humiditySecondHand, humiditySecondxo, humiditySecondyo, humiditySecondxr, humiditySecondyr,humidityScale);
		sc(humiditySecondShadow, humiditySecondshadowxo + humidityShadowOffset, humiditySecondshadowyo + humidityShadowOffset, humiditySecondshadowxr, humiditySecondshadowyr,humidityScale);

		sc(humidityBigReflection, humidityBigReflectionxo, humidityBigReflectionyo,null,null,humidityScale);
		sc(humidityWindowReflection, humidityWindowReflectionxo, humidityWindowReflectionyo,null,null,humidityScale);
		sc(humidityPin, humidityPinxo, humidityPinyo,null,null,humidityScale);
		sc(humidityPrefs, humidityPrefsxo, humidityPrefsyo,null,null,humidityScale);

		sc(humidityHelpButton, humidityHelpButtonxo, humidityHelpButtonyo,null,null,humidityScale);
		sc(humidityActionSwitch , humidityActionSwitchxo, humidityActionSwitchyo,null,null,humidityScale);

		humidityText.size = Math.round(20 * humidityScale);
		humidityText.hOffset = Math.round(humidityTextxo * humidityScale);
		humidityText.vOffset = Math.round(humidityTextyo * humidityScale);
		
		humidityTextArea.size = Math.round(20 * humidityScale);
		humidityTextArea.hOffset = Math.round(humidityTextAreaxo * humidityScale);
		humidityTextArea.vOffset = Math.round(humidityTextAreayo * humidityScale);
		humidityTextArea.width = Math.round(50 * humidityScale);
		humidityTextArea.height = Math.round(50 * humidityScale);
   }
	//===================================
	// resize the thermometer gauge
	//===================================

   if (gaugeSelected === "thermometer" || gaugeSelected === "all") {
		thermometerWindow.width = Math.round(thermometerWindowx * thermometerSize);
		thermometerWindow.height = Math.round(thermometerWindowy * thermometerSize);

		sc(thermometerBackground, thermometerBackgroundxo, thermometerBackgroundyo,null,null,thermometerSize);
		sc(thermometerSurround, thermometerSurroundxo, thermometerSurroundyo,null,null,thermometerSize);
		sc(thermometerSwitchFacesButton, thermometerSwitchFacesButtonxo, thermometerSwitchFacesButtonyo,null,null,thermometerSize);
		sc(thermometerHotLamp, thermometerHotLampxo, thermometerHotLampyo,null,null,thermometerSize);
		sc(thermometerColdLamp, thermometerColdLampxo, thermometerColdLampyo,null,null,thermometerSize);
		sc(thermometerStartButton, thermometerStartButtonxo, thermometerStartButtonyo,null,null,thermometerSize);
		sc(thermometerStopButton, thermometerStopButtonxo, thermometerStopButtonyo,null,null,thermometerSize);
		sc(thermometerSecondHand, thermometerSecondxo, thermometerSecondyo, thermometerSecondxr, thermometerSecondyr,thermometerSize);
		sc(thermometerSecondShadow, thermometerSecondshadowxo + thermometerShadowOffset, thermometerSecondshadowyo + thermometerShadowOffset, thermometerSecondshadowxr, thermometerSecondshadowyr,thermometerSize);

		sc(thermometerBigReflection, thermometerBigReflectionxo, thermometerBigReflectionyo,null,null,thermometerSize);
		sc(thermometerWindowReflection, thermometerWindowReflectionxo, thermometerWindowReflectionyo,null,null,thermometerSize);
		sc(thermometerPin, thermometerPinxo, thermometerPinyo,null,null,thermometerSize);
		sc(thermometerPrefs, thermometerPrefsxo, thermometerPrefsyo,null,null,thermometerSize);

		sc(thermometerHelpButton, thermometerHelpButtonxo, thermometerHelpButtonyo,null,null,thermometerSize);
		sc(thermometerActionSwitch, thermometerActionSwitchxo, thermometerActionSwitchyo,null,null,thermometerSize);

		thermometerText.size = Math.round(20 * thermometerSize);
		thermometerText.hOffset = Math.round(thermometerTextxo * thermometerSize);
		thermometerText.vOffset = Math.round(thermometerTextyo * thermometerSize);

		thermometerScaleText.size = Math.round(20 * thermometerSize);
		thermometerScaleText.hOffset = Math.round(thermometerScaleTextxo * thermometerSize);
		thermometerScaleText.vOffset = Math.round(thermometerScaleTextyo * thermometerSize);

		thermometerTextArea.size = Math.round(20 * thermometerSize);
		thermometerTextArea.hOffset = Math.round(thermometerTextAreaxo * thermometerSize);
		thermometerTextArea.vOffset = Math.round(thermometerTextAreayo * thermometerSize);
		thermometerTextArea.width = Math.round(50 * thermometerSize);
		thermometerTextArea.height = Math.round(50 * thermometerSize);
		
		thermometerScaleTextArea.size = Math.round(20 * thermometerSize);
		thermometerScaleTextArea.hOffset = Math.round(thermometerScaleTextAreaxo * thermometerSize);
		thermometerScaleTextArea.vOffset = Math.round(thermometerScaleTextAreayo * thermometerSize);
		thermometerScaleTextArea.width = Math.round(50 * thermometerSize);
		thermometerScaleTextArea.height = Math.round(50 * thermometerSize);
   }
   //===================================
	// resize the anemometer gauge
	//===================================

   if (gaugeSelected === "anemometer" || gaugeSelected === "all") {
		anemometerWindow.width = Math.round(anemometerWindowx * anemometerScale);
		anemometerWindow.height = Math.round(anemometerWindowy * anemometerScale);

		sc(anemometerBackground, anemometerBackgroundxo, anemometerBackgroundyo,null,null,anemometerScale);
		sc(anemometerSurround, anemometerSurroundxo, anemometerSurroundyo,null,null,anemometerScale);
		sc(anemometerSwitchFacesButton, anemometerSwitchFacesButtonxo, anemometerSwitchFacesButtonyo,null,null,anemometerScale);
		sc(anemometerLamp, anemometerLampxo, anemometerLampyo,null,null,anemometerScale);
		sc(anemometerStartButton, anemometerStartButtonxo, anemometerStartButtonyo,null,null,anemometerScale);
		sc(anemometerStopButton, anemometerStopButtonxo, anemometerStopButtonyo,null,null,anemometerScale);
		sc(anemometerWindHand, anemometerWindHandxo, anemometerWindHandyo, anemometerWindHandxr, anemometerWindHandyr, anemometerScale);
		sc(anemometerSecondHand, anemometerSecondxo, anemometerSecondyo, anemometerSecondxr, anemometerSecondyr,anemometerScale);
		sc(anemometerSecondShadow, anemometerSecondshadowxo + anemometerShadowOffset, anemometerSecondshadowyo + anemometerShadowOffset, anemometerSecondshadowxr, anemometerSecondshadowyr,anemometerScale);

		sc(anemometerBigReflection, anemometerBigReflectionxo, anemometerBigReflectionyo,null,null,anemometerScale);
		sc(anemometerWindowReflection, anemometerWindowReflectionxo, anemometerWindowReflectionyo,null,null,anemometerScale);
		sc(anemometerPin, anemometerPinxo, anemometerPinyo,null,null,anemometerScale);
		sc(anemometerPrefs, anemometerPrefsxo, anemometerPrefsyo,null,null,anemometerScale);

		sc(anemometerHelpButton, anemometerHelpButtonxo, anemometerHelpButtonyo,null,null,anemometerScale);
		sc(anemometerActionSwitch, anemometerActionSwitchxo, anemometerActionSwitchyo,null,null,anemometerScale);

		anemometerText.size = Math.round(18 * anemometerScale);
		anemometerText.hOffset = Math.round(anemometerTextxo * anemometerScale);
		anemometerText.vOffset = Math.round(anemometerTextyo * anemometerScale);

		anemometerTextArea.size = Math.round(18 * anemometerScale);
		anemometerTextArea.hOffset = Math.round(anemometerTextAreaxo * anemometerScale);
		anemometerTextArea.vOffset = Math.round(anemometerTextAreayo * anemometerScale);
		anemometerTextArea.width = Math.round(50 * anemometerScale);
		anemometerTextArea.height = Math.round(50 * anemometerScale);
   }
   //===================================
	// resize the weatherIconGauge gauge
	//===================================

   if (gaugeSelected === "weatherIconGauge" || gaugeSelected === "all") {
		weatherIconGaugeWindow.width = Math.round(weatherIconGaugeWindowx * weatherIconGaugeScale);
		weatherIconGaugeWindow.height = Math.round(weatherIconGaugeWindowy * weatherIconGaugeScale);

		sc(weatherIconGaugeBackground, weatherIconGaugeBackgroundxo, weatherIconGaugeBackgroundyo,null,null,weatherIconGaugeScale);
		sc(weatherIconGaugeSurround, weatherIconGaugeSurroundxo, weatherIconGaugeSurroundyo,null,null,weatherIconGaugeScale);
		sc(weatherIconGaugeSwitchFacesButton, weatherIconGaugeSwitchFacesButtonxo, weatherIconGaugeSwitchFacesButtonyo,null,null,weatherIconGaugeScale);
		sc(weatherIconGaugeLamp, weatherIconGaugeLampxo, weatherIconGaugeLampyo,null,null,weatherIconGaugeScale);
		sc(weatherIconGaugeStartButton, weatherIconGaugeStartButtonxo, weatherIconGaugeStartButtonyo,null,null,weatherIconGaugeScale);
		sc(weatherIconGaugeStopButton, weatherIconGaugeStopButtonxo, weatherIconGaugeStopButtonyo,null,null,weatherIconGaugeScale);

		sc(weatherIconGaugeBigReflection, weatherIconGaugeBigReflectionxo, weatherIconGaugeBigReflectionyo,null,null,weatherIconGaugeScale);
		sc(weatherIconGaugeWindowReflection, weatherIconGaugeWindowReflectionxo, weatherIconGaugeWindowReflectionyo,null,null,weatherIconGaugeScale);
		sc(weatherIconGaugePin, weatherIconGaugePinxo, weatherIconGaugePinyo,null,null,weatherIconGaugeScale);
		sc(weatherIconGaugePrefs, weatherIconGaugePrefsxo, weatherIconGaugePrefsyo,null,null,weatherIconGaugeScale);

		sc(weatherIconGaugeHelpButton, weatherIconGaugeHelpButtonxo, weatherIconGaugeHelpButtonyo,null,null,weatherIconGaugeScale);
		sc(weatherIconGaugeActionSwitch, weatherIconGaugeActionSwitchxo, weatherIconGaugeActionSwitchyo,null,null,weatherIconGaugeScale);
		sc(weatherIconGaugeManual, weatherIconGaugeManualxo, weatherIconGaugeManualyo, weatherIconGaugeManualxr, weatherIconGaugeManualyr,weatherIconGaugeScale);

		s2(weatherIcon, weatherIconxo, weatherIconyo,null,null,weatherIconGaugeScale);
		s2(windIcon, windIconxo, windIconyo,null,null,weatherIconGaugeScale);
		s2(fogIcon, fogIconxo, fogIconyo,null,null,weatherIconGaugeScale);
		s2(exoticIcon, exoticIconxo, exoticIconyo,null,null,weatherIconGaugeScale);
		s2(showersIcon, showersIconxo, showersIconyo,null,null,weatherIconGaugeScale);

   }
	//===================================
	// resize the barometer gauge
	//===================================
   if (gaugeSelected === "barometer" || gaugeSelected === "all") {
		barometerWindow.width = Math.round(barometerWindowx * barometerScale);
		barometerWindow.height = Math.round(barometerWindowy * barometerScale);

		sc(barometerBackground, barometerBackgroundxo, barometerBackgroundyo,null,null,barometerScale);
		sc(barometerSurround, barometerSurroundxo, barometerSurroundyo,null,null,barometerScale);
		sc(barometerSwitchFacesButton, barometerSwitchFacesButtonxo, barometerSwitchFacesButtonyo,null,null,barometerScale);
		sc(barometerDangerLamp, barometerDangerLampxo, barometerDangerLampyo,null,null,barometerScale);
		sc(barometerStartButton, barometerStartButtonxo, barometerStartButtonyo,null,null,barometerScale);
		sc(barometerStopButton, barometerStopButtonxo, barometerStopButtonyo,null,null,barometerScale);
		sc(barometerSecondHand, barometerSecondxo, barometerSecondyo, barometerSecondxr, barometerSecondyr,barometerScale);
		sc(barometerSecondShadow, barometerSecondshadowxo + barometerShadowOffset, barometerSecondshadowyo + barometerShadowOffset, barometerSecondshadowxr, barometerSecondshadowyr,barometerScale);

		sc(barometerBigReflection, barometerBigReflectionxo, barometerBigReflectionyo,null,null,barometerScale);
		sc(barometerWindowReflection, barometerWindowReflectionxo, barometerWindowReflectionyo,null,null,barometerScale);
		sc(barometerPin, barometerPinxo, barometerPinyo,null,null,barometerScale);
		sc(barometerPrefs, barometerPrefsxo, barometerPrefsyo,null,null,barometerScale);

		sc(barometerHelpButton, barometerHelpButtonxo, barometerHelpButtonyo,null,null,barometerScale);
		sc(barometerActionSwitch, barometerActionSwitchxo, barometerActionSwitchyo,null,null,barometerScale);
		sc(barometerManual, barometerManualxo, barometerManualyo, barometerManualxr, barometerManualyr,barometerScale);

		barometerText.size = Math.round(16 * barometerScale);
		barometerText.hOffset = Math.round(barometerTextxo * barometerScale);
		barometerText.vOffset = Math.round(barometerTextyo * barometerScale);

		barometerTextArea.size = Math.round(16 * barometerScale);
		barometerTextArea.hOffset = Math.round(barometerTextAreaxo * barometerScale);
		barometerTextArea.vOffset = Math.round(barometerTextAreayo * barometerScale);
		barometerTextArea.width = Math.round(50 * barometerScale);
		barometerTextArea.height = Math.round(50 * barometerScale);

		barometerHighText.size = Math.round(16 * barometerScale);
		barometerHighText.hOffset = Math.round(barometerHighTextxo * barometerScale);
		barometerHighText.vOffset = Math.round(barometerHighTextyo * barometerScale);
		
		barometerHighTextArea.size = Math.round(16 * barometerScale);
		barometerHighTextArea.hOffset = Math.round(barometerHighTextAreaxo * barometerScale);
		barometerHighTextArea.vOffset = Math.round(barometerHighTextAreayo * barometerScale);
		barometerHighTextArea.width = Math.round(50 * barometerScale);
		barometerHighTextArea.height = Math.round(50 * barometerScale);

	}
}
//========================
//End function
//========================

//=======================================================================
// this function starts the hourglass timer
//=======================================================================
function busyStart() {
   weatherIconGaugeLamp.src="Resources/images/green-lampfalse.png";
   if ( preferences.tooltipPref.value === "enabled" ) {
           weatherIconGaugeLamp.tooltip = "Feed is not yet giving valid data";
   } 
   totalBusyCounter = 0;
   busyTimer.ticking = true;
   weatherTimer.ticking = true;

}
//========================
//End function
//========================

//=======================================================================
// this is the main function that is called by the main routine
//=======================================================================
function updateWeather() {

    busyStart();
	getData(preferences.icao.value);
}
//========================
//End function
//========================

//=======================================================================
// this is the main function that is called by the main routine
//=======================================================================
function confirmUpdateWeather() {
	//var answer = alert("The widget will now poll the weather from aviationWeather.gov, the first attempt is manual, subsequent polls are automatic - proceed?", "Get the weather", "No Thanks");
    answer = 1
	if (answer === 1) {
        busyStart();
    	getData(preferences.icao.value);
	}
}
//========================
//End function
//========================

//=======================================================================
// this function determines whether the clipboard viewer is visible
//=======================================================================
function setInfoWindow() {
    if (preferences.permanentPanel.value === "enabled") {
        infoWindow.visible = true;
    } else {
        infoWindow.visible = false;
    }
}
//========================
//End function
//========================


 
//=======================================================================
// this function handles a middle button press
//=======================================================================
anemometerSwitchFacesButton.onMouseDown = function (event) {
		if (preferences.soundPref.value != "disabled") {
			play(clunk,false);
		}
		if (preferences.windUnit.value === "knots") {
			preferences.windUnit.value = "metres";
		} else {
			preferences.windUnit.value = "knots";
		}
		checkAndSetAnemometerScale();
		setAnemometerText();
		setHoverTooltip(wind_dir_degrees, wind_speed_kt, precip_in, difString, wx_string);
}
//========================
//End function
//========================
 

 
 
//=======================================================================
// this function handles a middle button press
//=======================================================================
thermometerSwitchFacesButton.onMouseDown = function (event) {
		if (preferences.soundPref.value != "disabled") {
			play(clunk, false);
		}
		if (preferences.tempUnit.value === "celsius") {
			preferences.tempUnit.value = "fahrenheit";
		} else if (preferences.tempUnit.value === "fahrenheit") {
			preferences.tempUnit.value = "kelvin";
		} else if (preferences.tempUnit.value === "kelvin") {
			preferences.tempUnit.value = "celsius";
		}
		checkAndSetThermometerScale();
		setThermometerText();
		setHoverTooltip(wind_dir_degrees, wind_speed_kt, precip_in, difString, wx_string);
}
//========================
//End function
//========================
 
//=======================================================================
// this function handles a middle button press
//=======================================================================
barometerSwitchFacesButton.onMouseDown = function (event) {
	if (preferences.soundPref.value != "disabled") {
		play(clunk, false);
	}
	if (preferences.barometerScalePref.value === "millibars") {
		preferences.barometerScalePref.value = "hg";
	} else if (preferences.barometerScalePref.value === "hg") {
		preferences.barometerScalePref.value = "hpa";
	} else if (preferences.barometerScalePref.value === "hpa") {
		preferences.barometerScalePref.value = "mmhg";
	} else if (preferences.barometerScalePref.value === "mmhg") {
		preferences.barometerScalePref.value = "millibars";
	}	 	
	checkAndSetBarometerScale();
	setBarometerText();
	setHoverTooltip(wind_dir_degrees, wind_speed_kt, precip_in, difString, wx_string);
}
//========================
//End function
//========================

 

//=======================================================================
// this function handles a middle button press
//=======================================================================
function checkAndSetBarometerScale() {
	
		if (preferences.barometerScalePref.value === "millibars") {
			barometerBackground.src="Resources/images/back-panzer-millibars.png";
		} else if (preferences.barometerScalePref.value === "hg") {
		   barometerBackground.src="Resources/images/back-panzer-INHG.png";			
		} else if (preferences.barometerScalePref.value === "hpa") {
			barometerBackground.src="Resources/images/back-panzer-HPA.png";
		} else if (preferences.barometerScalePref.value === "mmhg") {
			barometerBackground.src="Resources/images/back-panzer-MMHG.png";
		}	 	
}
//========================
//End function
//========================


//=======================================================================
// this function sets the scale for the Anemometer
//=======================================================================
function checkAndSetAnemometerScale() {
		if (preferences.windUnit.value === "knots") {
				anemometerBackground.src="Resources/images/back-panzer-wind-knots.png";
		} else {
				anemometerBackground.src="Resources/images/back-panzer-wind-metres.png";
		}		

}
//========================
//End function
//========================


//=======================================================================
// this function sets the scale for the thermometer
//=======================================================================
function checkAndSetThermometerScale() {
		if (preferences.tempUnit.value === "celsius") {
				thermometerBackground.src="Resources/images/background-centigrade.png";
			    thermometerScaleText.data = "C";
	   }
		if (preferences.tempUnit.value === "fahrenheit") {
				thermometerBackground.src="Resources/images/background-fahrenheit.png";
		   	thermometerScaleText.data = "F";
            // change the string to fahrenheit measurements
		}	
		
		if (preferences.tempUnit.value === "kelvin") {
				thermometerBackground.src="Resources/images/background-kelvin.png";
		   	thermometerScaleText.data = "K";
            // change the string to fahrenheit measurements
		}
			
}
//========================
//End function
//========================

//=======================================================================
// this function restarts the widget
//=======================================================================
humidityStartButton.onMouseDown = function () {
	startButtonOnMouseDown ();
}
thermometerStartButton.onMouseDown = function () {
	startButtonOnMouseDown ();
}
anemometerStartButton.onMouseDown = function () {
	startButtonOnMouseDown ();
}
weatherIconGaugeStartButton.onMouseDown = function () {
	startButtonOnMouseDown ();
}
barometerStartButton.onMouseDown = function () {
	startButtonOnMouseDown ();
}
function startButtonOnMouseDown () {
	if (preferences.soundPref.value != "disabled") {
		play(ting, false);
	}
	reloadWidget();
};
//========================
//End function
//========================

//=======================================================================
// this function initiates the prefs
//=======================================================================
humidityPrefs.onMouseDown = function () {
	prefsOnMouseDown();
}
thermometerPrefs.onMouseDown = function () {
	prefsOnMouseDown();
}
anemometerPrefs.onMouseDown = function () {
	prefsOnMouseDown();
}
weatherIconGaugePrefs.onMouseDown = function () {
	prefsOnMouseDown();
}
barometerPrefs.onMouseDown = function () {
	prefsOnMouseDown();
}
function prefsOnMouseDown() {
   weatherText.data = "making the changes to prefs.";

	prefs.src = "Resources/images/prefs01.png";
	if (preferences.soundPref.value != "disabled") {
		play(winding, false);
	}
	showWidgetPreferences();
};
//========================
//End function
//========================

//=======================================================================
// hide all the gauges 
//=======================================================================
function hideTheGauges () {

// we hide all the gauges as it has been found that the zordering of the windows is not persistent
// if we do not hide the gauges they will appear on top of the help window.

    helpWindow.visible = true; // the order in which these occur gives a good fade.
        
    barometerWindow.visible = false;
    anemometerWindow.visible = false;
    weatherIconGaugeWindow.visible = false;
    thermometerWindow.visible = false;
    humidityWindow.visible = false;
    
    if (preferences.soundPref.value != "disabled") {
        play(ting, false);
    }
}
//========================
//End function
//========================


//=======================================================================
// these functions open the help facility
//=======================================================================
humidityHelpButton.onMouseDown = function () {
    hideTheGauges();
    humidityHelp.visible = true;
}
//========================
//End function
//========================

//=======================================================================
// these functions open the help facility
//=======================================================================
thermometerHelpButton.onMouseDown = function () {
    hideTheGauges();
	thermometerHelp.visible = true;
}
//========================
//End function
//========================

//=======================================================================
// these functions open the help facility
//=======================================================================
anemometerHelpButton.onMouseDown = function () {
    hideTheGauges();
	anemometerHelp.visible = true;
}
//========================
//End function
//========================

//=======================================================================
// these functions open the help facility
//=======================================================================
weatherIconGaugeHelpButton.onMouseDown = function () {
    hideTheGauges();
	weatherIconGaugeHelp.visible = true;
}
//========================
//End function
//========================

//=======================================================================
// these functions open the help facility
//=======================================================================
barometerHelpButton.onMouseDown = function () {
    hideTheGauges();
	barometerHelp.visible = true;
}
//========================
//End function
//========================





//=======================================================================
// this function makes all gauges visible
//=======================================================================
function allGaugesVisible() {
	anemometerWindow.visible = true;
	weatherIconGaugeWindow.visible = true;
	thermometerWindow.visible = true;
	barometerWindow.visible = true;
	humidityWindow.visible = true;
	infoWindow.visible = true;
	if (preferences.soundPref.value != "disabled") {
		play(ting, false);
	}
};
//========================
//End function
//========================

//=======================================================================
// this function handles a help request
//=======================================================================
anemometerHelp.onMouseDown = function () {
	helpWindow.visible = false;
	anemometerHelp.visible = false; // in this order allows a nice fade
	allGaugesVisible();
};
//========================
//End function
//========================

//=======================================================================
// this function handles a help request
//=======================================================================
weatherIconGaugeHelp.onMouseDown = function () {
	helpWindow.visible = false;
	weatherIconGaugeHelp.visible = false; // in this order allows a nice fade
	allGaugesVisible();
};
//========================
//End function
//========================

//=======================================================================
// this function handles a help request
//=======================================================================
clipboardHelp.onMouseDown = function () {
	helpWindow.visible = false;
	clipboardHelp.visible = false; // in this order allows a nice fade
	allGaugesVisible();
};
//========================
//End function
//========================

//=======================================================================
// this function handles a help request
//=======================================================================
barometerHelp.onMouseDown = function () {
	helpWindow.visible = false;
	barometerHelp.visible = false; // in this order allows a nice fade
	allGaugesVisible();
};
//========================
//End function
//========================

//=======================================================================
// this function handles a help request
//=======================================================================
humidityHelp.onMouseDown = function () {
	helpWindow.visible = false;
	humidityHelp.visible = false; // in this order allows a nice fade
	allGaugesVisible();
};
//========================
//End function
//========================


//=======================================================================
// this function handles a help request
//=======================================================================
thermometerHelp.onMouseDown = function () {
	helpWindow.visible = false;
	thermometerHelp.visible = false; // in this order allows a nice fade
	allGaugesVisible();
};
//========================
//End function
//========================



//=======================================================================
// this function handles a widget stop request
//=======================================================================
humidityStopButton.onMouseDown = function () {
	stopButtonOnMouseDown ();
}
thermometerStopButton.onMouseDown = function () {
	stopButtonOnMouseDown ();
}
anemometerStopButton.onMouseDown = function () {
	stopButtonOnMouseDown ();
}
weatherIconGaugeStopButton.onMouseDown = function () {
	stopButtonOnMouseDown ();
}
barometerStopButton.onMouseDown = function () {
	stopButtonOnMouseDown ();
}
function stopButtonOnMouseDown () {
	weatherText.data = "Turned off all weather functions"

   weatherTimer.ticking = false;
   busyTimer.ticking = false;
	if (preferences.soundPref.value != "disabled") {
		play(clunk, false);
	}
    
	zeroGauges();
};
//========================
//End function
//========================

function zeroGauges() {
		
	barometerManual.rotation = -15;
	weatherIconGaugeManual.rotation = -45;
		
	barometerSecondHand.rotation = (0) +30;
	barometerSecondShadow.rotation = barometerSecondHand.rotation;

	thermometerSecondHand.rotation = (0) +30;
	thermometerSecondShadow.rotation = thermometerSecondHand.rotation;

	anemometerSecondHand.rotation = (0) +30;
	anemometerSecondShadow.rotation = anemometerSecondHand.rotation;

	humiditySecondHand.rotation = (0) +30;
	humiditySecondShadow.rotation = humiditySecondHand.rotation;
	
	anemometerWindHand.rotation = parseInt(0) ;
}
//========================
//End function
//========================

//=======================================================================
// this function starts the mousewheel resize
//=======================================================================
barometerBackground.onMouseWheel = function (event) {
	  gaugeSelected = "barometer";
	  backgroundOnMouseWheel(event,gaugeSelected);
}
thermometerBackground.onMouseWheel = function (event) {
	gaugeSelected = "thermometer";
	backgroundOnMouseWheel(event,gaugeSelected);
}
textBckgnd.onMouseWheel = function (event) {
	gaugeSelected = "clipboard";
	backgroundOnMouseWheel(event,gaugeSelected);
}
anemometerBackground.onMouseWheel = function (event) {
	gaugeSelected = "anemometer";
	backgroundOnMouseWheel(event,gaugeSelected);
}
weatherIconGaugeBackground.onMouseWheel = function (event) {
	gaugeSelected = "weatherIconGauge";
	backgroundOnMouseWheel(event,gaugeSelected);
}
humidityBackground.onMouseWheel = function (event) {
	gaugeSelected = "humidity";
	backgroundOnMouseWheel(event,gaugeSelected);
}
function backgroundOnMouseWheel(event,gaugeSelected) {
	var size,
		maxLength,
		minLength,
		ticks,
		step;
	
	if (preferences.ctrlResizePref.value === "CTRL" && !system.event.ctrlKey ) {
		return;
	}
   if (gaugeSelected === "clipboard") {
	   size = Number(preferences.infoSize.value),
		maxLength = Number(preferences.infoSize.maxLength),
		minLength = Number(preferences.infoSize.minLength),
		ticks = Number(preferences.infoSize.ticks),
		step = Math.round((maxLength - minLength) / (ticks - 1));
	}
   if (gaugeSelected === "barometer") {
	   size = Number(preferences.barometerSize.value),
		maxLength = Number(preferences.barometerSize.maxLength),
		minLength = Number(preferences.barometerSize.minLength),
		ticks = Number(preferences.barometerSize.ticks),
		step = Math.round((maxLength - minLength) / (ticks - 1));
	}
   if (gaugeSelected === "thermometer") {
	   size = Number(preferences.thermometerSize.value),
		maxLength = Number(preferences.thermometerSize.maxLength),
		minLength = Number(preferences.thermometerSize.minLength),
		ticks = Number(preferences.thermometerSize.ticks),
		step = Math.round((maxLength - minLength) / (ticks - 1));
	}
   if (gaugeSelected === "anemometer") {
	   size = Number(preferences.anemometerSize.value),
		maxLength = Number(preferences.anemometerSize.maxLength),
		minLength = Number(preferences.anemometerSize.minLength),
		ticks = Number(preferences.anemometerSize.ticks),
		step = Math.round((maxLength - minLength) / (ticks - 1));
	}
   if (gaugeSelected === "weatherIconGauge") {
	   size = Number(preferences.weatherIconGaugeSize.value),
		maxLength = Number(preferences.weatherIconGaugeSize.maxLength),
		minLength = Number(preferences.weatherIconGaugeSize.minLength),
		ticks = Number(preferences.weatherIconGaugeSize.ticks),
		step = Math.round((maxLength - minLength) / (ticks - 1));
	}
   if (gaugeSelected === "humidity") {
	   size = Number(preferences.humiditySize.value),
		maxLength = Number(preferences.humiditySize.maxLength),
		minLength = Number(preferences.humiditySize.minLength),
		ticks = Number(preferences.humiditySize.ticks),
		step = Math.round((maxLength - minLength) / (ticks - 1));
	}
	
	//if ((system.event.ctrlKey && )) { // has to be 'system.event' under 4.0 as just the .event won't pass down 
		if (system.event.scrollDelta > 0) {
			if (preferences.MouseWheelPref.value === "up") {
				size -= step;
				if (size < minLength) {
					size = minLength;
				}
			} else {
				size += step;
				if (size > maxLength) {
					size = maxLength;
				}
			}
		} else if (system.event.scrollDelta < 0) {
			if (preferences.MouseWheelPref.value === "up") {
				size += step;
				if (size > maxLength) {
					size = maxLength;
				}
			} else {
				size -= step;
				if (size < minLength) {
					size = minLength;
				}
			}
		}
		if (gaugeSelected === "clipboard") {
		   preferences.infoSize.value = String(size);
		}
		if (gaugeSelected === "barometer") {
		   preferences.barometerSize.value = String(size);
		}
	   if (gaugeSelected === "thermometer") {
		   preferences.thermometerSize.value = String(size);
		}
	   if (gaugeSelected === "anemometer") {
		   preferences.anemometerSize.value = String(size);
		}
	   if (gaugeSelected === "weatherIconGauge") {
		   preferences.weatherIconGaugeSize.value = String(size);
		}
	   if (gaugeSelected === "humidity") {
		   preferences.humiditySize.value = String(size);
		}
		sizeClock(gaugeSelected);
	//}
};
//========================
//End function
//========================


//=======================================================================
// this function gives each individual gauge focus as the mouse enters
//=======================================================================
// this enables the pop-up weather box to function on all gauges

barometerWindow.onMouseEnter= function(event) {
	if (preferences.mouseHoverPref.value === "enabled") {
		barometerWindow.focus();
	}
}
anemometerWindow.onMouseEnter= function(event) {
	if (preferences.mouseHoverPref.value === "enabled") {
		anemometerWindow.focus();
	}
}
weatherIconGaugeWindow.onMouseEnter= function(event) {
	if (preferences.mouseHoverPref.value === "enabled") {
		weatherIconGaugeWindow.focus();
	}
}
thermometerWindow.onMouseEnter= function(event) {
	if (preferences.mouseHoverPref.value === "enabled") {
		thermometerWindow.focus();
	}
}
humidityWindow.onMouseEnter= function(event) {
	if (preferences.mouseHoverPref.value === "enabled") {
		humidityWindow.focus();
	}
}
infoWindow.onMouseEnter= function(event) {
	if (preferences.mouseHoverPref.value === "enabled") {
		infoWindow.focus();
	}
}
//========================
//End functions
//========================

//=======================================================================
// this function defines the keyboard events captured
//=======================================================================
barometerWindow.onKeyDown = function(event) {
	mainWindowOnKeyDown (event);
}
thermometerWindow.onKeyDown = function(event) {
	mainWindowOnKeyDown (event);
}
anemometerWindow.onKeyDown = function(event) {
	mainWindowOnKeyDown (event);
}
weatherIconGaugeWindow.onKeyDown = function(event) {
	mainWindowOnKeyDown (event);
}
humidityWindow.onKeyDown = function(event) {
	mainWindowOnKeyDown (event);
}
infoWindow.onKeyDown = function(event) {
	mainWindowOnKeyDown (event);
}

function mainWindowOnKeyDown (event) {
   if (system.event.keyCode==116) {
		if (debugFlg === 1) { 
       print("pressing "+system.event.keyCode);
      }
      reloadWidget();
   }
}
//========================
//End function
//========================


//=======================================================================
// this function fires the main event on a double click
//=======================================================================
humidityBackground.onMultiClick = function() {
	backgroundOnMultiClick ();
}
thermometerBackground.onMultiClick = function() {
	backgroundOnMultiClick ();
}
anemometerBackground.onMultiClick = function() {
	backgroundOnMultiClick ();
}
weatherIconGaugeBackground.onMultiClick = function() {
	backgroundOnMultiClick ();
}
barometerBackground.onMultiClick = function() {
	backgroundOnMultiClick ();
}
function backgroundOnMultiClick () {
	if (preferences.soundPref.value != "disabled") {
		play(ting, false);
	}
	updateWeather();
};
//========================
//End function
//========================



//================================================
// event to stop the busy egg timer
//================================================
busy.onMouseDown = function() {	
	busyStop();
}
//========================
//End function
//========================

//================================================
// Function to stop the busy egg timer
//================================================
function busyStop() {
	if (debugFlg === 1) { 
    print("%busyStop - stopping the weather timer ");
   }
   busy.tooltip = "Double click on face to refresh the data";
   busyTimer.ticking=false;
   
   busy.visible=false;
   busyBlur.visible=false;
}
//========================
//End function
//========================


//=================================================================================================
// Function to read language localisation file
//=================================================================================================
function roMap(data) {
    var lookFor1 = /"(\w+)"\s*\=\s*"([^"]+)";/g,
        lookFor2 = /"(\w+)"\s*\=\s*"([^"]+)";/,
        found = data.match(lookFor1),
        i,
        def,
        fnd,
        map = {};
    if (found != null) {
        for (i = 0; i < found.length; i += 1) {
            def = found[i];
            fnd = def.match(lookFor2);
            if (fnd != null) {
                map[fnd[1]] = fnd[2];
            }
        }
    }
    return map;
}
//========================
//End function
//========================

//================================================
// this function animates the clock hand pointer
//================================================
function rotateHand() {
   set_the_pointer ();
   curAngle = clock_hand.rotation;
   //print("curAngle "+ curAngle);
   //var a = new RotateAnimation( clock_hand, curAngle-360, 1300, animator.kEaseOut, rotateHandEnd );
   //animator.start( a );
  }
//========================
//End function
//========================

//================================================
// this function animates various items
//================================================
		rotateObject = function (obj, value) {
			var animationDuration,
				animationInterval = 5,

				updateMe = function () {	// called during rotateAnimation
					var now = animator.milliseconds, fraction, angle;

					if (now >= (this.startTime + this.duration)) {
						obj.rotation = this.endAngle;
						obj.busy = false;
						return false;
					}
					fraction = (now - this.startTime) / this.duration;
					angle = animator.ease(this.startAngle, this.endAngle, fraction, animator.kEaseOut);
					obj.rotation = angle;
					return true;
				},

				rotateAnimation = function (startAngle, endAngle) {
					var rotate = new CustomAnimation(animationInterval, updateMe);
					rotate.duration = animationDuration;
					rotate.startAngle = startAngle;
					rotate.endAngle = endAngle;
					animator.start(rotate);
				};

			obj.busy = true;
			animationDuration = animationInterval * Math.floor(900 / animationInterval - 1);
			rotateAnimation(obj.rotation, value);
		};
//========================
//End function
//========================

//================================================
// this function checks the icao data
//================================================
function checkTheData() {
var checkIcao ;
    // this does a search through the icao data table
    if (preferences.icao.value != "") {
       checkIcao = searchIcaoFile(preferences.icao.value);
    }

    if (preferences.metarpref.value === "location") {
        //DEAN show an image instead of text
        //txtSearchCity.data = bf("_Search_city") + ":";
        //knob2.hOffset = 130;
    } else {
        //txtSearchCity.data = bf("_Search_ICAO") + " :";
        //knob2.hOffset = 185;
    }

    // get the data
    if (preferences.icao.value != "") {
       //set the getdata timer to user set interval, default 600 secs
       weatherTimer.ticking = true;

       //do_the_business () ;//getData(preferences.icao.value);
    } else {
       weatherTimer.ticking = false;
       searchWindowVisible();
    }
}
//========================
//End function
//========================

//=================================================================================================
// Function to make text areas visible rather than text objects
//=================================================================================================
function setTextAreas() {
    if (system.platform === "macintosh") {
			humidityTextArea.visible = true;
			thermometerTextArea.visible = true;
			thermometerScaleTextArea.visible = true;
			anemometerTextArea.visible = true;
			barometerTextArea.visible = true;
			barometerHighTextArea.visible = true;
    } else {
			barometerText.visible = true;
			barometerHighText.visible = true;
			thermometerText.visible = true;
			thermometerScaleText.visible = true;
			anemometerText.visible = true;
			humidityText.visible = true;
	}
}
//========================
//End function
//========================


//========================
// set the font for the information pop ups
//========================
function sethoverTextFont () {

  weatherText.font = preferences.popupPanelFont.value ;
  weatherText.style.fontSize = preferences.popupPanelFontSizePref.value   + "px";
  if (debugFlg === 1) { 
	  log("%sethoverTextFont - preferences.popupPanelFont.value ",preferences.popupPanelFont.value);
	  log("%sethoverTextFont - preferences.popupPanelFontSizePref.value ",preferences.popupPanelFontSizePref.value);
	}
}
//========================
// function ends
//========================



//========================
// checked via timer to light the barometer storm warning bulb
//========================
function testPressureDrop() {

// dangerous pressure drop leading to volatile weather
//    store the last pressure from the previous poll
//    store the time of the last poll
//    compare the pressure drop, of great compare the two times
//    if the timeframe is short then light lamp

   var oldpressureStorage = preferences.pressureStorage.value;
   var oldPressureStorageDate = preferences.pressureStorageDate.value;
   var currentDate = Math.floor(new Date())/1000;	 // time in seconds

	// 24 hectopascals/millibars in 24 hours. 
	// A storm system often falls at a rate of more than 1 millibar per hour. 
	// If the air pressure falls 24 mb (or more) in 24 hours, the system is called a bomb cyclone.
	
	if (debugFlg === 1) {
		print("oldPressureStorageDate " + oldPressureStorageDate);
		print("currentdate - 3960 " + (currentDate - 3960));
	}

	// if the pressure drops by 1 millibar and it is a recent reading
	// this caters for the computer waking up from a sleep or a restart
   

	if (oldpressureStorage - pressureValue >= 1.33322 ) { // one milibar drop < 1 hour - a storm is brewing
		if (oldPressureStorageDate >= (currentDate - 3960)) {
		   print("pressure reading is a recent one, certainly within the last 70 mins");
		   print("The lamp is lit as the pressure is dropping fast enough for a serious storm. The old pressure value was " + oldpressureStorage + " the new pressure value is " + pressureValue);
			barometerDangerLamp.src = "Resources/images/red-lamptrue.png";
			barometerDangerLamp.tooltip = "The lamp is lit as the pressure is dropping fast enough for a serious storm. The old pressure value was " + oldpressureStorage + " the new pressure value is " + pressureValue;
		} else {
		   print("Note: The pressure reading was taken more than 70 mins ago so it can be ignored");
		   barometerDangerLamp.tooltip = "The pressure has dropped but is NOT dropping at the level that would indicate a storm";
			barometerDangerLamp.src = "Resources/images/red-lampfalse.png";
		}	 
	} else {
		barometerDangerLamp.tooltip = "If the lamp is ever lit bright red then the pressure is dropping fast enough for a storm, green indicates normal pressure changes.";
		barometerDangerLamp.src = "Resources/images/green-lamptrue.png";
	}
	preferences.pressureStorage.value = pressureValue;
	preferences.pressureStorageDate.value = Math.floor(new Date()/1000);	 // time in seconds
}
//========================
// function ends
//========================


//========================
// main function called by the sleep timer
//========================
function sleepTimerFunction() {
    updateWeather();
    sleepTimer.ticking=false;
}
//========================
// timer function ends
//========================

//========================
// main function called by the weatherIconGauge Timer
//========================
function weatherIconGaugeTimerFunction() {

   timeLeftInSeconds = timeLeftInSeconds - 5;
   if (timeLeftInSeconds < 0 ){
    timeLeftInSeconds = preferences.sampleIntervalPref.value;
   }
   var point1 = 360/ preferences.sampleIntervalPref.value;
   weatherIconGaugeManual.tooltip = "Time to next poll in " + timeLeftInSeconds + " secs";

    weatherIconGaugeManual.rotation = ((timeLeftInSeconds * point1 )-45) ;
    //print("timeLeftInSeconds "+ timeLeftInSeconds);
    //print("weatherIconGaugeManual.rotation "+ (timeLeftInSeconds * point1 ));
    //print(weatherTimer.ticking);
}
//========================
// timer function ends
//========================


//========================
// main function called by the position Timer 
//========================
function positionTimerFunction() {
    
  if (preferences.widgetLockPercentagePref.value === "enabled") {
        // check for aspect ratio and determine whether it is in portrait or landscape mode
        if (screen.width > screen.height) {
            aspectRatio = "landscape";
        } else {
            aspectRatio = "portrait";
        }
        // if the orientation has changed then reposition the gauges
        if (oldAspectRatio != aspectRatio ) {
           print("Aspect ratio has changed");
           oldAspectRatio = aspectRatio;
           
            checkAndMoveThermometer();
            checkAndMoveAnemometer();
            checkAndMoveWeatherIconGauge();
            checkAndMoveBarometer();
            checkAndMoveHumidity();	
        }
        saveBarometerPosition();
        saveThermometerPosition();
        saveHumidityPosition();
        saveAnemometerPosition();
        saveWeatherIconGaugePosition();
    }
  }
//========================
// position timer function ends
//========================


//========================
// main function called by the pressureStorage Timer 
//========================
function pressureStorageTimerFunction() {
    testPressureDrop();
}
//========================
// pressureStorage timer function ends
//========================



//========================
// main function called by the gauge Timer 
//========================
function gaugeTimerFunction() {
// the gaugeTimer is here to separate the gauge animations to 1 second apart
// this is because three/four animations occurring together simultaneously fails to draw correctly
// causing pointer remnants and white widget backgrounds when the transparent mask is not maintained
// due to the widget engine giving the processor too much to do within the widget.

       gaugeCounter = gaugeCounter + 1 ;
       if (gaugeCounter === 1) {
                rotateObject(barometerSecondHand, (((pressureValue -600)/2)  * 3) +30);
                rotateObject(barometerSecondShadow, (((pressureValue -600)/2)  * 3) +30);
       };
       if (gaugeCounter === 2) {
                rotateObject(thermometerSecondHand, (300 * ((temperatureValue + 30)/80)+30));
                rotateObject(thermometerSecondShadow, (300 * ((temperatureValue + 30)/80)+30));
       };
       if (gaugeCounter === 3) {
                rotateObject(anemometerSecondHand, ((wind_speed_kt )  * 3) +30);
                rotateObject(anemometerSecondShadow, ((wind_speed_kt)  * 3) +30);
       };
       if (gaugeCounter === 4) {
                rotateObject(humiditySecondHand, (humidityValue  * 3) +30);
                rotateObject(humiditySecondShadow, (humidityValue  * 3) +30);
       };
       if (gaugeCounter === 5) {
            //print("wind_dir_degrees" +wind_dir_degrees);
                rotateObject(anemometerWindHand, (parseInt(wind_dir_degrees)));
            gaugeCounter = 0;
            gaugeTimer.ticking=false;
       };
       busy.src = "Resources/images/busy-F" + busyCounter + "-32x32x24.png";
}
//========================
// gauge timer function ends
//========================


//========================
// main function called by the alarm Timer 
//========================
function alarmTimerFunction() {
    
    // pop up alarm box with the condition ie. rain
    
    var answer = alert("The widget says it is raining!", "Acknowledge just this one Alarm.", "Cancel all current rain alarms.");
          
        if (answer === 1) {
          // cancel the current alarm
          // stop the sound immediately
        }
        
        if (answer === 2) {
          // cancel the current alarm
          // stop the sound immediately
          // set a flag to prevent future alarms reoccurring
        }
}
//========================
// alarm timer function ends
//========================


//========================
// main function called by the busy Timer 
//========================
function busyTimerFunction() {
    
       busy.visible = true;
       busyBlur.visible = true;
       busy.tooltip = "Widget is polling the weather data and has been doing so for " + parseInt(totalBusyCounter/10) + " secs so far";

       busyCounter = busyCounter + 1 ;
       totalBusyCounter = totalBusyCounter + 1 ;
       if (busyCounter >= 7) {busyCounter = 1};
       busy.src = "Resources/images/busy-F" + busyCounter + "-32x32x24.png";
       if (totalBusyCounter >= 1000) {
        busyStop();
       }
}
//========================
// busy timer function ends
//========================


//========================
// main function called by the weather Timer 
//========================
function weatherTimerFunction() {
    if (preferences.icao.value != "") {
        updateWeather();
    }
}
//========================
// weather timer function ends
//========================

function setDebugState() {
 
    debugFlg = preferences.debugFlgPref.value;    
        
    print (" debugFlg " + debugFlg);
    
    if (debugFlg == 1) {
        preferences.imageEditPref.hidden=false;		
    } else {
        preferences.imageEditPref.hidden=true;		
    }
  }  
    
//=================================================================================================
// END script script.js
//=================================================================================================

