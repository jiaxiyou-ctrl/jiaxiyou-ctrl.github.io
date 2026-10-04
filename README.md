# Jiaxi You — Personal website

个人网站：**https://jiaxiyou-ctrl.github.io/**

这里是个人主页和项目展示页面的正式源文件。后续的内容、布局和动画调整都在这个项目中进行。

## 日常修改

1. 修改下面对应的页面、样式或脚本。
2. 在本地预览，确认文字、图片和交互。
3. 检查通过后提交并推送到 `main`；GitHub Pages 会自动更新网站，网址保持不变。

| 内容 | 文件 |
| --- | --- |
| 个人主页 | `site/index.html` |
| 机器人项目 | `site/projects/robotic-microsurgery/index.html` |
| RAG 项目 | `site/projects/reliable-evidence-flow/index.html` |
| Tangible Views 演示 | `site/projects/tangible-views/index.html` |
| 页面字体、颜色、布局 | `site/assets/styles/` |
| 动画与交互 | `site/assets/scripts/` |
| 图片、研究图、视频、报告 | `site/assets/images/`, `figures/`, `videos/`, `reports/` |

网页本身就是源文件，无需安装前端框架或重新构建。

## 本地预览与检查

在项目目录中运行：

```sh
python3 scripts/preview.py
```

然后打开 http://localhost:58321/ 。停止预览时按 Ctrl+C。

```sh
python3 scripts/check.py
```

检查会验证页面链接、资源、导航锚点和模块引用。GitHub 上也会执行同样的检查，只有通过后才发布。

## Tangible Views 的源项目

搭建立方体应用继续在 [tangible-views](https://github.com/jiaxiyou-ctrl/tangible-views) 仓库开发与测试。完成修改后，在本网站项目目录运行：

```sh
python3 scripts/sync-tangible.py /path/to/tangible-views
python3 scripts/check.py
```

同步脚本保留原项目结构，只为个人网站补充返回主页的入口。同步版本记录在 `tangible-source.json`。

## 发布

GitHub Pages 使用仓库的 GitHub Actions 工作流。工作流只发布 `site/` 目录。项目说明、检查脚本与开发记录不会成为网页文件。

- 网站： https://jiaxiyou-ctrl.github.io/
- 仓库： https://github.com/jiaxiyou-ctrl/jiaxiyou-ctrl.github.io
- 发布状态： https://github.com/jiaxiyou-ctrl/jiaxiyou-ctrl.github.io/actions

初次部署后可继续修改页面。每次发布对应一个 Git 提交，必要时可以恢复以前的版本。
