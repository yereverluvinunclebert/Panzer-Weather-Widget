//  ||
//====================================================================================
// Panzer weather widget 1.0.1
// Steampunked by: Dean Beedell with serious code suggestions by Harry Whitfield (original code by Bogdan Irimia now 95% replaced)
// Dean.beedell@lightquick.co.uk
//
// metar.js - include for specific weather feed functions related to this feed source - https://aviationweather.gov
//
//====================================================================================

 
//================================================================================================
// this function is where we come to when an ICAO code is found and data returned
// a successful http request brings you here.
//================================================================================================
function myStatusProc() {
var vals,
	returnedXML,
	vals0,
	secsDif,
	returnedString;
	var data1;
	var num_results ;
	var observation_time ;
	var station_id; 
	var temp_c ;
	var altim_in_hg; 
	var dewpoint_c; 

	var latitude; 
	var longitude ;

	var visibility_statute_mi ;
	var metar_items; 
	var current_node;
	var sky_condition_items;
	var cloud_base_ft_agl = new Array();
	var sky_cover = new Array();  // this should clear the array each time it is called.
	var counter ;
	var humidity ;
	var locationDayNight;
	var decimalTime;
	var isDay;
	var initialObsTime ;
	var cloud_base_mt_agl;
	var humidity;
	var answer;
// vars to change the weather string to metric measurements
	var numericRegex = /[+-]?\d+(?:\.\d+)?/g;
	var cloudBaseMatch;
	var cloudBaseMetres;
	var cnt1 = 0;
	
	var connectErrorCount = 0;

	suppressUpdates();  // stops the widget from updating visually
	
    // debugFlg = 0
    if (debugFlg === 1) { print("%myStatusProc - this.readyState "+ this.readyState)};
    if (this.readyState === 4) { // asynchronous xml request complete
        if (debugFlg === 1) { print("%myStatusProc:status:  " + this.status)};
        if (this.status === 200) {
            connectErrorCount = 0;
            // return as XML
            returnedXML = this.responseXML;
            // return as string - this is only for debugFlg logging
            // returnedString = this.responseText.split(">");
            returnedString = this.responseText;
            if (debugFlg === 1) { print("%myStatusProc - returnedString: " + returnedString.toString())};

            // get the values from the XML data response, the num results should be non-zero
            data1 = returnedXML.evaluate("string(response/data)");
            num_results = returnedXML.evaluate("string(response/data/attribute::num_results)");
            if (debugFlg === 1) { print ("%myStatusProc - num_results "+ num_results)};

            //num_results = "0";
            // if the feed is successful but the number of results is zero  
            if (num_results === "0" ) {
	            if (preferences.alertPref.value === "enabled") {
	              //The source weather feed is currently producing no valid data.
	              alert(bf('_alertstr11')+ (parseInt(preferences.sampleIntervalPref.value/60)) + bf('_alertstr12'));
	            }
	            busyStop();
               weatherIconGaugeLamp.src="Resources/images/red-lamptrue.png";
               return;
            }
            
            weatherIconGaugeTimer.ticking = true;

            weatherIconGaugeLamp.src="Resources/images/green-lamptrue.png";
				// if you have managed to get this far then the feed is good and returning valid data
			    if ( preferences.tooltipPref.value === "enabled" ) {
			            weatherIconGaugeLamp.tooltip = "Feed is valid and giving weather data";
				 } 
				 
            // get the values from the XML data and return strings - the easy stuff first
            observation_time = returnedXML.evaluate("string(response/data/METAR/observation_time)");
            if (debugFlg === 1) { print ("%myStatusProc - observation_time "+ observation_time)};
            station_id = returnedXML.evaluate("string(response/data/METAR/station_id)");
            if (debugFlg === 1) { print ("%myStatusProc - station_id "+ station_id)};
            temp_c = parseInt(returnedXML.evaluate("string(response/data/METAR/temp_c)"));
            if (debugFlg === 1) { print ("%myStatusProc - temp_c "+ temp_c)};
            altim_in_hg = returnedXML.evaluate("string(response/data/METAR/altim_in_hg)");
            if (debugFlg === 1) { print ("%myStatusProc - altim_in_hg "+ altim_in_hg)};
            dewpoint_c = parseInt(returnedXML.evaluate("string(response/data/METAR/dewpoint_c)"));
            if (debugFlg === 1) { print ("%myStatusProc - dewpoint_c "+ dewpoint_c)};
            wind_dir_degrees = returnedXML.evaluate("string(response/data/METAR/wind_dir_degrees)");
            if (debugFlg === 1) { print ("%myStatusProc - wind_dir_degrees "+ wind_dir_degrees)};
            wind_speed_kt = returnedXML.evaluate("string(response/data/METAR/wind_speed_kt)");
            if (debugFlg === 1) { print ("%myStatusProc - wind_speed_kt "+ wind_speed_kt)};

            //wind_speed_kt = "90"; 
            
            latitude = returnedXML.evaluate("string(response/data/METAR/latitude)");
            if (debugFlg === 1) { print ("%myStatusProc - latitude "+ latitude)};
            longitude = returnedXML.evaluate("string(response/data/METAR/longitude)");
            if (debugFlg === 1) { print ("%myStatusProc - longitude "+ longitude)};

            wx_string = returnedXML.evaluate("string(response/data/METAR/wx_string)");
            if (debugFlg === 1) { print ("%myStatusProc - wx_string "+ wx_string)};

            precip_in = returnedXML.evaluate("string(response/data/METAR/precip_in)");
            if (debugFlg === 1) { print ("%myStatusProc - precip_in "+ precip_in)};

            visibility_statute_mi = returnedXML.evaluate("string(response/data/METAR/visibility_statute_mi)");
            if (debugFlg === 1) { print ("%myStatusProc - visibility_statute_mi "+ visibility_statute_mi)}

            // this is the routine that will determine if there is more than one sky attribute
            metar_items = returnedXML.evaluate("/response/data/METAR"); //read in the metar data into an array
				current_node = metar_items.item(0);	// this gets <METAR> group where the metar data resides
            sky_condition_items = current_node.evaluate("sky_condition"); //get the sky_condition from the METAR group

            cloud_base_ft_agl = new Array();
            sky_cover = new Array();  // this should clear the array each time it is called.
            counter = 0;

			   if (sky_condition_items != null) {
					while (counter < sky_condition_items.length) {
			                        current_node = sky_condition_items.item(counter);
			                        sky_cover[counter] = current_node.evaluate("string(attribute::" + "sky_cover" + ")");
			                        cloud_base_ft_agl[counter] = current_node.evaluate("string(attribute::" + "cloud_base_ft_agl" + ")");
			                        counter = counter + 1;
					}
			   }
            //the first and lowest cloudbase is the one that really counts, there could be as many as three sky cover readings
            if (debugFlg === 1) { print ("%myStatusProc - sky_cover 1 "+ sky_cover[0])};
            if (debugFlg === 1) { print ("%myStatusProc - cloud_base_ft_agl 1 "+ cloud_base_ft_agl[0])};
            if (debugFlg === 1 && sky_cover[1] != undefined) { print ("%myStatusProc - sky_cover 2 "+ sky_cover[1])};
            if (debugFlg === 1 && sky_cover[1] != undefined) { print ("%myStatusProc - cloud_base_ft_agl 2 "+ cloud_base_ft_agl[1])};
            //if the station id returned is null then assume the weather information is missing for an unknown reason.
            if (station_id === "") {
                if (debugFlg === 1) { print ("%myStatusProc - missing station_id ")};
                answer = alert("Rather weird - The supplied ICAO code " + preferences.icao.value + " does not seem to providing any valid data, please select another.");
                if (answer === 1) {
                  searchWindowVisible(); // replace with an input form
                }
            }
            
            //decode the visibility when a cloud cover field found
            
            skyClarity ="";
            skyClarityString= "";
            skyClarity = get_cloud_cover(sky_cover);
            if (cloud_base_ft_agl != 0) {
                if (preferences.imperialMetricPref.value === "metric") {
							// change the string to metric measurements
							cloud_base_mt_agl = "";
							cloud_base_ft_agl = "1100, 1400 and 2200"
							
							while (cloudBaseMatch = numericRegex.exec(cloud_base_ft_agl)) {
							   if (cloud_base_mt_agl != "") {cloud_base_mt_agl += ", "};
							   cloudBaseMetres = parseInt(cloudBaseMatch * 0.3048) ;
							   cloud_base_mt_agl = cloud_base_mt_agl + cloudBaseMetres;
								cnt1 += 1;
							}
							//print("..cloud_base_mt_agl " + cloud_base_mt_agl);
							skyClarityString = skyClarity + " at " + cloud_base_mt_agl + " m.";
                } else {
                    skyClarityString = skyClarity + " at " + cloud_base_ft_agl + " ft.";
                }
            }
            if (debugFlg === 1) { print("%myStatusProc - skyClarityString " + skyClarityString)};

            resumeUpdates(); // graphically resume updates - helps prevents the white backgrounds 
            
            // get pressure in millimetres of mercury by default
            pressureValue = Math.round(Number(altim_in_hg * 25.3999)); // returns value from inches of mrcury to millimetres of mercury
            //pressureValStr = String(pressureValue) + "(" + String(Math.round(1.3333 * pressureValue)) + ")";
            //if (debugFlg === 1) { print ("%myStatusProc - Pressure = "+ pressureValStr)};

            // rotate the outer hand to show the data has just been captured
            //rotateHand(); //we don't have a hand to rotate yet

            // set temperature
            
            temperatureValue = temp_c ;

            //calculate humidity
            
            humidity = Math.round(100 * Math.pow((112 - (0.1 * temp_c ) + dewpoint_c) / (112 + (0.9 * temp_c )), 8));
            if (debugFlg === 1) { print ("%myStatusProc - humidity "+ humidity)};
            humidityValue = humidity;
 
 				// now set the gauge pointers

            if (preferences.actionSwitchPref.value === "tick" ) {
            
					barometerSecondHand.rotation = (((pressureValue -600)/2)  * 3) +30;
					barometerSecondShadow.rotation = barometerSecondHand.rotation;
					
					thermometerSecondHand.rotation = (300 * ((temperatureValue + 30)/80)+30);
					thermometerSecondShadow.rotation = thermometerSecondHand.rotation;

					anemometerSecondHand.rotation = ((wind_speed_kt)  * 3) +30;
					anemometerSecondShadow.rotation = anemometerSecondHand.rotation;
3
					humiditySecondHand.rotation = (humidityValue  * 3) +30;
					humiditySecondShadow.rotation = humiditySecondHand.rotation;
					
					anemometerWindHand.rotation = parseInt(wind_dir_degrees) ;

			} else {
				   // the animated rotations have been moved to timers to prevent resource competition
					gaugeTimer.ticking=true;
					
					//anemometerWindHand.rotation = parseInt(wind_dir_degrees) ;
					//rotateObject(anemometerWindHand, parseInt(wind_dir_degrees) );
			}
				
        	if (preferences.actionSwitchPref.value === "smooth" ) {
				rotateObject(barometerManual, (((preferences.lastPres.value -600)/2)  * 3) -15);
			} else {
				barometerManual.rotation = (((preferences.lastPres.value -600)/2)  * 3) -15;
			}				
				
			// now light the lamps

			if (temperatureValue >= 80)  {
			    thermometerHotLamp.src = "Resources/images/red-lamptrue.png";
			} else {
			    thermometerHotLamp.src = "Resources/images/red-lampfalse.png";
			}
			
			if (temperatureValue <= 0)  {
			    thermometerColdLamp.src = "Resources/images/blue-lamptrue.png";
			} else {
			    thermometerColdLamp.src = "Resources/images/blue-lampfalse.png";
			}
			
			if (wind_speed_kt >= 80)  {
			    anemometerLamp.src = "Resources/images/red-lamptrue.png";
			} else {
			    anemometerLamp.src = "Resources/images/red-lampfalse.png";
			}

			// the barometer lamp is lit via a timer
			
			testPressureDrop();
				
			// now populate the text areas
			
			humidityText.data = humidityValue;
			humidityTextArea.data = humidityValue;
			
			checkAndSetThermometerScale();
			checkAndSetAnemometerScale(); 	
														
			setBarometerText();
			setThermometerText();
			setAnemometerText();
			
			// build the dock vitality

			buildVitality("Resources/images/dock.png", weatherIcon, gCity, gTemp, "\u00B0");

            // get the current decimalTime and use it to test for sunrise or sunset
            
            locationDayNight = new SunriseSunset(theDate.getYear(), theDate.getMonth(), theDate.getDay(), latitude , longitude  );
            decimalTime = theDate.getHours() + ( theDate.getMinutes()/ 60) ;
            //if (debugFlg === 1) { print ("%myStatusProc - decimalTime "+ decimalTime)};
            
            //print ("%myStatusProc >>>>>>>>>>>>>>>> - decimalTime "+ decimalTime);
            isDay = locationDayNight.isDaylight(decimalTime);
            if (debugFlg === 1) { print("%myStatusProc - daylight " + isDay)};

            //wx_string = "+FG"; //testing string

            // set the general weather conditions into the icon displayed
            
            determineWeatherConditionIcon(wx_string, sky_cover, isDay);

            // get the observation time string
            
            initialObsTime = observation_time.substr(0,10) + " " + observation_time.substr(11,8);
            usableObsTime = stringToDate(initialObsTime);

            //set the mini clock to show the observation time
            theClock.displayTime(usableObsTime); // we don't yet ha4ve amini clock

            // get the current time string and compare
            
            theDate = new Date();
            secsDif = parseInt(theDate.getTime() / 1000, 10) - parseInt(usableObsTime.getTime() / 1000, 10);

            // format the interval for display in the tooltip
            difString = nice_format_interval(secsDif);
            preferences.lastUpdated.value = usableObsTime.getTime();
            if (debugFlg === 1) { print("%myStatusProc - difString " + difString)};

            humidityBackground.Tooltip = " ";
            // set the hover over tooltips
            setHoverTooltip(wind_dir_degrees, wind_speed_kt, precip_in, difString, wx_string);

            setIconTooltip(wx_string, sky_cover);

            set_the_pointer();

 			sizeClock("weatherIconGauge") //kludge to make the gauge display the correct weather icon

            // buildVitality
            gCity = icaoLocation5+ " "+ icaoLocation1;
            gTemp = temperatureValue;
            if (gCity && gTemp) {
                buildVitality("Resources/images/dock.png", weatherIcon, gCity, gTemp, "\u00B0"); //u00B0 unicode character
            }
             busyStop();
        } else {
            // Cannot connect so generate an error, this handles total failures to connect to the feed, internet disconnected &c
             if (preferences.alertPref.value === "enabled") {
	            if (connectErrorCount === preferences.connectErrorCountPref.value ) {
	              //The source weather feed is currently producing no valid data.
	              alert(bf('_alertstr9')+ (parseInt(preferences.sampleIntervalPref.value/60)) + " mins.");
	              connectErrorCount = 0;
	              return;
             	}
            }
            connectErrorCount = connectErrorCount + 1;
        }
    }
}
//========================
//End function
//========================




