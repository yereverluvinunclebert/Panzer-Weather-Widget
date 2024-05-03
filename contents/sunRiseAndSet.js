          //   SunriseSunset Class (2013-04-21)
//
// OVERVIEW
//
//   Implementation of http://williams.best.vwh.net/sunrise_sunset_algorithm.htm
//
// LICENSE
//
//   Copyright 2011-2013 Preston Hunt <me@prestonhunt.com>
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
//
// DESCRIPTION
//
//   Provides sunrise and sunset times for specified date and position.
//   All dates are UTC.  Year is 4-digit.  Month is 1-12.  Day is 1-31.
//   Longitude is positive for east, negative for west. Latitude is
//   positive for north, negative for south.
//
// SAMPLE USAGE
//
//   var tokyo = new SunriseSunset( 2011, 1, 19, 35+40/60, 139+45/60); 
//   tokyo.sunriseUtcHours()      --> 21.8199 = 21:49 GMT
//   tokyo.sunsetUtcHours()       --> 7.9070  = 07:54 GMT
//   tokyo.sunriseLocalHours(9)   --> 6.8199  = 06:49 at GMT+9
//   tokyo.sunsetLocalHours(9)    --> 16.9070 = 16:54 at GMT+9
//   tokyo.isDaylight(1.5)        --> true
//
//   var losangeles = new SunriseSunset( 2011, 1, 19, 34.05, -118.233333333 );
//   etc.

var SunriseSunset = function( utcFullYear, utcMonth, utcDay, latitude, longitude ) {
    this.zenith = 90 + 50/60; //   offical      = 90 degrees 50'
                              //   civil        = 96 degrees
                              //   nautical     = 102 degrees
                              //   astronomical = 108 degrees

// The value returned by getYear is the current year minus 1900
//  getMonth() returns the month (0 to 11) of a date

    this.utcFullYear = utcFullYear;
    this.utcMonth = utcMonth;
    this.utcDay = utcDay;
    this.latitude = latitude;
    this.longitude = longitude;
    
//            print ("%SRS-O latitude " + latitude);
//            print ("%SRS-O longitude " + longitude);
    

    this.rising = true; // set to true for sunrise, false for sunset
    this.lngHour = this.longitude / 15;
};

