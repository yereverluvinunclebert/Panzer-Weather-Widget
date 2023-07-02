/*
	Steampunk Clock Object - version 1.1
	6 September, 2012
	Copyright 2012 Dean Beedell and Harry Whitfield
	mailto:g6auc@arrl.net
*/

/*properties
    appendChild, base, centreBoss, clock, clockReflection, dayOfWeek,
    displayTime, floor, frame, getDay, getHours, getMinutes, getSeconds, hOffset,
    hRegistrationPoint, height, hourHand, minuteHand, opacity, prototype,
    reScale, rotation, round, secondHand, src, toLowerCase, vOffset,
    vRegistrationPoint, width, zOrder

*/

function SPclock(parent, hOffset, vOffset, zOrder, scale) {
	var  newImage = function (parent, hOffset, vOffset, width, height, src, zOrder, opacity, hRegP, vRegP) {
	var o = new Image();

	o.src = src;
    	o.width  = Math.round(scale * width);
    	o.height = Math.round(scale * height);
	o.zOrder = zOrder;
    	o.opacity = opacity || 255;             // opacity is an optional parameter

    	hRegP = hRegP || 0;                     // hRegP and vRegP are optional parameters
    	vRegP = vRegP || 0;

    	hOffset += hRegP;
    	vOffset += vRegP;

    	o.hOffset = Math.round(scale * hOffset);
    	o.vOffset = Math.round(scale * vOffset);

    	o.hRegistrationPoint =  Math.round(scale * hRegP);
    	o.vRegistrationPoint =  Math.round(scale * vRegP);

        o.tooltip = "Time of Weather Report";

		parent.appendChild(o);
		return o;
	},
		frame = new Frame(),
		base = "Resources/SPclock/",

    	dayOfWeek = newImage(frame, 55, 145, 64, 37, base + "sunday.png", zOrder),
    	clock = newImage(frame, 0, 0, 200, 232, base + "clock.png", zOrder + 1),
    	clockShadow = newImage(frame, 0, 0, 182, 232, base + "clockShadow.png", zOrder + 1),
    	hourHand = newImage(frame, 74, 79, 27, 55, base + "hourHand.png", zOrder + 2, 255, 12, 54),
    	minuteHand = newImage(frame, 78, 63, 20, 71, base + "minuteHand.png", zOrder + 3, 255, 8, 70),
    	secondHand = newImage(frame, 86, 81, 4, 21, base + "secondHand.png", zOrder + 4, 255, 2, 21),
    	centreBoss = newImage(frame, 77, 124, 25, 26, base + "centreBoss.png", zOrder + 5),
    	clockReflection = newImage(frame, 27, 71, 122, 74, base + "clockReflection.png", zOrder + 6, 89);

	this.base = base;
	this.dayOfWeek = dayOfWeek;
	this.clock = clock;
	this.hourHand = hourHand;
	this.minuteHand = minuteHand;
	this.secondHand = secondHand;
	this.centreBoss = centreBoss;
	this.clockReflection = clockReflection;



	frame.hOffset = hOffset;
	frame.vOffset = vOffset;
	frame.width   = 240 * scale;
	frame.height  = 232 * scale;
	frame.zOrder  = zOrder;
	parent.appendChild(frame);
	this.frame = frame;
}

SPclock.prototype.reScale = function (scale) {
	var  scaleImage = function (o, hOffset, vOffset, width, height, hRegP, vRegP) {
    	o.width  = Math.round(scale * width);
    	o.height = Math.round(scale * height);

    	hRegP = hRegP || 0;                     // hRegP and vRegP are optional parameters
    	vRegP = vRegP || 0;

    	hOffset += hRegP;
    	vOffset += vRegP;

    	o.hOffset = Math.round(scale * hOffset);
    	o.vOffset = Math.round(scale * vOffset);

    	o.hRegistrationPoint =  Math.round(scale * hRegP);
    	o.vRegistrationPoint =  Math.round(scale * vRegP);
	};

    scaleImage(this.dayOfWeek, 55, 145, 64, 37);
    scaleImage(this.clock, 0, 0, 200, 232);
    scaleImage(this.hourHand, 74, 79, 27, 55, 12, 54);
    scaleImage(this.minuteHand, 78, 63, 20, 71, 8, 70);
    scaleImage(this.secondHand, 86, 81, 4, 21, 2, 21);
    scaleImage(this.centreBoss, 77, 124, 25, 26);
    scaleImage(this.clockReflection, 27, 71, 122, 74);

    //this.frame.width   = 102 * scale;
    //	this.frame.height  = 232 * scale;

};

SPclock.prototype.displayTime = function (d) {
	function weekDayOf(d) {
    	var dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    	return dow[d.getDay()];
	}

    var hours = d.getHours() % 12,
        mins  = d.getMinutes(),
        secs  = d.getSeconds(),
        dow   = weekDayOf(d).toLowerCase();

    this.hourHand.rotation   = Math.floor(30 * hours + mins / 2);
    this.minuteHand.rotation = Math.floor(6 * mins + secs / 10);
    this.secondHand.rotation = 6 * secs;

    this.dayOfWeek.src = this.base + dow + ".png";
};