//=======================================================
// this function gets data from the chosen location - called from the timer routine
//=======================================================
function getData(loc) {
    var request;
    // debugFlg = 0;
     // start the busy timer animation
     if (debugFlg === 1) { print("start the busy timer animation");};
     //busyTimer.ticking=true;
     if (weatherText.data === "") {
     		weatherText.data = "obtaining weather data... from https://aviationweather.gov/"
     }

    if (debugFlg === 1) { print("%getData - Getting data... from aviationweather.gov/adds/.../stationstring=" + loc)};
    request = new XMLHttpRequest();        // an asynchronous request
    analysisType = "METAR";
    analysisType2 = "";
    request.onreadystatechange = myStatusProc;
    if (debugFlg === 1) { print("%getData - location " + loc)};
     request.open("GET", "https://aviationweather.gov/api/data/dataserver?requestType=retrieve&dataSource=metars&stationString=" + loc + "&hoursBeforeNow=6&format=xml&mostRecent=true", "true");

    if (debugFlg === 1) { print("%getData - http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&hoursBeforeNow=1&stationString=" + loc)};

    request.timeout = 10;
    request.send();
}
//========================
//End function
//========================



//================================================================================================
//  function to decode_weather when a wx field found and set the icon accordingly
//================================================================================================
function determineWeatherConditionIcon(wx_string, sky_cover, isDay){
   //wx_string = "+PRFG"; //testing string
   //sky_cover[0] = "BKN";
   // debugFlg = 0;
   
   var wSeverity="";
   var wModifier="";
   var skycover1="";
   var skycover2="";
   var skycover3="";

    if (sky_cover[0] === "SKC") {skycover1 = "SKC"};
    if (sky_cover[1] === "SKC") {skycover2 = "SKC"};
    if (sky_cover[2] === "SKC") {skycover3 = "SKC"};
    if (sky_cover[0] === "CLR") {skycover1 = "CLR"};
    if (sky_cover[1] === "CLR") {skycover2 = "CLR"};
    if (sky_cover[2] === "CLR") {skycover3 = "CLR"};
    if (sky_cover[0] === "FEW") {skycover1 = "FEW"};
    if (sky_cover[1] === "FEW") {skycover2 = "FEW"};
    if (sky_cover[2] === "FEW") {skycover3 = "FEW"};
    if (sky_cover[0] === "SCT") {skycover1 = "SCT"};
    if (sky_cover[1] === "SCT") {skycover2 = "SCT"};
    if (sky_cover[2] === "SCT") {skycover3 = "SCT"};
    if (sky_cover[0] === "BKN") {skycover1 = "BKN"};
    if (sky_cover[1] === "BKN") {skycover2 = "BKN"};
    if (sky_cover[2] === "BKN") {skycover3 = "BKN"};
    if (sky_cover[0] === "OVC") {skycover1 = "OVC"};
    if (sky_cover[1] === "OVC") {skycover2 = "OVC"};
    if (sky_cover[2] === "OVC") {skycover3 = "OVC"};
    if (sky_cover[0] === "VV ") {skycover1 = "VV "};
    if (sky_cover[1] === "VV ") {skycover2 = "VV "};
    if (sky_cover[2] === "VV ") {skycover3 = "VV "};
    if (sky_cover[0] === "CAVOK") {skycover1 = "CAVOK"};
    if (sky_cover[1] === "CAVOK") {skycover2 = "CAVOK"};
    if (sky_cover[2] === "CAVOK") {skycover3 = "CAVOK"};

   if (debugFlg === 1) { print("%determineWeatherCondition - sky_cover " +sky_cover[0])};

   if (wx_string.indexOf("-") !=-1 ) {
     wSeverity = "light";
   } else if (wx_string.indexOf("+") !=-1 ) {
      wSeverity = "heavy";
   } else {
     wSeverity = "medium";  // moderate conditions have no descriptor
   }

   if (debugFlg === 1) { print("%determineWeatherCondition - wx_string " +wx_string)};
   if (debugFlg === 1) { print("%determineWeatherCondition - wSeverity " +wSeverity)};
   if (wx_string.indexOf("UP") !=-1 ) {presentConditions += "unknown ";}

   //in the absence of a weather code assume clear sky
   //var presentConditions = "clear and sunny";
   weatherVal="0cloud.png";

   //determine the weather type,
   if (wx_string.indexOf("MI") !=-1 ) {
     wModifier += "shallow ";
   }
   if (wx_string.indexOf("PR") !=-1 ) {
     wModifier += "partial ";
   }
   if (wx_string.indexOf("DZ") !=-1 ) {
     wModifier += "drizzle ";
   }
   if (wx_string.indexOf("BC") !=-1 ) {
     wModifier += "patches of ";
   }
   if (wx_string.indexOf("DR") !=-1 ) {
     wModifier += "drifting ";
   }
   if (wx_string.indexOf("BL") !=-1 ) {
     wModifier += "blowing ";
   }
   if (wx_string.indexOf("SH") !=-1 ) {
     wModifier += "showers ";
   }
   if (wx_string.indexOf("VC") !=-1 ) {
     //presentConditions += "nearby ";
     wModifier += "nearby ";
   }
   if (wx_string.indexOf("FZ") !=-1 ) {
     //presentConditions += "freezing ";
     wModifier += "freezing ";
   }

   // FEW = 1 or 2 eighths cover; SCT = 3 or 4 eighths cover; BKN = 5, 6 or 7 eighths cover & OVC = 8/8 cover

   //use the cloud code to determine cloud cover
    if (skycover1 === "SKC" || skycover2  === "SKC" || skycover3 === "SKC" ) {skyClarity = "Clear skies"};   // default clear
    if (skycover1 === "CLR" || skycover2  === "CLR" || skycover3 === "CLR" ) {skyClarity = "Clear skies"};   // default
    if (skycover1 === "VV " || skycover2  === "VV " || skycover3 === "VV " ) {skyClarity = "Vertical visibility"};      // default
    if (skycover1 === "CAVOK" || skycover2  === "CAVOK" || skycover3 === "CAVOK") {skyClarity = "Ceiling and visibility OK"};       // default

    if (skycover1 === "FEW" || skycover2  === "FEW" || skycover3 === "FEW") {
      //Partly cloudy"
      weatherVal="1cloud_norain.png";
    };
    if (skycover1 === "SCT" || skycover2  === "SCT" || skycover3 === "SCT") {
      //skyClarity = "Scattered clouds"
      weatherVal="2cloud_norain.png";
    };
    if (skycover1 === "BKN" || skycover2  === "BKN" || skycover3 === "BKN") {
      //skyClarity = "Mostly cloudy"
      weatherVal="3cloud_norain.png";
    };
    if (skycover1 === "OVC" || skycover2  === "OVC" || skycover3 === "OVC") {
      //skyClarity = "Overcast"
      weatherVal="4cloud_norain.png";
    };


   //type of weather - snow
   if (wx_string.indexOf("SN") !=-1 || wx_string.indexOf("SG") !=-1 ) {

       if (wSeverity=="light") {
          if (skycover1 === "SCT" || skycover2  === "SCT" || skycover3 === "SCT") {
             //skyClarity = "Scattered clouds"
             weatherVal="1cloud_lightsnow.png"; //default
          };
          if (skycover1 === "BKN" || skycover2  === "BKN" || skycover3 === "BKN") {
            //skyClarity = "Mostly cloudy"
            weatherVal="2cloud_lightsnow.png";
          };
          if (skycover1 === "OVC" || skycover2  === "OVC" || skycover3 === "OVC"){
            //skyClarity = "Mostly cloudy"
            weatherVal="4cloud_lightsnow.png";
          };
       }
       if (wSeverity=="medium") {
          if (skycover1 === "SCT" || skycover2  === "SCT" || skycover3 === "SCT") {
            //skyClarity = "Scattered clouds"
            weatherVal="2cloud_snow.png";
          };
          if (skycover1 === "BKN" || skycover2  === "BKN" || skycover3 === "BKN") {
            //skyClarity = "Mostly cloudy"
            weatherVal="2cloud_snow.png";
          };
          if (skycover1 === "OVC" || skycover2  === "OVC" || skycover3 === "OVC") {
            //skyClarity = "Overcast"
            weatherVal="3cloud_snow.png";
          };
       }
       if (wSeverity=="heavy") {
            weatherVal="4cloud_heavysnow.png";
       }
   }
   
   // no need to take the cloud into account, always cloudy with hail
   var weatherType = "none";
   if (wx_string.indexOf("IC") !=-1 ) {
     //presentConditions += "ice crystals ";
     weatherType = "hail";
   }
   if (wx_string.indexOf("PE") !=-1 ) {
     //presentConditions += "ice pellets ";
     weatherType = "hail";
   }
   if (wx_string.indexOf("GR") !=-1 ) {
     //presentConditions += "hail ";
     weatherType = "hail";
   }
   if (wx_string.indexOf("GS") !=-1 ) {
     //presentConditions += "small hail ";
     weatherType = "hail";
   }  // and/or snow pellets

   //type of weather - hail
   if (weatherType === "hail") {
       if (wSeverity=="light") {
          weatherVal="2cloud_hail.png"; //default
          if (skycover1 === "OVC" || skycover2  === "OVC" || skycover3 === "OVC") {
            //skyClarity = "Mostly cloudy"
            weatherVal="4cloud_lighthail.png";
          };
       }
       if (wSeverity=="medium") {
          if ((skycover1 === "SCT" || skycover2  === "SCT" || skycover3 === "SCT")||(skycover1 === "BKN" || skycover2  === "BKN" || skycover3 === "BKN"))  {
            //skyClarity = "Scattered clouds"
            weatherVal="2cloud_hail.png";
          };
          if (skycover1 === "OVC" || skycover2  === "OVC" || skycover3 === "OVC") {
            //skyClarity = "Mostly cloudy"
            weatherVal="3cloud_hail.png";
          };
       }
       if (wSeverity=="heavy") {
            weatherVal="4cloud_heavyhail.png";
       }
   }
   
    // this caters for the event when there are showers indicated but no associated rain code
    // it is strange but it quite often occurs...
    if (wx_string.indexOf("SH") !=-1 && wx_string.indexOf("SN") === -1 && wx_string.indexOf("SG") === -1 && weatherType != "hail")
    {
         //if no RAin code nor hail or snow but showers indicated then just assume rain...
         showersIcon.src= "Resources/images/icons_metar/day/" + "showers.png";
    } else {
         showersIcon.src= "";
    }

   //type of weather - rain
   if (wx_string.indexOf("RA") !=-1 ) {
       wSeverity="light"; // default
     //presentConditions += "rain ";
       if (wSeverity=="light") {
          if (skycover1 === "FEW" || skycover2  === "FEW" || skycover3 === "FEW") {
            //Partly cloudy"
            weatherVal="1cloud_lightrain.png";
          };
          if (skycover1 === "SCT" || skycover2  === "SCT" || skycover3 === "SCT") {
            //skyClarity = "Scattered clouds"
            weatherVal="2cloud_lightrain.png";
          };
          if (skycover1 === "BKN" || skycover2  === "BKN" || skycover3 === "BKN") {
            //skyClarity = "Mostly cloudy"
            weatherVal="3cloud_lightrain.png";
          };
          if (skycover1 === "OVC" || skycover2  === "OVC" || skycover3 === "OVC") {
            //skyClarity = "Overcast"
            weatherVal="4cloud_lightrain.png";
          };
       }
       if (wSeverity=="medium") {
          if (skycover1 === "FEW" || skycover2  === "FEW" || skycover3 === "FEW") {
            //Partly cloudy"
            weatherVal="1cloud_modrain.png";
          };
          if (skycover1 === "SCT" || skycover2  === "SCT" || skycover3 === "SCT") {
            //skyClarity = "Scattered clouds"
            weatherVal="2cloud_modrain.png";
          };
          if (skycover1 === "BKN" || skycover2  === "BKN" || skycover3 === "BKN") {
            //skyClarity = "Mostly cloudy"
            weatherVal="3cloud_modrain.png";
          };
          if (skycover1 === "OVC" || skycover2  === "OVC" || skycover3 === "OVC") {
            //skyClarity = "Overcast"
            weatherVal="4cloud_modrain.png";
          };
       }
       if (wSeverity=="heavy") {
          if (skycover1 === "FEW" || skycover2  === "FEW" || skycover3 === "FEW") {
            //Partly cloudy"
            weatherVal="1cloud_heavyrain.png";
          };
          if (skycover1 === "SCT" || skycover2  === "SCT" || skycover3 === "SCT") {
            //skyClarity = "Scattered clouds"
            weatherVal="2cloud_heavyrain.png";
          };
          if (skycover1 === "BKN" || skycover2  === "BKN" || skycover3 === "BKN") {
            //skyClarity = "Mostly cloudy"
            weatherVal="3cloud_heavyrain.png";
          };
          if (skycover1 === "OVC" || skycover2  === "OVC" || skycover3 === "OVC") {
            //skyClarity = "Overcast"
            weatherVal="4cloud_heavyrain.png";
          };
       }
       
       if (wx_string.indexOf("TS") !=-1 ) {
            wModifier += "thunderstorm ";
            weatherVal="4cloud_heavyrain.png";
       }
   }

   fogIcon.src= "";    //default
   if (wx_string.indexOf("BR") !=-1 || wx_string.indexOf("FG") !=-1 ) {
     //presentConditions += "fog " or "mist";}
     if (wSeverity=="light") {
          fogIcon.src= "Resources/images/icons_metar/day/" + "1_fog.png";  //night or day makes no difference
       }
       if (wSeverity=="medium") {
          fogIcon.src= "Resources/images/icons_metar/day/" + "2_fog.png";
       }
       if (wSeverity=="heavy") {
          fogIcon.src= "Resources/images/icons_metar/day/" + "3_fog.png";
       }
   }

   //windIcon.src= "Resources/images/icons_metar/night/windy03.png";   //default
   if (wx_string.indexOf("SQ") !=-1 ) {
     //presentConditions += "strong winds ";
     windIcon.src= "Resources/images/icons_metar/day/" + "windy03.png";
   }

   exoticIcon.src= "";   //default
   //exotic types - we have no icons for any of these
   if (wx_string.indexOf("FU") !=-1 ) {
      exoticIcon.src= "Resources/images/icons_metar/day/" + "smoke.png";
      //presentConditions += "smoke ";
   }
   if (wx_string.indexOf("VA") !=-1 ) {
     //presentConditions += "volcanic ash ";
      exoticIcon.src= "Resources/images/icons_metar/day/" + "volcano.png";
   }
   if (wx_string.indexOf("DU") !=-1 ) {
     //presentConditions += "widespread dust ";}
      exoticIcon.src= "Resources/images/icons_metar/day/" + "dust.png";
   }
   if (wx_string.indexOf("SA") !=-1 ) {
     //presentConditions += "sand ";}
      exoticIcon.src= "Resources/images/icons_metar/day/" + "sand.png";
   }
   if (wx_string.indexOf("HZ") !=-1 ) {
     //presentConditions += "haze ";}
      exoticIcon.src= "Resources/images/icons_metar/day/" + "haze.png";
   }
   if (wx_string.indexOf("PY") !=-1 ) {
     //presentConditions += "spray ";}
      exoticIcon.src= "Resources/images/icons_metar/day/" + "spray.png";
   }
   if (wx_string.indexOf("PO") !=-1 ) {
     //presentConditions += "dustdevils ";}
      exoticIcon.src= "Resources/images/icons_metar/day/" + "dustdevil.png";
   }
   if (wx_string.indexOf("FC") !=-1 ) {
     //presentConditions += "tornado ";}
      exoticIcon.src= "Resources/images/icons_metar/day/" + "tornado.png";
   }
   if (wx_string.indexOf("SS") !=-1 ) {
     //presentConditions += "sandstorm/duststorm ";}
      exoticIcon.src= "Resources/images/icons_metar/day/" + "duststorm.png";
   }

    if (weatherVal) {
      if (isDay === true ) {
         var iconSrc = "Resources/images/icons_metar/day/" + weatherVal;
         weatherIcon.src = iconSrc;
         preceding.src = iconSrc    ;
         following.src = iconSrc    ;
      } else {
         var iconSrc = "Resources/images/icons_metar/night/n_" + weatherVal;
         weatherIcon.src = iconSrc;
         preceding.src = iconSrc    ;
         following.src = iconSrc    ;
      }
    } else {
      weatherIcon.src = "Resources/images/globe.png";
    }
   if (debugFlg === 1) { print("%determineWeatherCondition - iconSrc " +iconSrc)};
}
//========================
//End function
//========================



