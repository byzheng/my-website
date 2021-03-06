---
title: Climate Data
authors: 
 - bangyou-zheng
date: '2018-09-28'
slug: climate-data
categories:
  - climate
toc: true
tags:
  - climate
  - data
  - weather
---


In recent years, plot specific crop models have been adapted to national and regional scales to 
aid policy makers with agricultural decisions concerning climate change and the resulting effects on food security and future water demands. Inputs for the crop modeling process can be separated into three major categories: climatic, soil, and management parameters.


## Temperature

Historical climate data that is geospatially explicit is a necessity for any crop modeling process, 
especially on a regional scale. A few publically available sources include weather station data, interpolated grids based 
on station data, and satellite derived data.

### SILO
Queensland Government database containing point and gridded daily climate data for Australia from 1890 till present designed for crop and pasture modelling . The improved blended data method was developed for preparation and generation of solar radiation gridded datasets for SILO.
### NCDC
One of the most well known sources of regional weather station data comes from National 
Climatic Data Center (NCDC) sector of the National Oceanic and Atmospheric Administration (NOAA).  
Daily observations of temperature, precipitation, winds, pressure, snow, and others can be found for 
over 15,000 stations worldwide, including over 2,000 stations in the United States from the Global 
Surface Summary of the Day (GSOD).  The data covers a temporal range that begins in 1929 to near 
present time, although the most complete records begin in 1973.  While this dataset represents one of 
the most comprehensive, it suffers from data gaps in localities of low to no representation.  Data access 
can found at the following link (http://www.climate.gov/global-summary-day-gsod).

An alternative to the Global Summary of the Day weather station database is the Global Historical Climate Network Data (GHCN) version 2. The GHCN provides historical temperature, precipitation, and pressure data for thousands of land stations on a monthly basis.  Precipitation is represented over 20590 stations, mean temperature over 7280 stations, and minimum and maximum temperature over 4966 stations.   This data also suffers large data gaps favoring the Northern Hemisphere.  
http://www.ncdc.noaa.gov/ghcnm/v2.php 

### FAOCLIM 2.0
Other sources of weather station data include the FAOCLIM 2.0 global climate database.  
FAOCLIM 2.0 contains monthly data for weather stations across the world.  This station database 
contains a number of variables including a monthly total of evapotranspiration, precipitation, and 
sunshine duration, and monthly mean values for maximum and minimum temperature, vapor pressure, 
and wind speed.   FAOCLIM 2.0 also contains both long-term averages (1961-1990) and time series for 
precipitation and temperature. 
http://www.fao.org/nr/climpag/pub/EN1102_en.asp 

Weather station data can be a valuable in the crop modeling process.  Often, local weather 
station data is obtained for a particular farm and assumed to be representative of the weather 
conditions occurring on site.  Quality weather station data is invaluable for farm based studies

### WorldClim
!WorldClim has been developed at an even high resolution for the entire globe, excluding Antarctica.  !WorldClim contains global estimates of monthly mean, maximum, and minimum temperature and precipitation at a 1-km resolution between the years 1950-2000. 

!WorldClim interpolated weather station to produce monthly grids of climate variables. Weather station data came from a variety of different weather station databases including GHCN, WMO climatological normals, FAOCLIM 2.0, International Center for Tropical Agriculture (CIAT), and other regional databases.  Extensive quality control measures were taken to insure no duplicate records were present after combining the various databases, giving precedence to the GHCN database. After the quality control check, the database consisted of precipitation records from 47554 locations, mean temperature from 24542 locations, and minimum and maximum temperatures from 14835 locations.

Once the weather stations were checked, the ANUSPLIN software package version 4.3 was used to interpolate global climate surfaces from the weather stations.  This software implements thin-plate smoothing spline procedure, using every station as a data point.  The authors fitted a second-order spline using latitude, longitude, and elevation as independent variables, which produced the lowest overall cross –validation errors. Considering the ANUSPLIN program creates a continuous surface projection, the LAPGRD program was to create a global grid. Hence, the end resolution of the global grid merely depends on the input grid; the higher the resolution of the input grid, the better it represents the modeled climate data.

### Climate Research Unit (CRU)

The CRU database contains two different types, one at a course resolution (above 2°) and one at 
a fine resolution (0.5°).   There are two datasets that make up the coarse resolution data. 
 One set is the HadCRUT3 for land surface temperature.   This set represents over 4349 weather stations and contains land air temperature anomalies on a 5° X 5° grid dating back to 1850  This dataset contains many improvements to older versions (HadCRUT and HadCRUT2), including more station data to improve 
global coverage, removal of duplicate stations, and improving station normals and standard deviations.  Precipitation data is contained in the other and can be found at a 2.5° X 3.75° resolution. This set extends from 1900 to 1998. However, while the gridded precipitation data is at a higher resolution comparatively, spatial coverage is spotty; leaving major gaps in northern North America, Central Asia, and Africa.  CRU however holds a high resolution dataset that is of interest. 

The CRU TS 3.0 dataset contains monthly averages of six climate elements including precipitation, mean, maximum, and minimum temperature, and other for crop modeling.  This dataset 
represents an update to the previous versions (CRU TS 1.0, CRU TS 2.0, and CRU TS 2.1) and contains the 
highest temporal and parameter coverage. Weather station records were obtained from a variety of 
previously compiled sources and checked for inhomogeneities using an approach similar to the GHCN 
automatic method of homogenization. 

While this dataset is at a high resolution and a global spatial coverage, the data is lacking 
temporal resolution necessary for crop modeling.  In order to use this CRU TS 3.0 data, a weather 
generator must be employed to create a daily time series of climate observations.  Candidate generators 
include dGen-CRU, !Weatherman, and WGEN. 

###  NASA POWER (Prediction of Worldwide Energy Resource) Agroclimatology Data

One source of historical meteorological data is the NASA Agroclimatology Archive, one 
component of NASA’s POWER (Prediction of Worldwide Energy Resource) project.  POWER was created 
to allow access to data derived from NASA’s Surface Meteorological and Solar Energy (SSE) project for 
those interested in the design of renewable energy systems. The Agroclimatology archive was 
developed with agricultural Decision Supports Systems (DSS) in mind and provides easy download of 
historical data for specific site locations. 

### AgMERRA and AgCFSR

The AgMERRA and AgCFSR climate forcing datasets were created as an element of the Agricultural Model Intercomparison and Improvement Project (AgMIP) to provide consistent, daily time series over the 1980-2010 period with global coverage of climate variables required for agricultural models. These datasets were designed to be useful for AgMIP's coordinated, protocol-based studies of agricultural impacts ranging from biophysical process studies to global agricultural economic models. These datasets are provided to promote consistency and transparency in climate data and to facilitate more harmonized comparisons across regions and between models, particularly in instances where there exist strong market linkages between regions. The 1980-2010 time period is of particular importance for agricultural modeling efforts due to the necessity to calibrate models for improved intercomparison as well as for acting as a baseline upon which future climate scenarios can be statistically and dynamically constructed [[ZotCite(IQZRFHTW(Ruaneetal.2015))]].

The datasets are stored at 0.25°×0.25° horizontal resolution (~25km), with global coverage and daily values from 1980-2010 in order to form a "current period" climatology. [[ZotCite(VA5Q73D2(Villoriaetal.2016),ait)]] created a tool to download and visualize dataset from AgMIP.
## Precipitation

The Climate Prediction Center's ([http://www.cpc.ncep.noaa.gov/ CPC]) daily rainfall data for the entire world, 1979 - present & 50-km resolution, is one of the few high quality and long term observation-based rainfall products. Data is available at CPC's [http://ftp.cpc.ncep.noaa.gov/precip/CPC_UNI_PRCP/GAUGE_GLB/ ftp site].

 
A R package [https://github.com/RationShop/raincpc raincpc] could be used to download precipitation data from CPC.
## Soils

Considering how heavily most crop models are based on soil-plant-atmosphere interactions, soils are an important input parameter and require the most accurate information available.  Various regional datasets are available for different regions throughout the world; although a majority of regional studies use soil profiles supplied by their regions soil survey office.   

### Harmonized world soil database (HWSD)

The Land Use Change and Agriculture Program of IIASA (LUC) and the Food and Agriculture Organization of the United Nations (FAO) have developed a new comprehensive Harmonized World Soil Database (HWSD). Vast volumes of recently collected regional and national updates of soil information were used for this state-of-the-art database. The work was carried out in partnership with:
* ISRIC-World Soil Information, together with FAO, were responsible for the development of regional soil and terrain databases and the WISE soil profile database;
* the European Soil Bureau Network, which had recently completed a major update of soil information for Europe and northern Eurasia, and
* the Institute of Soil Science, Chinese Academy of Sciences, which provided the recent 1:1,000,000 scale Soil Map of China.

The HWSD is a 30 arc-second raster database with over 16000 different soil mapping units that combines existing regional and national updates of soil information worldwide (SOTER, ESD, Soil Map of China, WISE) with the information contained within the 1:5 000 000 scale FAO-UNESCO Soil Map of the World (FAO, 19711981).

The resulting raster database consists of 21600 rows and 43200 columns, which are linked to harmonized soil property data. The use of a standardized structure allows for the linkage of the attribute data with the raster map to display or query the composition in terms of soil units and the characterization of selected soil parameters (organic Carbon, pH, water storage capacity, soil depth, cation exchange capacity of the soil and the clay fraction, total exchangeable nutrients, lime and gypsum contents, sodium exchange percentage, salinity, textural class and granulometry).
###  ISRIC-WISE 

ISRIC-WISE soils database is a globally comprehensive dataset at one of the highest resolutions 
available at a 5’ X 5’ resolution.   The data were created using the soil distribution show on the 1:5 
million scale FAO-Unesco Soil Map of the World (DSMW) and soil parameter estimates derived from 
ISRIC’s global WISE soil profile database. The dataset contains information on 19 soil variables that are commonly used in crop modeling.  This dataset has be used by Mekonnen & Hoekstra (2010) the their assessemnt of global production of wheat’s green, blue and grey water footprint. 


## Land use

### Catchment Scale Land Use of Australia

This dataset is the most current national compilation of catchment scale land use data for Australia ([http://www.daff.gov.au/abares/pages/publications/display.aspx?url=http://143.188.17.20/anrdl/DAFFService/display.php?fid=pb_luausg9abll20140506_11a.xml CLUM]), as at March 2014. It is a seamless raster dataset that combines land use data for all state and territory jurisdictions, compiled at a resolution of 50 metres by 50 metres. It has been compiled from vector land use datasets collected as part of state and territory mapping programs through the Australian Collaborative Land Use and Management Program (ACLUMP). Catchment scale land use data was produced by combining land tenure and other types of land use information, fine-scale satellite data and information collected in the field. The date of mapping (1997 to 2012) and scale of mapping (1:25 000 to 1:250 000) vary, reflecting the source data capture date and scale. This information is provided in a supporting polygon dataset. 

### Worldwide cropland maps
A new 1 km global IIASA-IFPRI cropland percentage map for the baseline year 2005 has been developed which integrates a number of individual cropland maps at global to regional to national scales. These products are freely available for downloading from the http://cropland.geo-wiki.org website [[ZotCite(GXAI845A(Fritzetal.2015))]].

### gadm

GADM (http://www.gadm.org/) provides the country based shape file.