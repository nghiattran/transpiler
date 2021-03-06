let m = [20, 120, 20, 100],
w = 5000 - m[1] - m[3],
h = 800 - m[0] - m[2],
i = 0,
root;

let tree = d3.layout.tree()
  .size([h, w]);

let diagonal = d3.svg.diagonal()
. projection(function(d) { return [d.y, d.x]; });

let vis = d3.select('#canvas-container').append('svg:svg')
  .attr('width', w + m[1] + m[3])
  .attr('height', h + m[0] + m[2])
  .append('svg:g')
  .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');

function start(json) {
  root = json;
  root.x0 = h / 2;
  root.y0 = 0;

  function toggleAll(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
  }

  // Initialize the display to show a few nodes.
  // root.children.forEach(toggleAll);
  // toggle(root.children[1]);
  // toggle(root.children[1].children[2]);
  // toggle(root.children[9]);
  // toggle(root.children[9].children[0]);

  update(root);
};

function update(source) {
  let duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  let nodes = tree.nodes(root).reverse();

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { 
    d.y = d.depth * 180; 
    console.log(d);
  });

  // Update the nodes…
  let node = vis.selectAll('g.node')
  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  let nodeEnter = node.enter().append('svg:g')
  .attr('class', 'node')
  .attr('transform', function(d) { return 'translate(' + source.y0 + ',' + source.x0 + ')'; })
  .on('click', function(d) { toggle(d); update(d); });

  nodeEnter.append('svg:circle')
  .attr('r', 1e-6)
  .style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });

  nodeEnter.append('a')
  .attr('xlink:href', function(d) {
    return d.url;
  })
  .append('svg:text')
  .attr('x', function(d) { return d.children || d._children ? -10 : 10; })
      // .attr('y', function(d) { return d.children || d._children ? -10 : 10; })
      .attr('dy', '.35em')
      .attr('text-anchor', function(d) { return d.children || d._children ? 'end' : 'start'; })
      .text(function(d) { 
        if (d.attributes && d.attributes.id) {
          return d.attributes.id + '-' + d.name;
        } else {
          return d.name;
        }
      })
      .style('fill', function(d) {
        return d.free ? 'black' : '#999';
      })
      .style('fill-opacity', 1e-6);

      nodeEnter.append('svg:title')
      .text(function(d) {
        return d.description;
      });

  // Transition nodes to their new position.
  let nodeUpdate = node.transition()
  .duration(duration)
  .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

  nodeUpdate.select('circle')
  .attr('r', 6)
  .style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });

  nodeUpdate.select('text')
  .style('fill-opacity', 1);

  // Transition exiting nodes to the parent's new position.
  let nodeExit = node.exit().transition()
  .duration(duration)
  .attr('transform', function(d) { return 'translate(' + source.y + ',' + source.x + ')'; })
  .remove();

  nodeExit.select('circle')
  .attr('r', 1e-6);

  nodeExit.select('text')
  .style('fill-opacity', 1e-6);

  // Update the links…
  let link = vis.selectAll('path.link')
  .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert('svg:path', 'g')
  .attr('class', 'link')
  .attr('d', function(d) {
    let o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
  })
  .transition()
  .duration(duration)
  .attr('d', diagonal);

  // Transition links to their new position.
  link.transition()
  .duration(duration)
  .attr('d', diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
  .duration(duration)
  .attr('d', function(d) {
    let o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
  })
  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}