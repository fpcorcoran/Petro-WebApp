# Story-Map

## Goal: Design a web map to visualize petroleum imports monthly since 1986

## Design Steps/Milestones:

### Step 1: Page Design
 - set up html
    - map
      - pick a basemap style
    - banner
      - TBD
    - sidebar
      - drop down menu of ports to allow for zooming
      - skip to month
      - filter by petroleum type
      - filter by country of origin
    - bottom bar for graph
      - time series graph of port selected in sidebar
      - scroll buttons to move month to month

 - css
    - Penn colors?
    - Kleinman Center logo?
    - hover options on buttons
    - mostly TBD

### Step 2: Data Prep
  - Ports  
    - convert port location/name data to GeoJSON
  - Imports
    - Link import time series to port locations
  - Precipitation
    - can be brought in with location/name data

  - (initial goal) Convert location/name csv to GeoJSON to run tests

### Step 3: Parse and Plot
  - JQuery
    - bring in the data and parse
  - Append to html
    - create selectable options from port city names in sidebar
  - Markers
    - create markers at port locations
  - Graph
    - create graph of port below map

### Step 4: Interactivity
  - Port Cities
    - zoom to selected port city from sidebar
  - Months
    - skip to selected month from sidebar
    - forward and backward months from next/prev buttons
  - Petroleum Type
    - filter out types of petroleum imports from sidebar
  - Country of Origin
    - filter for exporting country from sidebar
  - Marker Size
    - Shrinking/swelling markers based on import amount at that month
