SCP.Controls.Controller = function(model) {
  this.setModel(model);
}

SCP.Controls.Controller.prototype.setModel = function(model) {
  this.model = model;
};

SCP.Controls.Controller.prototype.continue = function() {
  this.callAgent("question_unpausing_paused_operator", [this.model.getCurrentOperator()]);
};

SCP.Controls.Controller.prototype.goToNext = function() {
  this.callAgent('question_transition_to_next_operator', [this.model.getCurrentOperator()]);
};

SCP.Controls.Controller.prototype.toggleBreakpoint = function() {
  this.callAgent('question_adding_breakpoint', [this.model.getCurrentOperator(), this.model.getProcess()]);
};

SCP.Controls.Controller.prototype.callAgent = function(question, arguments) {
  var self = this;
  new SCP.Agent(question, arguments).run().promise().done(function() {
    self.model.update();
  });
};

SCP.Controls.Controller.prototype.updateModel = function() {
  this.model.update();
};