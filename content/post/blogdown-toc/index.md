---
title: JS updates position of TOC for Rmarkdown file in blogdown
authors: 
 - bangyou-zheng
date: '2020-09-02'
slug: blogdown-toc
categories:
  - R
tags:
  - R
  - blogdown
  - js
---

The TOC is rendered underneath when using [blogdown 0.20](https://cran.r-project.org/web/packages/blogdown/index.html) to write Rmarkdown file.

{{< figure src="blogdown-toc.png" title="" width="50%" lightbox="true" numbered="false" >}}

However, the current version of hugo [academic theme](https://github.com/gcushen/hugo-academic/tree/6f36c1624c2f63333a2d912963fa13f91e78782b) is rendered TOC at the right hand side and always keep on the screen which would be more useful. 

{{< figure src="hugo-toc.png" title="" width="100%" lightbox="true" numbered="false" >}}

A simple solution is to adjust the position of TOC using js.

* Update `plugins_js` in the configuration file `config\_default\params.toml` into `plugins_js  = [custom]`.
* Create a `custom.js` under `\assets\js\` folder. 
* Add the js script below into custom.js.


```js
$(document).ready(function(){
	
	// Find TOC
	var toc = $("#TOC");
	if (toc.length === 0) {
	  return;
	}

	// Find sidebar
	var sidebar = $("div.flex-xl-nowrap>div.docs-toc")
	if (sidebar.length !== 1) {
	   return;
	}
	sidebar.append(toc.html());
	// Add new class
	$(sidebar).find("li").addClass("nav-item");
	$(sidebar).find("li.a").addClass("nav-link");
	toc.html("")
});
```

