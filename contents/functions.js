//=========================================================
// functions.js   ||  
// Panzer weather widget  1.0
// Originally written and Steampunked by: Dean Beedell
// Dean.beedell@lightquick.co.uk
// Vitality code, advice and patience from Harry Whitfield
//
//=========================================================

/*jslint multivar */

/*property
	clockFaceSwitchPref, contextMenuItems, hLocationPercPref, hOffset, height,
	hoffset, itemExists, landscapeHoffsetPref, landscapeVoffsetPref, locked,
	onContextMenu, onMouseDown, onSelect, opacity, portraitHoffsetPref,
	portraitVoffsetPref, reveal, soundPref, title, tooltip, userWidgetsFolder,
	vLocationPercPref, vOffset, value, visible, voffset, widgetHideModePref,
	thermometerLockLandscapeModePref, thermometerLockPortraitModePref, width
*/

"use strict";

var mainWindow, mainWindowwidthDefault, mainWindowheightDefault,
		cableWheelSet, cableWheelSethoffsetDefault, cableWheelSetvoffsetDefault,
		cableWheelSetwidthDefault, cableWheelSetheightDefault, cable, cablehoffsetDefault,
		cablevoffsetDefault, cablewidthDefault, cableheightDefault, pipes, pipeshoffsetDefault,
		pipesvoffsetDefault, pipeswidthDefault, pipesheightDefault, bell, bellhoffsetDefault,
		bellvoffsetDefault, bellwidthDefault, bellheightDefault, indicatorRed,
		indicatorRedhoffsetDefault, indicatorRedvoffsetDefault, indicatorRedwidthDefault,
		indicatorRedheightDefault, speaker, speakerhoffsetDefault, speakervoffsetDefault,
		speakerwidthDefault, speakerheightDefault, bar, barhoffsetDefault, barvoffsetDefault,
		barwidthDefault, barheightDefault, sliderSet, sliderSethoffsetDefault,
		sliderSetvoffsetDefault, sliderSetwidthDefault, sliderSetheightDefault, text1,
		text1hoffsetDefault, text1voffsetDefault, text1fontDefault, text2, text2hoffsetDefault,
		text2voffsetDefault, text2fontDefault, tingingSound, startup, aspectRatio, displayLicence,
		widgetName, switchFacesButton, prefs, till, background2, background, smallMinuteHand,
		swSecondHand, swMinuteHand, swHourHand, dateText, secondtextxo, secondtextyo, sizeClock,
		pin, lock, stopWatchState, mistake;

//=================================================================
// Function to move the main_window onto the main screen - called on startup and by timer
//=================================================================
function mainScreen() {
// if the widget is off screen then move into the viewable window
	if (debugFlg === 1) {
		print("****************MAINSCREEN********************");
	}
	// check for aspect ratio and determine whether it is in portrait or landscape mode
	if (screen.width > screen.height) {
		aspectRatio = "landscape";
	} else {
		aspectRatio = "portrait";
	}
	if (debugFlg === 1) { 
		print("screen.width " + screen.width);
		print("screen.height " + screen.height);
		print("aspectRatio " + aspectRatio);
	}
	checkAndMoveThermometer();
	checkAndMoveAnemometer();
	checkAndMoveWeatherIconGauge();
	checkAndMoveBarometer();
	checkAndMoveHumidity();
}
//================
//End function
//================

//=================================
// this function moves the thermometer on screen in case it is accidentally moved off the viewable window
//=================================
function checkAndMoveBarometer() {
	var barometerSize = Number(preferences.barometerSize.value) / 100;

	// check if the widget has a lock
		if (aspectRatio === "landscape" && preferences.barometerLockLandscapeModePref.value === "enabled") {
			barometerWindow.hoffset = preferences.barometerLandscapeHoffsetPref.value;
			barometerWindow.voffset = preferences.barometerLandscapeVoffsetPref.value;
      } 
		if (aspectRatio === "portrait" && preferences.barometerLockPortraitModePref.value === "enabled") {
			barometerWindow.hoffset = preferences.barometerPortraitHoffsetPref.value;
			barometerWindow.voffset = preferences.barometerPortraitVoffsetPref.value;      	
      }
  		//now see if the gauge should be hidden
		if (aspectRatio === "landscape" && preferences.widgetHideModePref.value === "landscape") {
			barometerWindow.visible = false;
		} else {
			barometerWindow.visible = true;
		}
		if (aspectRatio === "portrait" && preferences.widgetHideModePref.value === "portrait") {
			barometerWindow.visible = false;
		} else {
			barometerWindow.visible = true;
		}

	if (preferences.widgetLockPercentagePref.value === "enabled") {
            placeBarometerByPercentage(); // if the percentage store has been set move to the specific window to the %position set
	}

	if (barometerWindow.hOffset < (-Math.abs(600 * barometerSize))) {
		print("Moving the barometer gauge back onto the screen from the left");
		barometerWindow.hOffset = (-120 * barometerSize);
	}
	if (barometerWindow.vOffset < (-Math.abs(500 * barometerSize))) {
		print("Moving the barometer gauge back onto the screen from the top");
		barometerWindow.vOffset = 0; 
	}
	if (barometerWindow.hOffset > screen.width - (230 * barometerSize)) { //adjust for the extra width of the help page
		print("Moving the barometer gauge back onto the screen from the right");
		barometerWindow.hOffset = screen.width - barometerWindow.width + (220 * barometerSize);
	}
	if (barometerWindow.vOffset > screen.height - (130 * barometerSize)) {	 //adjust for the extra height of the help page
		print("Moving the barometer gauge back onto the screen from the bottom");
		barometerWindow.vOffset = screen.height - barometerWindow.height; 
	}
	saveBarometerPosition();
}
//================
//End function
//================zm

//=================================
// this function moves the thermometer on screen in case it is accidentally moved off the viewable window
//=================================
function checkAndMoveThermometer() {
	var thermometerSize = Number(preferences.thermometerSize.value) / 100;

	// check if the widget has a lock
		if (aspectRatio === "landscape" && preferences.thermometerLockLandscapeModePref.value === "enabled") {
			thermometerWindow.hoffset = preferences.thermometerLandscapeHoffsetPref.value;
			thermometerWindow.voffset = preferences.thermometerLandscapeVoffsetPref.value;
      } 
		if (aspectRatio === "portrait" && preferences.thermometerLockPortraitModePref.value === "enabled") {
			thermometerWindow.hoffset = preferences.thermometerPortraitHoffsetPref.value;
			thermometerWindow.voffset = preferences.thermometerPortraitVoffsetPref.value;      	
      }
  		//now see if the gauge should be hidden
		if (aspectRatio === "landscape" && preferences.widgetHideModePref.value === "landscape") {
			thermometerWindow.visible = false;
		} else {
			thermometerWindow.visible = true;
		}
		if (aspectRatio === "portrait" && preferences.widgetHideModePref.value === "portrait") {
			thermometerWindow.visible = false;
		} else {
			thermometerWindow.visible = true;
		}

	if (preferences.widgetLockPercentagePref.value === "enabled") {
            placeThermometerByPercentage(); // if the percentage store has been set move to the specific window to the %position set
	}

	if (thermometerWindow.hOffset < (-Math.abs(600 * thermometerSize))) {
		print("Moving the thermometer gauge back onto the screen from the left");
		thermometerWindow.hOffset = (-120 * thermometerSize);
	}
	if (thermometerWindow.vOffset < (-Math.abs(500 * thermometerSize))) {
		print("Moving the thermometer gauge back onto the screen from the top");
		thermometerWindow.vOffset = 0; 
	}
	if (thermometerWindow.hOffset > screen.width - (230 * thermometerSize)) { //adjust for the extra width of the help page
		print("Moving the thermometer gauge back onto the screen from the right");
		thermometerWindow.hOffset = screen.width - thermometerWindow.width + (220 * thermometerSize);
	}
	if (thermometerWindow.vOffset > screen.height - (130 * thermometerSize)) {	 //adjust for the extra height of the help page
		print("Moving the thermometer gauge back onto the screen from the bottom");
		thermometerWindow.vOffset = screen.height - thermometerWindow.height; 
	}
	saveThermometerPosition();
}
//================
//End function
//================



