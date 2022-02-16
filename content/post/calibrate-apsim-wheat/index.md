---
title: Calibrate APSIM-Wheat model
authors: 
 - bangyou-zheng
date: '2022-02-16'
slug: calibrate-apsim-wheat
tags:
  - apsim
  - optimization
  - wheat
---

Calibration is a common task to use crop model (e.g. [APSIM](https://www.apsim.info/) to simulate field experiments. It is also tricky to pick up which parameters are used to optimize. This post summarised my experience to calibrate APSIM Wheat model in classic and next generation.

## Phenology

In general, phenology is the frist target to optimize as it is mainly impacted by temperature (earliness per se, vernalization) and day length.

### Emergence date

Emergence date is simulated by `shoot_rate` and `shoot_lag`. In a specific experiments, the emergence date is likely impacted by the local environments (e.g. temperature) and hardly to be calibrated for all experiments through adjusting `shoot_rate` and `shoot_lag`. The sowing date could be modified to suit emergence date.


*APSIM Classic*

| Name | Description | Default value | Range |
|------|-------------|---------------|-------|
|      |             |               |       |
|      |             |               |       |
|      |             |               |       |
