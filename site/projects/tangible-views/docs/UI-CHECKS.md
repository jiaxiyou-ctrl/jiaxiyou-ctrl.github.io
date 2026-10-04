# v0.9.0 · Chinese and English (22 September 2026)

Checked in the existing desktop browser using a separate local origin, port 8773.

- Direct English entry; exercise names, controls, diagrams, help, saved builds, multiple-solution explanation and project notes display in English.
- Completed Exercise 1 in English, switched to Chinese, undid the last edit, then switched back. The two-cube build, saved submission and completed status were preserved.
- Added and removed B2 through X-ray editing in English; opened the grid editor and checked its labels.
- Opened example mode, loaded Exercise 5 and enabled visual hints. Switching language preserved the six-cube build and its two highlighted differences.
- Returning to practice and refreshing restored the original two-cube build and 1/8 completed status. Example work did not overwrite practice.
- Inspected the desktop layouts and a narrow viewport (512 CSS pixels wide); no horizontal overflow in the checked states. Help, submission and language controls remained available.
- No console errors or warnings in the checked practice flow. All 39 automated checks passed, including the 262,144-state projection comparison.
- Screenshots 22–23 are the same live example in English and Chinese, captured at 1440 × 900.

The bilingual release changes presentation, not task geometry or the saved-work format. Earlier interaction and exhaustive geometry evidence is retained below.

---

# v0.8.0｜用户试用反馈修正（2026-09-22）

本轮测试沿用 macOS / Chrome 152，独立端口 8772，不修改用户 8768 练习数据。

- **复现：**周围八格各三层，中间 B2 为空；实际画布以 5 像素间隔读取命中区域，中间格没有可点击点。根因是前景表面拦住指针命中。
- **修复：**透视编辑淡化模型，在其上绘制九个独立底板命中区域。实际点击 B2 连续加到两层，右键减为一层，Shift 点击减为零；撤销恢复；Delete 也可移除。无需修改观察方向或先拆掉前排。
- **提示：**第 5 题缺少 A1 一层时，正视和右视各出现一处黄色加号；补上后差异为零，右键移除后两处标记恢复。多出部分显示减号，俯视方向与前后排一致。
- **流程：**精简完成和存档说明；练习首题提交后仍出现解释问题。1440×900、1280×720 操作入口可达，无水平溢出；控制台无错误或警告。
- **自动检查：**新增/调整回归项先观察到 4 项失败，实施后 36/36 通过，含 262,144 种结构穷举。原三级文字提示测试随产品交互调整移除；不宣称该功能继续存在。

本轮为软件修正与开发者回归验证，不是教学效果评价。此前记录保留如下。

---

# 浏览器验证记录

## v0.7.0｜2026-09-22 实际操作验证

本轮已在 Codex 内置 Chromium 152 浏览器完成新版检查。测试使用独立的本机 8769 端口，未修改用户 8768 端口的练习数据。

- 八题逐题手动通过界面搭建、提交，最后得到 8/8 完成；刷新及新标签重开后恢复。
- 第八题：错误结构不增加正确数，同一正确结构重复提交仍为 1/2，另一正确结构提交后完成。
- 练习中一块 → 示例中载入三块完整答案 → 返回仍为一块、完成数不增加。
- 提示按方向、位置、规律逐层展开；修改后清除。当前正确结构提交后显示“想一想”；改错后隐藏。
- 验证鼠标旋转、移出画布释放、滚轮上限、视角恢复，Enter/Space 编辑、撤销重做快捷键、清空恢复及重做分支清除。
- 实际检查 1280×720、1440×900、768×1024。窄屏采用上下排列，内容可滚动到达；DOM 宽度与内容宽度一致，无横向溢出。
- 使用独立存储夹具，验证存储访问失败的界面提示和继续编辑，以及损坏 JSON 存档后的恢复。

### 实际发现并修正

| 问题 | 原因 | 修正与复查 |
|---|---|---|
| 按格编辑时选格会关掉菜单 | 重绘替换了被点击的按钮，冒泡到页面时被误判为外部点击 | 根据点击发生时的事件路径判断；回归检查通过，随后八题连续格子编辑通过 |
| 小窗口查看提示时列标题消失 | 对照区内部滚动，把目标/当前标签一并滚走 | 固定对照区标题；1280×720 展开三级提示时仍可辨认列含义 |

