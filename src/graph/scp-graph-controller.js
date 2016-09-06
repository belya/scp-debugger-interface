SCP.Graph.Controller = function(model) {
  this.setModel(model);
}

SCP.Graph.Controller.prototype.setModel = function(model) {
  this.model = model;
};

SCP.Graph.Controller.prototype.setCurrentOperator = function(currentOperator) {
  this.model.setCurrentOperator(currentOperator);
};