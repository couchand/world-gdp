// Generated by CoffeeScript 1.7.1
(function() {
  var area, color, height, margin, stack, svg, svgHeight, svgWidth, width, x, xAxis, y, yAxis, yMin;

  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 80
  };

  svgWidth = 960;

  svgHeight = 500;

  width = svgWidth - margin.left - margin.right;

  height = svgHeight - margin.top - margin.bottom;

  x = d3.scale.linear().range([0, width]);

  y = d3.scale.log().range([height, 0]);

  yMin = 10000;

  color = d3.scale.category20();

  xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(function(d) {
    return d;
  });

  yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(y.tickFormat(3, "$,f"));

  area = d3.svg.area().x(function(d) {
    return x(d.year);
  }).y0(function(d) {
    return y(d.y0 || yMin);
  }).y1(function(d) {
    return y(d.y0 + d.y);
  });

  stack = d3.layout.stack().values(function(d) {
    return d.values;
  });

  svg = d3.select("body").append("svg").attr("width", svgWidth).attr("height", svgHeight).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data.csv", function(err, data) {
    var d, legend, region, regionNames, regions, yMax, _i, _j, _len, _len1;
    if (err) {
      d3.select("body").append("div").text("Error: " + err);
      return;
    }
    regionNames = d3.keys(data[0]).filter(function(key) {
      return key !== "year";
    });
    color.domain(regionNames);
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      d = data[_i];
      d.year = parseInt(d.year);
      for (_j = 0, _len1 = regionNames.length; _j < _len1; _j++) {
        region = regionNames[_j];
        d[region] = parseFloat(d[region]);
      }
    }
    regions = stack(regionNames.map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {
            year: d.year,
            y: d[name]
          };
        })
      };
    }));
    x.domain(d3.extent(data, function(d) {
      return d.year;
    }));
    yMax = d3.max(regions, function(region) {
      return d3.max(region.values, function(value) {
        return value.y0 + value.y;
      });
    });
    y.domain([yMin, yMax]).nice();
    svg.selectAll(".region").data(regions).enter().append("path").attr("class", "region").attr("d", function(d) {
      return area(d.values);
    }).style("fill", function(d) {
      return color(d.name);
    });
    legend = svg.append("g").attr("class", "legend").attr("transform", "translate(40, 20)").selectAll(".region").data(regionNames).enter().append("g").attr("class", "region").attr("transform", function(_, i) {
      return "translate(0," + (i * 13) + ")";
    });
    legend.append("rect").attr("width", 10).attr("height", 10).attr("fill", function(d) {
      return color(d);
    });
    legend.append("text").attr("class", "name").attr("x", 12).attr("y", 9).text(function(d) {
      return d;
    });
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    return svg.append("g").attr("class", "y axis").call(yAxis);
  });

}).call(this);
