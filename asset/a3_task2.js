getData3_1(1)
  .then((data) => {
    // const data = d[0];
    const margin = {
      t: 40,
      r: 60,
      b: 40,
      l: 60,
    };
    const width = 600;
    const height = 400;

    // append the svg object to the div with id #a3_task2
    const svg = d3
      .select('#a3_task2')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const path = d3.geoPath();
    const projection = d3.geoIdentity().reflectY(true);
    projection.fitSize([width, height], data);

    const { features } = data;

    // const dom = d3.extent(features, (d) => d.properties.density);

    const classes = 8;
    const greens = d3.quantize(d3.interpolateGreens, classes);
    // Jenks Natural Breaks
    const color = d3
      .scaleThreshold()
      .domain(
        ss.jenks(
          features.map((d) => d.properties.density),
          classes,
        ),
      )
      .range(greens);

    const tooltip = d3.select('#a3_task2').append('div').attr('class', 'tooltip');

    const mouseover = function () {
      tooltip.style('z-index', 1);
      tooltip.transition().style('opacity', 0.9);
      d3.select(this).transition().attr('fill', 'gold');
    };

    const mouseout = function () {
      tooltip.style('z-index', -1);
      tooltip.transition().style('opacity', 0);
      d3.select(this)
        .transition()
        .attr('fill', (d) => color(d.properties.density));
    };

    const f6 = d3.format('.6f');
    const f2 = d3.format('.2f');
    const mousemove = function (event, d) {
      tooltip
        .html(
          `<b>${d.properties.nome}</b><br>
           Abundance = <b>${d.properties.count}</b><br>
           Density = <b>${f6(d.properties.density)}</b><br>
           Area = <b>${f2(d.properties.area / 1e6)} km<sup>2</sup></b>`,
        )
        .style('top', `${event.pageY}px`)
        .style('left', `${event.pageX + 20}px`);
    };

    // Draw the map
    svg
      .append('g')
      .selectAll('path')
      .data(features)
      .join('path')
      .attr('d', path.projection(projection))
      .attr('fill', (d) => color(d.properties.density))
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('mousemove', mousemove);
  })
  .catch((e) => {
    console.log(e);
  });
