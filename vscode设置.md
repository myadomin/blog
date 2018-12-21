## vscode设置
* 扩展 chinese语言包 eslint markdownPreviewEnhance vetur
* 设置
``` json
{
  "git.ignoreMissingGitWarning": true,
  "editor.fontSize": 16,
  "window.zoomLevel": 1,
  "files.associations": {
    "*.tpl": "html",
    "*.wxml": "html"
  },
  "editor.tabSize": 2,
  // eslint扩展检测代码是否符合规则 不符合标红波浪线
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "vue",
      "autoFix": true
    }
  ],
  // 保存自动修正为eslint规则
  "eslint.autoFixOnSave": true,
  "javascript.implicitProjectConfig.experimentalDecorators": true,
  "explorer.confirmDelete": false,
  // emmet支持jsx
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "emmet.triggerExpansionOnTab": true,
  "explorer.confirmDragAndDrop": false
}
```