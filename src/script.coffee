# world gdp since year 1

margin =
  top:    20
  right:  20
  bottom: 30
  left:   80

svgWidth = 960
svgHeight = 500

width = svgWidth - margin.left - margin.right
height = svgHeight - margin.top - margin.bottom

x = d3.scale.linear()
  .range [0, width]

y = d3.scale.log()
  .range [height, 0]

yMin = 10000

color = d3.scale.category20()

xAxis = d3.svg.axis()
  .scale x
  .orient "bottom"

yAxis = d3.svg.axis()
  .scale y
  .orient "left"
  .tickFormat y.tickFormat 3, "$,f"

area = d3.svg.area()
  .x  (d) -> x d.year
  .y0 (d) -> y d.y0 or yMin
  .y1 (d) -> y d.y0 + d.y

stack = d3.layout.stack()
  .values (d) -> d.values

svg = d3.select "body"
  .append "svg"
  .attr "width", svgWidth
  .attr "height", svgHeight
  .append "g"
  .attr "transform", "translate(#{margin.left},#{margin.top})"

d3.csv "data.csv", (err, data) ->
  if err
    d3.select "body"
      .append "div"
      .text "Error: #{err}"
    return

  regionNames = d3.keys data[0]
    .filter (key) -> key isnt "year"
  color.domain regionNames

  for d in data
    d.year = parseInt d.year
    for region in regionNames
      d[region] = parseFloat d[region]

  regions = stack regionNames.map (name) ->
    name: name
    values: data.map (d) ->
      year: d.year
      y: d[name]

  x.domain d3.extent data, (d) -> d.year

  yMax = d3.max regions, (region) ->
    d3.max region.values, (value) ->
      value.y0 + value.y
  y.domain [yMin, yMax]
    .nice()

  svg.selectAll ".region"
    .data regions
    .enter()
    .append "path"
    .attr "class", "region"
    .attr "d", (d) -> area d.values
    .style "fill", (d) -> color d.name

  legend = svg.append "g"
    .attr "class", "legend"
    .attr "transform", "translate(40, 20)"
    .selectAll ".region"
    .data regionNames
    .enter()
    .append "g"
    .attr "class", "region"
    .attr "transform", (_, i) ->
      "translate(0,#{i * 13})"

  legend.append "rect"
    .attr "width", 10
    .attr "height", 10
    .attr "fill", (d) -> color d

  legend.append "text"
    .attr "class", "name"
    .attr "x", 12
    .attr "y", 9
    .text (d) -> d

  svg.append "g"
    .attr "class", "x axis"
    .attr "transform", "translate(0,#{height})"
    .call xAxis

  svg.append "g"
    .attr "class", "y axis"
    .call yAxis