//=================================
// this function moves the humidity
//=================================
function checkAndMoveHumidity() {
	var humiditySize = Number(preferences.humiditySize.value) / 100;

	// check if the widget has a lock
		if (aspectRatio === "landscape" && preferences.humidityLockLandscapeModePref.value === "enabled") {
			humidityWindow.hoffset = preferences.humidityLandscapeHoffsetPref.value;
			humidityWindow.voffset = preferences.humidityLandscapeVoffsetPref.value;
      } 
		if (aspectRatio === "portrait" && preferences.humidityLockPortraitModePref.value === "enabled") {
			humidityWindow.hoffset = preferences.humidityPortraitHoffsetPref.value;
			humidityWindow.voffset = preferences.humidityPortraitVoffsetPref.value;      	
      }
  		//now see if the gauge should be hidden
		if (aspectRatio === "landscape" && preferences.widgetHideModePref.value === "landscape") {
			humidityWindow.visible = false;
		} else {
			humidityWindow.visible = true;
		}
		if (aspectRatio === "portrait" && preferences.widgetHideModePref.value === "portrait") {
			humidityWindow.visible = false;
		} else {
			humidityWindow.visible = true;
		}

	if (preferences.widgetLockPercentagePref.value === "enabled") {
            placeHumidityByPercentage(); // if the percentage store has been set move to the specific window to the %position set
	}

	if (humidityWindow.hOffset < (-Math.abs(600 * humiditySize))) {
		print("Moving the humidity gauge back onto the screen from the left");
		humidityWindow.hOffset = (-120 * humiditySize);
	}
	if (humidityWindow.vOffset < (-Math.abs(500 * humiditySize))) {
		print("Moving the humidity gauge back onto the screen from the top");
		humidityWindow.vOffset = 0; 
	}
	if (humidityWindow.hOffset > screen.width - (230 * humiditySize)) { //adjust for the extra width of the help page
		print("Moving the humidity gauge back onto the screen from the right");
		humidityWindow.hOffset = screen.width - humidityWindow.width + (220 * humiditySize);
	}
	if (humidityWindow.vOffset > screen.height - (130 * humiditySize)) {	 //adjust for the extra height of the help page
		print("Moving the humidity gauge back onto the screen from the bottom");
		humidityWindow.vOffset = screen.height - humidityWindow.height; 
	}
	saveHumidityPosition();
}
//================
//End function
//================


//=================================
// this function moves the anemometer
//=================================
function checkAndMoveAnemometer() {
	var anemometerSize = Number(preferences.anemometerSize.value) / 100;

	// check if the widget has a lock
		if (aspectRatio === "landscape" && preferences.anemometerLockLandscapeModePref.value === "enabled") {
			anemometerWindow.hoffset = preferences.anemometerLandscapeHoffsetPref.value;
			anemometerWindow.voffset = preferences.anemometerLandscapeVoffsetPref.value;
      } 
		if (aspectRatio === "portrait" && preferences.anemometerLockPortraitModePref.value === "enabled") {
			anemometerWindow.hoffset = preferences.anemometerPortraitHoffsetPref.value;
			anemometerWindow.voffset = preferences.anemometerPortraitVoffsetPref.value;      	
      }
  		//now see if the gauge should be hidden
		if (aspectRatio === "landscape" && preferences.widgetHideModePref.value === "landscape") {
			anemometerWindow.visible = false;
		} else {
			anemometerWindow.visible = true;
		}
		if (aspectRatio === "portrait" && preferences.widgetHideModePref.value === "portrait") {
			anemometerWindow.visible = false;
		} else {
			anemometerWindow.visible = true;
		}

	if (preferences.widgetLockPercentagePref.value === "enabled") {
            placeAnemometerByPercentage(); // if the percentage store has been set move to the specific window to the %position set
	}

	if (anemometerWindow.hOffset < (-Math.abs(600 * anemometerSize))) {
		print("Moving the anemometer gauge back onto the screen from the left");
		anemometerWindow.hOffset = (-120 * anemometerSize);
	}
	if (anemometerWindow.vOffset < (-Math.abs(500 * anemometerSize))) {
		print("Moving the anemometer gauge back onto the screen from the top");
		anemometerWindow.vOffset = 0; 
	}
	if (anemometerWindow.hOffset > screen.width - (230 * anemometerSize)) { //adjust for the extra width of the help page
		print("Moving the anemometer gauge back onto the screen from the right");
		anemometerWindow.hOffset = screen.width - anemometerWindow.width + (220 * anemometerSize);
	}
	if (anemometerWindow.vOffset > screen.height - (130 * anemometerSize)) {	 //adjust for the extra height of the help page
		print("Moving the anemometer gauge back onto the screen from the bottom");
		anemometerWindow.vOffset = screen.height - anemometerWindow.height; 
	}
	saveAnemometerPosition();
}
//================
//End function
//================