### 响应观察

27 次从空板到满板的添加操作，诊断指标“输入处理开始到下一次 requestAnimationFrame 回调”P95 **12.0 ms**，范围 **4.1–13.9 ms**。测试通过 tests/browser-harness.html 的独立内存存档执行；这些数值不是实际屏幕呈现延迟，也不是跨设备性能保证。

约 10.1 秒内重复执行 56 次拖动，方块数量保持不变；实际页面未记录应用错误。取消、拖回起点等更多手势边界由控制器自动检查补充。

本轮属于开发验证。未开展学生试用，未测得学习效果。物理触控板手感、完整触屏支持与其他浏览器兼容性不在本次实测结论内。

[完整使用记录](USABILITY-RECORD.zh-CN.md) · [自动检查报告](../validation-report.json)

---

## 以下为历史版本记录

# 当前验证状态 — v0.6

日期：2026-09-19。

- **自动检查：26/26 通过。** 新增全部 8 题的阶段顺序、真实解数、正确示例与完成要求验证；正确提交才完成；多解题需要两种不同答案；旧存档迁移和新增题目隔离。
- **题库解数：** 依题序为 1、1、1、1、1、2、5、7，均经过枚举验证。
- **界面接线：** 题目列表使用稳定标识切换；检查新增页面节点、对话框、资源与模块引用。
- **浏览器实测：待完成。** 选择现有页面时仍被浏览器工具拒绝，原因是其强制安全策略无法核验。本轮未取得真实页面截图。

下一次浏览器验证重点：左侧列表与画布/对照区比例；8 题切换；提交错误/正确答案后的进度；第 8 题重复提交不能凑数；刷新恢复；多解说明图；窄屏布局。

---

## 历史验证状态 — v0.5

日期：2026-09-19。

- **软件检查：22/22 通过。** 新增相邻单位面、竖直堆叠、满板可见面、边线对比度、固定屏幕线宽与平视标签的检查。保留全部 262,144 种允许结构的独立投影比较和手势、撤销重做、保存恢复检查。
- **语言与接线：** 静态检查中文页面声明、按钮/提示标签、页面元素引用、模块引用及本地资源。
- **浏览器：尚未验证。** 本轮选择现有页面时，浏览器工具仍因无法核验其强制安全策略而拒绝访问。没有通过其他控制方式绕过；没有新版运行截图。

待浏览器恢复后重点检查：正视下横排三个方块、竖直三层；右视下前后三堆；65%–150% 缩放时的边线；平视时标签是否重叠；中文文本在窄屏是否挤压；方案列表展开与关闭；帮助与关于对话框；拖动与保存恢复。

当前截图集保留 v0.3/v0.2 历史截图，不代表 v0.5。

---

## Archived verification status — v0.4

Date: 2026-09-19.

**Automated:** 20/20 checks pass, including an independent oracle over all 262,144 allowed geometry states. New checks cover gesture decisions (click vs drag, secondary buttons, cancellation), undo/redo branching, saved snapshots, validated local-save recovery and camera direction mathematics. The gesture harness exercises the actual controller with a minimal input host; it is not a browser or rendering test.

**Browser:** pending. Two attempts to reload the existing in-app tab were rejected because the browser tool could not verify its admin-enforced security policy. No alternate browser-control method was used. No v0.4 screenshot, visual result, frame rate or browser interaction outcome is claimed.

## Next browser acceptance pass

- Empty board, all controls, three target/current rows and supporting copy fit at desktop and narrow widths.
- Hover snaps the preview to the intended stack; a short click adds one cube.
- Drag starting on a cube rotates without editing; leaving and returning to the starting point still counts as a drag.
- Drag release outside the scene, Escape, cancelled pointers and tool changes leave no stuck drag or accidental edit.
- Wheel zoom and camera presets preserve geometry; Reset view restores orientation.
- Erase, height limits, undo, redo and clear operate correctly with mouse and keyboard.
- Save/reopen a build, change activity and reload. Local progress and saved builds return.
- Difference toggle and hints work; both valid Activity 02 arrangements pass.
- Help/About menus open and close; no console errors.
- Capture real current screenshots after verification; archive labels on older images remain intact.

---

## Archived browser verification — v0.3

Date: 2026-09-19. Codex in-app browser, default 1280 × 720 viewport. The current screenshots are ordinary viewport captures; their content has not been visually edited.