SunriseSunset.prototype = {
    sin: function( deg ) { return Math.sin( deg * Math.PI / 180 ); },
    cos: function( deg ) { return Math.cos( deg * Math.PI / 180 ); },
    tan: function( deg ) { return Math.tan( deg * Math.PI / 180 ); },
    asin: function( x ) { return (180/Math.PI) * Math.asin(x); },
    atan: function( x ) { return (180/Math.PI) * Math.atan(x); },
    acos: function( x ) { return (180/Math.PI) * Math.acos(x); },
//    acos: function( x) { 
//        var x = (180/Math.PI) * Math.acos(x);
//        return x;
//    },
    
    getDOY: function() {
        var month = this.utcMonth,
            year = this.utcFullYear,
            day = this.utcDay;
        
        // print ("%SRSSRS-O year " + year);
        // print ("%SRSSRS-O month " + month);
        // print ("%SRSSRS-O day " + day);

        var N1 = Math.floor( 275 * month / 9 );
        // print ("%SRSSRS-O N1 " + N1);
        
        var N2 = Math.floor( (month + 9) / 12 );
        // print ("%SRSSRS-O N2 " + N2);
        
        var N3 = (1 + Math.floor((year - 4 * Math.floor(year / 4 ) + 2) / 3));
        // print ("%SRSSRS-O N3 " + N3);
        
        var N = N1 - (N2 * N3) + day - 30;
        // print ("%SRSSRS-O getDOY " + N);
        return N;
    },

    approximateTime: function() {
        var doy = this.getDOY();
        if ( this.rising ) {
            var a = doy + ((6 - this.lngHour) / 24);
            // print ("%SRSSRS-O approximateTime " + a);
            return a;
        } else {
            var a = doy + ((18 - this.lngHour) / 24);
            // print ("%SRSSRS-O approximateTime " + a);
            return a;
        }
    },

    meanAnomaly: function() {
        var t = this.approximateTime();
        var a = (0.9856 * t) - 3.289;
        // print ("%SRSSRS-O meanAnomaly " + a);
        return a;
  
    },

    trueLongitude: function() {
        var M = this.meanAnomaly();
        var L = M + (1.916 * this.sin(M)) + (0.020 * this.sin(2 * M)) + 282.634;
        var a = L % 360
        // print ("%SRSSRS-O trueLongitude " + a);
        return a;
    },

    rightAscension: function() {
        var L = this.trueLongitude();
        var RA = this.atan(0.91764 * this.tan(L));
        RA %= 360;

        var Lquadrant  = (Math.floor( L/90)) * 90;
        var RAquadrant = (Math.floor(RA/90)) * 90;
        RA = RA + (Lquadrant - RAquadrant);
        RA /= 15;
        // print ("%SRSSRS-O rightAscension " + RA);
        return RA;
    },

    sinDeclination: function() {
        var L = this.trueLongitude(),
        sinDeclination = 0.39782 * this.sin(L);
        // print ("%SRSSRS-O sinDeclination " + sinDeclination);
        return sinDeclination;
    },

    cosDeclination: function() {
        var a = this.cos(this.asin(this.sinDeclination()))
        // print ("%SRSSRS-O cosDeclination " + a);
        return a;
    },

    localMeanTime: function() {
        if (this.rising== true && debugFlg === 1) { print ("%SRS-I localmeantime2 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< STARTS ");}
        
        //debugFlg = 1;
        
        var a; 
        a = this.cos(this.zenith);
        
        var b;
        b = this.sinDeclination() * this.sin(this.latitude);
        
        var c;
        c = this.cosDeclination() * this.cos(this.latitude);
        
        var cosH = (a - b) / c;
                    

    if (this.rising== true && debugFlg === 1) {print ("%SRS-O localMeanTime cosH " + cosH)};


    // the above was changed for comparison whilst debugging the VB6 version


        if (this.rising== true && debugFlg === 1) {
            print (" **** %SRS-O localMeanTime cosH " + cosH);
        }
        
        if (cosH >  1) {
            if (this.rising== true && debugFlg === 1 && debugFlg === 1)  {print ("%SRS-O localMeanTime " + "the sun never rises on this location (on the specified date)");}
            return "the sun never rises on this location (on the specified date)";
        } else if (cosH < -1) {
            if (this.rising== true && debugFlg === 1)  {print ("%SRS-O localMeanTime " + "the sun never sets on this location (on the specified date)");}
            return "the sun never sets on this location (on the specified date)";
        } else {
            if (this.rising== true && debugFlg === 1)  {print ("%SRS-O localMeanTime this.acos(cosH) " + this.acos(cosH))};
        
            var H = this.rising ? 360 - this.acos(cosH) : this.acos(cosH);
            
            if (this.rising== true && debugFlg === 1)  {print (" **** %SRS-O localMeanTime rising = " +  this.rising );}
            
//            if (this.rising ) {
//                var H = 360 - this.acos(cosH); 
//            } else {
//                var H = this.acos(cosH);
//            }
            if (this.rising== true && debugFlg === 1)  {print (" **** %SRS-O localMeanTime H " + H);}

            H /= 15;
            if (this.rising== true && debugFlg === 1)  {print (" **** %SRS-O localMeanTime H /= 15 " + H);}
            var RA = this.rightAscension();
            if (this.rising== true && debugFlg === 1)  {print (" **** %SRS-O localMeanTime RA " + RA);}
            var t = this.approximateTime();
            if (this.rising== true && debugFlg === 1)  {print (" **** %SRS-O localMeanTime t " + t);}
            var T = H + RA - (0.06571 * t) - 6.622;
            if (this.rising== true && debugFlg === 1)  {print (" **** %SRS-O localMeanTime T = " + T);}
            if (this.rising== true && debugFlg === 1)  {print ("%SRS-I localmeantime2 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ENDS ");}

            // debugFlg = 0;

            return T;
        }
    },

    hoursRange: function( h ) {
        var a = (h+24) % 24;
    
        print ("%SRS-O hoursRange " + a);
        return a;
    },

    UTCTime: function() {
        //debugFlg = 1;
        
        var T = this.localMeanTime();
        if (this.rising== true && debugFlg === 1)  {print (" XXXX %SRS-O UTCTime T " + T);}
        
        var UT = T - this.lngHour;
        if (this.rising== true && debugFlg === 1)  {print (" XXXX %SRS-O UTCTime UT " + UT);}
        
        var a = this.hoursRange( UT );
        if (this.rising== true && debugFlg === 1)  {print (" XXXX %SRS-O UTCTime a " + a);}

        print ("%SRS-O UTCTime " + a);
 
        return a;
        //if ( UT < 0 ) UT += 24;
        //return UT % 24;
    },

    sunriseUtcHours: function() {
        this.rising = true;
        var a = this.UTCTime();
        // print ("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Obtaining sunriseUtcHours " + a);
        // print ("%SRS-O sunriseUtcHours " + a);
        return a;
    },

    sunsetUtcHours: function() {
        this.rising = false;
        var a = this.UTCTime();
        
        // print ("%SRS-O sunsetUtcHours " + a);
        return a;
    },

//    sunriseLocalHours: function(gmt) {
//        var a = this.hoursRange( gmt + this.sunriseUtcHours() );
//    
//        print ("%SRS-O sunriseLocalHours " + this.hoursRange( gmt + this.sunriseUtcHours() ));
//        return a;
//    },
//
//    sunsetLocalHours: function(gmt) {
//        var a = this.hoursRange( gmt + this.sunsetUtcHours() )
//        print ("%SRS-O sunsetLocalHours " + a);
//        return a;
//    },

    // utcCurrentHours is the time that you would like to test for daylight, in hours, at UTC
    // For example, to test if it's daylight in Tokyo (GMT+9) at 10:30am, pass in
    // utcCurrentHours=1.5, which corresponds to 1:30am UTC.
    isDaylight: function( utcCurrentHours ) {
        //print (" utcCurrentHours " + utcCurrentHours);
        var sunriseHours = this.sunriseUtcHours();
        
        var sunsetHours = this.sunsetUtcHours();
        
        //debugFlg = 1;
        
        if (debugFlg === 1) {print ("  sunriseHours " + sunriseHours)};
        if (debugFlg === 1) {print ("  sunsetHours " + sunsetHours)};
            
        if ( sunsetHours < sunriseHours ) {
            // Either the sunrise or sunset time is for tomorrow
            if ( utcCurrentHours > sunriseHours ) {
                if (debugFlg === 1) {print ("%SRS-O isDaylight true")};
                return true;
            } else if ( utcCurrentHours < sunsetHours ) {
                if (debugFlg === 1) {print ("%SRS-O isDaylight true")};
                return true;
            } else {
                if (debugFlg === 1) {print ("%SRS-O isDaylight false")};
                return false;
            }
        }

        if ( utcCurrentHours >= sunriseHours ) {
            if (debugFlg === 1) {print ("%SRS-O isDaylight " + utcCurrentHours < sunsetHours)};
            return utcCurrentHours < sunsetHours;
        } 
        if (debugFlg === 1) {print ("%SRS-O isDaylight false")};
        
        // debugFlg = 0;
        
        return false;
    }
};