//=================================
// this function moves the weatherIconGauge
//=================================
function checkAndMoveWeatherIconGauge() {
	var weatherIconGaugeSize = Number(preferences.weatherIconGaugeSize.value) / 100;

	// check if the widget has a lock
		if (aspectRatio === "landscape" && preferences.weatherIconGaugeLockLandscapeModePref.value === "enabled") {
			weatherIconGaugeWindow.hoffset = preferences.weatherIconGaugeLandscapeHoffsetPref.value;
			weatherIconGaugeWindow.voffset = preferences.weatherIconGaugeLandscapeVoffsetPref.value;
      } 
		if (aspectRatio === "portrait" && preferences.weatherIconGaugeLockPortraitModePref.value === "enabled") {
			weatherIconGaugeWindow.hoffset = preferences.weatherIconGaugePortraitHoffsetPref.value;
			weatherIconGaugeWindow.voffset = preferences.weatherIconGaugePortraitVoffsetPref.value;      	
      }
  		//now see if the gauge should be hidden
		if (aspectRatio === "landscape" && preferences.widgetHideModePref.value === "landscape") {
			weatherIconGaugeWindow.visible = false;
		} else {
			weatherIconGaugeWindow.visible = true;
		}
		if (aspectRatio === "portrait" && preferences.widgetHideModePref.value === "portrait") {
			weatherIconGaugeWindow.visible = false;
		} else {
			weatherIconGaugeWindow.visible = true;
		}

	if (preferences.widgetLockPercentagePref.value === "enabled") {
            placeweatherIconGaugeByPercentage(); // if the percentage store has been set move to the specific window to the %position set
	}

	if (weatherIconGaugeWindow.hOffset < (-Math.abs(600 * weatherIconGaugeSize))) {
		print("Moving the weatherIconGauge gauge back onto the screen from the left");
		weatherIconGaugeWindow.hOffset = (-120 * weatherIconGaugeSize);
	}
	if (weatherIconGaugeWindow.vOffset < (-Math.abs(500 * weatherIconGaugeSize))) {
		print("Moving the weatherIconGauge gauge back onto the screen from the top");
		weatherIconGaugeWindow.vOffset = 0; 
	}
	if (weatherIconGaugeWindow.hOffset > screen.width - (230 * weatherIconGaugeSize)) { //adjust for the extra width of the help page
		print("Moving the weatherIconGauge gauge back onto the screen from the right");
		weatherIconGaugeWindow.hOffset = screen.width - weatherIconGaugeWindow.width + (220 * weatherIconGaugeSize);
	}
	if (weatherIconGaugeWindow.vOffset > screen.height - (130 * weatherIconGaugeSize)) {	 //adjust for the extra height of the help page
		print("Moving the weatherIconGauge gauge back onto the screen from the bottom");
		weatherIconGaugeWindow.vOffset = screen.height - weatherIconGaugeWindow.height; 
	}
	saveWeatherIconGaugePosition();
}
//================
//End function
//================




//=================================
// this function opens the online help file
//=================================
function menuitem1OnClick() {
	var answer = alert("This button opens a browser window and connects to the help page for this widget. Do you wish to proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("https://www.deviantart.com/yereverluvinuncleber/art/Cyberpunk-Panzer-Weather-Widget-753277633");
	}
}
//================
//End function
//================

//=================================
// this function opens the URL for paypal
//=================================
function menuitem2OnClick() {
    var answer = alert("Help support the creation of more widgets like this, send us a coffee! This button opens a browser window and connects to the Kofi donate page for this widget). Will you be kind and proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
                openURL("https://www.ko-fi.com/yereverluvinunclebert");
    }
}
//================
//End function
//================

//=================================
// this function opens my Amazon URL wishlist
//=================================
function menuitem3OnClick() {
	var answer = alert("Help support the creation of more widgets like this. Buy me a small item on my Amazon wishlist! This button opens a browser window and connects to my Amazon wish list page). Will you be kind and proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://www.amazon.co.uk/gp/registry/registry.html?ie=UTF8&id=A3OBFB6ZN4F7&type=wishlist");
	}
}
//================
//End function
//================


//=================================
// this function opens other widgets URL
//=================================
function menuitem5OnClick() {
	var answer = alert("This button opens a browser window and connects to the Steampunk widgets page on my site. Do you wish to proceed", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("https://www.deviantart.com/yereverluvinuncleber/gallery/59981269/yahoo-widgets");
	}
}
//================
//End function
//================

//=================================
// this function opens the download URL
//=================================
function menuitem6OnClick() {
	var answer = alert("Download latest version of the widget - this button opens a browser window and connects to the widget download page where you can check and download the latest zipped .WIDGET file). Proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("https://www.deviantart.com/yereverluvinuncleber/art/Cyberpunk-Panzer-Weather-Widget-753277633");
	}
}
//================
//End function
//================

//=================================
// this function opens the browser at the contact URL
//=================================
function menuitem7OnClick() {
	var answer = alert("Visiting the support page - this button opens a browser window and connects to our contact us page where you can send us a support query or just have a chat). Proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
        openURL("http://www.facebook.com/profile.php?id=100012278951649");
	}
}
//================
//End function
//================

