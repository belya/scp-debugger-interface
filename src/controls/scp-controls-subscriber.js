SCP.Controls.Subscriber = function(controls) {
  this.setControls(controls);
}

SCP.Controls.Subscriber.prototype.setControls = function(controls) {
  this.controls = controls;
};

SCP.Controls.Subscriber.prototype.update = function(model) {
  var current = model.getCurrentOperator();
  var graph = model.getGraph();
  this.controls.toggleBreakpointIcon(!graph.nodes[current] || !graph.nodes[current].breakpoint);
};