| Interaction | Observed result |
|---|---|
| Initial page | Empty 3×3 board; Add cube active; all three current projections visible beside their targets |
| Click an empty 3D square, then the visible cube top | Stack grows from zero to one to two; views update without saving/checking |
| Construct activity 01 using seven direct scene clicks | Seven-cube target reached; 3/3 match appears immediately |
| Save the same construction twice | One saved attempt remains |
| Remove one cube from A1 | Live score changes from 3/3 to 1/3; top remains matched |
| Undo removal | Seven-cube structure and 3/3 match return |
| Rotate and reset view | Display camera changes; board-referenced projections and score remain 3/3 |
| Add with Enter at A1, then try beyond three layers | First action raises the stack; second is rejected with a height-limit message; keyboard focus remains on A1 |
| Undo after a rejected edit | Reverts the last actual change, restoring 3/3 |
| Select tool | Selects a stack without changing geometry or live score |
| Clear board, then undo | Empty board returns to the earlier successful structure |
| Activity 02 arrangements A and B | Both immediately show 3/3 |
| Switch back to activity 01 | Seven cubes, 3/3 and the saved attempt remain |
| Browser errors during these checks | None recorded |

Occlusion follows the drawn scene: clicking a visible face edits that stack. To reach a position hidden by another stack, rotate the model or use the board map. Keyboard activation also reaches focusable board positions. The end-to-end build used visible positions in back-to-front order.

Automated suite: 14/14 checks, including virtual edit limits and all 262,144 allowed projection states. See `validation-report.json` for the actual run record.

Not covered in this revision: live camera input, classroom studies, persistent storage after reload, comprehensive accessibility or cross-browser validation. Narrow layouts retain responsive styles; this revision's interactive verification used the default desktop viewport.

---

## Archived browser verification — v0.2

Date: 2026-09-18. Environment: Codex in-app browser. Desktop workspace checked at 1440 × 1050 CSS pixels; the normal narrow viewport, approximately 687 × 618, was also visually checked. These are direct browser interaction checks, separate from the automated geometry tests.

| Interaction | Observed result |
|---|---|
| Open activity 01 | Six-cube initial construction, three targets and hidden current projections in Practice mode |
| Check initial construction | 1/3 views match; front column A and right position 1 are too low |
| Request two hints | View-specific hint followed by the tallest-stack explanation |
| Add a cube to A1 | Construction updates to seven cubes; old feedback clears |
| Check the correction | 3/3 views match; success feedback and an actual attempt record appear |
| Rotate right, then reset view | Model camera changes and resets; board-referenced projection result stays 3/3 |
| Undo last edit | Six-cube construction returns and old grading is cleared |
| Recheck a previously checked state | Distinct attempt count does not increase |
| Load activity 02 arrangements A and B | Both different constructions pass |
| Load incomplete observation | Unknown cell shown; Check my build is disabled |
| Undo an incomplete observation | Prior complete height map returns |
| Explore mode, remove and add cubes | Current projections update; selected cell and heights follow edits |
| Click the C2 stack directly in the model | Selection changes to C2 |
| Switch activities and return | Current construction and checked result are retained for each activity during this session |
| Open and close instructions | Native dialog presents the actual available actions |
| System overview | Architecture, apparatus schematic, worked example and seven-solution count are present |
| Verification | Current report shows 12/12 checks and 262,144 exhaustive oracle comparisons |
| Classroom scenario | Generated image loads with a visible illustrative-scene disclosure |
| Narrow viewport | Sidebar collapses and workspace sections stack; main construction remains usable |

The delivered screenshots are actual desktop viewport captures, normalized to PNG encoding without changing their visible content. The classroom scenario is a separately generated illustrative asset. Its source and prompt are recorded in IMAGE-PROVENANCE.md.

Not covered: live hardware, participant usability, classroom learning effects, comprehensive accessibility, cross-browser verification, persistent storage across browser reloads or production deployment.

## v0.7.0 干净副本复现

2026-09-22：从 d6c6afa 导出独立目录，Node v20.19.6 直接运行，无依赖安装。35/35 检查通过；浏览器在独立 8771 端口完成第一题、提交、刷新恢复 1/8 和反思问题。Tab 从“添加”移到“移除”，焦点边框可见；控制台无错误或警告。当前图库链接与实际图片已检查。