//===========================================
// this function opens the browser at the contact URL
//===========================================
function facebookChat() {
    var answer = alert("Visiting the Facebook chat page - this button opens a browser window and connects to our Facebook chat page.). Proceed?", "Open Browser Window", "No Thanks");
    if (answer === 1) {
        openURL("http://www.facebook.com/profile.php?id=100012278951649");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function edits the widget
//===========================================
function editWidget() {
    //var answer = alert("Editing the widget. Proceed?", "Open Editor", "No Thanks");
    //if (answer === 1) {
		//uses the contents of imageEditPref to initiate your default editor
        performCommand("menu");
    //}

}
//=====================
//End function
//=====================

//=================================
// this function allows a spacer in the menu
//=================================
function nullfunction() {
	//print("null");
}
//================
//End function
//================

//===========================================
// this function causes explorer to be opened and the file selected
//===========================================
function findWidget() {

 // temporary development version of the widget
    var widgetFullPath = convertPathToPlatform(system.userWidgetsFolder + "/" + widgetName);
    var alertString = "The widget folder is: \n";
    if (filesystem.itemExists(widgetFullPath)) {
        alertString += system.userWidgetsFolder + " \n\n";
        alertString += "The widget name is: \n";
        alertString += widgetName + ".\n ";

        alert(alertString, "Open the widget's folder?", "No Thanks");

        filesystem.reveal(widgetFullPath);
    } else {
        widgetFullPath = resolvePath(".");   
        filesystem.reveal(widgetFullPath);
        print("widgetFullPath " + widgetFullPath);
    }
}
//=====================
//End function
//=====================

//======================================================================================
// Function to perform commands
//======================================================================================
var runningTask;

function performCommand() {
    var answer;

    if (preferences.soundPref.value === "enabled") {
        play(tingingSound, false);
    }

    if (system.event.altKey) { // filesystem.open() call
        if (preferences.openFilePref.value === "") {
            answer = alert("This widget has not been assigned an alt+double-click function. You need to open the preferences and select a file to be opened. Do you wish to proceed?", "Open Preferences", "No Thanks");
            if (answer === 1) {
                showWidgetPreferences();
            }
            return;
        }
        filesystem.open(preferences.openFilePref.value);
    } else { // runCommandInBg() call
        if (preferences.imageEditPref.value === "") {
            answer = alert("This widget has not been assigned a double-click function. You need to open the preferences and enter a run command for this widget. Do you wish to proceed?", "Open Preferences", "No Thanks");
            if (answer === 1) {
                showWidgetPreferences();
            }
            return;
        }
        runCommandInBg(preferences.imageEditPref.value, "runningTask");
    }
}
//=====================
//End function
//=====================



//=======================================================
// this function assigns translations to menus for only a few of the menu options
// each time the cursor hovers over a window - it builds the menu from scratch
//=======================================================
function setmenu() {
	var items = [], mItem, sItem,
	          infoItems = [];

	function itemsIn() {
		          mItem = new MenuItem();
		          mItem.title = bf("");
		          mItem.onSelect = function () {
		              searchWindowVisible();
		          };
		    items.push(mItem);

		         mItem = new MenuItem();
		         mItem.title = bf("_Refresh_Metar_feed");
		         mItem.onSelect = function() {
		        			if (debugFlg === 1) { print("%setmenutitles _Refresh_Metar_feed")};
  							totalBusyCounter = 0;
		        			busyTimer.ticking=true;
		              	getData(preferences.icao.value);
		        };
		   items.push(mItem);
		        
		         mItem = new MenuItem();
		         mItem.title = "Download new ICAO code locations file";
		         mItem.onSelect = function() {
		        			if (debugFlg === 1) { print("%setmenutitles getNewIcaoLocations")};
		              	getNewIcaoLocations();
		        };
		   items.push(mItem);
		        
		        mItem = new MenuItem();
		        mItem.title = "Copy current weather to clipboard";
		        mItem.onSelect = function() {
		                copyWeather();
		        };
		        
		   items.push(mItem);
	
              mItem = new MenuItem();
              mItem.title = "";
              mItem.onSelect = function () {
                  nullfunction();
              };
      	items.push(mItem);
	
              mItem = new MenuItem();
              mItem.title = "Donate a Coffee with Ko-Fi";
              mItem.onSelect = function () {
                  menuitem2OnClick();
              };
      	items.push(mItem);
      

      
              mItem = new MenuItem();
              mItem.title = "";
              mItem.onSelect = function () {
                  nullfunction();
              };
      	items.push(mItem);

              mItem = new MenuItem();
              mItem.title = "Panzer weather Gauge Help";
              mItem.onSelect = function () {
                  if (selectedGauge === "humidity") {
							humidityHelpButton.onMouseDown();
	               }
	               if (selectedGauge === "thermometer") {
						  thermometerHelpButton.onMouseDown();
                  }
                  if (selectedGauge === "barometer") {
							barometerHelpButton.onMouseDown();
                  }
                  if (selectedGauge === "anemometer") {
							anemometerHelpButton.onMouseDown();
						}
                  if (selectedGauge === "weatherIconGauge") {
							weatherIconGaugeHelpButton.onMouseDown();
						}
              };
      	items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Online Help and other online options";
	      items.push(mItem);

        sItem = new MenuItem();
        sItem.title = "See More Steampunk Widgets";
        sItem.onSelect = function () {
            menuitem5OnClick();
        };
        mItem.appendChild(sItem);

        sItem = new MenuItem();
        sItem.title = "Download Latest Version";
        sItem.onSelect = function () {
            menuitem6OnClick();
        };
        mItem.appendChild(sItem);

        sItem = new MenuItem();
        sItem.title = "Contact Support";
        sItem.onSelect = function () {
            menuitem7OnClick();
        };
        mItem.appendChild(sItem);

        sItem = new MenuItem();
        sItem.title = "Chat about Steampunk Widgets on Facebook";
        sItem.onSelect = function() {
            facebookChat();
        };
        mItem.appendChild(sItem);

        mItem = new MenuItem();
        mItem.title = "Display Licence Agreement...";
        mItem.onSelect = function () {
            displayLicence();
        };
		items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "";
        mItem.onSelect = function() {
            nullfunction();
        };
		items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Reveal Widget in Windows Explorer";
        mItem.onSelect = function() {
            findWidget();
        };
		items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "";
        mItem.onSelect = function() {
            nullfunction();
        };
		items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Reload Widget (F5)";
        mItem.onSelect = function () {
            reloadWidget();
        };
		items.push(mItem);
 
		if (preferences.imageEditPref.value != "" && debugFlg == 1) {
		    mItem = new MenuItem();
		    mItem.title = "Edit Widget using " + preferences.imageEditPref.value ;
		    mItem.onSelect = function () {
				editWidget();
		    };
		    items.push(mItem);
		 }

        mItem = new MenuItem();
        mItem.title = "Switch off all weather functions";
        mItem.onSelect = function () {
			stopButtonOnMouseDown ();
        };
      	items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Turn all weather functions ON";
        mItem.onSelect = function () {
			startButtonOnMouseDown ();
        };
      	items.push(mItem);
	}
	
	barometerWindow.onContextMenu = function () {
		items = [];
		itemsIn();
		selectedGauge = "barometer";
		barometerWindow.contextMenuItems = items;
	};
	humidityWindow.onContextMenu = function () {
		items = [];
		itemsIn();
		selectedGauge = "humidity";
		humidityWindow.contextMenuItems = items;
	};
	thermometerWindow.onContextMenu = function () {
		items = [];
		itemsIn();
		selectedGauge = "thermometer";
		thermometerWindow.contextMenuItems = items;
	};
	
	anemometerWindow.onContextMenu = function () {
		items = [];
		itemsIn();
		selectedGauge = "anemometer";
		anemometerWindow.contextMenuItems = items;
	};
	
	weatherIconGaugeWindow.onContextMenu = function () {
		items = [];
		itemsIn();
		selectedGauge = "weatherIconGauge";
		weatherIconGaugeWindow.contextMenuItems = items;
	};
	
	infoWindow.onContextMenu = function () {
		selectedGauge = "clipboard";
		infoItems = []; // reinitialises the menu

      mItem = new MenuItem();
      mItem.title = "Panzer weather Gauge Help";
      mItem.onSelect = function () {
      
                
				infoWindow.visible = false; // this order gives a good fade
				
                hideTheGauges();
                //helpWindow.visible = true;

				clipboardHelp.visible = true;
				
//				barometerWindow.visible = false;
//				anemometerWindow.visible = false;
//				weatherIconGaugeWindow.visible = false;
//				thermometerWindow.visible = false;
//				humidityWindow.visible = false;
//
//				if (preferences.soundPref.value != "disabled") {
//					play(ting, false);
//				}						
      };
		infoItems.push(mItem);
              
		mItem = new MenuItem();
		mItem.title = "Copy METAR data to clipboard";
		mItem.onSelect = function() {
		     copyWeather();
		};
		infoItems.push(mItem);

		infoWindow.contextMenuItems = infoItems;
	};
	
}
//================
//End function
//================

//===============================================
// this function reloads the widget when preferences are changed
//===============================================
function changePrefs() {
	if (debugFlg === 1) { 
		log("preferences Changed");
	}
  // if the switch to % positioning has been made it will need to store the current position	
  if (preferences.widgetLockPercentagePref.value === "enabled") {
		saveBarometerPosition();
		saveThermometerPosition();
		saveHumidityPosition();
		saveAnemometerPosition();
		saveWeatherIconGaugePosition();
	}	
   weatherText.data = "making the changes to prefs.";
   preferences.sampleIntervalPref2.value = preferences.sampleIntervalPref.value;

	savePreferences();	
	sleep(1000);
	startup();			
//	reloadWidget();
}
//================
//End function
//================


//===============================================
// this function sets the tooltips
//===============================================
function settooltip() {
    if (debugFlg === 1) { 
	    print("settooltip");
	    print("preferences.tooltipPref.value " + preferences.tooltipPref.value);
	 }
    if ( preferences.tooltipPref.value === "enabled" ) {

			barometerStartButton.tooltip = "Press to restart the gauge";
			thermometerStartButton.tooltip = "Press to restart the gauge";
			anemometerStartButton.tooltip = "Press to restart the gauge";
			weatherIconGaugeStartButton.tooltip = "Press to restart the gauge";
			humidityStartButton.tooltip = "Press to restart the gauge";

			barometerStopButton.tooltip = "Press to switch off gauge functions";
			thermometerStopButton.tooltip = "Press to switch off gauge functions";
			anemometerStopButton.tooltip = "Press to switch off gauge functions";
			weatherIconGaugeStopButton.tooltip = "Press to switch off gauge functions";
			humidityStopButton.tooltip = "Press to switch off gauge functions";

			barometerSwitchFacesButton.tooltip = "Press to toggle pressure scales";
			thermometerSwitchFacesButton.tooltip = "Press to toggle fahrenheit or centigrade";
			anemometerSwitchFacesButton.tooltip = "button not assigned a function";
			weatherIconGaugeSwitchFacesButton.tooltip = "button not assigned a function";
			humiditySwitchFacesButton.tooltip = "button not assigned a function";

			barometerPrefs.tooltip = "Press to open the widget preferences";
			thermometerPrefs.tooltip = "Press to open the widget preferences";
			anemometerPrefs.tooltip = "Press to open the widget preferences";
			weatherIconGaugePrefs.tooltip = "Press to open the widget preferences";
			humidityPrefs.tooltip = "Press to open the widget preferences";

			barometerHelpButton.tooltip = "Press for a little help";
			thermometerHelpButton.tooltip = "Press for a little help";
			anemometerHelpButton.tooltip = "Press for a little help";
			weatherIconGaugeHelpButton.tooltip = "Press for a little help";
			humidityHelpButton.tooltip = "Press for a little help";

			barometerPin.tooltip = "Press to lock the widget in place";
			thermometerPin.tooltip = "Press to lock the widget in place";
			anemometerPin.tooltip = "Press to lock the widget in place";
			weatherIconGaugePin.tooltip = "Press to lock the widget in place";
			humidityPin.tooltip = "Press to lock the widget in place";
		  
			barometerActionSwitch.tooltip = "Choose smooth movement or regular ticks";
			thermometerActionSwitch.tooltip = "Choose smooth movement or regular ticks";
			anemometerActionSwitch.tooltip = "Choose smooth movement or regular ticks";
			weatherIconGaugeActionSwitch.tooltip = "";
			humidityActionSwitch.tooltip = "Choose smooth movement or regular ticks";

			barometerBackground.tooltip = "CTRL+mouse scrollwheel up/down to resize";
			thermometerBackground.tooltip = "CTRL+mouse scrollwheel up/down to resize";
			anemometerBackground.tooltip = "CTRL+mouse scrollwheel up/down to resize";
			weatherIconGaugeBackground.tooltip = "CTRL+mouse scrollwheel up/down to resize";
			humidityBackground.tooltip = "CTRL+mouse scrollwheel up/down to resize";
			
			barometerText.tooltip = "This is the current pressure value in digital form";
			barometerTextArea.tooltip = barometerText.tooltip
			barometerHighText.tooltip = "This is your previous saved pressure value";
			barometerHighTextArea.tooltip = barometerHighText.tooltip

			barometerDangerLamp.tooltip = "If the lamp is lit red then the pressure is dropping fast enough for a storm";
			thermometerHotLamp.tooltip = "If the lamp is lit - then it is dangerously hot";
			anemometerLamp.tooltip = "If the lamp is lit - then it is dangerously windy";
			thermometerColdLamp.tooltip = "If the lamp is lit - then it is really rather cold";
			weatherIconGaugeLamp.tooltip = "If the lamp is green there is a valid feed";
			
		   btn_ok.tooltip = bf("_Click_here_to_select");
		   btn_cancel.tooltip = bf("_Click_here_to_cancel");
		   
			icaoLamp.tooltip = bf("_Click_here_to_select_icao_codes");
			locationLamp.tooltip = bf("_Click_here_to_select_locations");
			
			radioKnob1.tooltip = bf("_Click_here_to_listen_to_help");
			radioKnob2.tooltip = bf("_Click_here_to_download_data_file");
			
			busy.tooltip = "Double click on face to refresh the data";
			
			weatherIconGaugeManual.tooltip = "Time to next poll in " + timeLeftInSeconds + " secs";
			
    } else {
			barometerStartButton.tooltip = "";
			thermometerStartButton.tooltip = "";
			anemometerStartButton.tooltip = "";
			weatherIconGaugeStartButton.tooltip = "";
			humidityStartButton.tooltip = "";

			barometerStopButton.tooltip = "";
			thermometerStopButton.tooltip = "";
			anemometerStopButton.tooltip = "";
			weatherIconGaugeStopButton.tooltip = "";
			humidityStopButton.tooltip = "";

			barometerSwitchFacesButton.tooltip = "";
			thermometerSwitchFacesButton.tooltip = "";
			anemometerSwitchFacesButton.tooltip = "";
			weatherIconGaugeSwitchFacesButton.tooltip = "";
			humiditySwitchFacesButton.tooltip = "";

			barometerPrefs.tooltip = "";
			thermometerPrefs.tooltip = "";
			anemometerPrefs.tooltip = "";
			weatherIconGaugePrefs.tooltip = "";
			humidityPrefs.tooltip = "";

			barometerHelpButton.tooltip = "";
			thermometerHelpButton.tooltip = "";
			anemometerHelpButton.tooltip = "";
			weatherIconGaugeHelpButton.tooltip = "";
			humidityHelpButton.tooltip = "";

			barometerPin.tooltip = "";
			thermometerPin.tooltip = "";
			anemometerHelpButton.tooltip = "";
			weatherIconGaugeHelpButton.tooltip = "";
			humidityPin.tooltip = "";
		  
			barometerBackground.tooltip = "";
			thermometerBackground.tooltip = "";
			anemometerBackground.tooltip = "";
			weatherIconGaugeBackground.tooltip = "";
			humidityBackground.tooltip = "";
			
			popupknob.tooltip = "";
		   btn_ok.tooltip = "";
		   btn_cancel.tooltip = "";
		   
			icaoLamp.tooltip = "";
			locationLamp.tooltip = "";

			barometerActionSwitch.tooltip = "";
			thermometerActionSwitch.tooltip = "";
			anemometerActionSwitch.tooltip = "";
			weatherIconGaugeActionSwitch.tooltip = "";
			humidityActionSwitch.tooltip = "";
			
			barometerText.tooltip = "";
			barometerTextArea.tooltip = "";
			barometerHighText.tooltip = "";
			barometerHighTextArea.tooltip = "";

			barometerDangerLamp.tooltip = "";
			thermometerHotLamp.tooltip = "";
			anemometerHotLamp.tooltip = "";
			thermometerColdLamp.tooltip = "";
			weatherIconGaugeLamp.tooltip = "";

			radioKnob1.tooltip = "";
			radioKnob2.tooltip = "";
			
			busy.tooltip = "";
			
			weatherIconGaugeManual.tooltip = " ";
			
    }
}
//================
//End function
//================


//=================================================================
// Function to lock the widget
//=================================================================
function lockThermometer() {
	if (preferences.soundPref.value !== "disabled") {
		play(lock, false);
	}
	// check for aspect ratio and determine whether it is in portrait or landscape mode
	if (screen.width > screen.height) {
		aspectRatio = "landscape";
	} else {
		aspectRatio = "portrait";
	}
	if (thermometerWindow.locked) {
		thermometerPin.opacity = 1;		
		thermometerWindow.locked = false;
		thermometerPin.tooltip = "click me to lock the widget in place";

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.thermometerLockLandscapeModePref.value = "disabled";
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.thermometerLockPortraitModePref.value = "disabled";
		}		
	} else {
		thermometerPin.opacity = 255;
		thermometerWindow.locked = true;
		thermometerPin.tooltip = "click me to unlock";

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.thermometerLockLandscapeModePref.value = "enabled";
			preferences.thermometerLandscapeHoffsetPref.value = thermometerWindow.hoffset;
			preferences.thermometerLandscapeVoffsetPref.value = thermometerWindow.voffset;
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.thermometerLockPortraitModePref.value = "enabled";
			preferences.thermometerPortraitHoffsetPref.value = thermometerWindow.hoffset;
			preferences.thermometerPortraitVoffsetPref.value = thermometerWindow.voffset;
		}
	}
}
//================
//End function
//================



