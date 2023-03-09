---
title: "Comparison of temperature from different sources"
authors:
  - bangyou-zheng
date: '2023-03-09'
slug: compare-temperature
tags:
  - R
  - climate
---

<script src="{{< blogdown/postref >}}index_files/htmlwidgets/htmlwidgets.js"></script>
<script src="{{< blogdown/postref >}}index_files/jquery/jquery.min.js"></script>
<link href="{{< blogdown/postref >}}index_files/leaflet/leaflet.css" rel="stylesheet" />
<script src="{{< blogdown/postref >}}index_files/leaflet/leaflet.js"></script>
<link href="{{< blogdown/postref >}}index_files/leafletfix/leafletfix.css" rel="stylesheet" />
<script src="{{< blogdown/postref >}}index_files/proj4/proj4.min.js"></script>
<script src="{{< blogdown/postref >}}index_files/Proj4Leaflet/proj4leaflet.js"></script>
<link href="{{< blogdown/postref >}}index_files/rstudio_leaflet/rstudio_leaflet.css" rel="stylesheet" />
<script src="{{< blogdown/postref >}}index_files/leaflet-binding/leaflet.js"></script>
<script src="{{< blogdown/postref >}}index_files/lfx-sleep/lfx-sleep-prod.js"></script>

## Data source

The weather records are sourced for 79 sites from