//================================================================================================
//  function to decode cloud cover information into a text form
//================================================================================================
function get_cloud_cover(sky_cover){
// Decodes cloud cover information.
// Format is SKC or CLR for clear skies, or cccnnn where ccc = 3-letter
// code and nnn = altitude of cloud layer in hundreds of feet. 'VV' seems
// to be used for very low cloud layers. (Other conversion factor:
// 1 m = 3.28084 ft)
// FEW = 1 or 2 eighths cover; SCT = 3 or 4 eighths cover; BKN = 5, 6 or 7 eighths cover & OVC = 8/8 cover

    // debugFlg = 0;
    
    var skyClarity = bf("_ceiling_and_visibility_OK");
    if (sky_cover[0] === "SKC") {skyClarity = bf("_clear_skies")};
    if (sky_cover[0] === "CLR") {skyClarity = bf("_clear_skies")};
    if (sky_cover[0] === "FEW") {skyClarity = bf("_partly_cloudy")};
    if (sky_cover[0] === "SCT") {skyClarity = bf("_scattered_clouds")};
    if (sky_cover[0] === "BKN") {skyClarity = bf("_mostly_cloudy")};
    if (sky_cover[0] === "OVC") {skyClarity = bf("_overcast")};
    if (sky_cover[0] === "VV ") {skyClarity = bf("_vertical_visibility")};
    if (sky_cover[0] === "CAVOK ") {skyClarity = bf("_ceiling_and_visibility_OK")};

//    (1) there are no clouds below 5000 feet above aerodrome level (AAL) or minimum sector altitude (whichever is higher) and no cumulonimbus or towering cumulus; (2) visibility is at least 10 kilometres (6 statute miles) or more; and (3) no current or forecast significant weather such as precipitation, thunderstorms, shallow fog or low drifting snow

    if (sky_cover[1] === "FEW" && sky_cover[0] != sky_cover[1]) {skyClarity += " + " + bf("_partly_cloudy")};
    if (sky_cover[1] === "SCT" && sky_cover[0] != sky_cover[1]) {skyClarity += " + " + bf("_scattered_clouds")};
    if (sky_cover[1] === "BKN" && sky_cover[0] != sky_cover[1]) {skyClarity += " + " + bf("_mostly_cloudy")};
    if (sky_cover[1] === "OVC" && sky_cover[0] != sky_cover[1]) {skyClarity += " + " + bf("_overcast")};

    if (debugFlg === 1) { print("%get_cloud_cover - part " +skyClarity)};
    return skyClarity;

}
//========================
//End function
//========================