//=================================================================
// Function to lock the widget
//=================================================================
function LockAnemometer() {
	if (preferences.soundPref.value !== "disabled") {
		play(lock, false);
	}
	// check for aspect ratio and determine whether it is in portrait or landscape mode
	if (screen.width > screen.height) {
		aspectRatio = "landscape";
	} else {
		aspectRatio = "portrait";
	}
	if (anemometerWindow.locked) {
		anemometerPin.opacity = 1;		
		anemometerWindow.locked = false;
		anemometerPin.tooltip = "click me to lock the widget in place";

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.anemometerLockLandscapeModePref.value = "disabled";
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.anemometerLockPortraitModePref.value = "disabled";
		}		
	} else {
		anemometerPin.opacity = 255;
		anemometerWindow.locked = true;
		anemometerPin.tooltip = "click me to unlock";

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.anemometerLockLandscapeModePref.value = "enabled";
			preferences.anemometerLandscapeHoffsetPref.value = anemometerWindow.hoffset;
			preferences.anemometerLandscapeVoffsetPref.value = anemometerWindow.voffset;
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.anemometerLockPortraitModePref.value = "enabled";
			preferences.anemometerPortraitHoffsetPref.value = anemometerWindow.hoffset;
			preferences.anemometerPortraitVoffsetPref.value = anemometerWindow.voffset;
		}
	}
}
//================
//End function
//================



