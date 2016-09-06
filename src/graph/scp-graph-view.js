SCP.Graph.View = function(container) {
  this.setContainer(container);
  this.initGraph();
}

SCP.Graph.View.prototype.setContainer = function(container) {
  var newContainer = $("<div class='graph'></div>");
  $("#" + container).append(newContainer);
  this.container = newContainer;
};

SCP.Graph.View.prototype.initGraph = function() {
  this.initCytoscape();
  this.initGraphEvents();
};

SCP.Graph.View.prototype.initCytoscape = function() {
  this.graph = cytoscape({
    container: this.container,
    boxSelectionEnabled: false,
    autounselectify: true,
    style: SCP.Graph.View.STYLES
  });
};

SCP.Graph.View.prototype.initGraphEvents = function() {
  var self = this;
  this.graph.on('tap', 'node', function(event) {
    var target = event.cyTarget;
    self.controller.setCurrentOperator(target.data().id);
  });
};

SCP.Graph.View.prototype.control = function(controller) {
  this.controller = controller;
};

SCP.Graph.View.STYLES = [
  {
    selector: 'node',
    style: {
      'height': 20,
      'width': 20,
      'background-color': '#ccc',
      'label': 'data(type)'
    }
  },
  {
    selector: 'edge',
    style: {
      'label': 'data(type)',
      'edge-text-rotation': 'autorotate'
    }
  },
  {
    selector: '.initial',
    style: {
      'background-color': 'green',
    }
  },
  {
    selector: '.paused',
    style: {
      'background-color': 'red',
    }
  },
  {
    selector: '.selected',
    style: {
      'width': 30,
      'height': 30
    }
  },
  {
    selector: '.breakpoint',
    style: {
      'border-width': '5px'
    }
  }
];