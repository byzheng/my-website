---
title: Interactive correlation plot
authors: 
- bangyou-zheng
date: '2020-08-26'
slug: interactive-cor
categories:
  - R
tags:
  - R
  - blogdown
  - hugo
---

<script src="{{< blogdown/postref >}}index_files/htmlwidgets/htmlwidgets.js"></script>
<script src="{{< blogdown/postref >}}index_files/d3-bundle/d3-bundle.min.js"></script>
<script src="{{< blogdown/postref >}}index_files/d3-lasso/d3-lasso.min.js"></script>
<script src="{{< blogdown/postref >}}index_files/save-svg-as-png/save-svg-as-png.min.js"></script>
<script src="{{< blogdown/postref >}}index_files/flatbush/flatbush.min.js"></script>
<link href="{{< blogdown/postref >}}index_files/ggiraphjs/ggiraphjs.min.css" rel="stylesheet" />
<script src="{{< blogdown/postref >}}index_files/ggiraphjs/ggiraphjs.min.js"></script>
<script src="{{< blogdown/postref >}}index_files/girafe-binding/girafe.js"></script>
<script src="{{< blogdown/postref >}}index_files/htmlwidgets/htmlwidgets.js"></script>
<script src="{{< blogdown/postref >}}index_files/d3-bundle/d3-bundle.min.js"></script>
<script src="{{< blogdown/postref >}}index_files/d3-lasso/d3-lasso.min.js"></script>
<script src="{{< blogdown/postref >}}index_files/save-svg-as-png/save-svg-as-png.min.js"></script>
<script src="{{< blogdown/postref >}}index_files/flatbush/flatbush.min.js"></script>
<link href="{{< blogdown/postref >}}index_files/ggiraphjs/ggiraphjs.min.css" rel="stylesheet" />
<script src="{{< blogdown/postref >}}index_files/ggiraphjs/ggiraphjs.min.js"></script>
<script src="{{< blogdown/postref >}}index_files/girafe-binding/girafe.js"></script>

Correlation figure is very useful to show correlation for all variables in a data frame. There are several ways to draw a correlation plot in R. This post is to show how to create correlation plots and interactive plot in Rmarkdown.

Load all required libraries.

``` r
library(ggplot2)
library(corrplot)
library(ggiraph)
library(tidyverse)
```

## Basic plot function

The `plot` function in basic R can be used to plot correlation in a data frame (e.g. the dataset `longley`). However this method is not suitable to view a table with lots of columns.

``` r
plot(longley)
```

<img src="{{< blogdown/postref >}}index_files/figure-html/basic-plot-1.png" width="672" />

## corrplot package

`corrplot` package can be used to draw a static correlation figure for a data frame. However, the scatter plots are not plotted for each pair of variables and it is hard to understand the real correlation.

``` r
cor(longley) %>% 
  corrplot()
```

<img src="{{< blogdown/postref >}}index_files/figure-html/corrplot-static-1.png" width="672" />

## Interactive figure using ggiraph

`ggiraph` package can convert a ggplot into interactive figure. A `ggplot2` figure is created for the correlation. It is possible to show the scatter plot when click on the correlation map.

``` r
# Calculate the correlation and obtain the lower triangle
pd <- cor(longley)
pd[upper.tri(pd)] <- NA
pd <- reshape2::melt(pd, na.rm = TRUE)

colors = c("blue", "white", "red")

# Create ggplot2
p1 <- ggplot(pd) +
  geom_tile(aes(Var1, Var2, fill = value), color = "gray")  +
  scale_fill_gradient2(low = colors[1], high = colors[3],
                       mid = colors[2], midpoint = 0, limit = c(-1, 1), space = "Lab",
                       name = "Corr") +
  geom_text(mapping = aes(x = Var1, y = Var2, label = round(value, 1)), size = 2) +
  ggplot2::coord_fixed() +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45,
                                   vjust = 1, size = 8, hjust = 1),
        axis.text.y = element_text(size = 8),
        legend.position = 'bottom') +
  guides(fill = FALSE) +
#  guides(fill = guide_colorbar(title = NULL, barwidth = unit(0.6, "npc"))) +
  xlab("") + ylab("") 
p1
```

<img src="{{< blogdown/postref >}}index_files/figure-html/corrplot-data-1.png" width="100%" />

In the next step, the interactive figure is created through adding new columns `data_id` and `tooltip`.

``` r
pd2 <- pd %>% 
  mutate(data_id = paste0(Var1, '-', Var2),
         tooltip = paste0(Var1, '-', Var2, ': ', round(value, 2)))
p2 <- ggplot(pd2) +
  geom_tile_interactive(aes(Var1, Var2, fill = value,
                            tooltip = tooltip
                            ), color = "gray")  +
  scale_fill_gradient2(low = colors[1], high = colors[3],
                       mid = colors[2], midpoint = 0, limit = c(-1, 1), space = "Lab",
                       name = "Corr") +
  geom_text(mapping = aes(x = Var1, y = Var2, label = round(value, 1)), size = 2) +
  ggplot2::coord_fixed() +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45,
                                   vjust = 1, size = 8, hjust = 1),
        axis.text.y = element_text(size = 8),
        legend.position = 'bottom') +
  guides(fill = FALSE) +
#  guides(fill = guide_colorbar(title = NULL, barwidth = unit(0.6, "npc"))) +
  xlab("") + ylab("")
girafe(ggobj = p2)
```