//=================================================================================
// function to set the metar description text returning presentConditions just for the bk tooltip according to information received
//=================================================================================
function getMetarDescription(wx_string) {

   var presentConditions = "";
   var wSeverity="";
   var wModifier="";

    // debugFlg = 0;
    
   if (wx_string.indexOf("UP") !=-1 ) {presentConditions += "unknown ";}

   //in the absence of a weather code assume clear sky
   //var presentConditions = "clear and sunny";
   weatherVal="0cloud.png";

   //determine the strength of the weather type, light, medium, heavy or very heavy
   if (wx_string.indexOf("MI") !=-1 ) {
     wModifier += bf("_shallow");
   }
   if (wx_string.indexOf("PR") !=-1 ) {
     wModifier += bf("_partial");
   }
   if (wx_string.indexOf("DZ") !=-1 ) {
     wModifier += bf("_drizzle");
   }
   if (wx_string.indexOf("BC") !=-1 ) {
     wModifier += bf("_patches of");
   }
   if (wx_string.indexOf("DR") !=-1 ) {
     wModifier += bf("_drifting");
   }
   if (wx_string.indexOf("BL") !=-1 ) {
     wModifier += bf("_blowing");
   }
   if (wx_string.indexOf("SH") !=-1 ) {
     wModifier += bf("_showers");
   }
   if (wx_string.indexOf("VC") !=-1 ) {
     //presentConditions += "nearby ";
     wModifier += bf("_in_the_vicinity");
   }
   if (wx_string.indexOf("FZ") !=-1 ) {
     //presentConditions += "freezing ";
     wModifier += bf("_freezing");
   }
   if (wx_string.indexOf("TS") !=-1 ) {
     wModifier += bf("_thunderstorm");
   }
   if ( wModifier!="") {
        presentConditions = wModifier;
   }

   if (wx_string.indexOf("-") !=-1 ) {
     wSeverity = bf("_light") + " ";
   } else if (wx_string.indexOf("+") !=-1 ) {
      wSeverity = bf("_heavy") + " ";
   } else {
     wSeverity = "";  // moderate conditions have no descriptor
   }

   if (wx_string.indexOf("-") ==-1 || wx_string.indexOf("+") ==-1 ) {
        presentConditions += wSeverity;
        if (debugFlg === 1) { print("%getMetarDescription - wSeverity " +wSeverity)};
   }

   if (wx_string.indexOf("RA") !=-1 ) {presentConditions += bf("_rain") + " ";}    
   if (wx_string.indexOf("SN") !=-1 ) {presentConditions += bf("_snow") + " ";}
   if (wx_string.indexOf("SG") !=-1 ) {presentConditions += bf("_snow_grains") + " ";}
   if (wx_string.indexOf("IC") !=-1 ) {presentConditions += bf("_ice_crystals") + " ";}
   if (wx_string.indexOf("PE") !=-1 ) {presentConditions += bf("_ice_pellets") + " ";}
   if (wx_string.indexOf("GR") !=-1 ) {presentConditions += bf("_hail") + " ";}
   if (wx_string.indexOf("GS") !=-1 ) {presentConditions += bf("_small_hail") + " ";}
   if (wx_string.indexOf("UP") !=-1 ) {presentConditions += bf("_unknown") + " ";}
   if (wx_string.indexOf("BR") !=-1 ) {presentConditions += bf("_mist") + " ";}
   if (wx_string.indexOf("FG") !=-1 ) {presentConditions += bf("_fog") + " ";}
   if (wx_string.indexOf("FU") !=-1 ) {presentConditions += bf("_smoke") + " ";}
   if (wx_string.indexOf("VA") !=-1 ) {presentConditions += bf("_volcanic_ash") + " ";}
   if (wx_string.indexOf("DU") !=-1 ) {presentConditions += bf("_widespread_dust") + " ";}
   if (wx_string.indexOf("SA") !=-1 ) {presentConditions += bf("_sand") + " ";}
   if (wx_string.indexOf("HZ") !=-1 ) {presentConditions += bf("_haze") + " ";}
   if (wx_string.indexOf("PY") !=-1 ) {presentConditions += bf("_spray") + " ";}
   if (wx_string.indexOf("PO") !=-1 ) {presentConditions += bf("_dustdevils") + " ";}
   if (wx_string.indexOf("SQ") !=-1 ) {presentConditions += bf("_strong_winds") + " ";}
   if (wx_string.indexOf("FC") !=-1 ) {presentConditions += bf("_tornado") + " ";}
   if (wx_string.indexOf("SS") !=-1 ) {presentConditions += bf("_sandstorm_duststorm") + " ";}
   if (debugFlg === 1 && presentConditions != "") {print("%getMetarDescription - presentConditions " +presentConditions)};
   return presentConditions;
}
//========================
//End function
//========================


