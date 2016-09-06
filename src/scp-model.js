SCP.Model = function() {
  this.initGraph();
  this.initSubscribers();
};

SCP.Model.prototype.initGraph = function() {
  this.graph = {
    nodes: {
    },
    edges: {
    }
  }
};

SCP.Model.prototype.initSubscribers = function() {
  this.subscribers = [];
};

SCP.Model.prototype.setProcess = function(process) {
  this.process = process;
  this.notify();
};

SCP.Model.prototype.getProcess = function() {
  return this.process;
};

SCP.Model.prototype.setCurrentOperator = function(operator) {
  this.currentOperator = operator;
  this.notify();
};

SCP.Model.prototype.getCurrentOperator = function() {
  return this.currentOperator;
};

SCP.Model.prototype.getGraph = function() {
  return this.graph;
};

SCP.Model.prototype.setGraph = function(graph) {
  this.graph = graph;
};

SCP.Model.prototype.add = function(node) {
  var self = this;
  var isProcessDeferred = this.isProcess(node);
  var isOperatorDeferred = this.isOperator(node);
  isProcessDeferred.promise()
    .done(function() {
      self.setProcess(node)
    });
  isOperatorDeferred.promise()
    .done(function() {
      console.log("operator");
      self.addOperator(node);
    });
};

SCP.Model.prototype.isProcess = function(process) {
  var deferred = $.Deferred();
  window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_F, [
    SCP.keynodes.get('scp_process'),
    sc_type_arc_pos_const_perm,
    process
  ])
    .done(function(array) {
      if (array.length > 0)
        deferred.resolve();
      else
        deferred.reject();
    })
    .fail(deferred.reject);
  return deferred;
};

SCP.Model.prototype.isOperator = function(operator) {
  return this.getOperatorType(operator);
};

SCP.Model.prototype.addOperator = function(operator) {
  var deferred = $.Deferred();
  var self = this;
  this.graph.nodes[operator] = {};
  $.when(
    this.getOperatorType(operator),
    this.checkIfInitial(operator),
    this.checkIfBreakpoint(operator),
    this.checkIfPaused(operator),
    this.findIncomingTransitions(operator),
    this.findOutcomingTransitions(operator)
  )
    .done(function(type, initial, breakpoint, paused, incoming, outcoming) {
      self.graph.nodes[operator].type = SCP.keynodes.getIdentifierByAddress(type)
      self.graph.nodes[operator].initial = initial;
      self.graph.nodes[operator].breakpoint = breakpoint;
      self.graph.nodes[operator].paused = paused;
      self.addIncomingTransitions(operator, incoming);
      self.addOutcomingTransitions(operator, outcoming);
      self.notify();
    })
    .fail(deferred.reject);
  return deferred;
};

SCP.Model.prototype.getOperatorType = function(operator) {
  var deferred = $.Deferred();
  window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3A_A_F, [
    sc_type_node | sc_type_const,
    sc_type_arc_pos_const_perm,
    operator
  ])
    .done(function(array) {
      var deferreds = [];
      for(var i = 0; i < array.length; i++)
        deferreds.push($.Deferred());
      var type;
      $(array).each(function(index, element) {
        var node = element[0];
        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_F, [
          SCP.keynodes.get('scp_operator_atomic_type'),
          sc_type_arc_pos_const_perm,
          node
        ])
          .done(function(array) {
            type = node;
            deferreds[index].resolve();
          })
          .fail(deferreds[index].resolve)
      }).promise()
        .done(function() {
          $.when.apply($, deferreds).done(function() {
            if (type)
              deferred.resolve(type);
            else
              deferred.reject();
          });
        });
    })
    .fail(deferred.reject);
  return deferred;
};

SCP.Model.prototype.findIncomingTransitions = function(operator) {
  var deferred = $.Deferred();
  var deferreds = [];
  deferreds[0] = this.findIncomingTransitionsOfAType(operator, 'nrel_goto');
  deferreds[1] = this.findIncomingTransitionsOfAType(operator, 'nrel_then');
  deferreds[2] = this.findIncomingTransitionsOfAType(operator, 'nrel_else');
  $.when.apply($, deferreds).done(function() {
    result = [];
    for(var i = 0; i < arguments.length; i++)
      result = result.concat(arguments[i]);
    deferred.resolve(result);
  });
  return deferred;
};

