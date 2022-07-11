---
title: "Combine project management and data analysis using Tiddlywiki and RMarkdown"
authors: 
 - bangyou-zheng
date: '2022-07-08'
slug: tiddlywiki-rmarkdown
categories:
  - R
tags:
  - tiddlywiki
  - R
---

I have been looking for a simple and flexible tool to manage projects, take notes, and track results of data analysis with R, e.g. EverNote, OneNote, Trac, JIRA, github, RMarkdown, bookdown, etc. Recently, [Tiddlywiki](https://tiddlywiki.com/) and [Projectify](https://thaddeusjiang.github.io/Projectify/) pops up from random goggling. [Tiddlywiki](https://tiddlywiki.com/) is a non-linear notebook for storing information. I found it is very useful and simple to manage my research projects and take notes of data analysis as a data scientist and digital agronomist. 

## Project management

I always work on multiple projects at the same time. Beyond the project management by project members, I prefer to keep a personal project management to track, hold and restore my activities related with a specific project. [Projectify](https://thaddeusjiang.github.io/Projectify/) is a preconfigured Tiddlywiki for project management to capture thoughts, plan projects, and schedule tasks. Projectify manages projects through [tags](https://tiddlywiki.com/static/Tagging.html) in Tiddlywiki. 
Adding tags into the new tiddler can easily associate it into [one or multiple projects ](https://thaddeusjiang.github.io/Projectify/). 


## Reading notes

Literature and online materials are very important to scientific research. [Refnotes](https://kookma.github.io/TW-Refnotes/) plugin can add reference into any tiddlers using bibtex format. My reference management tool [Zotero](https://www.zotero.org/) with extension [Better Bibtext](https://retorque.re/zotero-better-bibtex/) can easily export references in a collection into bibtex format and keep updates. [This post](refnotes-zotero) show how to use Zotero and Refnotes in Tiddlywiki.


## Data analysis

[R](https://www.r-project.org/) is my major programming language for data analysis. [RMarkdown](https://rmarkdown.rstudio.com/) has been using for long period to document the data analysis and share outputs with my colleagues. RMarkdown documents provide powerful features to reproduce outputs of data analysis and very suitable to generate final outputs, which can be treated as a linear procedure from raw data to output. However, as a data scientist, I often branch data analysis to 

* Get new data from my own experiments or other colleagues. The new data require for quality checking and might or might not be useful for further analysis.
* Test new ideas from the current analysis (branch from master analysis). The new ideas might be brilliant and merge into master analysis, or might be rubbish.
* Check the previous analysis for any strange results. The checking procedure might find an error in the raw data and scripts which introduce a new fix into master analysis, or new understanding for science. 

It is unreproducible, time-consuming and even impossible to write RMarkdown file for each branching data analysis as 1) the modified or dropped input files, 2) the too big intermediate results, 3) lost tracks of R scripts, etc. Branching data analysis is very common for scientific research and non-linear procedure.

As the way of natural thinking, the feature of Tiddlywiki to [create missing tiddler](https://tiddlywiki.com/static/Creating%2520and%2520editing%2520tiddlers.html) is very easy to branch master data analysis without leaving current tiddler just through using two brackets (e.g. `[[New Idea]]`). Tiddlywiki shows a link to create new tiddler. 


There are two types of notes from data analysis using R: 1) notes from general data analysis. 2) final results with Rmarkdown.


### Notes from general data analysis

For a new branch of data analysis, I create a new tiddler to take notes. The main difficulty is to save images from RStudio `Plot Zoom` into file system and use in Tiddlywki. A hot key (e.g. `Win + F`) is defined in [Autohotkey](https://www.autohotkey.com/) to save images in `Plot Zoom` of RStudio, any `Save As` window, or take a screenshot for any active windows. Finally the `image macro` from [Shiraz Plugin](https://kookma.github.io/TW-Shiraz/) is copied into clipboard and is ready to paste into Tiddlywiki.

```

; Win + F
; Take a scrrenshoot and save to tiddlywiki folder and copy the img macro to clipboard
; RStudio Plot Zoom: Directly save images 
; Save As Window: Directly save images
; Any other windows: Take a screenshot, paste into MSPaint, and save images
#f::
SetKeyDelay, 20
sleep, 100

; If the active window has title "Plot Zoom" (i.e. RStudio Plot Zoom Window)
; Right click and save a new image
; Only works after resizing Plot Zoom Window
if (WinActive("Plot Zoom"))
{
	; Right Click at the left
	MouseRightClickFromLeft(50, 10)
	Sleep, 300
	; Down three times
	Loop, 3 {
	Send, {Down}
	Sleep, 300
	}	
	Send, {enter}
	Sleep, 2000
	
}
else if (WinActive("Save As") or WinActive("Save File")) 
{
; Nothing to do for save as window
}
else 
{
; For other active window. Take a screenshot with active window
	send {Alt Down}{PrintScreen}{Alt Up}
	sleep, 500
	run MSPaint
	Sleep, 1000
	Send, #{Up}
	Sleep, 500
	Mouseclick, left, 250, 250, 5
	Sleep, 200
	send ^v
	sleep, 500
	Send ^s
}

; Use current time as filename
FormatTime, time, A_now, yyyyMMddHHmmss
Sleep, 1000
Send %time%.png
Sleep, 500
Send ^l
Sleep, 200
; Save to tiddlyfolder
Send, C:\Users\zhe00a\OneDriveCSIRO\Working\09-Blog\tiddlywiki\files\images

Loop, 5 {
Send, {enter}
Sleep, 300
}

; Send to clipboard for the img macro
;img_macro = [img[./files/images/%time%.png]]
img_macro = <<image-basic "./files/images/%time%.png" caption:"" width:"95`%" align:"center">>

SetEnv ClipBoard, %img_macro%

return


```

### Final results with Rmarkdown

I have been writing lots of Rmarkdown files to generate reports from data analysis. However, these Rmarkdown are stored in the different folders and not organise in the proper way. I always have troubles to find the old results. It is useful to organize Rmarkdown output in one system. 

A new R package [rtiddlywiki](https://rtiddlywiki.bangyou.me/) is developed to generate Tiddlerwiki markdown format from Rmarkdwon files and `PUT` into Tiddlywiki (although only works for node.js web server at this stage). This package provides a new format `tiddle_document` with `tags` and `fields` used in Tiddlywiki, e.g.

```yaml
title: "R Markdown file"
output: 
  html_document: default
  rtiddlywiki::tiddler_document:
    path: "full-path-to-tiddlywiki-project"
    host: "http://127.0.0.1:8080/"
    tags: ["tag 1", "tag 2"]
    fields:
      "field1": "V1"
      "field 2": "Value 2"
```

This method allows me to save Rmarkdown output in the centralized places (i.e. Tiddlywki) 
and share with my colleagues.
 
