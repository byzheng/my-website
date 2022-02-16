---
title: TiddlyWIKI
authors: 
 - bangyou-zheng
date: '2022-02-16'
slug: tiddlywiki
tags:
  - tiddlywiki
---

[Tiddlywiki](https://tiddlywiki.com/) is a non-linear notebook for storing information. I found it is very useful and simple to take notes of my daily work and any thoughts. This post summarized tips I used in TiddlyWIKI.

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