<div id="htmlwidget-1" style="width:100%;height:576px;" class="girafe html-widget"></div>
<script type="application/json" data-for="htmlwidget-1">{"x":{"html":"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' class='ggiraph-svg' role='img' id='svg_0cdbe858_fb57_4594_808f_7c88c607c488' viewBox='0 0 504 432'>\n <defs id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_defs'>\n  <clipPath id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_c1'>\n   <rect x='0' y='0' width='504' height='432'/>\n  <\/clipPath>\n  <clipPath id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_c2'>\n   <rect x='31.26' y='0' width='441.47' height='432'/>\n  <\/clipPath>\n  <clipPath id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_c3'>\n   <rect x='104.85' y='5.48' width='362.4' height='362.4'/>\n  <\/clipPath>\n <\/defs>\n <g id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_rootg' class='ggiraph-svg-rootg'>\n  <g clip-path='url(#svg_0cdbe858_fb57_4594_808f_7c88c607c488_c1)'>\n   <rect x='0' y='0' width='504' height='432' fill='#FFFFFF' fill-opacity='1' stroke='#FFFFFF' stroke-opacity='1' stroke-width='0.75' stroke-linejoin='round' stroke-linecap='round' class='ggiraph-svg-bg'/>\n  <\/g>\n  <g clip-path='url(#svg_0cdbe858_fb57_4594_808f_7c88c607c488_c3)'>\n   <polyline points='104.85,337.68 467.26,337.68' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,287.35 467.26,287.35' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,237.02 467.26,237.02' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,186.68 467.26,186.68' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,136.35 467.26,136.35' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,86.01 467.26,86.01' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,35.68 467.26,35.68' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='135.05,367.88 135.05,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='185.39,367.88 185.39,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='235.72,367.88 235.72,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='286.05,367.88 286.05,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='336.39,367.88 336.39,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='386.72,367.88 386.72,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='437.06,367.88 437.06,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e1' x='109.89' y='312.52' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='GNP.deflator-GNP.deflator: 1'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e2' x='160.22' y='312.52' width='50.33' height='50.33' fill='#FF0C03' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='GNP-GNP.deflator: 0.99'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e3' x='210.55' y='312.52' width='50.33' height='50.33' fill='#FF8565' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Unemployed-GNP.deflator: 0.62'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e4' x='260.89' y='312.52' width='50.33' height='50.33' fill='#FFA58A' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Armed.Forces-GNP.deflator: 0.46'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e5' x='311.22' y='312.52' width='50.33' height='50.33' fill='#FF1808' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Population-GNP.deflator: 0.98'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e6' x='361.55' y='312.52' width='50.33' height='50.33' fill='#FF0C03' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-GNP.deflator: 0.99'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e7' x='411.89' y='312.52' width='50.33' height='50.33' fill='#FF1E0C' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-GNP.deflator: 0.97'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e8' x='160.22' y='262.18' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='GNP-GNP: 1'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e9' x='210.55' y='262.18' width='50.33' height='50.33' fill='#FF8868' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Unemployed-GNP: 0.6'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e10' x='260.89' y='262.18' width='50.33' height='50.33' fill='#FFA98E' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Armed.Forces-GNP: 0.45'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e11' x='311.22' y='262.18' width='50.33' height='50.33' fill='#FF0D03' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Population-GNP: 0.99'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e12' x='361.55' y='262.18' width='50.33' height='50.33' fill='#FF0702' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-GNP: 1'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e13' x='411.89' y='262.18' width='50.33' height='50.33' fill='#FF1406' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-GNP: 0.98'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e14' x='210.55' y='211.85' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Unemployed-Unemployed: 1'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e15' x='260.89' y='211.85' width='50.33' height='50.33' fill='#E7D5FF' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Armed.Forces-Unemployed: -0.18'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e16' x='311.22' y='211.85' width='50.33' height='50.33' fill='#FF7655' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Population-Unemployed: 0.69'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e17' x='361.55' y='211.85' width='50.33' height='50.33' fill='#FF7A59' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-Unemployed: 0.67'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e18' x='411.89' y='211.85' width='50.33' height='50.33' fill='#FF9D81' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-Unemployed: 0.5'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e19' x='260.89' y='161.51' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Armed.Forces-Armed.Forces: 1'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e20' x='311.22' y='161.51' width='50.33' height='50.33' fill='#FFB9A2' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Population-Armed.Forces: 0.36'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e21' x='361.55' y='161.51' width='50.33' height='50.33' fill='#FFAF95' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-Armed.Forces: 0.42'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e22' x='411.89' y='161.51' width='50.33' height='50.33' fill='#FFA78C' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-Armed.Forces: 0.46'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e23' x='311.22' y='111.18' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Population-Population: 1'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e24' x='361.55' y='111.18' width='50.33' height='50.33' fill='#FF0902' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-Population: 0.99'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e25' x='411.89' y='111.18' width='50.33' height='50.33' fill='#FF2410' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-Population: 0.96'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e26' x='361.55' y='60.85' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-Year: 1'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e27' x='411.89' y='60.85' width='50.33' height='50.33' fill='#FF1E0B' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-Year: 0.97'/>\n   <rect id='svg_0cdbe858_fb57_4594_808f_7c88c607c488_e28' x='411.89' y='10.51' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-Employed: 1'/>\n   <text x='133.47' y='339.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='183.81' y='339.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='231.77' y='339.72' font-size='4.27pt' font-family='Arial'>0.6<\/text>\n   <text x='282.1' y='339.72' font-size='4.27pt' font-family='Arial'>0.5<\/text>\n   <text x='334.81' y='339.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='385.14' y='339.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='435.48' y='339.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='183.81' y='289.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='231.77' y='289.39' font-size='4.27pt' font-family='Arial'>0.6<\/text>\n   <text x='282.1' y='289.39' font-size='4.27pt' font-family='Arial'>0.4<\/text>\n   <text x='334.81' y='289.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='385.14' y='289.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='435.48' y='289.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='234.14' y='239.05' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='281.16' y='239.05' font-size='4.27pt' font-family='Arial'>-0.2<\/text>\n   <text x='332.44' y='239.05' font-size='4.27pt' font-family='Arial'>0.7<\/text>\n   <text x='382.77' y='239.05' font-size='4.27pt' font-family='Arial'>0.7<\/text>\n   <text x='433.11' y='239.05' font-size='4.27pt' font-family='Arial'>0.5<\/text>\n   <text x='284.47' y='188.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='332.44' y='188.72' font-size='4.27pt' font-family='Arial'>0.4<\/text>\n   <text x='382.77' y='188.72' font-size='4.27pt' font-family='Arial'>0.4<\/text>\n   <text x='433.11' y='188.72' font-size='4.27pt' font-family='Arial'>0.5<\/text>\n   <text x='334.81' y='138.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='385.14' y='138.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='435.48' y='138.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='385.14' y='88.05' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='435.48' y='88.05' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='435.48' y='37.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n  <\/g>\n  <g clip-path='url(#svg_0cdbe858_fb57_4594_808f_7c88c607c488_c1)'>\n   <text x='54.7' y='340.55' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>GNP.deflator<\/text>\n   <text x='82.59' y='290.22' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>GNP<\/text>\n   <text x='55.01' y='239.88' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Unemployed<\/text>\n   <text x='49.68' y='189.55' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Armed.Forces<\/text>\n   <text x='62.11' y='139.21' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Population<\/text>\n   <text x='83.76' y='88.88' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Year<\/text>\n   <text x='64.35' y='38.55' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Employed<\/text>\n   <text transform='translate(107.13,408.84) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>GNP.deflator<\/text>\n   <text transform='translate(177.18,389.12) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>GNP<\/text>\n   <text transform='translate(208.01,408.63) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Unemployed<\/text>\n   <text transform='translate(254.58,412.39) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Armed.Forces<\/text>\n   <text transform='translate(313.70,403.61) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Population<\/text>\n   <text transform='translate(379.34,388.30) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Year<\/text>\n   <text transform='translate(415.95,402.02) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Employed<\/text>\n  <\/g>\n <\/g>\n<\/svg>","js":null,"uid":"svg_0cdbe858_fb57_4594_808f_7c88c607c488","ratio":1.16666666666667,"settings":{"tooltip":{"css":".tooltip_SVGID_ { padding:5px;background:black;color:white;border-radius:2px;text-align:left; ; position:absolute;pointer-events:none;z-index:999;}","placement":"doc","opacity":0.9,"offx":10,"offy":10,"use_cursor_pos":true,"use_fill":false,"use_stroke":false,"delay_over":200,"delay_out":500},"hover":{"css":".hover_data_SVGID_ { fill:orange;stroke:black;cursor:pointer; }\ntext.hover_data_SVGID_ { stroke:none;fill:orange; }\ncircle.hover_data_SVGID_ { fill:orange;stroke:black; }\nline.hover_data_SVGID_, polyline.hover_data_SVGID_ { fill:none;stroke:orange; }\nrect.hover_data_SVGID_, polygon.hover_data_SVGID_, path.hover_data_SVGID_ { fill:orange;stroke:none; }\nimage.hover_data_SVGID_ { stroke:orange; }","reactive":true,"nearest_distance":null},"hover_inv":{"css":""},"hover_key":{"css":".hover_key_SVGID_ { fill:orange;stroke:black;cursor:pointer; }\ntext.hover_key_SVGID_ { stroke:none;fill:orange; }\ncircle.hover_key_SVGID_ { fill:orange;stroke:black; }\nline.hover_key_SVGID_, polyline.hover_key_SVGID_ { fill:none;stroke:orange; }\nrect.hover_key_SVGID_, polygon.hover_key_SVGID_, path.hover_key_SVGID_ { fill:orange;stroke:none; }\nimage.hover_key_SVGID_ { stroke:orange; }","reactive":true},"hover_theme":{"css":".hover_theme_SVGID_ { fill:orange;stroke:black;cursor:pointer; }\ntext.hover_theme_SVGID_ { stroke:none;fill:orange; }\ncircle.hover_theme_SVGID_ { fill:orange;stroke:black; }\nline.hover_theme_SVGID_, polyline.hover_theme_SVGID_ { fill:none;stroke:orange; }\nrect.hover_theme_SVGID_, polygon.hover_theme_SVGID_, path.hover_theme_SVGID_ { fill:orange;stroke:none; }\nimage.hover_theme_SVGID_ { stroke:orange; }","reactive":true},"select":{"css":".select_data_SVGID_ { fill:red;stroke:black;cursor:pointer; }\ntext.select_data_SVGID_ { stroke:none;fill:red; }\ncircle.select_data_SVGID_ { fill:red;stroke:black; }\nline.select_data_SVGID_, polyline.select_data_SVGID_ { fill:none;stroke:red; }\nrect.select_data_SVGID_, polygon.select_data_SVGID_, path.select_data_SVGID_ { fill:red;stroke:none; }\nimage.select_data_SVGID_ { stroke:red; }","type":"multiple","only_shiny":true,"selected":[]},"select_inv":{"css":""},"select_key":{"css":".select_key_SVGID_ { fill:red;stroke:black;cursor:pointer; }\ntext.select_key_SVGID_ { stroke:none;fill:red; }\ncircle.select_key_SVGID_ { fill:red;stroke:black; }\nline.select_key_SVGID_, polyline.select_key_SVGID_ { fill:none;stroke:red; }\nrect.select_key_SVGID_, polygon.select_key_SVGID_, path.select_key_SVGID_ { fill:red;stroke:none; }\nimage.select_key_SVGID_ { stroke:red; }","type":"single","only_shiny":true,"selected":[]},"select_theme":{"css":".select_theme_SVGID_ { fill:red;stroke:black;cursor:pointer; }\ntext.select_theme_SVGID_ { stroke:none;fill:red; }\ncircle.select_theme_SVGID_ { fill:red;stroke:black; }\nline.select_theme_SVGID_, polyline.select_theme_SVGID_ { fill:none;stroke:red; }\nrect.select_theme_SVGID_, polygon.select_theme_SVGID_, path.select_theme_SVGID_ { fill:red;stroke:none; }\nimage.select_theme_SVGID_ { stroke:red; }","type":"single","only_shiny":true,"selected":[]},"zoom":{"min":1,"max":1,"duration":300},"toolbar":{"position":"topright","pngname":"diagram","tooltips":null,"hidden":[],"delay_over":200,"delay_out":500},"sizing":{"rescale":true,"width":1}}},"evals":[],"jsHooks":[]}</script>

