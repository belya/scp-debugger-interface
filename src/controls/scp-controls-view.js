SCP.Controls.View = function(container) {
  this.setContainer(container);
  this.initButtons();
};

SCP.Controls.View.prototype.setContainer = function(container) {
  var newContainer = $("<div class='controls form-inline'></div>");
  $("#" + container).append(newContainer);
  this.container = newContainer;
};

SCP.Controls.View.prototype.initButtons = function() {
  this.initContinueButton();
  this.initGoToNextButton();
  this.initToggleBreakpointButton();
  this.initUpdateButton();
};

//Add btn initialization to the single method
SCP.Controls.View.prototype.initContinueButton = function() {
  var button = $("<button class='btn btn-primary btn-space'><i class='glyphicon glyphicon-play'></i></button>");
  var self = this;
  this.container.append(button);
  button.click(function() {
    self.controller.continue();
  });
  this.continueButton = button;
};

SCP.Controls.View.prototype.initGoToNextButton = function() {
  var button = $("<button class='btn btn-primary btn-space'><i class='glyphicon glyphicon-step-forward'></i></button>");
  var self = this;
  this.container.append(button);
  button.click(function() {
    self.controller.goToNext();
  });
  this.goToNextButton = button;
};

SCP.Controls.View.prototype.initToggleBreakpointButton = function() {
  var button = $("<button class='btn btn-primary btn-space'></button>");
  var self = this;
  this.container.append(button);
  button.click(function() {
    self.controller.toggleBreakpoint();
  });
  this.toggleBreakpointButton = button;
};

SCP.Controls.View.prototype.initUpdateButton = function() {
  var button = $("<button class='btn btn-primary'><i class='glyphicon glyphicon-repeat'></i></button>");
  var self = this;
  this.container.append(button);
  button.click(function() {
    self.controller.updateModel();
  });
  this.updateButton = button;
};


SCP.Controls.View.prototype.control = function(controller) {
  this.controller = controller;
};

SCP.Controls.View.prototype.toggleBreakpointIcon = function(isBreakpoint) {
  if (isBreakpoint)
    this.toggleBreakpointButton.html("<i class='glyphicon glyphicon-ok'></i>");
  else
    this.toggleBreakpointButton.html("<i class='glyphicon glyphicon-remove'></i>");
};