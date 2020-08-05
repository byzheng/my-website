---
title: Archive the big folder
authors: 
 - bangyou-zheng
date: '2020-08-05'
slug: archive-big-folder
draft: false
categories:
  - HTP
tags:
  - HTP
  - data
---

In the [PhenoCopter](https://phenocopter.bangyou.me) platform, I have to deal with the limited space in the storage of our data center. The practical solution is to archive  old flights into tape and current flights in the active storage.

The challenge for UAV data is mixed by smaller and bigger files (mainly images). The test flight has 37, 010 files with 43.6 GB on disk and 12.8 GB file size in total.

## Create archive file

I tested the `tar` and `zip` format to archive all files into a single file which is eacy to transfer between storage. 

```
tar -cf flight1.tar flight1
```

The `tar` command took about 8m to generate 13 GB file. 

```
 zip -r -0  Flight1-Visual.zip Flight1-Visual 2>&1 > /dev/null
```


The `zip` command took the similar time of `tar` command and generate the file with similar size.


## Delete the data

The next challenge is to delete all files in the original storage. Thanks for the suggestions from [here](https://www.slashroot.in/which-is-the-fastest-method-to-delete-files-in-linux). The fastest way to delete folder with lots of files is `rsync` or `perl`. 

```
mkdir empty_dir
rsync -a --delete empty_dir/    yourdirectory/

cd yourdirectory
perl -e 'for(<*>){((stat)[9]<(unlink))}'
```
