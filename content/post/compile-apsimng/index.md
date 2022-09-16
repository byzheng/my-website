---
title: 'Compile APSIMNG from source codes'
authors: 
 - bangyou-zheng
date: '2022-09-17'
slug: compile-apsimng
tags:
  - apsimng
---




## Checkout the latest source codes from APSIMInitiative

```
git clone --depth 1 https://github.com/APSIMInitiative/APSIM.Shared.git
git clone  --depth 1  https://github.com/APSIMInitiative/ApsimX.git
```

## Compile APSIMNG GUI 

Open `ApsimX.sln` under folder `ApsimX` with Visual Studio (2019 above), and then use menu `Build` -> `Build Solution` to build whole projects.

## Publish models for batch mode

Run following command under Models folders on Windows

Publish for windows

```
dotnet publish -c Release -f netcoreapp3.1 -r win-x64 Models.csproj
```

Publish for Ubuntu

```
dotnet publish -c Release -f netcoreapp3.1 -r ubuntu.20.04-x64  Models.csproj
```

Publish for SLES (e.g. CSIRO cluster):

```
dotnet publish -c Release -f netcoreapp3.1 -r sles.15-x64  Models.csproj
```

All runtime identify for other operating system can be found from [github](https://github.com/dotnet/runtime/blob/main/src/libraries/Microsoft.NETCore.Platforms/src/runtime.json)

Copy the contents `bin/Release/netcoreapp3.1/<runtime-identify>/publish/` to your operating system.

## Further steps 

On Windows, check whether `sqlite3.dll` is under `bin\Release\netcoreapp3.1\win-x64\publish`  folder. If not, copy from `bin\Release\netcoreapp3.1\win-x64\` to `publish` folder.

On Linux, sqlite3 should be installed into system with following command

for Ubuntu

```
sudo apt install sqlite3
```

for CSIRO cluster

```
module load sqlite/3.35.5
```