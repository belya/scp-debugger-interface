SCP.Bundle = function(options) {
  this.setNamespace(options.namespace);
  this.setModel(options.model);
  this.setContainer(options.container);
  this.initView();
  this.initController();
}

SCP.Bundle.prototype.setNamespace = function(namespace) {
  this.namespace = namespace;
};

SCP.Bundle.prototype.setModel = function(model) {
  this.model = model;
};

SCP.Bundle.prototype.setContainer = function(container) {
  this.container = container;
};

SCP.Bundle.prototype.initView = function() {
  this.view = new this.namespace.View(this.container);
  var subscriber = new this.namespace.Subscriber(this.view);
  this.model.subscribe(subscriber);
};

SCP.Bundle.prototype.initController = function() {
  this.controller = new this.namespace.Controller(this.model);
  this.view.control(this.controller);
};