//=================================================================
// Function to lock the widget
//=================================================================
function LockWeatherIconGauge() {
	if (preferences.soundPref.value !== "disabled") {
		play(lock, false);
	}
	// check for aspect ratio and determine whether it is in portrait or landscape mode
	if (screen.width > screen.height) {
		aspectRatio = "landscape";
	} else {
		aspectRatio = "portrait";
	}
	if (weatherIconGaugeWindow.locked) {
		weatherIconGaugePin.opacity = 1;		
		weatherIconGaugeWindow.locked = false;
		weatherIconGaugePin.tooltip = "click me to lock the widget in place";

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.weatherIconGaugeLockLandscapeModePref.value = "disabled";
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.weatherIconGaugeLockPortraitModePref.value = "disabled";
		}		
	} else {
		weatherIconGaugePin.opacity = 255;
		weatherIconGaugeWindow.locked = true;
		weatherIconGaugePin.tooltip = "click me to unlock";

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.weatherIconGaugeLockLandscapeModePref.value = "enabled";
			preferences.weatherIconGaugeLandscapeHoffsetPref.value = weatherIconGaugeWindow.hoffset;
			preferences.weatherIconGaugeLandscapeVoffsetPref.value = weatherIconGaugeWindow.voffset;
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.weatherIconGaugeLockPortraitModePref.value = "enabled";
			preferences.weatherIconGaugePortraitHoffsetPref.value = weatherIconGaugeWindow.hoffset;
			preferences.weatherIconGaugePortraitVoffsetPref.value = weatherIconGaugeWindow.voffset;
		}
	}
}
//================
//End function
//================


//=================================================================
// Function to lock the barometer gauge
//=================================================================
function lockBarometer() {
	if (preferences.soundPref.value !== "disabled") {
		play(lock, false);
	}
	// check for aspect ratio and determine whether it is in portrait or landscape mode
	if (screen.width > screen.height) {
		aspectRatio = "landscape";
	} else {
		aspectRatio = "portrait";
	}
	if (barometerWindow.locked) {
		barometerPin.opacity = 1;		
		barometerWindow.locked = false;
		barometerPin.tooltip = "click me to lock the widget in place";

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.barometerLockLandscapeModePref.value = "disabled";
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.barometerLockPortraitModePref.value = "disabled";
		}		
	} else {
		barometerPin.opacity = 255;
		barometerWindow.locked = true;
		barometerPin.tooltip = "click me to unlock";

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.barometerLockLandscapeModePref.value = "enabled";
			preferences.barometerLandscapeHoffsetPref.value = barometerWindow.hoffset;
			preferences.barometerLandscapeVoffsetPref.value = barometerWindow.voffset;
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.barometerLockPortraitModePref.value = "enabled";
			preferences.barometerPortraitHoffsetPref.value = barometerWindow.hoffset;
			preferences.barometerPortraitVoffsetPref.value = barometerWindow.voffset;
		}
	}
}
//================
//End function
//================


//=================================================================
// Function to lock the humidity gauge
//=================================================================
function lockHumidity() {
	if (preferences.soundPref.value !== "disabled") {
		play(lock, false);
	}
	// check for aspect ratio and determine whether it is in portrait or landscape mode
	if (screen.width > screen.height) {
		aspectRatio = "landscape";
	} else {
		aspectRatio = "portrait";
	}
	if (humidityWindow.locked) {
		humidityPin.opacity = 1;		
		humidityWindow.locked = false;
		humidityPin.tooltip = "click me to lock the widget in place";

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.humidityLockLandscapeModePref.value = "disabled";
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.humidityLockPortraitModePref.value = "disabled";
		}		
	} else {
		humidityPin.opacity = 255;
		humidityWindow.locked = true;
		humidityPin.tooltip = "click me to unlock";

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.humidityLockLandscapeModePref.value = "enabled";
			preferences.humidityLandscapeHoffsetPref.value = humidityWindow.hoffset;
			preferences.humidityLandscapeVoffsetPref.value = humidityWindow.voffset;
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.humidityLockPortraitModePref.value = "enabled";
			preferences.humidityPortraitHoffsetPref.value = humidityWindow.hoffset;
			preferences.humidityPortraitVoffsetPref.value = humidityWindow.voffset;
		}
	}
}
//================
//End function
//================

