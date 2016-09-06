SCP.Keynodes = function() {
  
}

SCP.Keynodes.IDENTIFIERS = [
  'rrel_1',
  'rrel_2',
  'rrel_3',
  'rrel_4',
  'rrel_5',
  'rrel_init',
  'nrel_goto',
  'nrel_then',
  'nrel_else',
  'breakpoint',
  'question',
  'question_initiated',
  'question_finished',
  'question_unpausing_paused_operator',
  'question_transition_to_next_operator',
  'question_adding_breakpoint',
  'scp_operator_atomic_type',
  'scp_process',
  'scp_paused_operator',
  'varAssign',
  'searchSetStr3',
  'searchElStr3',
  'searchElStr5',
  'return',
  'eraseEl',
  'varAssign',
  'sys_search',
  'ifVarAssign',
  'print',
  'genEl'
];

SCP.Keynodes.prototype.init = function() {
  var deferred = $.Deferred();
  var self = this;
  SCWeb.core.Server.resolveScAddr(SCP.Keynodes.IDENTIFIERS, function (keynodes) {
    self.keynodes = keynodes;
    self.identifiers = {};
    for(var keynode in keynodes)
      self.identifiers[keynodes[keynode]] = keynode;
    deferred.resolve();
  });
  return deferred;
};

SCP.Keynodes.prototype.get = function(identifier) {
  return this.keynodes[identifier];
};

SCP.Keynodes.prototype.getIdentifierByAddress = function(address) {
  return this.identifiers[address];
};