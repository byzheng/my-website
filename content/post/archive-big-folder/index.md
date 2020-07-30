---
title: Archive the big folder
authors: 
 - bangyou-zheng
date: '2020-07-27'
slug: archive-big-folder
draft: true
categories:
  - HTP
tags:
  - HTP
  - data
---


The test flight has 37, 010 files with 43.6 GB on disk and 12.8 GB file size in total.

System Linux with 125 GB memory. 

```
tar -cf flight1.tar flight1
```
file size 13 GB

```
real    9m56.301s
user    0m1.671s
sys     0m40.607s
```

```
 zip -r -0  Flight1-Visual.zip Flight1-Visual 2>&1 > /dev/null

file size 13 GB

real    8m6.047s
user    0m1.663s
sys     3m35.314s



real    7m49.845s
user    0m37.455s
sys     3m28.711s
```

## Delete the data

Thanks for the suggestions from [here](https://www.slashroot.in/which-is-the-fastest-method-to-delete-files-in-linux). The fastest way to delete folder with lots of files is `perl`. 

```
mkdir empty_dir
rsync -a --delete empty_dir/    yourdirectory/

cd yourdirectory
perl -e 'for(<*>){((stat)[9]<(unlink))}'
```