//=======================
// unlocks the widget
//=======================
barometerPin.onMouseDown = function () {
	lockBarometer();
};
thermometerPin.onMouseDown = function () {
	lockThermometer();
};
anemometerPin.onMouseDown = function () {
	LockAnemometer();
};
weatherIconGaugePin.onMouseDown = function () {
	LockWeatherIconGauge();
};
humidityPin.onMouseDown = function () {
	lockHumidity();
};
//=======================
//End function
//=======================

//=================================================================
// Function to lock the widget on startup
//=================================================================
function checkLockWidget() {
	// check for aspect ratio and determine whether it is in portrait or landscape mode
	if (screen.width > screen.height) {
		aspectRatio = "landscape";
	} else {
		aspectRatio = "portrait";
	}
	if (debugFlg === 1) {
		print("aspectRatio " + aspectRatio);
		print("preferences.thermometerLockLandscapeModePref.value " + preferences.thermometerLockLandscapeModePref.value);
		print("preferences.thermometerLockPortraitModePref.value " + preferences.thermometerLockPortraitModePref.value);
	}
	// check if the widget has a lock for the screen type.
	
	checkLockThermometer();
	checkLockAnemometer();
	checkLockWeatherIconGauge();
	checkLockHumidity();
	checkLockBarometer();

}
//================
//End function
//================


//=================================================================
// Function to check the thermometer for lock status
//=================================================================
function checkLockThermometer() {	
	if (aspectRatio === "landscape") {
		if (preferences.thermometerLockLandscapeModePref.value === "disabled") {
			thermometerPin.opacity = 1;
			thermometerWindow.locked = false;
			thermometerPin.tooltip = "click me to lock the widget in place";
		} else {
			if (debugFlg === 1) { 
				print("checkLockWidget locking in landscape");
			}
			thermometerPin.opacity = 255;
			thermometerWindow.locked = true;
			thermometerPin.tooltip = "click me to unlock";
		}
	}
	// check if the widget has a lock for the screen type.
	if (aspectRatio === "portrait") {
		if (preferences.thermometerLockPortraitModePref.value === "disabled") {
			thermometerPin.opacity = 1;
			thermometerWindow.locked = false;
			thermometerPin.tooltip = "click me to lock the widget in place";
		} else {
			if (debugFlg === 1) { print("checkLockWidget locking in portrait");};
			thermometerPin.opacity = 255;
			thermometerWindow.locked = true;
			thermometerPin.tooltip = "click me to unlock";
		}
	}
}


//=================================================================
// Function to check the thermometer for lock status
//=================================================================
function checkLockAnemometer() {	
	if (aspectRatio === "landscape") {
		if (preferences.anemometerLockLandscapeModePref.value === "disabled") {
			anemometerPin.opacity = 1;
			anemometerWindow.locked = false;
			anemometerPin.tooltip = "click me to lock the widget in place";
		} else {
			if (debugFlg === 1) { print("checkLockWidget locking in landscape");};
			anemometerPin.opacity = 255;
			anemometerWindow.locked = true;
			anemometerPin.tooltip = "click me to unlock";
		}
	}
	// check if the widget has a lock for the screen type.
	if (aspectRatio === "portrait") {
		if (preferences.anemometerLockPortraitModePref.value === "disabled") {
			anemometerPin.opacity = 1;
			anemometerWindow.locked = false;
			anemometerPin.tooltip = "click me to lock the widget in place";
		} else {
			if (debugFlg === 1) { print("checkLockWidget locking in portrait");};
			anemometerPin.opacity = 255;
			anemometerWindow.locked = true;
			anemometerPin.tooltip = "click me to unlock";
		}
	}
}

//=================================================================
// Function to check the thermometer for lock status
//=================================================================
function checkLockWeatherIconGauge() {	
	if (aspectRatio === "landscape") {
		if (preferences.weatherIconGaugeLockLandscapeModePref.value === "disabled") {
			weatherIconGaugePin.opacity = 1;
			weatherIconGaugeWindow.locked = false;
			weatherIconGaugePin.tooltip = "click me to lock the widget in place";
		} else {
			if (debugFlg === 1) { print("checkLockWidget locking in landscape");};
			weatherIconGaugePin.opacity = 255;
			weatherIconGaugeWindow.locked = true;
			weatherIconGaugePin.tooltip = "click me to unlock";
		}
	}
	// check if the widget has a lock for the screen type.
	if (aspectRatio === "portrait") {
		if (preferences.weatherIconGaugeLockPortraitModePref.value === "disabled") {
			weatherIconGaugePin.opacity = 1;
			weatherIconGaugeWindow.locked = false;
			weatherIconGaugePin.tooltip = "click me to lock the widget in place";
		} else {
			if (debugFlg === 1) { print("checkLockWidget locking in portrait");};
			weatherIconGaugePin.opacity = 255;
			weatherIconGaugeWindow.locked = true;
			weatherIconGaugePin.tooltip = "click me to unlock";
		}
	}
}


//=================================================================
// Function to check the thermometer for lock status
//=================================================================
function checkLockHumidity() {	
	if (aspectRatio === "landscape") {
		if (preferences.humidityLockLandscapeModePref.value === "disabled") {
			humidityPin.opacity = 1;
			humidityWindow.locked = false;
			humidityPin.tooltip = "click me to lock the widget in place";
		} else {
			if (debugFlg === 1) { print("checkLockWidget locking in landscape");};
			humidityPin.opacity = 255;
			humidityWindow.locked = true;
			humidityPin.tooltip = "click me to unlock";
		}
	}
	// check if the widget has a lock for the screen type.
	if (aspectRatio === "portrait") {
		if (preferences.humidityLockPortraitModePref.value === "disabled") {
			humidityPin.opacity = 1;
			humidityWindow.locked = false;
			humidityPin.tooltip = "click me to lock the widget in place";
		} else {
			if (debugFlg === 1) { print("checkLockWidget locking in portrait");};
			humidityPin.opacity = 255;
			humidityWindow.locked = true;
			humidityPin.tooltip = "click me to unlock";
		}
	}
}

//=================================================================
// Function to check the thermometer for lock status
//=================================================================
function checkLockBarometer() {	
	if (aspectRatio === "landscape") {
		if (preferences.barometerLockLandscapeModePref.value === "disabled") {
			barometerPin.opacity = 1;
			barometerWindow.locked = false;
			barometerPin.tooltip = "click me to lock the widget in place";
		} else {
			if (debugFlg === 1) { print("checkLockWidget locking in landscape");};
			barometerPin.opacity = 255;
			barometerWindow.locked = true;
			barometerPin.tooltip = "click me to unlock";
		}
	}
	// check if the widget has a lock for the screen type.
	if (aspectRatio === "portrait") {
		if (preferences.barometerLockPortraitModePref.value === "disabled") {
			barometerPin.opacity = 1;
			barometerWindow.locked = false;
			barometerPin.tooltip = "click me to lock the widget in place";
		} else {
			if (debugFlg === 1) { print("checkLockWidget locking in portrait");};
			barometerPin.opacity = 255;
			barometerWindow.locked = true;
			barometerPin.tooltip = "click me to unlock";
		}
	}
}


