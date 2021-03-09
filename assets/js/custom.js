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