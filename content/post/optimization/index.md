---
title: Optimization of APSIM NG using factorial simulations
authors: 
- bangyou-zheng
date: '2021-03-08'
output:
  blogdown::html_page:
    toc: true
slug: optimization-apsimng
toc: true
tags:
  - apsim
  - optimization
---

Optimization of parameter values in the crop model is the key step to utilise models to simulate the field experiments. However, it is time consuming to calibrate lots of cultivars using observations from multiple experiments.

In this page, I presented a method using factorial simulations to calibrate and validate the leaf appearance process for wheat validation set in the [APSIM Next Generation](https://github.com/APSIMInitiative/ApsimX/). All 77 cultivars are simultaneously calibrated and validated in this process. The method heavily depends on the available CPU resources and infrastructure of cluster which might not be suitable for every situation. The codes in this page might not be reproducible.

The method of factorial simulations can be separated into multiple steps including

-   Split apsimx into individual simulations for each treatment except cultivar factor.
-   Generate parameter spaces and prepare task list for parallel calculation.
-   Run tasks using cluster to obtain simulated values for factorial simulations.
-   Merge simulated values of all treatments for the target cultivars.
-   Calibrate and validate the leaf appearance process through comparing simulated and observed values.

``` r
# Load the required packages
suppressPackageStartupMessages(library(rapsimng))
suppressPackageStartupMessages(library(tidyverse))
```

## Split apsimx into individual simulations

Multiple experiments are used to test a crop model and organise into an apsimx file. It takes very long time to run a single apsimx file with lots of simulations (e.g. wheat.apsimx in the release contains more than 4000 simulations and takes more than 20 min to run all simulations). As we will run simulations in the parallel using multiple cores, the best practice is to split apsimx files into individual simulations.

The cultivars will be replaced with virtual cultivars (i.e. new values in the parameter spaces). The real cultivars in the experiment can be ignored. Consequently, we only need to run simulations for all treatments except cultivars.

In this step, I assume all datasets have been configured in a single apsimx file (e.g. [Wheat.apsimx](https://raw.githubusercontent.com/APSIMInitiative/ApsimX/2a82f22208e1a9bd3d25b501457b43e507411b65/Tests/Validation/Wheat/Wheat.apsimx) in the APSIM NG Release). Experiments contain a factor Cv or Cultivar to specify all cultivars in the field experiments. All files are downloaded from internet.

The input is the wheatp.apsimx and associated weather files. The output is the split apsimx files merged with weather files and stored as Rds format.

APSIM NG provides a feature to generate .apsimx files from a single .apsim file through right clicking the root node.

<img src="apsimng-generate-simulations.png" width="40%" style="display: block; margin: auto;" />

``` r
# Path to wheat.apsimx file
file <- "Tests/Validation/Wheat/Wheat.apsimx"
# Path to store the individual apsimx files
out <- "Simulations/"
# Factor in apsimx to specify cultivars
cultivar_factor <- c("Cv", "Cultivar")

# read apsimx file
apsimx_model <- read_apsimx(file)

# Create a template
apsimx_model_temp <- apsimx_model
# Remove unused models to save spaces
remove_nodes <- c("[Simulations].Sensibility",
                  "[Simulations].Validation",
                  "[Simulations].TitlePage",
                  "[Simulations].Introduction",
                  "[DataStore].ExcelMultiInput",
                  "[DataStore].DailyObsPred",
                  "[DataStore].HarvestObsPred")
for (j in seq(along = remove_nodes)) {
  node_remove <- search_path(apsimx_model_temp, remove_nodes[j])
  if (length(node_remove) > 0) {
    apsimx_model_temp <- remove_model(apsimx_model_temp, node_remove$path)
  }
}

# Get all simulations
sims <- search_node(apsimx_model, all = TRUE, `$type` = "Models.Core.Simulation, Models")
sims <- sims %>% discard(function(x) x$node$Name == "CO2TEBaseSimulation")
print(map_chr(sims, function(x) x$node$Name))

# Process each simulation by splitting into individual treatment if parent is Experiment or directly exporting in case of single simulation.
for (j in seq(along = sims)) {
  # Check whether the parent is experiment
  parent <- get_parent(apsimx_model, sims[[j]]$path)
  if (parent$node$`$type` == "Models.Factorial.Experiment, Models") {
    exp_node <- parent$node
    exp_name <- exp_node$Name
    # Remove all figures as we don't need them
    graphs <- search_node(exp_node, all = TRUE, 
                          `$type` = "Models.Graph, Models")
    for (k in rev(seq(along = graphs))) {
      exp_node <- remove_model(exp_node, graphs[[k]]$path)
    }
    # Remove unused reports
    remove_nodes <- c("[DailyReport]",
                      "[MaxLeafSizeReport]",
                      "[SowingReport]")
    for (k in seq(along = remove_nodes)) {
      node_remove <- search_path(exp_node, remove_nodes[k])
      if (length(node_remove) > 0) {
        exp_node <- remove_model(exp_node, node_remove$path)
      }
    }
    # Create a new apsimx file from template
    apsimx_model_exp <- apsimx_model_temp
    apsimx_model_exp <- insert_model(apsimx_model_exp, c(1), exp_node)
    # Get the met files
    met <- NULL
    met_file <- NULL
    tryCatch({
      met_file <- get_metfile(apsimx_model_exp)
      met_path <- file.path(dirname(file), met_file)
      met <- readLines(met_path)
    }, error = function(e){
      
    })
    # Further split apsimx by all factors except Cv
    all_nodes <- apsimx_model_exp %>% 
      search_path("[Factors]")
    
    # find out all combinations of all other nodes
    simulations <- get_simulations(all_nodes$node)
    
    # Check whether Cv node exists
    pos <- names(simulations) %in% cultivar_factor
    if (sum(pos) == 0) {
      warning("Cultivar factor doesn't exist for experiment ", exp_name)
      #next()
    }
    # Generate all simulations for factors except cultivar
    simulations <- simulations[!(names(simulations) %in% cultivar_factor)]
    simulations <- expand.grid(simulations, stringsAsFactors = FALSE)
    # Generate apsimx for each factor
    for (m in seq_len(max(1, nrow(simulations)))) {
      # In case of single simulation
      if (nrow(simulations) == 0) {
        model_factor_new <- all_nodes$node
        base_name <- exp_name
      } else {
        # Keep the required factor
        model_factor_new <- keep_simulations(all_nodes$node, as.list(simulations[m,,drop=FALSE]))
        factor_name <- paste(paste0(names(simulations), "_", simulations[m,]), collapse = '_')
        base_name <- paste0(exp_name, "-", factor_name)
      }
      # Generate a new apsimx
      apsimx_model_new <- apsimx_model_exp
      apsimx_model_new <- replace_model(apsimx_model_exp, 
                                        all_nodes$path,
                                        model_factor_new)
      
      # Combine weather and met file
      #apsimx <- readLines(file_name)
      file_name <- file.path(out, paste0(base_name, ".Rds"))
      # Find the weather file
      if (is.null(met)) {
        treat_node <- search_path(apsimx_model_new, "[Permutation].Treat")
        if (length(treat_node) > 0) {
          if (length(treat_node$node$Children) > 1 ){
            stop()
          }
          if (length(treat_node$node$Children[[1]]$Children) > 0) {
            met_file <- treat_node$node$Children[[1]]$Children[[1]]$FileName
            met_path <- file.path(dirname(file), met_file)
            new_met <- readLines(met_path)
          } else {
            new_met <- NULL
          }
        }
      } else {
        new_met <- met
      }
      # Save weather and apsimx file into Rds format
      saveRDS(list(met = new_met, apsimx = apsimx_model_new, met_file = met_file), file = file_name)
    }
  } else {
    # In case of single simulation
    apsimx_model_new <- apsimx_model_temp
    apsimx_model_new <- insert_model(apsimx_model_new, c(1), sims[[j]]$node)
    
    # Get weather data
    met <- NULL
    met_file <- NULL
    tryCatch({
      met_file <- get_metfile(apsimx_model_new)
      met_path <- file.path(dirname(file), met_file)
      met <- readLines(met_path)
    }, error = function(e){
      
    })
    
    # Save weather and apsimx file into Rds format
    base_name <- sims[[j]]$node$Name
    file_name <- file.path(out, paste0(base_name, ".Rds"))
    saveRDS(list(met = met, apsimx = apsimx_model_new, met_file = met_file), file = file_name)
    
  }
}
```

Finally wheat.apsimx is split into 885 treatments.

## Generate the parameter spaces and prepare the task list for parallel calculation

In this page, we will optimize two parameters in the leaf appearance rate i.e. base phyllochron (`[Phenology].Phyllochron.BasePhyllochron.FixedValue`) and photoperiod effect (`[Phenology].Phyllochron.PhotoPeriodEffect.XYPairs.Y`). The parameter range is determined by expert experience or possible values in the current wheat model. The internal should make sure there are enough accuracy for the target traits.

``` r
# Define list of parameter with specified range and interval
# Expand grid for all combinations
parameters <- list(`[Phenology].Phyllochron.BasePhyllochron.FixedValue` = as.character(seq(60, 130, by = 1)),
          `[Phenology].Phyllochron.PhotoPeriodEffect.XYPairs.Y` = paste0(seq(1, 2, by = 0.02), ",1,1")) %>% 
    expand.grid()
```

A single simulation takes less than 1 s to run in the APSIM GUI (APSIMNG.exe), but about 5 s in the command lines (Modeles.exe) as the overhead to load all required libraries. It would be much more efficient to combine multiple simulations in a single apsimx file (e.g. 200 simulations take about 150 s).

``` r
# Define the group size in a single apsimx file
size <- 200

# Calculate the number of groups
group <- seq(1, ceiling(nrow(parameters)/size))

# Create names for each virtual cultivar
# Assign the group value
parameters <- parameters %>% 
  mutate(name = paste0("GS", seq_len(n()), "GN"),
         group = rep(group, each = size , 
                      length.out = n())) %>% 
  pivot_longer(cols = starts_with("["), names_to = "parameter") 

# The parameters can be stored for later use, but ignore for this post
# saveRDS(parameters, file = "parameters.Rds)
knitr::kable(head(parameters), caption = "Sample of parameters")
```

| name  | group | parameter                                             | value |
|:------|------:|:------------------------------------------------------|:------|
| GS1GN |     1 | \[Phenology\].Phyllochron.BasePhyllochron.FixedValue  | 60    |
| GS1GN |     1 | \[Phenology\].Phyllochron.PhotoPeriodEffect.XYPairs.Y | 1,1,1 |
| GS2GN |     1 | \[Phenology\].Phyllochron.BasePhyllochron.FixedValue  | 61    |
| GS2GN |     1 | \[Phenology\].Phyllochron.PhotoPeriodEffect.XYPairs.Y | 1,1,1 |
| GS3GN |     1 | \[Phenology\].Phyllochron.BasePhyllochron.FixedValue  | 62    |
| GS3GN |     1 | \[Phenology\].Phyllochron.PhotoPeriodEffect.XYPairs.Y | 1,1,1 |

Table 1: Sample of parameters

## Run all tasks in cluster to collect results

This step is time-consuming and depends on the available CPUs. The total runtime can be calculated by number of treatments x number of virtual genotype groups x runtime of individual task / available CPUs. I used HTCondor deployed in CSIRO in which there are more 10, 000 available cores, but can normally utilize 5, 000 cores. The inputs below can be used to calculate the total runtime.

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>

<div class="input-group input-group-sm mb-3">
  <div class="input-group-prepend col-5">
    <span class="input-group-text col-12">Number of treatments</span>
  </div>
  <input name="total-run-time" type="text" id="treatments" value=885 class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
</div>
<div class="input-group input-group-sm mb-3">
  <div class="input-group-prepend col-5">
    <span class="input-group-text col-12">Number of genotype groups</span>
  </div>
  <input name="total-run-time" type="text" id="genotype-groups" value=37 class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
</div>
<div class="input-group input-group-sm mb-3">
  <div class="input-group-prepend col-5">
    <span class="input-group-text col-12">Runtime of individual task</span>
  </div>
  <input name="total-run-time" type="text" id="runtime-individual" value=150 class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
  <div class="input-group-append">
    <span class="input-group-text">seconds</span>
  </div>
</div>
<div class="input-group input-group-sm mb-3">
  <div class="input-group-prepend col-5">
    <span class="input-group-text col-12">Available CPUs</span>
  </div>
  <input name="total-run-time" type="text" id="cpus" value=5000 class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
</div>
<div class="input-group input-group-sm mb-3">
  <div class="input-group-prepend col-5">
    <span class="input-group-text col-12">Total runtime</span>
  </div>
  <input name="total-run-time" type="text" id="final-runtime" class="form-control" aria-label="Small" disabled aria-describedby="inputGroup-sizing-sm">
   <div class="input-group-append">
    <span class="input-group-text">hours</span>
  </div>
</div>

<script type="text/javascript">
$( document ).ready(function() {
  var cal_runtime = function() {
    let n_treatments = parseFloat($("#treatments").val());
    let n_genotype_group = parseFloat($("#genotype-groups").val());
    let individual_runtime = parseFloat($("#runtime-individual").val());
    let n_cpus = parseFloat($("#cpus").val());
    let final_runtime = n_treatments * n_genotype_group * individual_runtime / n_cpus / 3600;
    $("#final-runtime").val(final_runtime);
  }
  cal_runtime();
  $("input[name='total-run-time']").change(function() {
      cal_runtime();
  });
});
</script>

Scheduling task on the cluster (parallel computing) is out of the topic in this page. The total number of tasks equals the number of treatments x number of genotype groups. In general, all tasks can be treated as embarrassingly parallel (i.e. no interaction among tasks). The output of individual task can be saved in a single file. In the following section, R scripts are developed to run a task on HTCondor and can be modified to adapt to other types of cluters.

### Develop scripts to run individual task on HTCondor

HTCondor is configured to use all desktops when they are idle in CSIRO. Each task is independently run in the remote computer. My setup of HTCondor passes two parameters for each task (i.e. title of simulation and output file name). The scripts below are developed used basic R functions to reduce the file size when R transfers to remote computers.

There are many ways to setup how to sow a cultivar in APSIM NG, so that it is not easy to create a new factor Cultivar for any simualtions. Alternatively, we add a whole wheat model under paddock or field and replace the default parameter values in the model.

``` r
# Run jobs under condor -----------------------------------
# For test purpose only
sim_title <- 'group=1,Experiment=APS2-TOS_1'
file_prefix <- '375e780cabcc4bb7f00f5a9887faa9c8'

# arguments from the task
args <- commandArgs(TRUE)
sim_title <- args[[1]]
file_prefix <- args[[2]]

# Load required packages
library(methods)
# rapsimng depends on tidyverse package which has lots of other dependencey. A few basic functions are used in the scripts, so all source codes of rapsimng package is passed to HTCondor
path <- c("r-packages/rapsimng/R/")
files <- lapply(path, list.files, full.names = TRUE)
files <- unlist(files)
invisible(lapply(files, source))

# Read the parameter file generated before
parameters <- readRDS("parameters.rds")

splitTitle <- function (title, split = ",")  {
    temp <- strsplit(title, paste0(" *", split, " *"))[[1]]
    temp <- strsplit(temp, " *= *")
    temp <- as.data.frame(t(as.data.frame(temp)))
    row.names(temp) <- seq(length = nrow(temp))
    names(temp) <- c("name", "value")
    res <- as.character(temp$value)
    names(res) <- as.character(temp$name)
    res <- as.data.frame(t(as.data.frame(res)))
    for (i in seq(ncol(res))) {
        res[[i]] <- as.character(res[[i]])
    }
    return(res)
}

# Split the simulation title
sim_factors <- splitTitle(sim_title)
# Get the parameter for this task
group_idx <- as.numeric(sim_factors$group)
parameters <- parameters[parameters$group == group_idx,]

# List of new cultivars
new_cultivars <- unique(parameters$name)

# Get the experimetn name
filename <- sim_factors$Experiment
# Read the combined apsimx and met file which generated before
input <- readRDS(paste0(filename, '.Rds'))
sim_name <- paste0(filename, '.apsimx')
sim_name <- paste0(file_prefix, '.apsimx')

# Create a new apsimx file to store all virtual genotypes
apsimx_all <- input$apsimx
# remove experiment or simulation node for an empty apsimx. 
exp_node <- search_node(apsimx_all, `$type` = "Models.Factorial.Experiment, Models")
if (length(exp_node) > 0) {
    apsimx_all <- remove_model(apsimx_all, exp_node$path)
} else {
    sim_node <- search_node(apsimx_all, `$type` = "Models.Core.Simulation, Models")
    if (length(sim_node) > 0) {
        apsimx_all <- remove_model(apsimx_all, sim_node$path)
    }
}
# Remove the unused replacements in the wheat.apsimx
remove_nodes <- c("[Replacements].HarvestReport",
                  "[Replacements].MaxLeafSize",
                  "[Replacements].MaxLeafSizeReport",
                  "[Replacements].SowingReport",
                  "[Replacements].DailyReport")
for (j in seq(along = remove_nodes)) {
    node_remove <- search_path(apsimx_all, remove_nodes[j])
    if (length(node_remove) > 0) {
        apsimx_all <- remove_model(apsimx_all, node_remove$path)
    }
}

# Create a new apsimx file for each virtual genotype
i <- 1
start <- proc.time()
for (i in seq(along = new_cultivars)) {
    # Get from template
    apsimx <- input$apsimx
    
    # Replace the wheat plant with wheat.json
    wheat_model <- read_apsimx("Wheat.json")
    wheat_model <- search_path(wheat_model, "[Wheat]")
    wheat_node <- search_node(apsimx, `$type` = "Models.PMF.Plant, Models",
                              ResourceName = "Wheat",
                              Name = "Wheat")
    apsimx <- replace_model(apsimx, wheat_node$path, wheat_model$node)

    
    # Clean parameters in cultivars as we will use the default parameter values
    cultivars_node <- search_path(apsimx, "[Cultivars]")
    cultivars <- search_node(apsimx, `$type` = "Models.PMF.Cultivar, Models", all = TRUE)
    
    for (j in seq(along = cultivars)) {
        cultivars[[j]]$node$Command <- list()
        apsimx <- replace_model(apsimx, cultivars[[j]]$path, cultivars[[j]]$node)
    }
    
    
    # Remove extra levels in the Cv or Cultivar factor to use only one cultivar
    cv_node <- search_path(apsimx, "[Permutation].Cv")
    if (length(cv_node) == 0) {
        cv_node <- search_path(apsimx, "[Factors].Cultivar")
        if (length(cv_node) == 0) {
            
            cv_node <- search_path(apsimx, "[Factors].Permutation.Cultivar")
        }
    }
    # Use hartog as the template cultivar
    cultivars_tmp <- "hartog"
    if (length(cv_node) > 0) {
        
        old_spec <- cv_node$node$Specification
        if (grepl("^(.+ *= *)(.+)", old_spec)) {
            new_spec <- gsub("^(.+ *= *)(.+)", paste0("\\1", paste(cultivars_tmp, collapse = ", ")), 
                             old_spec)
            cv_node$node$Specification <- new_spec
        } else if (length(cv_node$node$Children) > 0){
            # Assume the similar operations
            old_opt <- cv_node$node$Children[[1]]
            new_opts <- list()
            j <- 1
            for (j in seq(along = cultivars_tmp)) {
                new_opt <- old_opt
                new_opt$Name <- cultivars_tmp[j]
                k <- 1
                for (k in seq(along = new_opt$Operation)) {
                    if (grepl('^.+cultivar:"([a-zA-Z_]+)".+$', new_opt$Operation[[k]]$Action)) {
                        new_opt$Operation[[k]]$Action <- gsub('^(.+cultivar:")([a-zA-Z_]+)(".+)$', 
                                                              paste0("\\1", cultivars_tmp[j], "\\3"), new_opt$Operation[[k]]$Action)
                    }
                }
                new_opts[[j]] <- new_opt
            }
            cv_node$node$Children <- new_opts
        }
        apsimx <- replace_model(apsimx, cv_node$path, cv_node$node) 
    }
    # Replace default parameter values
    parameters_i <- parameters[parameters$name %in% new_cultivars[i],]
    for (j in seq(along = parameters_i[[1]])) {
        apsimx <- set_parameter_value(apsimx, parameters_i$parameter[j], parameters_i$value[j])
    }
    
    # Remove all old report
    reports_node <- rev(search_node(apsimx, `$type` = "Models.Report, Models", all = TRUE))

    for (j in seq(along = reports_node)) {
        apsimx <- remove_model(apsimx, reports_node[[j]]$path)
    }
    # Remove max leaf size: A bug in the current APSIM NG
    reports_node <- rev(search_node(apsimx, `$type` = "Models.Manager, Models", 
                                    Name = "MaxLeafSize",
                                    all = TRUE))
    
    for (j in seq(along = reports_node)) {
        apsimx <- remove_model(apsimx, reports_node[[j]]$path)
    }
    
    # Add a new daily report
    new_daily <- read_apsimx("report_daily.json")
    harvest_report_node <- search_node(apsimx,  `$type`= "Models.Core.Zone, Models")
    if (length(harvest_report_node) > 0) {
        apsimx <- insert_model(apsimx, harvest_report_node$path, new_daily)
    }
    
    # Change experiment and simulation name
    sim_node <- search_node(apsimx, `$type` = "Models.Core.Simulation, Models")
    sim_node$node$Name <- paste0(new_cultivars[i], "Base")
    apsimx <- replace_model(apsimx, sim_node$path, sim_node$node)
    exp_node <- search_node(apsimx, `$type` = "Models.Factorial.Experiment, Models")
    # Add new apsimx into the whole apsimx file.
    if (length(exp_node) > 0) {
        exp_node$node$Name <- new_cultivars[i]
        apsimx_all <- append_model(apsimx_all, 1, list(exp_node$node))
    } else {
        apsimx_all <- append_model(apsimx_all, 1, list(sim_node$node))
    }
    
}

print(proc.time() - start)
# Remove the old files 
old_files <- paste0(file_prefix, 
                    c(".db", ".apsimx.bak",
                      ".DailyReport.csv",
                      ".HarvestReport.csv", 
                      ".apsimx", ".Rds"))
a <- file.remove(old_files[file.exists(old_files)])

# Write new apsimx into disk
system.time(write_apsimx(apsimx_all, sim_name))

# Write weather file if exists
if (!is.null(input$met)) {
    input$met <- input$met[!grepl("Powered", input$met)]
    writeLines(input$met, input$met_file)
}

# Run apsimx file
models_path <- "apsimx/Models.exe"
system.time(run_models(models_path, sim_name, csv = TRUE, parallel = FALSE))

# Read output
file <- list.files(".", paste0(file_prefix, "\\.DailyReport\\.csv"))
if (length(file) != 1) {
    tmp <- rep(NA, length(new_cultivars))
    out <- data.frame(name = new_cultivars, 
                      Clock.Today = tmp,
                      Wheat.Leaf.AppearedCohortNo = tmp,
                      Wheat.Phenology.HaunStage = tmp,
                      Wheat.Structure.LeafTipsAppeared = tmp)
} else {
    out <- read.csv(file)
    out$name <- gsub("^ *(GS\\d+GN).*", "\\1", out$SimulationName)
    #out$name <- new_cultivars[i]
    out <- out[out$Wheat.Phenology.HaunStage <= 8 & out$Wheat.Phenology.HaunStage > 0 &
                   out$Wheat.Phenology.Stage <= 6.2,]
    out <- out[,c( 
        "name",
        "Clock.Today",
        "Wheat.Leaf.AppearedCohortNo",
        "Wheat.Phenology.HaunStage",
        "Wheat.Structure.LeafTipsAppeared"
    )]
    out$Clock.Today <- as.Date(out$Clock.Today)
}

# Add experiment for post processing
out$Experiment <- sim_factors$Experiment
# Save the result
saveRDS(out, file=sprintf('%s.Rds', file_prefix))
```

Outputs for all tasks are stored in to shared drive.

It is not necessary to use parallel codes in the following steps, but parallel calculation does improve performance. `run_parallel` is a wrap function to run a fun in parallel in different platform.

``` r
run_parallel <- function (x, fun, cpus = parallel::detectCores() - 1, ...) 
{
    cl <- snow::getMPIcluster()
    args = commandArgs(trailingOnly = TRUE)
    if (!is.null(cl)) {
        r <- snow::parLapply(cl, x, fun, ...)
    }
    else if (length(args) > 0) {
        idx <- as.numeric(args[1])
        if (idx <= length(x)) {
            fun(idx, ...)
        }
        r <- NULL
    }
    else {
        library(snowfall)
        sfInit(cpus = cpus, parallel = TRUE, slaveOutfile = "tmp.txt")
        r <- sfLapply(x, fun, ...)
        sfStop()
    }
    r
}
```

## Merge simulated values of all treatments for the target cultivars.

All outputs in previous are merged into a single file for each cultivar for optimization.

In step 1, all groups of virtual genotypes in each treatment are merged into individual file (fst format is used).

``` r
# All apsimx files (experiment) generated before
experiments <- list.files("Simulations/", full.names = TRUE)

# Output folder for this step
out_folder <- "Experiment/"
if (!dir.exists(out_folder)) {
  dir.create(out_folder, recursive = TRUE)
}

base <- "path-to-htcondor-output"
i <- 1
par_merge <- function(i, experiments, base, out_folder) {
  out_file <- paste0(out_folder, experiments[i], ".fst") 
  if (file.exists(out_file)) {
    return(invisible(NULL))
  }
  library(tidyverse)
  files <- file.path(base, experiments[i]) %>% 
    list.files(full.names = TRUE)  
  res <- list()
  for (j in seq(along = files)) {
    tryCatch({
      r <- readRDS(files[j])
      r$Clock.Today <- as.Date(r$Clock.Today)
      res[[j]] <- r
    }, error = function(e) {
      file.remove(files[i])
    })
  }
  res <- bind_rows(res)
  out_file %>% 
    fst::write_fst(res, .)
  return(invisible())
}

run_parallel(seq(along = experiments), par_merge, experiments = experiments, base = base, out_folder = out_folder)
```

In step 2, all treatments for each cultivar is further merged into individual file. The observations can be red from wheat.db file after running wheat.apsimx

``` r

# It takes some times to read the big database so it would be better to save results in a Rds file and read it later. 
read_obs <- function(npi = TRUE) {
  file <- "Wheat.db"
  con <- dbConnect(RSQLite::SQLite(), file)
  simulations <- dbReadTable(con, "_Simulations") %>% tibble()
  sowing_report <- dbReadTable(con, "SowingReport") %>% tibble()
  factors <- dbReadTable(con, "_Factors")
  daily_report <- dbReadTable(con, "DailyObsPred") %>% tibble()
  dbDisconnect(con)
  
  daily_report <- daily_report %>% 
    select(SimulationID,
           Clock.Today, 
           Observed.Wheat.Leaf.AppearedCohortNo,
           Predicted.Wheat.Leaf.AppearedCohortNo,
           Predicted.Wheat.Phenology.HaunStage,
           Observed.Wheat.Phenology.HaunStage,
           Observed.Wheat.Structure.LeafTipsAppeared,
           Predicted.Wheat.Structure.LeafTipsAppeared)
  daily_report <- daily_report %>% 
      pivot_longer(cols = c(starts_with("Observed"), starts_with("Predicted"))) %>% 
    filter(!is.na(value)) %>% 
    mutate(type = gsub("^(Observed|Predicted)\\..+$", "\\1", name),
           trait = gsub("^(Observed|Predicted)\\.(.+)$", "\\2", name)) %>% 
    select(-name) %>% 
    group_by(SimulationID, Clock.Today, type, trait) %>% 
    mutate(sample = seq_len(n())) %>% 
    pivot_wider(names_from = "type",
                values_from = "value") %>% 
    filter(!is.na(Observed))

  obs <- sowing_report %>%
    select(SimulationID, Genotype = Wheat.SowingData.Cultivar) %>%
    left_join(simulations,
              by = c("SimulationID" = "ID")) %>%
    mutate(Genotype = tolower(Genotype)) %>%
    tbl_df() %>%
    right_join(daily_report %>% tbl_df(), by = "SimulationID") %>% 
    left_join(factors %>% tbl_df() %>%
                select(-FolderName, -CheckpointID) %>%  
                distinct(), by = "SimulationID")
    obs <- obs %>% 
        filter(Genotype %in% cultivars$Name) %>% 
        group_by(SimulationID, Genotype, Name, FolderName, Clock.Today,
                 trait, ExperimentName, FactorName, FactorValue) %>% 
        summarise(Observed = mean(Observed),
                  Predicted = mean(Predicted), .groups = "drop") %>% 
        mutate(Clock.Today = as.Date(as.numeric(as.Date(Clock.Today)), origin = "1970-1-1"))
    obs
}
```

``` r
# Read observations for list of genotype
obs <- read_obs()
genotypes <- tolower(unique(obs$Genotype)) %>% sort()
# output folder for this step
out_folder <- "Genotype/"
if (!dir.exists(out_folder)) {
  dir.create(out_folder, recursive = TRUE)
}
i <- 1
par_merge <- function(i, genotypes, obs, out_folder) {
  library(tidyverse)
  library(rapsimng)
  # Check whether output file exists
  out_file <- paste0(out_folder, genotypes[i], '.fst')
  if (file.exists(out_file)) {
    return(invisible())
  }
  # Get the experiment name and match experiments with observations for this genotype
  sim_files <- list.files('Experiment//',
                          full.names = TRUE)
  sim_exp_names <- tools::file_path_sans_ext(gsub("(_|-)", "", basename(sim_files)))
  sim_exp_names <- tools::file_path_sans_ext(basename(sim_files))
  sim_exp_names2 <- gsub("-", "\\.*", sim_exp_names)
  sim_exp_names2 <- gsub("_", "\\.*", sim_exp_names2)
  obs_i <- obs %>% 
    filter(Genotype == genotypes[i])
  exps_i <- obs_i %>% 
    select(Name, FolderName, ExperimentName) %>% 
    distinct()
  exps <- gsub("(_|-)", "", unique(obs_i$Name))
  
  # Read the simulated file and merge together
  res <- list()
  j <- 1
  for (j in seq(along = exps_i$Name)) {
    k <- 1
    target_sim_exp <- NULL
    for (k in seq(along = sim_exp_names)) {
      if (grepl(sim_exp_names2[k], gsub("-", "", exps_i$Name[j]))) {
        target_sim_exp <- sim_exp_names[k]
      }
    }
    if (is.null(target_sim_exp)) {
      stop("Not found the target experiment or simulation")
    }
    
    sim_file_i <- sim_files[match(target_sim_exp, sim_exp_names)]
    if (length(sim_file_i) != 1) {
      stop("Not found or multiple records")
    }
    r <- fst::read_fst(sim_file_i) %>% tibble()
    
    r$SimulationName <- exps_i$Name[j]
    res[[j]] <- r
    rm(r)
    gc(verbose = FALSE)
  }  
  res <- bind_rows(res)
  gc()
  # Write into disk
  fst::write_fst(res, out_file)
  rm(res)  
  gc()
  return(invisible())
}

run_parallel(seq(along = genotypes), par_merge, 
              genotypes = genotypes, obs = obs, out_folder = out_folder)
```

## Optimize the genotypic parameters for each genotype

``` r
# Read obs
obs <- read_obs()
obs <- obs %>% 
  select(-FactorValue, -FactorName) %>% 
  distinct()
# Get genotype list
genotypes <- tolower(unique(obs$Genotype)) %>% sort()
# Output folder
out_folder <- "Optimization/"
if (!dir.exists(out_folder)) {
  dir.create(out_folder, recursive = TRUE)
}

par_opt <- function(i, genotypes, obs, out_folder) {
  # Check output folder
  out_file_predicted <- paste0(out_folder, genotypes[i], '.Rds')
  if (file.exists(out_file_predicted)) {
    return(invisible())
  }
  
  # Read the simulated outputs
  out_file <- paste0("Genotype/", genotypes[i], '.fst')
  sim <- fst::read_fst(out_file) %>% tibble()
  # Remove Huan stage is more than 7
  sim <- sim %>% 
    filter(Wheat.Phenology.HaunStage <= 7)
  gc()
  
  # Join observations with simulated outputs
  obs2 <- obs %>% 
    filter(Genotype == genotypes[i]) %>% 
    select(trait, Observed, SimulationName = Name, Clock.Today) %>% 
    mutate(trait = paste0(trait, "_Obs")) %>% 
    pivot_wider(names_from = "trait", values_from = "Observed") 
  if (!has_name(obs2, "Wheat.Leaf.AppearedCohortNo_Obs")) {
    obs2$Wheat.Leaf.AppearedCohortNo_Obs <- NA_integer_
  }
  if (!has_name(obs2, "Wheat.Phenology.HaunStage_Obs")) {
    obs2$Wheat.Phenology.HaunStage_Obs <- NA_integer_
  }
  if (!has_name(obs2, "Wheat.Structure.LeafTipsAppeared_Sim")) {
    obs2$Wheat.Structure.LeafTipsAppeared_Obs <- NA_integer_
  }
  df <- obs2 %>% right_join(sim, by = c("SimulationName", "Clock.Today")) 
  
  rm(sim)
  # Calculate rmse, 
  rmse <- function(Wheat.Leaf.AppearedCohortNo_Obs, 
                   Wheat.Phenology.HaunStage_Obs, 
                   Wheat.Structure.LeafTipsAppeared_Obs,
                   Wheat.Leaf.AppearedCohortNo_Sim, 
                   Wheat.Phenology.HaunStage_Sim, 
                   Wheat.Structure.LeafTipsAppeared_Sim) {
   
   
    obs2 <- c(Wheat.Leaf.AppearedCohortNo_Obs, 
              Wheat.Phenology.HaunStage_Obs, 
              Wheat.Structure.LeafTipsAppeared_Obs)
    sim2 <- c(Wheat.Leaf.AppearedCohortNo_Sim, 
              Wheat.Phenology.HaunStage_Sim, 
              Wheat.Structure.LeafTipsAppeared_Sim)
    if (sum(is.na(sim2)) > 0) {
      return (NA)
    }
    pos <- !is.na(obs2)
    obs2 <- obs2[pos]
    sim2 <- sim2[pos]
    Metrics::rmse(obs2, sim2) 
  }
  
  # Calculate the RMSE
  rmse_sum <- df %>% 
    group_by(name) %>% 
    summarise(rmse = rmse(Wheat.Leaf.AppearedCohortNo_Obs, 
                          Wheat.Phenology.HaunStage_Obs, 
                          Wheat.Structure.LeafTipsAppeared_Obs,
                         Wheat.Leaf.AppearedCohortNo, 
                         Wheat.Phenology.HaunStage, 
                         Wheat.Structure.LeafTipsAppeared),
              .groups = "keep")
  # Get best combinations with minimum RMSE and the predicted value
  predicted <- rmse_sum %>% 
    ungroup() %>% 
    filter(rmse == min(rmse, na.rm = TRUE)) %>% 
    ungroup() %>% 
    left_join(df) %>% 
    mutate(experiment_type = ifelse(Experiment %in% cal_treatments[[j]], "Calibration", "Validation")) %>% 
    select(SimulationName, Clock.Today, name, rmse, experiment_type,
           Wheat.Leaf.AppearedCohortNo_Sim = Wheat.Leaf.AppearedCohortNo,
           Wheat.Phenology.HaunStage_Sim = Wheat.Phenology.HaunStage, 
           Wheat.Structure.LeafTipsAppeared_SIm = Wheat.Structure.LeafTipsAppeared) %>% 
    pivot_longer(cols = ends_with("_Sim"), names_to = "trait", 
                 values_to = "Predicted2") %>% 
    mutate(trait = gsub("_Sim", "", trait))
  
  
  
  rm(rmse_sum)
  rm(df)
  gc()
  # Matched the predicted with observed values
  obs_i <- obs %>% 
    filter(Genotype == genotypes[i]) %>% 
    rename(SimulationName = Name) %>% 
    right_join(predicted) %>% 
    filter(!is.na(Observed))
  # Save output
  saveRDS(obs_i, file = out_file_predicted)
 
}

run_parallel(seq(along = genotypes), par_opt,
              genotypes = genotypes, obs = obs, out_folder = out_folder)
```

In the last step, the optimized parameter values and predictions can be merged.

``` r
df <- "Optimization/" %>% 
  list.files(full.names = TRUE) %>% 
  map_df(readRDS)
```