The `onclick` event can be added for each grid to show the scatter plot through calling the `js` script. A js function `create_fig` is defined to use `d3.js` to draw a scatter plot.

``` r
knitr::raw_html('
<script type="text/javascript">
  
var create_fig = function(valuex, valuey, xlabel, ylabel) {
  var margin = {top: 10, right: 30, bottom: 50, left: 70},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
  
  // Remove old plot
  var svg1 = d3.select("#comparison-plot");
  svg1.selectAll("*").remove();
  // append the svg object to the body of the page
  
  var svg = d3.select("#comparison-plot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleLinear()
    .domain([Math.min(...valuex), Math.max(...valuex)])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", margin.left + width / 2)
    .attr("y", margin.top + height + 30)
    .text(xlabel);
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([Math.min(...valuey), Math.max(...valuey)])
    .range([ height, 0]);
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -50)
    .attr("x", -(height / 2) + margin.top)
    .attr("transform", "rotate(-90)")
    .text(ylabel);
  svg.append("g")
    .call(d3.axisLeft(y));
  // Create data item
  var data = valuex.map((item, i) => ({x:item, y:valuey[i]}))
  // Add dots
  svg.append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.x); } )
      .attr("cy", function (d) { return y(d.y); } )
      .attr("r", 4)
      .style("fill", "#69b3a2")

  }
</script>
')
```

