+++
authors = ["Bangyou Zheng", "Pengcheng Hu", "Scott Chapman"]
date = "2017-11-22"
image_preview = ""
math = false
publication_types = ["1"]
publication = ""
publication_short = "International Tropcal Agriculture Conference 2017"
selected = false
title = "PhenoCopter: An cloud based platform to manage, process and visualize images captured by unmanned aerial vehicle for high throughput phenotyping"
tags = ["HTP", "UAV", "image"]
projects = ["2016-csc-htp"]

url_code = ""
url_dataset = ""
url_pdf = ""
url_project = ""
url_slides = ""
url_video = ""

abstract_short = ""
abstract = "As the advances of technologies, unmanned aerial vehicles (UAV) are more convenient to capture images in large scale to extract crop phenotypes. However, the key challenge is how to efficiently manage all meta information, process huge amount of images and visualize intermediate outputs and final phenotype. A cloud based platform, PhenoCopter, is develop to deal with the challenge of data processing. The pipeline separates into several steps: collecting meta information, geo-tagging and checking raw images, reconstructing and tiling ortho-mosaic, segmenting mosaic into individual plots, extracting plot phenotyping. A database is used to store all meta information and status of data processing. Images, intermediate outputs and final phenotypes are stored in the CSIRO cloud based storage.  A web interface is built to visualize raw images and ortho-mosaic. The pipeline is also implemented to allow users to active next step and redo any previous steps. For plot segmentation, the experiment design is assumed as the rectangle block. Users only needs to click the four corners of a block and input several parameters including number of row and column, trims in the four edges. Several servers are involved in the platform including a MySQL server for database, an Apache server for web interface and user interaction, a Pix4D server for image reconstruction, a GeoServer for ortho-mosaic, a high performance computing server for phenotyping extraction. The six demo flights can be found in http://phenocopter.csiro.au. We expect to provide a useful tool for researchers and breeders to easily utilize UAV technologies into their researches."


# Optional featured image (relative to `static/img/` folder).
[header]
image = ""
caption = ""

+++
