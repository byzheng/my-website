---
title: Calculation of thermal time
authors: 
- bangyou-zheng
date: '2020-07-08'
slug: calculation-thermal-time
tags:
  - crop
  - weather
---




The thermal time is important to quantify the crop growth for a specific period (e.g. from sowing to flowering). However, the codes might be complicated if there are multiple records in an experiment. 

Here I showed how to use `left_join` function to easily calculate thermal time for the whole records in one data frame. 



```r
suppressPackageStartupMessages(library(weaana))
suppressPackageStartupMessages(library(tidyverse))
```

Random observations are generated from 1957 and 2009 for sowing and flowering time. 


```r
obs <- tibble(sowing = as.Date(paste0(seq(1957, 2009), '-05-01')),
       flowering = as.Date(paste0(seq(1957, 2009), '-', round(runif(53) * 20 + 210)), 
                           format = "%Y-%j"))
```


The weather records are stored in the APSIM format and red by `weaana` package.

```r
records <- readWeatherRecords("WeatherRecordsDemo1.met") %>% 
    getWeatherRecords()
```

The daily thermal time is calculated using base temperature 0C. The accumulated thermal times are summed up since the starting of weather records.


```r
records <- records %>% 
    mutate(tt = ifelse(avgt > 0, avgt, 0),
           cum_tt = cumsum(tt)) %>% 
    select(date, cum_tt)
```


The accumulated thermal time at sowing and flowering are selected from the weather records. Then the thermal time from sowing to flowering is calcuated by the difference of accumulated thermal time at sowing and flowering. 


```r
sowing_tt <- obs %>% 
    left_join(records, by = c("sowing" = 'date')) %>% 
    rename(sowing_tt = cum_tt)
flowering_tt <- obs %>% 
    left_join(records, by = c("flowering" = 'date')) %>% 
    left_join(sowing_tt, by = c("sowing", 'flowering')) %>% 
    mutate(tt = cum_tt - sowing_tt) %>% 
    select(-cum_tt, -sowing_tt)
head(flowering_tt)
```

```
## # A tibble: 6 × 3
##   sowing     flowering     tt
##   <date>     <date>     <dbl>
## 1 1957-05-01 1957-07-31 1322.
## 2 1958-05-01 1958-08-04 1471.
## 3 1959-05-01 1959-08-17 1543.
## 4 1960-05-01 1960-08-14 1405.
## 5 1961-05-01 1961-08-04 1278.
## 6 1962-05-01 1962-08-04 1384.
```


```r
flowering_tt %>% 
    ggplot() +
    geom_histogram(aes(tt)) +
    theme_bw() +
    xlab("Thermal time (Cd)")
```

```
## `stat_bin()` using `bins = 30`. Pick better value with `binwidth`.
```

<img src="{{< blogdown/postref >}}index_files/figure-html/plot-fig-1.png" width="384" />




