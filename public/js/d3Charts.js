// addJS_Node (null, "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js", null, showAddedUsersLastWeekStatistics);
// addJS_Node (null, "https://d3js.org/d3.v4.min.js", null, createUserBarChart);
var userChartActive = true;
var lastUsersData;
var lastLargestData;
var lastGenreData;

function createPieChart(genreData){
d3.selectAll("svg > *").remove();

userChartActive = false;
lastGenreData = genreData;

// set the dimensions and margins of the graph

currentWidth = parseInt(d3.select('svg').style('width'), 10);

const margin = 50;
const width = currentWidth - 2 * margin;
const height = 600 - 2 * margin;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select('svg')
    .attr("width", width)
    .attr("height", height)
    // .attr("viewBox", `0 0 ${height} ${width}`)
  .append("g")
    .attr("transform", "translate(" + (width/2 + margin) + "," + (height / 2 + margin) + ")");

// Create dummy data
var data = {a: 9, b: 20, c:30, d:8, e:12}
// set the color scale
var color = d3.scaleOrdinal()
  .domain(genreData.map((g)=> g._id))
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(genreData.map(g => g.count)));

for(let i =0; i< data_ready.length; i++){

    data_ready[i].data.key = genreData[data_ready[i].data.key]._id;
}
// The arc generator
var arc = d3.arc()
  .innerRadius(radius * 0.5)         // This is the size of the donut hole
  .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)


  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll('allSlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

  // Add the polylines between chart and labels: - polylines
svg
.selectAll('allPolylines')
.data(data_ready)
.enter()
.append('polyline')
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 1)
  .attr('points', function(d) {
    var posA = arc.centroid(d) // line insertion in the slice
    posA[0] = posA[0] * 1.15;
    posA[1] = posA[1] * 1.15;

    var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
    var posC = outerArc.centroid(d); // Label position = almost the same as posB
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
    return [posA, posB, posC]
  })

// Add the polylines between chart and labels: - text
svg
.selectAll('allLabels')
.data(data_ready)
.enter()
.append('text')
  .text( function(d) { return d.data.key } )
  .attr('transform', function(d) {
      var pos = outerArc.centroid(d);
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return 'translate(' + pos + ')';
  })
  .style('text-anchor', function(d) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return (midangle < Math.PI ? 'start' : 'end')
  });

  svg
.selectAll('allLabels')
.data(data_ready)
.enter()
.append('text')
  .text( function(d) { return d.data.value } )
  .attr('transform', function(d) {
      var pos = arc.centroid(d);
      
      return 'translate(' + pos + ')';
  })
  .style('text-anchor', function(d) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return (midangle < Math.PI ? 'start' : 'end')
  });



  svg.append('text')
      .attr('class', 'title')
      .attr('x',  0)
      .attr('y', -(height  / 2) + 20)
      .attr('text-anchor', 'middle')
      .text('Movies By Genre');
}





function createUserBarChart(users,largestValue){
    d3.selectAll("svg > *").remove();

    userChartActive = true;
    lastUsersData = users;
    lastLargestData = largestValue;


    const svg = d3.select('svg');
    const svgContainer = d3.select('#chartContainer');
    
    currentWidth = parseInt(svg.style('width'), 10);
    const margin = 80;
    const width = currentWidth - 2 * margin;
    const height = 600 - 2 * margin;
  
    const chart = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);
  
    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(users.map((u) => u._id))
      .padding(0.4)
    
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, largestValue]);
  
    // vertical grid lines
    // const makeXLines = () => d3.axisBottom()
    //   .scale(xScale)
  
    const makeYLines = () => d3.axisLeft()
      .scale(yScale)
  
    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));
  
    chart.append('g')
      .call(d3.axisLeft(yScale));
  
    // vertical grid lines
    // chart.append('g')
    //   .attr('class', 'grid')
    //   .attr('transform', `translate(0, ${height})`)
    //   .call(makeXLines()
    //     .tickSize(-height, 0, 0)
    //     .tickFormat('')
    //   )
  
    chart.append('g')
      .attr('class', 'grid')
      .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
      )
  
    const barGroups = chart.selectAll()
      .data(users)
      .enter()
      .append('g')
  
    barGroups
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (g) => xScale(g._id))
      .attr('y', (g) => yScale(g.count))
      .attr('height', (g) => height - yScale(g.count))
      .attr('width', xScale.bandwidth())
      .on('mouseenter', function (actual, i) {
        d3.selectAll('.value')
          .attr('opacity', 0)
  
        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.6)
          .attr('x', (a) => xScale(a._id) - 5)
          .attr('width', xScale.bandwidth() + 10)
  
        const y = yScale(actual.count)
  
        line = chart.append('line')
          .attr('id', 'limit')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', width)
          .attr('y2', y)
  
        barGroups.append('text')
          .attr('class', 'divergence')
          .attr('x', (a) => xScale(a._id) + xScale.bandwidth() / 2)
          .attr('y', (a) => yScale(a.count) + 30)
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
          .text((a, idx) => {
            const divergence = (a.count - actual.count).toFixed(1)
            
            let text = ''
            if (divergence > 0) text += '+'
            text += `${divergence}`
  
            return idx !== i ? text : '';
          })
  
      })
      .on('mouseleave', function () {
        d3.selectAll('.value')
          .attr('opacity', 1)
  
        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('x', (a) => xScale(a._id))
          .attr('width', xScale.bandwidth())
  
        chart.selectAll('#limit').remove()
        chart.selectAll('.divergence').remove()
      })
  
    barGroups 
      .append('text')
      .attr('class', 'value')
      .attr('x', (a) => xScale(a._id) + xScale.bandwidth() / 2)
      .attr('y', (a) => yScale(a.count) + 30)
      .attr('text-anchor', 'middle')
      .text((a) => `${a.count}`)
    
    svg
      .append('text')
      .attr('class', 'label')
      .attr('x', -(height / 2) - margin)
      .attr('y', margin / 2.4)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Users addition amount')
  
    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('Days')
  
    svg.append('text')
      .attr('class', 'title')
      .attr('x', width / 2 + margin)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('New Users Last week')
  
    // svg.append('text')
    //   .attr('class', 'source')
    //   .attr('x', width - margin / 2)
    //   .attr('y', height + margin * 1.7)
    //   .attr('text-anchor', 'start')
    //   .text('Source: Stack Overflow, 2018')
  
  }

    function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
        var D                                   = document;
        var scriptNode                          = D.createElement ('script');
        if (runOnLoad) {
            scriptNode.addEventListener ("load", runOnLoad, false);
        }
        scriptNode.type                         = "text/javascript";
        if (text)       scriptNode.textContent  = text;
        if (s_URL)      scriptNode.src          = s_URL;
        if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';
    
        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);
    }

    window.addEventListener('resize', handleResize );

    function handleResize(){
        if(userChartActive){
            createUserBarChart(lastUsersData,lastLargestData);
        }
        else{
            createPieChart(lastGenreData);
        }
    }