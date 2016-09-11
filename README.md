# SCP Debug interface
Follow these steps to install:
- Download repo to /sc-web/components/scp/
- Download cytoscape: http://www.cytoscape.org/. Place it to /ostis/sc-web/client/static/common/cytoscape
- Move scp.css to /ostis/sc-web/client/static/components/css/scp.css
- Add this line to /ostis/client/templates/common.html:
```html
<script type="text/javascript" charset="utf-8" src="/static/common/cytoscape/cytoscape.min.js"></script>
```
- Add these lines to /ostis/client/templates/components.html:
```html
<link rel="stylesheet" type="text/css" href="/static/components/css/scp.css" />
<script type="text/javascript" charset="utf-8" src="/static/components/js/scp/scp.js"></script>
```
- Add a file with the following content to your knowledge base:
```scs
ui_external_languages
  -> scp_debugger_view;;

scp_debugger_view => nrel_main_idtf: [Отладчик SCP] (*
  <- lang_ru;;
*);;

format_scp_debugger => nrel_main_idtf: [Формат SCP отладчика] (*
  <- lang_ru;;
*);;
```
- Run this code in /ostis/sc-web/scripts/
```bash
python build_components.py -i -a
```
- That's it! Now your debugger is wrapped with a cute interface :)