-   [SILO Patched Point Dataset](https://www.longpaddock.qld.gov.au/silo/point-data/) with label `ppd`
-   [SILO Data Drill](https://www.longpaddock.qld.gov.au/silo/gridded-data/) with label `drill`
-   [Australian Gridded Climate Data](http://www.bom.gov.au/climate/austmaps/about-agcd-maps.shtml) from BOM with label `agcd`
-   [NASA POWER](https://power.larc.nasa.gov/) with label `power`

The daily radiations (MJ/m^2) are downloaded from 1990-01-01 to 2022-12-31.

## Sites

There are 79 sites sourced from Lilley et al (2019) across Australian grain belt.

<div id="htmlwidget-1" style="width:100%;height:400px;" class="leaflet html-widget"></div>
<script type="application/json" data-for="htmlwidget-1">{"x":{"options":{"crs":{"crsClass":"L.CRS.EPSG3857","code":null,"proj4def":null,"projectedBounds":null,"options":{}},"sleep":true,"sleepTime":750,"wakeTime":750,"sleepNote":true,"hoverToWake":false,"wakeMessage":"Click or Hover to Wake","sleepOpacity":0.7},"calls":[{"method":"addTiles","args":["https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",null,null,{"minZoom":0,"maxZoom":18,"tileSize":256,"subdomains":"abc","errorTileUrl":"","tms":false,"noWrap":false,"zoomOffset":0,"zoomReverse":false,"opacity":1,"zIndex":1,"detectRetina":false,"attribution":"&copy; <a href=\"https://openstreetmap.org\">OpenStreetMap<\/a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA<\/a>"}]},{"method":"addMarkers","args":[[-30.3381,-36.7411,-35.9825,-32.881,-36.3,-31.2475,-33.8612,-33.572,-29.6883,-26.9269,-33.0682,-33.0664,-32.3292,-33.8018,-33.8451,-41.7256,-35.6724,-31.6494,-30.2761,-37.0476,-35.6408,-34.4417,-28.7953,-33.6031,-28.5211,-34.8085,-30.9537,-37.825,-33.6903,-33.4915,-36.6699,-32.4419,-38.243,-33.9551,-35.09,-31.6183,-33.83,-33.1006,-35.3288,-36.2964,-34.439,-31.4756,-34.2358,-29.1906,-34.748,-32.8361,-29.4898,-34.625,-28.5367,-28.9786,-36.8297,-30.3401,-31.6508,-28.9293,-31.5495,-33.9634,-35.0681,-33.1281,-33.5803,-36.1048,-32.9869,-36.4288,-31.2353,-33.466,-34.2785,-34.4061,-31.9861,-35.1583,-33.3075,-30.0372,-32.6722,-28.2061,-32.5635,-33.9382,-30.8408,-33.043,-34.6222,-34.1317,-34.3167],[115.5394,144.3274,142.9156,138.3515,140.7667,150.4632,138.0114,148.6619,115.8857,150.1419,147.2133,147.2283,117.8733,148.704,148.6534,147.0794,147.0361,117.2331,116.6714,148.9283,145.5761,116.9944,114.6975,121.7828,150.3256,149.7311,150.2494,142.0644,138.4041,145.5248,142.1733,118.8983,143.9887,137.6953,139.8972,117.7217,117.159,118.4625,140.5175,142.0243,140.5978,118.2789,142.0867,115.4414,137.5276,135.15,149.8471,117.6361,115.5142,148.9899,140.5328,149.7552,116.6586,150.3915,147.1961,118.4788,142.3125,148.2428,120.0458,146.5094,121.6239,145.3949,119.3564,138.5412,138.7729,147.5248,147.9489,147.4575,117.3403,148.1223,116.6706,152.1003,148.9503,147.1962,116.7267,135.4519,146.4326,135.7301,148.2967],null,null,null,{"interactive":true,"draggable":false,"keyboard":true,"title":"","alt":"","zIndexOffset":0,"opacity":1,"riseOnHover":false,"riseOffset":250},["BADGINGARRA RESEARCH STN","BENDIGO AIRPORT","BIRCHIP POST OFFICE","BOOLEROO CENTRE","BORDERTOWN","BREEZA (MAIN STREET)","BUTE","CANOWINDRA (CANOWINDRA STREET)","CARNAMAH","CONDAMINE","CONDOBOLIN AIRPORT AWS","CONDOBOLIN AG RESEARCH STN","CORRIGIN","COWRA AG RESEARCH STATION","COWRA AIRPORT COMPARISON","CRESSY RESEARCH STATION","CULCAIRN BOWLING CLUB","CUNDERDIN","DALWALLINU","DELEGATE STATION","FINLEY POST OFFICE","FRANKLAND VINEYARDS","GERALDTON AIRPORT COMPARISON","ESPERANCE DOWNS RESEARCH STN","GOONDIWINDI AIRPORT","GOULBURN AIRPORT AWS","GUNNEDAH AIRPORT AWS","HAMILTON RESEARCH STATION","BRINKWORTH","HILLSTON AIRPORT","HORSHAM AERODROME","HYDEN","WINCHELSEA (POST OFFICE)","KADINA","KAROONDA","KELLERBERRIN","KOJONUP","LAKE GRACE COMPARISON","LAMEROO","ANTWERP","LOXTON RESEARCH CENTRE","MERREDIN","MILDURA AIRPORT","MINGENEW","MINLATON AERO","MINNIPA AGRICULTURAL CENTRE","MOREE AERO","MOUNT BARKER","MULLEWA","MUNGINDI POST OFFICE","NARACOORTE (LOCHABER)","NARRABRI WEST POST OFFICE","NORTHAM","NORTH STAR POST OFFICE","NYNGAN AIRPORT","ONGERUP","OUYEN (POST OFFICE)","PARKES AIRPORT AWS","RAVENSTHORPE","RUTHERGLEN RESEARCH","SALMON GUMS RES.STN.","SHEPPARTON AIRPORT","SOUTHERN CROSS AIRFIELD","SPALDING (BUNDALEER RESERVOIR)","TARLEE","TEMORA RESEARCH STATION","TRANGIE RESEARCH STATION AWS","WAGGA WAGGA AMO","WAGIN","WALGETT AIRPORT AWS","WANDERING","WARWICK","WELLINGTON (D&J RURAL)","WEST WYALONG AIRPORT AWS","WONGAN HILLS RES.STATION","WUDINNA AERO","YANCO AGRICULTURAL INSTITUTE","YEELANNA","YOUNG POST OFFICE"],null,null,null,null,{"interactive":false,"permanent":false,"direction":"auto","opacity":1,"offset":[0,0],"textsize":"10px","textOnly":false,"className":"","sticky":true},null]}],"limits":{"lat":[-41.7256,-26.9269],"lng":[114.6975,152.1003]}},"evals":[],"jsHooks":[]}</script>

## Yearly average minimum temperature

I calculated the yearly average minimum temperature and then anomaly of average minimum temperature from 1990 to 2022.

<div class="figure">

<img src="{{< blogdown/postref >}}index_files/figure-html/mint-abnormal-year-1.png" alt="Anomaly of average minimum temperature (C)" width="100%" height="600" />
<p class="caption">
Figure 1: Anomaly of average minimum temperature (C)
</p>

</div>

<div class="figure">

<img src="{{< blogdown/postref >}}index_files/figure-html/fig-yearly-mint-compare-1.png" alt="Comparison of yearly average minimum temperature between AGDC and other sources" width="100%" height="200" />
<p class="caption">
Figure 2: Comparison of yearly average minimum temperature between AGDC and other sources
</p>

</div>

## Yearly average maximum temperature

I calculated the yearly average maximum temperature and then anomaly of average maximum temperature from 1990 to 2022.

<div class="figure">

<img src="{{< blogdown/postref >}}index_files/figure-html/maxt-abnormal-year-1.png" alt="Anomaly of average maximum temperature (C)" width="100%" height="600" />
<p class="caption">
Figure 3: Anomaly of average maximum temperature (C)
</p>

</div>

<div class="figure">

<img src="{{< blogdown/postref >}}index_files/figure-html/fig-yearly-maxt-compare-1.png" alt="Comparison of yearly average maximum temperature between AGDC and other sources" width="100%" height="200" />
<p class="caption">
Figure 4: Comparison of yearly average maximum temperature between AGDC and other sources
</p>

</div>

## Summary

Comparing with radiation, temperatures don’t have big difference among data source.

## Reference

Lilley JM, Flohr BM, Whish JPM, Farre I, Kirkegaard JA. 2019. Defining optimal sowing and flowering periods for canola in Australia. Field Crops Research 235, 118–128.
