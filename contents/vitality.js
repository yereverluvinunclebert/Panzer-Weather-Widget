/*properties
    appendChild, createDocument, createElement, dockOpen, hOffset, opacity,
    setAttribute, setDockItem, src, vOffset 
*/

function buildVitality(bg, icon, city, temp, degree) {
	var d, v, dock_bg, dock_icon, u, t, w;

	if (!widget.dockOpen) { return; } 

	d = XMLDOM.createDocument();
	v = d.createElement("dock-item");
	v.setAttribute("version", "1.0");
	d.appendChild(v);

	dock_bg = d.createElement("image");
	dock_bg.setAttribute("src", bg);
	dock_bg.setAttribute("hOffset", 0);
	dock_bg.setAttribute("vOffset", 0);
	v.appendChild(dock_bg);

	dock_icon = d.createElement("image");
	dock_icon.setAttribute("src", icon.src);
	dock_icon.setAttribute("hOffset", 2);
	dock_icon.setAttribute("vOffset", 8);
	dock_icon.setAttribute("width", 48);
	dock_icon.setAttribute("height", 48);
	dock_icon.setAttribute("style", "opacity: " + icon.opacity / 255);
	v.appendChild(dock_icon);

	t = d.createElement("text");
	t.setAttribute("hOffset", "67");
	t.setAttribute("vOffset", "36");
	t.setAttribute("hAlign", "right");
	t.setAttribute("style", "text-align: right;font-family: 'Futura', 'Arial Narrow'; font-stretch: condensed; font-size: 21px; color: #ffffff; -kon-shadow: 0px -1px rgba( 0, 0, 0, 0.7 )");
	t.setAttribute("data",  temp);
	v.appendChild(t);

	w = d.createElement("text");
	w.setAttribute("hOffset", "72");
	w.setAttribute("vOffset", "37");
	w.setAttribute("hAlign", "right");
	w.setAttribute("style", "text-align: right;font-family: 'Futura', 'Arial Narrow'; font-stretch: condensed; font-size: 14px; color: #ffffff; -kon-shadow: 0px -1px rgba( 0, 0, 0, 0.7 )");
	w.setAttribute("data",  degree);
	v.appendChild(w);

	u = d.createElement("text");
	u.setAttribute("wrap", "true");
	u.setAttribute("width", "75");
	u.setAttribute("hOffset", "70");
	u.setAttribute("vOffset", "55");
	u.setAttribute("hAlign", "right");
	u.setAttribute("vAlign", "center");
	u.setAttribute("style", "text-align: right;font-family: 'Futura', 'Arial Narrow'; font-stretch: condensed; font-size: 10px; color: #ffffff; -kon-shadow: 0px -1px rgba( 0, 0, 0, 0.7 )");
	u.setAttribute("data",  city);
	v.appendChild(u);

	widget.setDockItem(d, "fade");
}