//=================================================================
// Function to set the tick type
//=================================================================
barometerActionSwitch.onMouseDown = function ()
{
	ActionSwitchOnMouseDown();
}
thermometerActionSwitch.onMouseDown = function ()
{
	ActionSwitchOnMouseDown();
}
anemometerActionSwitch.onMouseDown = function ()
{
	ActionSwitchOnMouseDown();
}
weatherIconGaugeActionSwitch.onMouseDown = function ()
{
	ActionSwitchOnMouseDown();
}
humidityActionSwitch.onMouseDown = function ()
{
	ActionSwitchOnMouseDown();
}

function ActionSwitchOnMouseDown ()
{
  if (preferences.actionSwitchPref.value == "tick" ) {
       preferences.actionSwitchPref.value = "continuous";
  } else {
       preferences.actionSwitchPref.value = "tick";
  }
if (preferences.soundPref.value !== "disabled") {
	play(lock, false);
}
  barometerActionSwitch.opacity=255;
  thermometerActionSwitch.opacity=255;
  anemometerActionSwitch.opacity=255;
  weatherIconGaugeActionSwitch.opacity=255;
  humidityActionSwitch.opacity=255;
}

//================
//End function
//================

//=================================================================
// Function to set the tick type
//=================================================================
barometerActionSwitch.onMouseUp = function ()
{
	ActionSwitchOnMouseUp ();
}
thermometerActionSwitch.onMouseUp = function ()
{
	ActionSwitchOnMouseUp ();
}
anemometerActionSwitch.onMouseUp = function ()
{
	ActionSwitchOnMouseUp ();
}
weatherIconGaugeActionSwitch.onMouseUp = function ()
{
	ActionSwitchOnMouseUp ();
}
humidityActionSwitch.onMouseUp = function ()
{
	ActionSwitchOnMouseUp ();
}
//================
//End function
//================

//=================================================================
// Function to set the tick type
//=================================================================
function ActionSwitchOnMouseUp ()
{
		  barometerActionSwitch.opacity=1;
		  anemometerActionSwitch.opacity=1;
		  weatherIconGaugeActionSwitch.opacity=1;
		  thermometerActionSwitch.opacity=1;
		  humidityActionSwitch.opacity=1;
        updateWeather();
}
//================
//End function
//================



//===========================================
// this function places the widget on an interval of 10 seconds
//===========================================
function saveBarometerPosition () {	
		//store the current hlocation in % of the screen
		preferences.barometerHLocationPercPref.value = String((barometerWindow.hoffset / screen.width) * 100);
		preferences.barometerVLocationPercPref.value = String((barometerWindow.voffset / screen.height) * 100);
}
//=====================
//End function
//=====================


//===========================================
// this function places the widget on an interval of 10 seconds
//===========================================
function saveThermometerPosition () {	
		//store the current hlocation in % of the screen
		preferences.thermometerHLocationPercPref.value = String((thermometerWindow.hoffset / screen.width) * 100);
		preferences.thermometerVLocationPercPref.value = String((thermometerWindow.voffset / screen.height) * 100);
}
//=====================
//End function
//=====================



//===========================================
// this function places the widget on an interval of 10 seconds
//===========================================
function saveHumidityPosition () {	
		//store the current hlocation in % of the screen
		preferences.humidityHLocationPercPref.value = String((humidityWindow.hoffset / screen.width) * 100);
		preferences.humidityVLocationPercPref.value = String((humidityWindow.voffset / screen.height) * 100);
}
//=====================
//End function
//=====================

//===========================================
// this function places the widget on an interval of 10 seconds
//===========================================
function saveAnemometerPosition () {	
		//store the current hlocation in % of the screen
		preferences.anemometerHLocationPercPref.value = String((anemometerWindow.hoffset / screen.width) * 100);
		preferences.anemometerVLocationPercPref.value = String((anemometerWindow.voffset / screen.height) * 100);
}
//=====================
//End function
//=====================


//===========================================
// this function places the widget on an interval of 10 seconds
//===========================================
function saveWeatherIconGaugePosition () {	
		//store the current hlocation in % of the screen
		preferences.weatherIconGaugeHLocationPercPref.value = String((weatherIconGaugeWindow.hoffset / screen.width) * 100);
		preferences.weatherIconGaugeVLocationPercPref.value = String((weatherIconGaugeWindow.voffset / screen.height) * 100);
}
//=====================
//End function
//=====================


//===========================================
// this function places the widget at a percentage of screen position when switched from portrait to landscape
//===========================================
function placeBarometerByPercentage() {
	if (debugFlg === 1) { 
		print("%placing the Barometer By Percentage");
	}
	// First of all read the previous hlocation from the prefs in %
	// calculate the current hlocation in % of the screen
	// the widget stores any new h & v locations in % of the screen using the half-second location timer - screenLocationTimer
	// if the screen width has changed then change the relative position

	barometerWindow.hoffset = screen.width * (preferences.barometerHLocationPercPref.value / 100);
	barometerWindow.voffset = screen.height * (preferences.barometerVLocationPercPref.value / 100);
}
//=====================
//End function
//=====================

//===========================================
// this function places the Thermometer at a percentage of screen position when switched from portrait to landscape
//===========================================
function placeThermometerByPercentage() {
	if (debugFlg === 1) { 
		print("%placing the Thermometer By Percentage");
	}
	thermometerWindow.hoffset = screen.width * (preferences.thermometerHLocationPercPref.value / 100);
	thermometerWindow.voffset = screen.height * (preferences.thermometerVLocationPercPref.value / 100);
}
//=====================
//End function
//=====================

//===========================================
// this function places the humidity gauge at a percentage of screen position when switched from portrait to landscape
//===========================================
function placeHumidityByPercentage() {
	if (debugFlg === 1) { 
		print("%placing the Humidity By Percentage");
	}
	humidityWindow.hoffset = screen.width * (preferences.humidityHLocationPercPref.value / 100);
	humidityWindow.voffset = screen.height * (preferences.humidityVLocationPercPref.value / 100);
}
//=====================
//End function
//=====================

//===========================================
// this function places the anemometer at a percentage of screen position when switched from portrait to landscape
//===========================================
function placeAnemometerByPercentage() {
	if (debugFlg === 1) { 
		print("%placing the Anemometer By Percentage");
	}
	anemometerWindow.hoffset = screen.width * (preferences.anemometerHLocationPercPref.value / 100);
	anemometerWindow.voffset = screen.height * (preferences.anemometerVLocationPercPref.value / 100);
}
//=====================
//End function
//=====================


//===========================================
// this function places the weatherIconGauge at a percentage of screen position when switched from portrait to landscape
//===========================================
function placeweatherIconGaugeByPercentage() {
	if (debugFlg === 1) { 
		print("%placing the weatherIconGauge By Percentage");
	}
	weatherIconGaugeWindow.hoffset = screen.width * (preferences.weatherIconGaugeHLocationPercPref.value / 100);
	weatherIconGaugeWindow.voffset = screen.height * (preferences.weatherIconGaugeVLocationPercPref.value / 100);
}
//=====================
//End function
//=====================






//=================================================================
// END script functions.js
//=================================================================



        /*
        barometer
        thermometer
        humidity
		  */
		  