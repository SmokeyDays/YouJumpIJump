### 编辑和调试的约定

#### Commit 规范
提交规范基于 AngularJS, 格式如下:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

其中, type 指示了提交的类型: 
  - docs: 对文档的修改。
  - style: 修改结构名称等。
  - feat: 新的特性、模块等。
  - fix: 修复 Bug.
  - test: 修改和增添了测试单元。
  - pref: 对性能的优化。
  - refactor: 对结构的重整。
  - ci: 对CI配置文件或脚本进行了修改。
  - chore: 不添加新功能，也没有更改结构的微小修改。

scope 指示了提交的作用域，表示提交影响的区域，可以不写。

subject 指示了提交的内容。