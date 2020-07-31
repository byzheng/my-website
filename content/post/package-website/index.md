---
title: Build and deploy website for R package 
authors: 
 - bangyou-zheng
date: '2020-07-31'
slug: package-website
categories:
  - software
tags:
  - R
---

After development a R package and push into github, I want to build a reference website, and automatically deploy it with my sub-domain.


## Setup pkgdown
[pkgdown](https://pkgdown.r-lib.org) is an very powerful tool to make it quick and easy to build a website for R package. 


```r
# Run once to configure your package to use pkgdown
usethis::use_pkgdown()

# Run to build the website
pkgdown::build_site()
```

## Setup the github actions

The example workflow can be found from [pkgdown repository](https://github.com/r-lib/pkgdown/tree/master/.github). Download all files into `.github` folder and modify as I need, e.g. add extra package for building. 

All changes are pushed into github and check workflows are passed.

## Setup the custom sub-domain

* Create DNS record with type `CNAME` and value `username.github.io`.
* Create a file `CNAME` (all upper case) under folder `.github`.
* Push the new change into github.
* Setup the custom domain under the `setting` of the repository. Wait a few minutes to allow github deploy and apply new settings.