SCP.Model.prototype.findOutcomingTransitions = function(operator) {
  var deferred = $.Deferred();
  var deferreds = [];
  deferreds[0] = this.findOutcomingTransitionsOfAType(operator, 'nrel_goto');
  deferreds[1] = this.findOutcomingTransitionsOfAType(operator, 'nrel_then');
  deferreds[2] = this.findOutcomingTransitionsOfAType(operator, 'nrel_else');
  $.when.apply($, deferreds).done(function() {
    result = [];
    for(var i = 0; i < arguments.length; i++)
      result = result.concat(arguments[i]);
    deferred.resolve(result);
  });
  return deferred;
};

SCP.Model.prototype.addIncomingTransitions = function(operator, transitions) {
  for(var i = 0; i < transitions.length; i++) {
    var node = transitions[i][0];
    if (this.graph.nodes[node] && this.graph.nodes[node].push)
      this.graph.edges[node].push({
        target: operator,
        type: SCP.keynodes.getIdentifierByAddress(transitions[i][4])
      });
  }
};


SCP.Model.prototype.addOutcomingTransitions = function(operator, transitions) {
  this.graph.edges[operator] = [];
  for(var i = 0; i < transitions.length; i++) {
    var node = transitions[i][2];
    if (this.graph.nodes[node])
      this.graph.edges[operator].push({
        target: node,
        type: SCP.keynodes.getIdentifierByAddress(transitions[i][4])
      });
  }
};

SCP.Model.prototype.findIncomingTransitionsOfAType = function(operator, type) {
  var deferred = $.Deferred();
  window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F, [
    sc_type_node | sc_type_const,
    sc_type_const | sc_type_arc_common,
    operator,
    sc_type_arc_pos_const_perm,
    SCP.keynodes.get(type)
  ])
    .done(function(array) {
      deferred.resolve(array);
    })
    .fail(function() {
      deferred.resolve([])
    });
  return deferred;
};


SCP.Model.prototype.findOutcomingTransitionsOfAType = function(operator, type) {
  var deferred = $.Deferred();
  window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
    operator,
    sc_type_const | sc_type_arc_common,
    sc_type_node | sc_type_const,
    sc_type_arc_pos_const_perm,
    SCP.keynodes.get(type)
  ])
    .done(function(array) {
      deferred.resolve(array);
    })
    .fail(function() {
      deferred.resolve([])
    });
  return deferred;
};

SCP.Model.prototype.checkIfPaused = function(operator) {
  var deferred = $.Deferred();
  window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3A_A_F, [
    sc_type_node | sc_type_const,
    sc_type_arc_pos_const_perm,
    operator
  ])
    .done(function(array) {
      for(var i = 0; i < array.length; i++) {
        var node = array[i][0];
        if (node == SCP.keynodes.get('scp_paused_operator')) {
          deferred.resolve(true);
          return;
        }
      }
      deferred.resolve(false);
    })
  return deferred;
};

SCP.Model.prototype.checkIfBreakpoint = function(operator) {
  var deferred = $.Deferred();
  window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3A_A_F, [
    sc_type_node | sc_type_const,
    sc_type_arc_pos_const_perm,
    operator
  ])
    .done(function(array) {
      for(var i = 0; i < array.length; i++) {
        var node = array[i][0];
        if (node == SCP.keynodes.get('breakpoint')) {
          deferred.resolve(true);
          return;
        }
      }
      deferred.resolve(false);
    })
  return deferred;
};

SCP.Model.prototype.checkIfInitial = function(operator) {
  var deferred = $.Deferred();
  window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F, [
    sc_type_node | sc_type_const,
    sc_type_arc_pos_const_perm,
    operator,
    sc_type_arc_pos_const_perm,
    SCP.keynodes.get('rrel_init')
  ])
    .done(function(array) {
      deferred.resolve(true);
    })
    .fail(function() {
      deferred.resolve(false);
    });
  return deferred;
};

SCP.Model.prototype.remove = function(node) {
  //TODO implement
  this.notify();
};

SCP.Model.prototype.subscribe = function(subscriber) {
  this.subscribers.push(subscriber);
};

SCP.Model.prototype.notify = function() {
  for(var i = 0; i < this.subscribers.length; i++)
    this.subscribers[i].update(this);
};

SCP.Model.prototype.update = function() {
  var nodes = this.graph.nodes;
  this.initGraph();
  for(var node in nodes)
    this.add(node);
};
//TODO add operator object