<script type="text/javascript">
  
var create_fig = function(valuex, valuey, xlabel, ylabel) {
  var margin = {top: 10, right: 30, bottom: 50, left: 70},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
  
  // Remove old plot
  var svg1 = d3.select("#comparison-plot");
  svg1.selectAll("*").remove();
  // append the svg object to the body of the page
  
  var svg = d3.select("#comparison-plot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleLinear()
    .domain([Math.min(...valuex), Math.max(...valuex)])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", margin.left + width / 2)
    .attr("y", margin.top + height + 30)
    .text(xlabel);
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([Math.min(...valuey), Math.max(...valuey)])
    .range([ height, 0]);
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -50)
    .attr("x", -(height / 2) + margin.top)
    .attr("transform", "rotate(-90)")
    .text(ylabel);
  svg.append("g")
    .call(d3.axisLeft(y));
  // Create data item
  var data = valuex.map((item, i) => ({x:item, y:valuey[i]}))
  // Add dots
  svg.append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.x); } )
      .attr("cy", function (d) { return y(d.y); } )
      .attr("r", 4)
      .style("fill", "#69b3a2")

  }
</script>

The `js` is created to response the `onclick` event.

``` r
# Generate js to create_fig
generate_js <- function(df) {

  x <- longley[[df$Var1]]
  y <- longley[[df$Var2]]
  df$onclick <- paste0("create_fig(", 
         jsonlite::toJSON(x), ", ",
         jsonlite::toJSON(y), ", ",
         '"', df$Var1, '", ',
         '"', df$Var2, '"',
         ")")
  df
}
# Create a new data frame
pd3 <- pd2 %>% 
  group_by(Var1, Var2) %>% 
  do(generate_js(.))

p3 <- ggplot(pd3) +
  geom_tile_interactive(aes(Var1, Var2, fill = value,
                            tooltip = tooltip,
                            data_id = data_id,
                            onclick = onclick
                            ), color = "gray")  +
  scale_fill_gradient2(low = colors[1], high = colors[3],
                       mid = colors[2], midpoint = 0, limit = c(-1, 1), space = "Lab",
                       name = "Corr") +
  geom_text(mapping = aes(x = Var1, y = Var2, label = round(value, 1)), size = 2) +
  ggplot2::coord_fixed() +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45,
                                   vjust = 1, size = 8, hjust = 1),
        axis.text.y = element_text(size = 8),
        legend.position = 'bottom') +
  guides(fill = FALSE) +
#  guides(fill = guide_colorbar(title = NULL, barwidth = unit(0.6, "npc"))) +
  xlab("") + ylab("")
girafe(ggobj = p3)
```

