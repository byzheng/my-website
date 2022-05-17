---
title: "Using Tiddlywiki for project management and data analysis"
authors: 
 - bangyou-zheng
date: '2022-05-17'
slug: tiddlywiki
draft: true
tags:
  - tiddlywiki
  - R
---


I have been looking for a simple and flexible tool to manage projects, take notes from reading (e.g. literature and online), and track results of data analysis, e.g. EverNote, OneNote, Trac, JIRA, github, RMarkdown, etc. The tools are designed to develop software, but too complicated for daily usages of project management and data analysis. Recently, [Tiddlywiki](https://tiddlywiki.com/) and [Projectify](https://thaddeusjiang.github.io/Projectify/) pops up from random goggling. [Tiddlywiki](https://tiddlywiki.com/) is a non-linear notebook for storing information. I found it is very useful and simple to manage my research projects and take notes of data analysis as a data scientist and digital agronomist. 



## Data analysis

[R](https://www.r-project.org/) is the major programming language for data analysis. [RMarkdown](https://rmarkdown.rstudio.com/) has been using for long period to document the data analysis and share outputs with my colleagues. [RMarkdown] documents provide powerful features to reproduce outputs of data analysis and very suitable to generate final outputs, which can be treated as a linear procedure from raw data to output. As a data scientist, however, I often branch data analysis to 

* Get new data from my own experiments or other colleagues. The new data require for quality checking and might or might not be useful for further analysis.
* Test new ideas from the current analysis (branch from master analysis). The new ideas might be brilliant and merge into master analysis, or might be rubbish.
* Check the previous analysis for any strange results. The checking procedure might find an error in the raw data and scripts which introduce a new fix into master analysis, or new understanding for science. 

It is unreproducible, time-consuming and even impossible to write RMarkdown file for each branching data analysis as 1) the modified or dropped input files, 2) the too big intermediate results, 3) lost tracks of R scripts, etc. Branching data analysis is very common for scientific research and non-linear procedure.






 

<!--

## Stick a tiddler for daily logs at the top

I like to write a daily log for what I did for each day and stick on the top of page.

* Create a tiddler with title `StickyTiddler`.
* Add tag `$:/tags/AboveStory`.
* In that tiddler's text field, enter:

```
<$tiddler tiddler=<<now "DDth MMM YYYY">> >
     <$transclude tiddler="$:/core/ui/ViewTemplate"/>
</$tiddler>
```

The sticky tiddler show the daily journal tiddler with title which has format as DDth MMM YYYY (e.g. 16th February 2022).

-->


