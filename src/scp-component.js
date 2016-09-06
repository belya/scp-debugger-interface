SCP.Component = {
  ext_lang: 'scp_debugger_view',
  formats: ['format_scp_debugger'],
  struct_support: true,
  factory: function(sandbox) {
    SCP.keynodes = new SCP.Keynodes();
    SCP.keynodes.deferred = SCP.keynodes.init();
    return new SCP.Viewer(sandbox);
  }
};

SCWeb.core.ComponentManager.appendComponentInitialize(SCP.Component);