<div id="htmlwidget-2" style="width:100%;height:576px;" class="girafe html-widget"></div>
<script type="application/json" data-for="htmlwidget-2">{"x":{"html":"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' class='ggiraph-svg' role='img' id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57' viewBox='0 0 504 432'>\n <defs id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_defs'>\n  <clipPath id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_c1'>\n   <rect x='0' y='0' width='504' height='432'/>\n  <\/clipPath>\n  <clipPath id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_c2'>\n   <rect x='31.26' y='0' width='441.47' height='432'/>\n  <\/clipPath>\n  <clipPath id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_c3'>\n   <rect x='104.85' y='5.48' width='362.4' height='362.4'/>\n  <\/clipPath>\n <\/defs>\n <g id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_rootg' class='ggiraph-svg-rootg'>\n  <g clip-path='url(#svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_c1)'>\n   <rect x='0' y='0' width='504' height='432' fill='#FFFFFF' fill-opacity='1' stroke='#FFFFFF' stroke-opacity='1' stroke-width='0.75' stroke-linejoin='round' stroke-linecap='round' class='ggiraph-svg-bg'/>\n  <\/g>\n  <g clip-path='url(#svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_c3)'>\n   <polyline points='104.85,337.68 467.26,337.68' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,287.35 467.26,287.35' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,237.02 467.26,237.02' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,186.68 467.26,186.68' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,136.35 467.26,136.35' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,86.01 467.26,86.01' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='104.85,35.68 467.26,35.68' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='135.05,367.88 135.05,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='185.39,367.88 185.39,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='235.72,367.88 235.72,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='286.05,367.88 286.05,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='336.39,367.88 336.39,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='386.72,367.88 386.72,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <polyline points='437.06,367.88 437.06,5.48' fill='none' stroke='#EBEBEB' stroke-opacity='1' stroke-width='1.07' stroke-linejoin='round' stroke-linecap='butt'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e1' x='109.89' y='312.52' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='GNP.deflator-GNP.deflator: 1' data-id='GNP.deflator-GNP.deflator' onclick='create_fig([83,88.5,88.2,89.5,96.2,98.1,99,100,101.2,104.6,108.4,110.8,112.6,114.2,115.7,116.9], [83,88.5,88.2,89.5,96.2,98.1,99,100,101.2,104.6,108.4,110.8,112.6,114.2,115.7,116.9], \"GNP.deflator\", \"GNP.deflator\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e2' x='160.22' y='312.52' width='50.33' height='50.33' fill='#FF0C03' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='GNP-GNP.deflator: 0.99' data-id='GNP-GNP.deflator' onclick='create_fig([234.289,259.426,258.054,284.599,328.975,346.999,365.385,363.112,397.469,419.18,442.769,444.546,482.704,502.601,518.173,554.894], [83,88.5,88.2,89.5,96.2,98.1,99,100,101.2,104.6,108.4,110.8,112.6,114.2,115.7,116.9], \"GNP\", \"GNP.deflator\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e3' x='160.22' y='262.18' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='GNP-GNP: 1' data-id='GNP-GNP' onclick='create_fig([234.289,259.426,258.054,284.599,328.975,346.999,365.385,363.112,397.469,419.18,442.769,444.546,482.704,502.601,518.173,554.894], [234.289,259.426,258.054,284.599,328.975,346.999,365.385,363.112,397.469,419.18,442.769,444.546,482.704,502.601,518.173,554.894], \"GNP\", \"GNP\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e4' x='210.55' y='312.52' width='50.33' height='50.33' fill='#FF8565' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Unemployed-GNP.deflator: 0.62' data-id='Unemployed-GNP.deflator' onclick='create_fig([235.6,232.5,368.2,335.1,209.9,193.2,187,357.8,290.4,282.2,293.6,468.1,381.3,393.1,480.6,400.7], [83,88.5,88.2,89.5,96.2,98.1,99,100,101.2,104.6,108.4,110.8,112.6,114.2,115.7,116.9], \"Unemployed\", \"GNP.deflator\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e5' x='210.55' y='262.18' width='50.33' height='50.33' fill='#FF8868' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Unemployed-GNP: 0.6' data-id='Unemployed-GNP' onclick='create_fig([235.6,232.5,368.2,335.1,209.9,193.2,187,357.8,290.4,282.2,293.6,468.1,381.3,393.1,480.6,400.7], [234.289,259.426,258.054,284.599,328.975,346.999,365.385,363.112,397.469,419.18,442.769,444.546,482.704,502.601,518.173,554.894], \"Unemployed\", \"GNP\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e6' x='210.55' y='211.85' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Unemployed-Unemployed: 1' data-id='Unemployed-Unemployed' onclick='create_fig([235.6,232.5,368.2,335.1,209.9,193.2,187,357.8,290.4,282.2,293.6,468.1,381.3,393.1,480.6,400.7], [235.6,232.5,368.2,335.1,209.9,193.2,187,357.8,290.4,282.2,293.6,468.1,381.3,393.1,480.6,400.7], \"Unemployed\", \"Unemployed\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e7' x='260.89' y='312.52' width='50.33' height='50.33' fill='#FFA58A' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Armed.Forces-GNP.deflator: 0.46' data-id='Armed.Forces-GNP.deflator' onclick='create_fig([159,145.6,161.6,165,309.9,359.4,354.7,335,304.8,285.7,279.8,263.7,255.2,251.4,257.2,282.7], [83,88.5,88.2,89.5,96.2,98.1,99,100,101.2,104.6,108.4,110.8,112.6,114.2,115.7,116.9], \"Armed.Forces\", \"GNP.deflator\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e8' x='260.89' y='262.18' width='50.33' height='50.33' fill='#FFA98E' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Armed.Forces-GNP: 0.45' data-id='Armed.Forces-GNP' onclick='create_fig([159,145.6,161.6,165,309.9,359.4,354.7,335,304.8,285.7,279.8,263.7,255.2,251.4,257.2,282.7], [234.289,259.426,258.054,284.599,328.975,346.999,365.385,363.112,397.469,419.18,442.769,444.546,482.704,502.601,518.173,554.894], \"Armed.Forces\", \"GNP\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e9' x='260.89' y='211.85' width='50.33' height='50.33' fill='#E7D5FF' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Armed.Forces-Unemployed: -0.18' data-id='Armed.Forces-Unemployed' onclick='create_fig([159,145.6,161.6,165,309.9,359.4,354.7,335,304.8,285.7,279.8,263.7,255.2,251.4,257.2,282.7], [235.6,232.5,368.2,335.1,209.9,193.2,187,357.8,290.4,282.2,293.6,468.1,381.3,393.1,480.6,400.7], \"Armed.Forces\", \"Unemployed\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e10' x='260.89' y='161.51' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Armed.Forces-Armed.Forces: 1' data-id='Armed.Forces-Armed.Forces' onclick='create_fig([159,145.6,161.6,165,309.9,359.4,354.7,335,304.8,285.7,279.8,263.7,255.2,251.4,257.2,282.7], [159,145.6,161.6,165,309.9,359.4,354.7,335,304.8,285.7,279.8,263.7,255.2,251.4,257.2,282.7], \"Armed.Forces\", \"Armed.Forces\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e11' x='311.22' y='312.52' width='50.33' height='50.33' fill='#FF1808' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Population-GNP.deflator: 0.98' data-id='Population-GNP.deflator' onclick='create_fig([107.608,108.632,109.773,110.929,112.075,113.27,115.094,116.219,117.388,118.734,120.445,121.95,123.366,125.368,127.852,130.081], [83,88.5,88.2,89.5,96.2,98.1,99,100,101.2,104.6,108.4,110.8,112.6,114.2,115.7,116.9], \"Population\", \"GNP.deflator\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e12' x='311.22' y='262.18' width='50.33' height='50.33' fill='#FF0D03' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Population-GNP: 0.99' data-id='Population-GNP' onclick='create_fig([107.608,108.632,109.773,110.929,112.075,113.27,115.094,116.219,117.388,118.734,120.445,121.95,123.366,125.368,127.852,130.081], [234.289,259.426,258.054,284.599,328.975,346.999,365.385,363.112,397.469,419.18,442.769,444.546,482.704,502.601,518.173,554.894], \"Population\", \"GNP\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e13' x='311.22' y='211.85' width='50.33' height='50.33' fill='#FF7655' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Population-Unemployed: 0.69' data-id='Population-Unemployed' onclick='create_fig([107.608,108.632,109.773,110.929,112.075,113.27,115.094,116.219,117.388,118.734,120.445,121.95,123.366,125.368,127.852,130.081], [235.6,232.5,368.2,335.1,209.9,193.2,187,357.8,290.4,282.2,293.6,468.1,381.3,393.1,480.6,400.7], \"Population\", \"Unemployed\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e14' x='311.22' y='161.51' width='50.33' height='50.33' fill='#FFB9A2' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Population-Armed.Forces: 0.36' data-id='Population-Armed.Forces' onclick='create_fig([107.608,108.632,109.773,110.929,112.075,113.27,115.094,116.219,117.388,118.734,120.445,121.95,123.366,125.368,127.852,130.081], [159,145.6,161.6,165,309.9,359.4,354.7,335,304.8,285.7,279.8,263.7,255.2,251.4,257.2,282.7], \"Population\", \"Armed.Forces\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e15' x='311.22' y='111.18' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Population-Population: 1' data-id='Population-Population' onclick='create_fig([107.608,108.632,109.773,110.929,112.075,113.27,115.094,116.219,117.388,118.734,120.445,121.95,123.366,125.368,127.852,130.081], [107.608,108.632,109.773,110.929,112.075,113.27,115.094,116.219,117.388,118.734,120.445,121.95,123.366,125.368,127.852,130.081], \"Population\", \"Population\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e16' x='361.55' y='312.52' width='50.33' height='50.33' fill='#FF0C03' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-GNP.deflator: 0.99' data-id='Year-GNP.deflator' onclick='create_fig([1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962], [83,88.5,88.2,89.5,96.2,98.1,99,100,101.2,104.6,108.4,110.8,112.6,114.2,115.7,116.9], \"Year\", \"GNP.deflator\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e17' x='361.55' y='262.18' width='50.33' height='50.33' fill='#FF0702' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-GNP: 1' data-id='Year-GNP' onclick='create_fig([1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962], [234.289,259.426,258.054,284.599,328.975,346.999,365.385,363.112,397.469,419.18,442.769,444.546,482.704,502.601,518.173,554.894], \"Year\", \"GNP\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e18' x='361.55' y='211.85' width='50.33' height='50.33' fill='#FF7A59' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-Unemployed: 0.67' data-id='Year-Unemployed' onclick='create_fig([1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962], [235.6,232.5,368.2,335.1,209.9,193.2,187,357.8,290.4,282.2,293.6,468.1,381.3,393.1,480.6,400.7], \"Year\", \"Unemployed\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e19' x='361.55' y='161.51' width='50.33' height='50.33' fill='#FFAF95' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-Armed.Forces: 0.42' data-id='Year-Armed.Forces' onclick='create_fig([1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962], [159,145.6,161.6,165,309.9,359.4,354.7,335,304.8,285.7,279.8,263.7,255.2,251.4,257.2,282.7], \"Year\", \"Armed.Forces\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e20' x='361.55' y='111.18' width='50.33' height='50.33' fill='#FF0902' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-Population: 0.99' data-id='Year-Population' onclick='create_fig([1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962], [107.608,108.632,109.773,110.929,112.075,113.27,115.094,116.219,117.388,118.734,120.445,121.95,123.366,125.368,127.852,130.081], \"Year\", \"Population\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e21' x='361.55' y='60.85' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Year-Year: 1' data-id='Year-Year' onclick='create_fig([1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962], [1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962], \"Year\", \"Year\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e22' x='411.89' y='312.52' width='50.33' height='50.33' fill='#FF1E0C' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-GNP.deflator: 0.97' data-id='Employed-GNP.deflator' onclick='create_fig([60.323,61.122,60.171,61.187,63.221,63.639,64.989,63.761,66.019,67.857,68.169,66.513,68.655,69.564,69.331,70.551], [83,88.5,88.2,89.5,96.2,98.1,99,100,101.2,104.6,108.4,110.8,112.6,114.2,115.7,116.9], \"Employed\", \"GNP.deflator\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e23' x='411.89' y='262.18' width='50.33' height='50.33' fill='#FF1406' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-GNP: 0.98' data-id='Employed-GNP' onclick='create_fig([60.323,61.122,60.171,61.187,63.221,63.639,64.989,63.761,66.019,67.857,68.169,66.513,68.655,69.564,69.331,70.551], [234.289,259.426,258.054,284.599,328.975,346.999,365.385,363.112,397.469,419.18,442.769,444.546,482.704,502.601,518.173,554.894], \"Employed\", \"GNP\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e24' x='411.89' y='211.85' width='50.33' height='50.33' fill='#FF9D81' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-Unemployed: 0.5' data-id='Employed-Unemployed' onclick='create_fig([60.323,61.122,60.171,61.187,63.221,63.639,64.989,63.761,66.019,67.857,68.169,66.513,68.655,69.564,69.331,70.551], [235.6,232.5,368.2,335.1,209.9,193.2,187,357.8,290.4,282.2,293.6,468.1,381.3,393.1,480.6,400.7], \"Employed\", \"Unemployed\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e25' x='411.89' y='161.51' width='50.33' height='50.33' fill='#FFA78C' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-Armed.Forces: 0.46' data-id='Employed-Armed.Forces' onclick='create_fig([60.323,61.122,60.171,61.187,63.221,63.639,64.989,63.761,66.019,67.857,68.169,66.513,68.655,69.564,69.331,70.551], [159,145.6,161.6,165,309.9,359.4,354.7,335,304.8,285.7,279.8,263.7,255.2,251.4,257.2,282.7], \"Employed\", \"Armed.Forces\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e26' x='411.89' y='111.18' width='50.33' height='50.33' fill='#FF2410' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-Population: 0.96' data-id='Employed-Population' onclick='create_fig([60.323,61.122,60.171,61.187,63.221,63.639,64.989,63.761,66.019,67.857,68.169,66.513,68.655,69.564,69.331,70.551], [107.608,108.632,109.773,110.929,112.075,113.27,115.094,116.219,117.388,118.734,120.445,121.95,123.366,125.368,127.852,130.081], \"Employed\", \"Population\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e27' x='411.89' y='60.85' width='50.33' height='50.33' fill='#FF1E0B' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-Year: 0.97' data-id='Employed-Year' onclick='create_fig([60.323,61.122,60.171,61.187,63.221,63.639,64.989,63.761,66.019,67.857,68.169,66.513,68.655,69.564,69.331,70.551], [1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962], \"Employed\", \"Year\")'/>\n   <rect id='svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_e28' x='411.89' y='10.51' width='50.33' height='50.33' fill='#FF0000' fill-opacity='1' stroke='#BEBEBE' stroke-opacity='1' stroke-width='0.21' stroke-linejoin='miter' stroke-linecap='butt' title='Employed-Employed: 1' data-id='Employed-Employed' onclick='create_fig([60.323,61.122,60.171,61.187,63.221,63.639,64.989,63.761,66.019,67.857,68.169,66.513,68.655,69.564,69.331,70.551], [60.323,61.122,60.171,61.187,63.221,63.639,64.989,63.761,66.019,67.857,68.169,66.513,68.655,69.564,69.331,70.551], \"Employed\", \"Employed\")'/>\n   <text x='133.47' y='339.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='183.81' y='339.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='183.81' y='289.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='231.77' y='339.72' font-size='4.27pt' font-family='Arial'>0.6<\/text>\n   <text x='231.77' y='289.39' font-size='4.27pt' font-family='Arial'>0.6<\/text>\n   <text x='234.14' y='239.05' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='282.1' y='339.72' font-size='4.27pt' font-family='Arial'>0.5<\/text>\n   <text x='282.1' y='289.39' font-size='4.27pt' font-family='Arial'>0.4<\/text>\n   <text x='281.16' y='239.05' font-size='4.27pt' font-family='Arial'>-0.2<\/text>\n   <text x='284.47' y='188.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='334.81' y='339.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='334.81' y='289.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='332.44' y='239.05' font-size='4.27pt' font-family='Arial'>0.7<\/text>\n   <text x='332.44' y='188.72' font-size='4.27pt' font-family='Arial'>0.4<\/text>\n   <text x='334.81' y='138.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='385.14' y='339.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='385.14' y='289.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='382.77' y='239.05' font-size='4.27pt' font-family='Arial'>0.7<\/text>\n   <text x='382.77' y='188.72' font-size='4.27pt' font-family='Arial'>0.4<\/text>\n   <text x='385.14' y='138.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='385.14' y='88.05' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='435.48' y='339.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='435.48' y='289.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='433.11' y='239.05' font-size='4.27pt' font-family='Arial'>0.5<\/text>\n   <text x='433.11' y='188.72' font-size='4.27pt' font-family='Arial'>0.5<\/text>\n   <text x='435.48' y='138.39' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='435.48' y='88.05' font-size='4.27pt' font-family='Arial'>1<\/text>\n   <text x='435.48' y='37.72' font-size='4.27pt' font-family='Arial'>1<\/text>\n  <\/g>\n  <g clip-path='url(#svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57_c1)'>\n   <text x='54.7' y='340.55' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>GNP.deflator<\/text>\n   <text x='82.59' y='290.22' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>GNP<\/text>\n   <text x='55.01' y='239.88' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Unemployed<\/text>\n   <text x='49.68' y='189.55' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Armed.Forces<\/text>\n   <text x='62.11' y='139.21' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Population<\/text>\n   <text x='83.76' y='88.88' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Year<\/text>\n   <text x='64.35' y='38.55' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Employed<\/text>\n   <text transform='translate(107.13,408.84) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>GNP.deflator<\/text>\n   <text transform='translate(177.18,389.12) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>GNP<\/text>\n   <text transform='translate(208.01,408.63) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Unemployed<\/text>\n   <text transform='translate(254.58,412.39) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Armed.Forces<\/text>\n   <text transform='translate(313.70,403.61) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Population<\/text>\n   <text transform='translate(379.34,388.30) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Year<\/text>\n   <text transform='translate(415.95,402.02) rotate(-45.00)' font-size='6pt' font-family='Arial' fill='#4D4D4D' fill-opacity='1'>Employed<\/text>\n  <\/g>\n <\/g>\n<\/svg>","js":null,"uid":"svg_366a3718_a0a3_4c4e_ac3d_69f681d39c57","ratio":1.16666666666667,"settings":{"tooltip":{"css":".tooltip_SVGID_ { padding:5px;background:black;color:white;border-radius:2px;text-align:left; ; position:absolute;pointer-events:none;z-index:999;}","placement":"doc","opacity":0.9,"offx":10,"offy":10,"use_cursor_pos":true,"use_fill":false,"use_stroke":false,"delay_over":200,"delay_out":500},"hover":{"css":".hover_data_SVGID_ { fill:orange;stroke:black;cursor:pointer; }\ntext.hover_data_SVGID_ { stroke:none;fill:orange; }\ncircle.hover_data_SVGID_ { fill:orange;stroke:black; }\nline.hover_data_SVGID_, polyline.hover_data_SVGID_ { fill:none;stroke:orange; }\nrect.hover_data_SVGID_, polygon.hover_data_SVGID_, path.hover_data_SVGID_ { fill:orange;stroke:none; }\nimage.hover_data_SVGID_ { stroke:orange; }","reactive":true,"nearest_distance":null},"hover_inv":{"css":""},"hover_key":{"css":".hover_key_SVGID_ { fill:orange;stroke:black;cursor:pointer; }\ntext.hover_key_SVGID_ { stroke:none;fill:orange; }\ncircle.hover_key_SVGID_ { fill:orange;stroke:black; }\nline.hover_key_SVGID_, polyline.hover_key_SVGID_ { fill:none;stroke:orange; }\nrect.hover_key_SVGID_, polygon.hover_key_SVGID_, path.hover_key_SVGID_ { fill:orange;stroke:none; }\nimage.hover_key_SVGID_ { stroke:orange; }","reactive":true},"hover_theme":{"css":".hover_theme_SVGID_ { fill:orange;stroke:black;cursor:pointer; }\ntext.hover_theme_SVGID_ { stroke:none;fill:orange; }\ncircle.hover_theme_SVGID_ { fill:orange;stroke:black; }\nline.hover_theme_SVGID_, polyline.hover_theme_SVGID_ { fill:none;stroke:orange; }\nrect.hover_theme_SVGID_, polygon.hover_theme_SVGID_, path.hover_theme_SVGID_ { fill:orange;stroke:none; }\nimage.hover_theme_SVGID_ { stroke:orange; }","reactive":true},"select":{"css":".select_data_SVGID_ { fill:red;stroke:black;cursor:pointer; }\ntext.select_data_SVGID_ { stroke:none;fill:red; }\ncircle.select_data_SVGID_ { fill:red;stroke:black; }\nline.select_data_SVGID_, polyline.select_data_SVGID_ { fill:none;stroke:red; }\nrect.select_data_SVGID_, polygon.select_data_SVGID_, path.select_data_SVGID_ { fill:red;stroke:none; }\nimage.select_data_SVGID_ { stroke:red; }","type":"multiple","only_shiny":true,"selected":[]},"select_inv":{"css":""},"select_key":{"css":".select_key_SVGID_ { fill:red;stroke:black;cursor:pointer; }\ntext.select_key_SVGID_ { stroke:none;fill:red; }\ncircle.select_key_SVGID_ { fill:red;stroke:black; }\nline.select_key_SVGID_, polyline.select_key_SVGID_ { fill:none;stroke:red; }\nrect.select_key_SVGID_, polygon.select_key_SVGID_, path.select_key_SVGID_ { fill:red;stroke:none; }\nimage.select_key_SVGID_ { stroke:red; }","type":"single","only_shiny":true,"selected":[]},"select_theme":{"css":".select_theme_SVGID_ { fill:red;stroke:black;cursor:pointer; }\ntext.select_theme_SVGID_ { stroke:none;fill:red; }\ncircle.select_theme_SVGID_ { fill:red;stroke:black; }\nline.select_theme_SVGID_, polyline.select_theme_SVGID_ { fill:none;stroke:red; }\nrect.select_theme_SVGID_, polygon.select_theme_SVGID_, path.select_theme_SVGID_ { fill:red;stroke:none; }\nimage.select_theme_SVGID_ { stroke:red; }","type":"single","only_shiny":true,"selected":[]},"zoom":{"min":1,"max":1,"duration":300},"toolbar":{"position":"topright","pngname":"diagram","tooltips":null,"hidden":[],"delay_over":200,"delay_out":500},"sizing":{"rescale":true,"width":1}}},"evals":[],"jsHooks":[]}</script>

A new `div` element is added at the bottom of interactive figure to show the scatter plot.

``` r
knitr::raw_html('<div id="comparison-plot"></div>')
```

<div id="comparison-plot"></div>
