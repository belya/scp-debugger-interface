SCP.Viewer = function(sandbox) {
  var self = this;
  this.setSandbox(sandbox);
  this.initContainer();
  this.initModel();
  this.initGraph();
  this.initControls();
  this.initEvents();
  SCP.keynodes.deferred.promise()
    .done(function() {
      self.sandbox.updateContent();
      self.model.notify();
    });
}

SCP.Viewer.prototype.setSandbox = function(sandbox) {
  this.sandbox = sandbox;
};

SCP.Viewer.prototype.initContainer = function(container) {
  this.container = this.sandbox.container
};

SCP.Viewer.prototype.initModel = function() {
  this.model = new SCP.Model();
};

SCP.Viewer.prototype.initGraph = function() {
  this.graph = new SCP.Bundle({
    namespace: SCP.Graph,
    model: this.model,
    container: this.container,
  });
};

SCP.Viewer.prototype.initControls = function() {
  this.controls = new SCP.Bundle({
    namespace: SCP.Controls,
    model: this.model,
    container: this.container,
  });
};

SCP.Viewer.prototype.initEvents = function() {
  this.sandbox.eventStructUpdate = $.proxy(this.eventStructUpdate, this);
};

SCP.Viewer.prototype.eventStructUpdate = function(added, contour, arc) {
  var self = this;
  window.sctpClient.get_arc(arc)
    .done(function(array) {
      if (added)
        self.updateAfterAddition(array[1]);
      else
        self.updateAfterDeletion(array[1]);
    });
}

SCP.Viewer.prototype.updateAfterAddition = function(node) {
  this.model.add(node);
}

SCP.Viewer.prototype.updateAfterDeletion = function(node) {
  this.model.remove(node);
};