$(document).ready(function(){
	
	// Find TOC
	var toc = $("#TOC");
	if (toc.length === 0) {
	  return;
	}

	// Find sidebar
	var sidebar = $("div.flex-xl-nowrap")
	if (sidebar.length !== 1) {
	   return;
	}
	// Generate html
	var html = '<div class="d-none d-xl-block col-xl-2 docs-toc">' + 
	'<ul class="nav toc-top"><li><a href="#" id="back_to_top" class="docs-toc-title">Contents</a></li></ul>' +
	'<nav id="TableOfContents" class="nav flex-column">' + 
	toc.html() +
	'</nav></div>';
	sidebar.append(html);
	// Add new class
	$(sidebar).find("li").addClass("nav-item");
	$(sidebar).find("li.a").addClass("nav-link");
	toc.html("")
});