//=================================================================================
// function to convert degrees to a compass bearing
//=================================================================================
function degToCompass(windDirection) {
    var thisVal = 0; // force val to be a numeric variable, otherwise it adds the string "0.5" to val!  
    thisVal = Math.round((windDirection/22.5) + 0.5); // pARSEiNT ALWAYS ROUNDS DOWN!
    // print(thisVal);
    var arr=["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    compassDirection= arr[(thisVal % 16)];
    return  compassDirection;
}
//========================
//End function
//========================


//=================================================================================
// function to convert a wind speed to the Beaufort scale (extended)
//=================================================================================
function beaufortConversion(wind_speed_kt) {
 windIcon.src= "";
 windIcon.tooltip = "";
//   Beaufort Scales (Wind Speed)
 if (wind_speed_kt < 1) {
   force = 0; // Calm 	Sea like a mirror.
   windIcon.src= "";
 }
 if (wind_speed_kt >= 1 && wind_speed_kt <= 3 ) {
   force = 1;  // 1 1-3	Light air 	Ripples only.
 }
 if (wind_speed_kt >= 4 && wind_speed_kt <= 6 ) {
   force = 2; // 4-6	Light breeze 	Small wavelets (0.2 m). Crests have a glassy appearance.
 }
 if (wind_speed_kt >= 7 && wind_speed_kt <= 10) {
   force = 3; // 7-10  Gentle breeze 	Large wavelets (0.6 m), crests begin to break.
 }
 if (wind_speed_kt >=11 && wind_speed_kt <= 16) {
   force = 4; // 11-16  Moderate breeze 	Small waves (1 m), some whitecaps
   windIcon.src= "Resources/images/icons_metar/night/" + "windy01.png"
   windIcon.tooltip = "Moderate breeze " + "force " + force;
 }
 if (wind_speed_kt >=17 && wind_speed_kt <= 21) {
   force = 5; //  17-21 Fresh breeze
   windIcon.src= "Resources/images/icons_metar/night/" + "windy02.png"
   windIcon.tooltip = "Fresh breeze " + "force " + force;
 }
 if (wind_speed_kt >=22 && wind_speed_kt <= 27) {
   force = 6; // 22-27 Strong breeze
   windIcon.src= "Resources/images/icons_metar/night/" + "windy03.png"
   windIcon.tooltip = "Strong Wind " + "force " + force;
 }
 if (wind_speed_kt >=28 && wind_speed_kt <= 33) {
   force = 7; // 28-33 Near gale
   windIcon.src= "Resources/images/icons_metar/night/" + "windy04.png"
   windIcon.tooltip = "Near gale " + "force " + force;
 }
 if (wind_speed_kt >=34 && wind_speed_kt <= 40) {
   force = 8; // 34-40 Gale
   windIcon.tooltip = "Gale " + "force " + force;
   windIcon.src= "Resources/images/icons_metar/night/" + "windy05.png"
 }
 if (wind_speed_kt >=41 && wind_speed_kt <= 47) {
   force = 9; // 41-47 Strong gale
   windIcon.tooltip = "Strong gale " + "force " + force;
   windIcon.src= "Resources/images/icons_metar/night/" + "windy05.png"
 }
 if (wind_speed_kt >=48 && wind_speed_kt <= 55) {
   force = 10; // 48-55 Storm
   windIcon.tooltip = "Storm " + "force " + force;
   windIcon.src= "Resources/images/icons_metar/night/" + "windy05.png"
 }
 if (wind_speed_kt >=56 && wind_speed_kt <= 63) {
   force = 11; // 56-63 Violent storm
   windIcon.tooltip = "Violent storm " + "force " + force;
   windIcon.src= "Resources/images/icons_metar/night/" + "windy05.png"
 }
 if (wind_speed_kt >=64 && wind_speed_kt <= 79) {
   force = 12; // 64+ Hurricane
   windIcon.tooltip = "Hurricane " + "force " + force;
   windIcon.src= "Resources/images/icons_metar/night/" + "windy05.png"
 }
 if (wind_speed_kt >=80 && wind_speed_kt <= 88) {
   force = 13; // 80+ Typhoon
   windIcon.tooltip = "Typhoon " + "force " + force;
   windIcon.src= "Resources/images/icons_metar/night/" + "windy05.png"
 }
 if (wind_speed_kt >=89 && wind_speed_kt <= 98) {
   force = 14; // 80+ Typhoon
   windIcon.tooltip = "Typhoon " + "force " + force;
   windIcon.src= "Resources/images/icons_metar/night/" + "windy05.png"
 }
 if (wind_speed_kt >=99 && wind_speed_kt <=107) {
   force = 15; // 80+ Typhoon
   windIcon.tooltip = "Typhoon " + "force " + force;
   windIcon.src= "Resources/images/icons_metar/night/" + "windy05.png"
 }
 if (wind_speed_kt >=108 && wind_speed_kt <=117) {
   force = 16; // 80+ Severe Typhoon
   windIcon.tooltip = "Severe Typhoon " + "force " + force;
   windIcon.src= "Resources/images/icons_metar/night/" + "windy05.png"
 }
 if (wind_speed_kt >=118) {
   force = 17; // 80+ Severe Typhoon
   windIcon.tooltip = "Severe Typhoon " + "force " + force;
   windIcon.src= "Resources/images/icons_metar/night/" + "windy05.png"
 }
 windIcon.visible = true;
 windIcon.zorder = 50;

 //windIcon.tooltip = windIcon.tooltip + " " + clock_hand.tooltip;
 return force;
}
//========================
//End function
//========================


//================================================
// this function returns a translated string
//================================================
function bf(s) { 
    //print(useAlternative);
    if (useAlternative) {
        return ro[s];
    }
    s = widget.getLocalizedString(s);
    return uc ? s.toUpperCase() : s;
}
//========================
//End function
//========================


//=================================================================================
// function to convert a string to a date
//=================================================================================
function stringToDate(s)  {
  s = s.split(/[-: ]/);
  return new Date(s[0], s[1]-1, s[2], s[3], s[4], s[5]);
}
//========================
//End function
//========================

//====================================================================================
// this function provides a text version of when the data was last collected
//====================================================================================
function nice_format_interval(duration) {
    var hours = Math.floor(duration / 3600),
        minutes = Math.floor((duration - hours * 3600) / 60),
        res;
    if (hours > 72) {
        //print("%Update " + String(hours) + " hours and " + String(minutes) + " minutes ago");
        return bf('_No_recent_data_available') + '!';
    }
    if (hours > 0) {
        res = bf('_Updated');
        if (hours === 1) {
            res += ' ' + bf('_one_hour');
        } else {
            res += ' ' + String(hours) + ' ' + bf('_hours');
        }
        if (minutes === 1) {
            res += ' ' + bf('_and_one_minute');
        } else if (minutes > 1) {
            res += ' ' + bf('_and') + ' ' + String(minutes) + ' ' + bf('_minutes');
        }
        return res + ' ' + bf('_ago');
    }
    if (minutes > 0) {
        if (minutes === 1) {
            return bf('_Updated_one_minute_ago');
        }
        return bf('_Updated') + ' ' + String(minutes) + ' ' + bf('_minutes_ago');
    }
    if (duration === 1) {
        return bf('_Updated_one_second_ago');
    }
    return bf('_Updated') + ' ' + String(duration) + ' ' + bf('_seconds_ago');
}
//========================
//End function
//========================


//================================================
// this function sets the hover over tooltip
//================================================
function setHoverTooltip(wind_dir_degrees, wind_speed_kt, precip_in, difString,wx_string) {
    //precip_in = 0.2; for testing
	var force, tooltipString,temperatureVal;
    // debugFlg = 0;
       
    compassDirection=degToCompass(wind_dir_degrees);
    if (debugFlg === 1) { print("%setHoverTooltip compassDirection " + compassDirection)};
    if (debugFlg === 1) { print("%setHoverTooltip " + skyClarityString)};
    force = beaufortConversion(wind_speed_kt);

    tooltipString =  " "  + usableObsTime + " "  + "\n " + preferences.icao.value + " ";
	tooltipString += icaoLocation1 + ", " + icaoLocation2 + ", " + icaoLocation3+" "  + "\n " ;

	if (preferences.barometerScalePref.value === "millibars") {
		tooltipString += bf('_Pressure') + ": " + parseInt(pressureValue * 1.33322) + " mb\n " ;
	} else if (preferences.barometerScalePref.value === "hg") {
		tooltipString += bf('_Pressure') + ": " + parseInt(pressureValue / 25.399999704976) + " inHg\n " ;
	} else if (preferences.barometerScalePref.value === "hpa") {
		tooltipString += bf('_Pressure') + ": " + parseInt(pressureValue * 1.33322) + " hpa\n " ;
	} else if (preferences.barometerScalePref.value === "mmhg") {
		tooltipString += bf('_Pressure') + ": " + pressureValue + " mmHg\n " ;
	}	
						
    if (preferences.tempUnit.value === "fahrenheit") {
			temperatureVal = temperatureValue * 1.8 + 32;
			tooltipString += bf('_Temperature') + ": " + Math.round(temperatureVal).toFixed(2) + " F\n " 
		}
    if (preferences.tempUnit.value === "celsius") {
			tooltipString += bf('_Temperature') + ": " + Math.round(temperatureValue).toFixed(2) + " C\n " 
		}
    if (preferences.tempUnit.value === "kelvin") {
			tooltipString += bf('_Temperature') + ": " + Math.round(parseInt(temperatureValue + 273.15)).toFixed(2) + " K\n " 
		}
		tooltipString += bf('_Humidity') + ": " + humidityValue + " % "   + "\n " +  skyClarityString  + "\n " ;
    
    if (preferences.windUnit.value === "knots") {
			tooltipString += bf("_wind_speed_is") + " " + wind_speed_kt + " knots, ";
		} else {
			tooltipString += bf("_wind_speed_is") + " " + parseInt(wind_speed_kt*0.51444) + " m/sec, ";
		}
		
		tooltipString += bf("_strength_force") + " " + force + ", " + bf("_direction") + " " + compassDirection;

    if (precip_in != 0) {
       tooltipString +=  "\n " + bf("_precipitation_is") + " " + precip_in + " inches";
    }

    var wx_str = getMetarDescription(wx_string);    // get the interpreted wx string data
    if (wx_str != "" ) {
       tooltipString += " \n " + wx_str +" \n "  ;
		}
    weatherText.data = String(tooltipString);

	humidityBackground.Tooltip = tooltipString;

    // save the tooltip value so it can be used during the regular timed 60 second tooltip updates.
    preferences.lastTooltip.value = humidityBackground.Tooltip;
    humidityBackground.Tooltip += " \n" + difString;
    humidityBackground.Tooltip += " \n " + bf("_Double_tap_on_me_to_get_new_weather");
	thermometerBackground.Tooltip =  humidityBackground.Tooltip;
	anemometerBackground.Tooltip =  humidityBackground.Tooltip;
	weatherIconGaugeBackground.Tooltip =  humidityBackground.Tooltip;
	barometerBackground.Tooltip =  humidityBackground.Tooltip;
 }
//========================
//End function
//========================

//=================================================================================
// function to set the mainweather icon tooltip according to two sources
//=================================================================================
function  setIconTooltip(wx_string, sky_cover) {
     // debugFlg = 0;
    //firstly, try the wx_string
    weatherIcon.Tooltip = getMetarDescription(wx_string);
    if (weatherIcon.Tooltip === "" ) {
      // if no wx_string use the cloud cover or lack of it
      weatherIcon.Tooltip = get_cloud_cover(sky_cover);
    }
    weatherIcon.Tooltip = humidityBackground.Tooltip;

    if (debugFlg === 1) { print("%setIconTooltip - weatherIcon.Tooltip " +weatherIcon.Tooltip)};
}
//========================
//End function
//========================



//=====================================
//  sets the wind pointer direction
//=====================================
function set_the_pointer () {

        //barometerManual.tooltip = bf("_the_current_wind_direction_is") + " - " + wind_dir_degrees + " degrees or " + compassDirection;
        barometerManual.tooltip = "This pointer indicates the old pressure value at its last reading. If the current reading falls more than 1 millibar from this indicator then a storm is likely.";
        		   

}
//========================
//End function
//========================


//==================================================================================
// this function moves the manual pointer from the last position to the new
//==================================================================================
function setManual(val, animate) {
    var min = 600,
        max = 800,
        angle,
        lastVal,
        x;
    if (val) {
        lastVal = preferences.lastPres.value;
        preferences.lastPres.value = val;
        savePreferences();
    }

    if (val < min) {
        val = min;
    }
    if (val > max) {
        val = max;
    }
    var angle = ((((val -600)/2)  * 3) +30) -45; // the 45 takes into account the 45 degree inclination of the image
    if (preferences.actionSwitchPref.value === "smooth" ) {
        //angle = 1;
        //log ("angle2 " + angle2);
        if (lastVal < min) {
            lastVal = min;
        }
        if (lastVal > max) {
            lastVal = max;
        }
                
        x = new CustomAnimation(1, updateIt);
        x.duration = 600;
        x.start_angle = ((((lastVal -600)/2)  * 3) +30) -45; // ditto above
        x.end_angle = angle;
        animator.start(x);
        
    } else {
        barometerManual.rotation = angle;
    }
}
//========================
//End function
//========================

//================================================
// this function rotates the pointer
//================================================
function updateIt() {
    var now = animator.milliseconds,
        t = now - this.startTime,
        percent = t / this.duration,
        angle = this.start_angle + (this.end_angle - this.start_angle) * percent;
    	  barometerManual.rotation = angle;
    if (animator.milliseconds >= (this.startTime + this.duration)) {
        angle = this.end_angle;
        barometerManual.rotation = angle;
        return false; // we're done
    }
    return true; // keep going
}
//========================
//End function
//========================


//=================================================================================================
// Function to rotate the previous pressure recording pointer to new value
//=================================================================================================
barometerManual.onClick = function() {
//pressureValue
    setManual(pressureValue, preferences.actionSwitchPref.value);
};
//========================
//End function
//========================


//================================================
// this function makes the search window visible
//================================================
function searchWindowVisible() {
      //if (preferences.soundPref.value === "enabled") {play(clunk,false)}
      keyPressCount = 0;
      searchWindow.visible = true;
      txt_results.data = "";
      txt_search.data = "" ;
      txtSearching.data = " " ;
 }
//========================
//End function
//========================

//=================================================================================================
// Function to set the location
//=================================================================================================
//imgBtnSearch.onClick = function() {
       //testLocation();
//};
//========================
//End function
//========================


//=================================================================================================
// Search Location - function to handle a change of location
//=================================================================================================
imgCmbResults.onMouseDown = function() { // was onClick
    changeLoc();
};
//========================
//End function
//========================

//===============================================================================
// this function determines what to do on a knob click icao or location?
//===============================================================================
function knob2onClick() {
    txt_search.data = "";
    txt_results.data = "";
    if (preferences.soundPref.value === "enabled") {
        play(clunk, false);
    }
    if (preferences.metarpref.value === "location") {
        //txtSearchCity.data = bf("_Search_ICAO") + " :";
        //knob2.hOffset = 185;
    } else {
			preferences.metarpref.value = "location";
			enterICAO.visible = false;
			enterLocation.visible = true;
	    	locationLamp.src = "Resources/images/search/smallGreenLamp.png";
	    	icaoLamp.src = "Resources/images/search/smallRedLamp.png";
			//txtSearchCity.data = bf("_Search_city") + ":";
			//knob2.hOffset = 130;
    }
}
//========================
//End function
//========================


//=================================================================================================
// Search Location - function to OK the change in location
//=================================================================================================
btn_ok.onClick = function() {

    if (preferences.soundPref.value === "enabled") {
        play(sparks, true);
    }
    if (txt_results.data === "" )
    {
   		busyStart();
        	testLocation();
    } else {
   		busyStart();

        saveLoc(txt_search.data);
        preferences.lastPres.value = 0;
        btn_ok.visible = false;
        btn_pushed.visible = true;
        sleep(500);
        btn_ok.visible = true;
        btn_pushed.visible = false;
        sleep(1000);
        txtSearching.data = "";
			if (preferences.soundPref.value === "enabled") {
				play(shutdown, false);
			}
        searchWindow.visible = false;
    }
    
};
//========================
//End function
//========================


//=================================================================================================
// Search Location - function to close the search window
//=================================================================================================
btn_cancel.onClick = function() {
    if (preferences.soundPref.value === "enabled") {
    	play(shutdown, false);
    }
    searchWindow.visible = false;
    //fadeSearchWindow(); // starts the fade timer - no need to fade as a visibility toggle automatically causes a fade
    txt_results.data = "";
};
//========================
//End function
//========================

//=================================================================================================
// Search Location - function to get a new location
//=================================================================================================
icaoLamp.onclick = function() {
	txt_search.data = "";
	txt_results.data = "";
	 preferences.metarpref.value = "icao";
   if (preferences.soundPref.value === "enabled") {
   	play(click1,true);	
   }
	 enterICAO.visible = true;
	 enterLocation.visible = false;
	 icaoLamp.src = "Resources/images/search/smallGreenLamp.png";
	 locationLamp.src = "Resources/images/search/smallRedLamp.png";
};
//========================
//End function
//========================


//=================================================================================================
// Search Location - function to get a new location
//=================================================================================================
locationLamp.onClick = function() {
   txt_search.data = "";
   txt_results.data = "";
	preferences.metarpref.value = "location";
   if (preferences.soundPref.value === "enabled") {
   	play(click1,true);	
   }
	enterICAO.visible = false;
	enterLocation.visible = true;
	locationLamp.src = "Resources/images/search/smallGreenLamp.png";
	icaoLamp.src = "Resources/images/search/smallRedLamp.png";
};
//========================
//End function
//========================


//================================================================================================
// this function takes the input ICAO code or location and tests it against a list of known codes
// if it is valid it then initiates a new http request.
//================================================================================================
function testLocation() {
            var checkIcao = "";
            var checkCity = "";
            if (txt_search.data != "") {
            txtSearching.data = bf("_searching") + "...";

               if (debugFlg === 1) { print("%testLocation " + preferences.metarpref.value)};

               // test a code or city name
               if (preferences.metarpref.value === "icao") {
                   checkIcao = searchIcaoFile(txt_search.data);
               } else {
                   checkCity = searchCityFile(txt_search.data);
               }

               // now get the data from the metar server
					if (debugFlg === 1) { 
                print("%testLocation checkIcao "+ checkIcao);
                print("%testLocation preferences.icao.value "+ preferences.icao.value);
					}

               if (checkIcao != "city not found" || preferences.icao.value != "") {
                   print("%testLocation checkIcao "+ checkIcao);
                   icaoData = checkIcao;
                   getData(preferences.icao.value);
 
                   sleep(1000);
                   txtSearching.data = "";
                   if (searchWindow.visible === true) {
							if (preferences.soundPref.value === "enabled") {
								play(shutdown, false);
							}
			                      //fadeSearchWindow(); // starts the fade timer
                      searchWindow.visible = false;
                   }
               } else {
                   sleep(2000);
                   txtSearching.data = "Type a valid ICAO code (EGKK).";
               }
        } else {
            if (preferences.metarpref.value === "location") {
                   alert(bf("_Please_enter_the_name_of_your_desired_city_first") + "!");
            } else {
                   alert(bf("_Please_enter_the_name_of_your_desired_icao_first") + "!");
            }
        }
}
//========================
//End function
//========================


//=======================================================
// searches the icao data file for a specific code
//=======================================================
function searchIcaoFile(loc) {  // returns icaoData
    var icaoDataArray = filesystem.readFile( icaoDataFile, true ),
        i,
        def,
        fnd,
        map = {};
        lookFor = loc;
        var splitIcaoData = {};
        // debugFlg = 0;
        
        
        txtSearching.data = "Getting the ICAO code " + loc;
        sleep(1500);

        if (debugFlg === 1) { print ("searchIcaoFile - " + preferences.metarpref.value + " search started for " + lookFor)};

        for (i = 0; i < icaoDataArray.length; i += 1) {
            icaoDataArray[i] = icaoDataArray[i].toUpperCase();
            fnd = icaoDataArray[i].match(lookFor);
            if (fnd != null) {
                splitIcaoData = icaoDataArray[i].split(",");
                icaoLocation1 = (splitIcaoData[1].replace(/"/g, ""));//.toProperCase();   //
                //icaoLocation1 = icaoLocation1.toProperCase();
                if (debugFlg === 1) { print ("%searchIcaoFile - icaoLocation1 "  + " = " + icaoLocation1)};

                icaoLocation2 = (splitIcaoData[2].replace(/"/g, ""));//.toProperCase();   // city
                if (debugFlg === 1) { print ("%searchIcaoFile - icaoLocation2 "  + " = " + icaoLocation2)};

                icaoLocation3 = (splitIcaoData[3].replace(/"/g, ""));//.toProperCase();   // country
                if (debugFlg === 1) { print ("%searchIcaoFile - icaoLocation3 " + " = " + icaoLocation3)};
  
                icaoLocation4 = splitIcaoData[4].replace(/"/g, "");   // airport code LHR
                if (debugFlg === 1) { print ("%searchIcaoFile - icaoLocation4 "  + " = " + icaoLocation4)};
  
                icaoLocation5 = splitIcaoData[5].replace(/"/g, "");   // icao code

                if (icaoLocation5 === "\\N") {
                  icaoLocation5 = splitIcaoData[4].replace(/"/g, "");
                };   // use the IATA code as the ICAO code is missing}
                if (debugFlg === 1) { print ("%searchIcaoFile - icaoLocation5 " + " = " + icaoLocation5)};

                retStr = icaoDataArray[i];
                preferences.icao.value = icaoLocation5;
                if (debugFlg === 1) { print ("searchIcaoFile - found " + lookFor + " in " + retStr)};
                txtSearching.data = "Found ICAO code " + loc;

                sleep(1000);
                return (retStr);
            }
        }
        if (icaoLocation5 === "\\N") {
             var answer = alert("That city does not have a valid ICAO code assigned. \n It exists and has an IATA code, but that is of no use... \n Please select another location.");
        };

        if (fnd === null) {
            if (debugFlg === 1) { print ("searchIcaoFile - lookFor not found " + lookFor)};
            txtSearching.data = "Failed to find ICAO code " + lookFor;
            preferences.icao.value = "";
            loc = "";
            return ("city not found");
        }
}
//==================================
//End function
//==================================






//=======================================================
// searches the icao data file for a specific city match, if more than one found it will build an array of menu items to allow the user to select.
//=======================================================
function searchCityFile(loc) {  // returns icaoData
    var icaoDataArray = filesystem.readFile( "Resources/icao_codes.dat", true ),
        i,
        j=0,
        def,
        fnd,
        map = {},
        lookFor = loc,
        foundCityFlg=false;
        var resultItems = new Array();
        var vals = new Array();
        txtSearching.data = "Getting the city " + loc;
        
        // debugFlg = 0;
        
        sleep(1500);

        if (debugFlg === 1) { print ("searchCityFile "+preferences.metarpref.value + " search started for " + lookFor)};

        for (i = 0; i < icaoDataArray.length; i += 1) {
            icaoDataArray[i] = icaoDataArray[i].toUpperCase();
            fnd = icaoDataArray[i].match(lookFor);
            if (fnd != null) {
                foundCityFlg = true;
                var splitIcaoData = icaoDataArray[i].split(",");
                icaoLocation1 = splitIcaoData[1].replace(/"/g, "");   //
                if (debugFlg === 1) { print ("%searchCityFile - icaoLocation1 "  + " = " + icaoLocation1)};

                icaoLocation2 = splitIcaoData[2].replace(/"/g, "");   // city
                if (debugFlg === 1) { print ("%searchCityFile - icaoLocation2 "  + " = " + icaoLocation2)};

                icaoLocation3 = splitIcaoData[3].replace(/"/g, "");   // country
                if (debugFlg === 1) { print ("%searchCityFile - icaoLocation3 " + " = " + icaoLocation3)};

                icaoLocation4 = splitIcaoData[4].replace(/"/g, "");   // airport code LHR
                if (debugFlg === 1) { print ("%searchCityFile - icaoLocation4 "  + " = " + icaoLocation4)};

                icaoLocation5 = splitIcaoData[5].replace(/"/g, "");   // icao code

                if (debugFlg === 1) { print ("%searchCityFile - icaoLocation5 " + " = " + icaoLocation5)};

                preferences.icao.value = icaoLocation5;
                retStr = icaoDataArray[i];
                if (debugFlg === 1) { print ("searchCityFile - found " + icaoLocation5 + " associated with " + lookFor + " in " + retStr)};
                txtSearching.data = "Found City " + loc;

                // Create City Menu

                j+=1;  //increment this counter each time a city match is found
                if (debugFlg === 1) { print ("searchCityFile - building menu item " + j + " " + icaoLocation5 +  " " +icaoLocation1)};
                resultItems[j] = new MenuItem();
                resultItems[j].title = icaoLocation1 + ", " + icaoLocation2 + ", " + icaoLocation3 + ", " + icaoLocation5 ;
                // IMPORTANT : do NOT change the minimum supported widget version to 4.5 as it will stop the next line from working.
                // this feature allows the static icao value to be passed to the onselect function
                // rather than the new value of icaoLocation5 when the menu item is finally selected.
                resultItems[j].onSelect = "saveLoc('" + icaoLocation5 + "', \"" + icaoLocation1 + "\")";
                if (j === 0) {
                    saveLoc(icaoLocation5,icaoLocation1);
                }
            }
        }
        // if the city counter is greater than zero then show the popup menu we have built
        if (j > 0) {
                 popupMenu(resultItems, 25, 90);
        } 
        if (foundCityFlg === false) {
            if (debugFlg === 1) { print ("searchCityFile - City not found " + lookFor)};
            txtSearching.data = bf("_city_not_found") + "! " + lookFor;
            preferences.icao.value = "";
            loc = "";
            return ("city not found");
        }
}
//==================================
//End function
//==================================

//=========================================================
// this function loads the menu selected city location icao code into the icao prefs
//=========================================================
function saveLoc(icao,title) {
    if (debugFlg === 1) { print("%SaveLoc - icao " + icao)};
    if (debugFlg === 1) { print("%SaveLoc - title " + title)};
    txt_results.data = title;

    if (icao === "N") {
           var answer = alert("That city does not have a valid ICAO code assigned. \n It exists and has an IATA code, but that is of no use... \n Please select another location.");
           return;
    };

    if (icao) {
        preferences.icao.value = icao;
    }
    //DEAN show an image instead of text
    enterICAO.visible = true;
    enterLocation.visible = false;
    //txtSearchCity.data = bf("_Search_city") + ":";
    preferences.metarpref.value === "icao";
}
//========================
//End function
//========================


//================================================
// this function copies the text from the tooltip to the system clipboard
//================================================
function copyWeather() {
    system.clipboard = weatherText.data;
}
//========================
//End function
//========================


//======================================================================================
// Search Location - function to handle each keypress on the text search field
//======================================================================================
txt_search.onKeyPress = function() {
    // debugFlg = 0;
   
    // if the input is a location then handle it
    if (preferences.metarpref.value === "location") {

        if ((system.event.keyString === "Return") || (system.event.keyString === "Enter")) {
            txt_search.rejectKeyPress();
            var ee =  txt_search.data;
            txt_search.data = ee.replace(/\s/g,'');
            //txt_search.data = ee.trim();  //trim is not implemented
            if (txt_search.data != "") {   // no empty strings
                    if (debugFlg === 1) { print("%txt_search - calling testLocation")};
                    testLocation();
            }
        } else {
            var key = system.event.key;
            if ((key >= "a") && (key <= "z")) {
                txt_search.rejectKeyPress();
                txt_search.replaceSelection(key.toUpperCase());
            }
        }
    }
    // if the input is an icao then handle it
    if (preferences.metarpref.value === "icao") {
              if ((system.event.keyString === "Backspace") ) {
                     keyPressCount -= 1 ;
                     return;
               } else if ((system.event.keyString === "Return") || (system.event.keyString === "Enter")) {
                    //shorten the input to 4 characters if cut /pasted in with too many characters
                    var ff = txt_search.data;
                    if (ff.length > 4) {
                        var gg = txt_search.data;
                        txt_search.data = gg.substring(0,4);
                        var answer = alert("Valid ICAO codes are only four digits long. Use the top sliding switch to select a city search.");
                        if (debugFlg === 1) { print("%txt_search - txt_search.data "+ txt_search.data)};
                    };
                    var ee =  txt_search.data;
                    txt_search.data = ee.replace(/\s/g,'');
                    //txt_search.data = ee.trim();  //trim is not implemented
                    if (txt_search.data != "") {   // no empty strings
                            if (debugFlg === 1) { print("%txt_search - calling testLocation")};
                            testLocation();
                    }
               } else {
                      var key = system.event.key;
                      if ((key >= "a") && (key <= "z")) {
                          txt_search.rejectKeyPress();
                          txt_search.replaceSelection(key.toUpperCase());
                      }
                      keyPressCount += 1 ;
               }

               if (debugFlg === 1) { print("%txt_search - keyPressCount "+ keyPressCount)};
               if (keyPressCount > 4 ) {
                      //if the station id returned is null then assume the weather information is missing for an unknown reason.
                      txtSearching.data = "Use top switch for city.";
                      var answer = alert("Valid ICAO codes are only four digits long. Use the top sliding switch to select a city search.");
                      txt_search.focus();
               }
    }
};
//=====================
//End function
//=====================

//======================================================================================
// Search Location - function to handle a change of location
//======================================================================================
txt_results.onMouseDown = function() { // was onClick
    changeLoc();
};
//=====================
//End function
//=====================


//======================================================================================
// function to play a help file recorde by me
//======================================================================================
radioKnob1.onMouseDown = function() { 
    if (preferences.soundPref.value === "enabled") {
   	play(click1,false);	
   }
};
//=====================
//End function
//=====================

//======================================================================================
// function to open a web-page and obtain the new icao locations data file
//======================================================================================
radioKnob2.onMouseDown = function() { 
	getNewIcaoLocations();
}
//=====================
//End function
//=====================




//======================================================================================
// function to open a web-page and obtain the new icao locations data file
//======================================================================================
function getNewIcaoLocations() {
	var url = new URL();
	var webAddress;
	var airportData;
	var answer;
	
	txt_results.data = "Downloading icao_codes";

    if (preferences.soundPref.value === "enabled") {
   	play(click1,false);	
   }

	answer = alert("This button goes online and downloads/updates the airports data file. Do you wish to proceed?", "Start Download", "No Thanks");
	if (answer === 1) {
	   if (searchWindow.visible === false) {
			searchWindowVisible();
	   }
   	busyStart();

	   webAddress = "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat";
		airportData = url.fetch(webAddress);
		// write the icao_locations data file to a file in the user data folder
   	filesystem.writeFile( system.widgetDataFolder + "/icao_codes.dat",airportData);
  	   busyTimer.ticking = false;

	} else {
		txt_results.data = "";
		return;
	}
	txt_results.data = "Update completed";
	
}
//=====================
//End function
//=====================

//======================================================================================
// function to 
//======================================================================================
weatherIconGaugeManual.onMouseDown = function () {
      if (preferences.actionSwitchPref.value === "smooth" ) {
			//rotateObject(weatherIconGaugeManual, (((preferences.lastUpdated.value -600)/2)  * 3) -15);
		} else {
			//weatherIconGaugeManual.rotation = (((preferences.lastUpdated.value -600)/2)  * 3) -15;
		}	
}
//=====================
//End function
//=====================


//======================================================================================
// function to set the barometer text
//======================================================================================
//by default in mmHg
// * 1.33322 to mbars
// * 1.33322 to hPa
// * 25.399999704976 to inHg
function setBarometerText() {
    if (pressureValue === 0) {
    	return;
    }
	if (preferences.barometerScalePref.value === "millibars") {
		// "millibars";
		barometerText.data = pressureValue * 1.33322;
		barometerTextArea.data = barometerText.data;
		barometerHighText.data = preferences.lastPres.value * 1.33322;
	} else if (preferences.barometerScalePref.value === "hg") {
		// inches of mercury "hg";
		barometerText.data = pressureValue / 25.399999704976;
		barometerTextArea.data = pressureValue;
		barometerHighText.data = preferences.lastPres.value / 25.399999704976;		
	} else if (preferences.barometerScalePref.value === "hpa") {
		//same a smillibars in effect - "hpa";
		barometerText.data = pressureValue * 1.33322;
		barometerTextArea.data = barometerText.data;
		barometerHighText.data = preferences.lastPres.value * 1.33322;
	} else if (preferences.barometerScalePref.value === "mmhg") {
		//mmhg no conversion required = default scale of measurement as used in this widget
		barometerText.data = pressureValue;
		barometerTextArea.data = pressureValue;
		barometerHighText.data = preferences.lastPres.value;
	}	 	
}
//=====================
//End function
//=====================
//======================================================================================
// function to set the barometer text
//======================================================================================

function setThermometerText() {
    if (temperatureValue === 0) {
    	return;
    }

		if (preferences.tempUnit.value === "celsius") {
    	        thermometerText.data = temperatureValue;
				thermometerTextArea.data = temperatureValue;	
		}         
		if (preferences.tempUnit.value === "fahrenheit") {
				thermometerText.data = parseInt(temperatureValue * 9 / 5 + 32);
				thermometerTextArea.data = thermometerText.data;
		}	         
		if (preferences.tempUnit.value === "kelvin") {
				thermometerText.data = parseInt(temperatureValue + 273.15);
				thermometerTextArea.data = thermometerText.data;
		}	         
}
//=====================
//End function
//=====================

//======================================================================================
// function to set the anemometer text
//======================================================================================
function setAnemometerText() {
    if (wind_speed_kt === 0) {
    	return;
    }
		if (preferences.windUnit.value === "knots") {
				anemometerText.data = wind_speed_kt;
				anemometerTextArea.data = wind_speed_kt;
		} else {
				anemometerTextArea.data = parseInt(wind_speed_kt*0.51444);
				anemometerText.data = anemometerTextArea.data;		}		
}
//=====================
//End function
//=====================
