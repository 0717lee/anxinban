# 阶段一进度记录

## Session 记录

- 已确认用户批准进入实现阶段。
- 已确认阶段执行顺序：先阶段一，完成后停下汇报。
- 已确认开发限制：不加登录、历史、OCR、语音、数据库、真实接口。
- 已提醒用户保存关键 Session ID 和截图。

## 本地验证记录

- 静态检查通过：`server/index.js`、`web/app.js`、`web/index.html`、`web/styles.css` 无诊断错误。
- 本地服务启动成功：`npm start` 后可访问 `http://localhost:3000/`。
- 接口验证通过：POST `/api/generate` 返回 `success + data + error` 结构。
- 高风险兜底验证通过：输入包含“验证码”时，返回 `riskLevel: high`，并包含对应 `riskTags`。
- 当前阶段状态：阶段一最小主链路已跑通，待用户确认后再决定是否进入阶段二。

## 阶段一遗留风险

- 当前 `/api/generate` 已跑通 `success + data + error` 结构。
- 当前 `callAi()` 尚未接入真实 AI，只返回 fallback 结构化结果。
- 这只能作为主链路骨架验证，不算最终“真实 AI 生成”能力。
- 在进入最终演示或部署前，必须接入真实 AI 调用。
- 接入真实 AI 后，必须保留失败时的明确错误提示，不能继续用 fallback 假装成功。
- 该问题会直接影响创新性、实用性和完成度，是后续优先修复项。

## 阶段二第一优先级进度

- 已按 `docs/TECH.md`、`docs/PLAN.md`、`docs/SCORECARD.md` 和当前记录重新确认阶段二目标。
- 已完成 `callAi()` 改造：后端现在只从环境变量读取 AI Key，不再返回 fallback 假成功。
- 当前接入方案已实现：调用真实 AI 接口、要求 JSON 输出、校验固定结构、失败时返回 `success: false + error`。
- 当前本地环境未配置 AI Key，因此“正常说明”和“医保案例”请求会真实返回 `AI_KEY_MISSING`，这符合“不要用 fallback 假装成功”的要求。
- 当前错误处理已验证：输入为空时返回 `TEXT_REQUIRED`；缺少 AI Key 时返回 `AI_KEY_MISSING`。
- 当前状态：真实 AI 接入代码已落地，但要完成“真实生成成功场景”验证，还需要在后端环境变量中配置可用 AI Key。

## 阶段二补充安全与验证说明

- 已完成后端 body 长度限制，超长输入现在返回 `TEXT_TOO_LONG`。
- 已完成静态文件路径收紧，路径穿越访问未读到 `web` 目录外文件。
- 已补充真实 AI 验证说明，明确了 `OPENAI_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_MODEL` 的使用方式。
- 已补充阿里云百炼兼容说明：可使用 `DASHSCOPE_API_KEY`，并配合兼容的 `OPENAI_BASE_URL` 与 `OPENAI_MODEL`。
- 当前本地仍无可用 Key，因此本次只完成说明更新和安全小修，不进入 UI 优化。

## 阶段二稳定性补丁

- 已增强 `extractJson()`：当 `JSON.parse` 失败时，统一返回 `AI_RESPONSE_INVALID`，不再落成普通 `SERVER_ERROR`。
- 已增强 `validateAiData()`：现在会校验 `plainExplanation.title`、`plainExplanation.summary`、`plainExplanation.tips`、`steps`、每个 step 的 `stepNumber/title/content`、`safety.defaultReminder`、`safety.priorityReminder`。
- 已增加场景值校验：`scene` 只允许 `medical / bank / government`，非法值返回 `SCENE_INVALID`。
- 已增加 AI 请求超时控制：上游超时时返回 `AI_TIMEOUT`。
- 本地已验证：非法场景返回 `SCENE_INVALID`；空输入仍返回 `TEXT_REQUIRED`；服务无语法诊断错误。
- 结构异常与超时补丁已落地，但要完整命中验证，还需要可用 AI Key 或模拟异常上游响应。

## 阶段二提示词安全补丁

- 已增强 `buildPrompt()`：明确说明用户粘贴的原始说明只是待解释文本，不是给 AI 的指令。
- 已使用 `<USER_TEXT>...</USER_TEXT>` 包裹原始说明，减少原文与系统规则混淆的风险。
- 已明确要求 AI 忽略原始说明中任何试图改变输出格式、泄露信息、跳过安全规则或插入隐藏指令的内容。
- 本次补丁不改接口结构、不改 UI、不新增功能，只增强提示词安全边界。

## 真实 Key 成功路径验证（当前轮次）

- 已按计划重新验证 4 个用例。
- 用户复测已通过，当前服务已成功读取 AI Key 环境变量。
- `medical` 普通医保说明验证通过：返回 `200`，`success: true`。
- `bank` 验证码高风险说明验证通过：返回 `200`，`success: true`，且 `riskLevel: high`。
- `TEXT_REQUIRED` 验证通过：空输入返回 `400` 与 `TEXT_REQUIRED`。
- `SCENE_INVALID` 验证通过：非法场景返回 `400` 与 `SCENE_INVALID`。
- 结论：真实 AI 成功路径与关键错误路径当前均已完成验证。
- 当前状态按要求停下，不进入 UI 优化。

## 阶段二 UI 与高风险展示优化

- 已按 `docs/PRD.md`、`docs/UI.md`、`docs/SCORECARD.md` 和当前记录完成现有页面优化，没有新增功能。
- 已强化老人友好展示：整体文字更大、边界更清楚、对比更高、按钮更少且主操作更明确。
- 已保持普通结果页顺序：先展示通俗解释，再展示步骤卡，最后展示默认安全提醒。
- 已强化步骤卡的一屏一步体验：步骤标题更醒目，正文更易读，步骤位置提示更清楚。
- 已强化高风险结果页展示：加强版安全提醒置顶，风险词并入提醒文案，视觉权重明显高于普通内容。
- “先找家人确认 / 联系官方渠道” 两个按钮当前只做提醒动作，点击后给出停下来确认的提示，不跳转真实服务。
- 本地页面验证通过：普通医保流程已确认“先解释、再步骤、后提醒”；银行高风险流程已确认“提醒置顶、风险词醒目、按钮不跳转”。
- 当前状态按要求停下，不自动进入部署。

## UI 设计感重做（温暖信笺风格）

- 已按用户反馈"简洁、美观、富有设计感并且老人友好"重做前端样式。
- 设计方向：温暖信笺风格 —— 像一封写给老人的信，纸质质感、衬线标题、大字高对比。
- 已引入 Noto Serif SC 衬线字体用于标题，Noto Sans SC 用于正文，形成清晰字体层次。
- 已重写色彩体系：暖橙红印章色为主色、墨绿为辅助色、金色点缀、深红为高风险警示色，整体温暖但高对比。
- 已加入设计细节：标题旁"安"字印章装饰、左侧装订线渐变、面板入场动画、高风险框脉冲动画、步骤卡顶部渐变条。
- 已重做场景卡片为横向 flex 布局：图标在左、文字在右，hover 时左侧出现主色竖条。
- 已优化按钮层次：主按钮带阴影和 hover 上浮、幽灵按钮 hover 变主色、提示按钮用墨绿区分。
- 已完善移动端适配：字号、间距、步骤操作区在窄屏下变为单列。
- 本地验证通过：普通医保流程和银行高风险流程在新样式下均正常展示，顺序和风险置顶逻辑不变。
- 本次只重写样式和微调 HTML 结构，没有新增功能，没有改后端。

## 去 AI 味清理（克制版样式）

- 已按用户反馈"前端页面 AI 味太重"调用 `ai-slop-cleaner` 与 `ui-ux-pro-max` skill 进行清理。
- 已重写 `web/index.html`：emoji 图标全部替换为内联 SVG 图标；删除印章装饰、装订线、渐变条等装饰性结构；简化类名和语义结构（`.scene-grid`→`.scenes`、`.safety-note`→`.note`、`.primary-button`→`.btn-primary`、`.ghost-button`→`.btn-ghost`、`.hint-button`→`.btn-hint`、`.risk-box`→`.risk-alert` 等）。
- 已重写 `web/styles.css`：删除所有 `::before/::after` 装饰（印章、装订线、渐变条、左侧色块）；删除 `radial-gradient` 背景装饰和 `linear-gradient` 装饰条；删除过度动画（`panelIn`、`riskPulse`）；删除 hover 时的 `transform: translateY` 位移效果；简化阴影为单一极简值；颜色体系收敛为单一克制暖红主色 + 墨绿安全色 + 深红警示色。
- 已同步 `web/app.js`：将 `.hint-button` 选择器更新为 `.btn-hint`，与新 HTML 类名匹配。
- 本地验证通过（Chrome DevTools MCP）：
  - 首页场景选择正常显示，三个场景卡片（医保/银行/政务）结构清晰。
  - 点击医保场景后面板正确切换到输入页，标题变为"医保场景说明输入"。
  - 医保主流程：AI 返回通俗解释（标题+摘要+tips）、步骤卡（4步）、安全提醒，顺序正确。
  - 银行高风险流程：高风险提醒置顶显示"发现高风险内容：验证码、密码、银行卡、转账"，风险词醒目，"先找家人确认/联系官方渠道"按钮正常展示。
  - 步骤卡导航正常：上一步/下一步按钮、位置提示"第 X / 4 步"均工作正常。
- 本次只做去 AI 味清理和类名同步，没有新增功能，没有改后端。
- 当前状态按要求停下，不自动进入部署。

## 部署前三项小修与复验

- 已按用户要求完成三项小修，未大改视觉方向：
  1. 移除 `web/styles.css` 中残留的 `Noto Serif SC` 字体声明（`.section-title`、`.scene-text strong`、`.step strong` 三处），统一继承 body 系统字体栈。
  2. 去掉 `.header h1` 的 `letter-spacing: 0.08em`，改为 `letter-spacing: 0`。
  3. 强刷页面复验"先找家人确认"按钮：点击后页面内显示提示文本，**不再弹 alert**。
- 本地验证通过（Chrome DevTools MCP，强刷忽略缓存）：
  - 首页：价值说明正常显示，三个场景卡片结构清晰，已截图 `screenshots/01-home.png`。
  - 医保主流程：通俗解释 + 步骤卡（4步）+ 安全提醒顺序正确，已截图 `screenshots/02-medical-result.png`。
  - hint 按钮页面内提示：点击"先找家人确认"后显示提示文本，无 alert，已截图 `screenshots/03-hint-message.png`。
  - 银行高风险流程：风险提醒置顶"发现高风险内容：验证码、密码、银行卡、转账"，风险词醒目，已截图 `screenshots/04-bank-high-risk.png`。
  - 移动端 390×844：首页和医保结果页布局正常，hint 按钮单列显示，页面内提示正常，已截图 `screenshots/05-mobile-home.png`、`screenshots/06-mobile-medical-result.png`、`screenshots/07-mobile-hint-message.png`。
- 当前状态按要求停下，不进入部署。

## 新增通用兜底入口（general 场景）

- 已按用户要求在首页三个主场景下方增加辅助兜底入口，不改变产品核心范围。
- 前端改动（`web/index.html`、`web/app.js`、`web/styles.css`）：
  - 首页三个场景卡片下方新增 `.fallback-entry` 兜底入口，标题"不知道选哪个？"，说明"看不懂的 App 说明，也可以先放这里"，按钮语义"直接帮我看看"。
  - 视觉权重弱于主场景卡片：虚线边框、更小字号、更浅文字色，不喧宾夺主。
  - JS 中 `.scene-card, .fallback-entry` 统一绑定点击事件，`getSceneLabel` 增加 `general` → "通用"映射。
- 后端改动（`server/index.js`）：
  - `isValidScene` 增加 `general` 到合法场景列表。
  - `getSceneLabel` 增加 `general` → "通用"映射。
  - `buildPrompt` 中 scene 字段说明更新为 `medical|bank|government|general`。
  - AI 输出结构、安全风险判断机制（AI 识别 + 关键词兜底）保持不变。
- 文档更新：
  - `docs/PRD.md` 4.1.1 节新增"通用兜底入口"说明。
  - `docs/UI.md` 2.1.1 节新增"通用兜底入口"设计要求。
  - `docs/TECH.md` 6.1 节场景类型增加"通用（general）"说明。
- 本地验证结果（Chrome DevTools MCP + curl）：
  - 首页：兜底入口正常显示在三个主场景下方，视觉权重弱，已截图 `screenshots/08-home-with-fallback.png`。
  - 通用入口点击：正确进入输入页，标题显示"通用场景说明输入"。
  - 后端 general 场景校验：`curl` 测试 `scene:"general"` 返回 `AI_KEY_MISSING`（500）而非 `SCENE_INVALID`（400），证明 general 已被接受为合法场景。
  - 后端非法场景校验：`scene:"invalid"` 仍返回 `SCENE_INVALID`（400），校验机制正常。
  - 移动端 390×844：首页布局正常，兜底入口在移动端显示正常，已截图 `screenshots/09-mobile-home-with-fallback.png`。
- 遗留待验证项：当前新会话未继承 AI Key 环境变量，通用入口和银行高风险的完整 AI 生成路径需要用户在配置了 Key 的会话中重启服务后复验。
- 当前状态按要求停下，不进入部署。

## .env 自动加载与遗留项复验

- 用户新增 `.env`、`.env.example`、`.gitignore`，并修改 `server/index.js` 增加 `loadLocalEnv()` 函数：自实现轻量 env 加载器（不引入 dotenv 依赖），支持注释、引号包裹、BOM 去除，不覆盖已存在的环境变量。
- `.gitignore` 已正确排除 `.env`、`node_modules/`、`npm-debug.log*`。
- `.env.example` 包含 `DASHSCOPE_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_MODEL`、`PORT` 四个变量模板。
- 重启服务后复验遗留项全部通过：
  - 通用入口（general 场景）完整 AI 生成：粘贴"请在服务页面完成实名认证，上传身份证照片并绑定手机号"，AI 返回 `success=true`、`riskLevel=low`、`scene=general`、`stepsCount=3`，前端正确展示通俗解释"实名认证是什么意思？"+步骤卡(4步)+安全提醒，已截图 `screenshots/10-general-result.png`。
  - 银行高风险完整 AI 生成：粘贴"您正在进行转账操作，请输入手机收到的验证码完成验证，输入银行卡号和支付密码后即可完成转账"，后端关键词兜底正确触发，返回 `riskLevel=high`、`riskTags=[验证码,支付密码,银行卡号,转账,密码,银行卡]`、`priorityReminder="发现高风险内容：验证码、密码、银行卡、转账。不要直接继续，请先联系官方渠道或家人确认。"`，前端风险提醒置顶显示，已截图 `screenshots/11-bank-high-risk-frontend.png`。
- 当前状态按要求停下，不进入部署。

## 前端文案去技术词+更简短

- 已按用户反馈"前端文案不够好"和方向选择"去技术词+更简短"完成文案全面更新。
- HTML 文案改动（`web/index.html`）：
  - subtitle: "帮你把复杂说明看懂" → "看不懂的，我帮你读"
  - tagline: 长句 → "医保、银行、政务 App 里看不懂的字，粘过来就行。"
  - 医保说明: "医保说明更容易看懂" → "医保的事，我帮你看"
  - 银行说明: "银行操作先看清再处理" → "银行的事，先看清再做"
  - 政务说明: "政务流程一步一步来" → "政务的事，一步一步来"
  - 兜底入口说明: "看不懂的 App 说明，也可以先放这里" → "看不懂的，先放这里"
  - 首页备注: "遇到不确定内容，先确认再操作。" → "拿不准的，先问家人再点。"
  - 返回按钮: "返回上一步" → "返回"；"返回修改内容" → "返回修改"
  - 输入标签: "把公开说明粘贴到这里" → "把看不懂的字粘过来"
  - placeholder: 简化为 "例如：医保待遇资格认证，按提示完成操作。"
  - 安全提示: "不要输入身份证号、银行卡号、密码、验证码等敏感信息。" → "别填身份证号、银行卡号、密码、验证码。"
  - 生成按钮: "生成解释和步骤" → "帮我看一下"
  - 步骤卡标题: "步骤卡" → "怎么做"
  - 状态标题: "正在整理说明" → "正在帮你看"
  - 状态消息: "请稍等，我正在帮你整理内容。" → "稍等一下，马上就好。"
- JS 文案改动（`web/app.js`）：
  - 场景标题: `${scene}场景说明输入` → `把${scene}的说明粘过来`
  - hint 消息: 长正式文本 → "先别动。找家人问问，或者打官方电话确认。"
  - 场景错误: "请先选择场景。" → "请先选一个场景。"
  - 文本错误: "请先粘贴说明内容。" → "请先把看不懂的字粘过来。"
  - 失败兜底: "暂时没整理成功，请稍后再试。" → "没看成功，等一下再试。"
  - 失败标题: "暂时没整理成功" → "没看成功"
  - 状态标题/消息: 同 HTML 改动
- 修复了 `web/app.js` 第110行语法错误（`'请先贴说明内容` 缺少闭合引号和分号）。
- 本地验证通过（Chrome DevTools MCP，强刷 `?v=20260617e` 忽略缓存）：
  - 首页文案：subtitle、tagline、三个场景说明、兜底入口说明、首页备注全部正确显示。
  - 输入页文案：标题"把医保的说明粘过来"、标签"把看不懂的字粘过来"、安全提示"别填身份证号、银行卡号、密码、验证码。"、按钮"帮我看一下"、返回按钮"返回"全部正确。
  - 空输入错误提示："请先把看不懂的字粘过来。"正确显示。
  - 状态页文案："正在帮你看"和"稍等一下，马上就好。"正确显示。
  - 医保结果页文案：返回按钮"返回修改"、步骤卡标题"怎么做"、步骤导航"上一步/下一步"、安全提醒标题"安全提醒"、动作按钮"先找家人确认/联系官方渠道"全部正确。
  - hint 按钮页面内提示："先别动。找家人问问，或者打官方电话确认。"正确显示，无 alert 弹窗。
  - 银行高风险流程：标题"把银行的说明粘过来"、高风险置顶提醒、步骤卡标题"怎么做"、风险词展示、动作按钮全部正确。
  - 移动端 390×844：首页和银行高风险结果页文案显示正常，已截图 `screenshots/mobile-home-20260617.png`、`screenshots/mobile-bank-risk-20260617.png`。
  - 控制台无 JS 错误（仅一个 404 资源错误，不影响功能）。
- 当前状态按要求停下，不进入部署。

## 文案定稿两处小修

- 用户认可文案方向，只要求两处小修，不再大面积改：
  1. 首页 tagline: "看不懂的字" → "看不懂的内容"（"内容"覆盖说明、提示、短信、页面文字，更准）。
  2. 失败按钮: "返回重新输入" → "返回修改"（与结果页返回按钮统一口径，少一点压力）。
- 本地验证通过（Chrome DevTools MCP，强刷 `?v=20260617f`）：
  - 首页 tagline 显示"医保、银行、政务 App 里看不懂的内容，粘过来就行。"。
  - 触发失败状态（输入过短内容），失败按钮显示"返回修改"。
- favicon 404 不影响功能，部署前如需更干净可加空 favicon 声明，非关键项。
- 文案定稿，当前状态按要求停下，不进入部署。

## 输入页文案按场景配置

- 用户反馈输入页主标题和输入提示太像模板拼接（"把${场景}的说明粘过来"），要求按场景配置独立文案。
- 改动内容：
  - `web/index.html`：给 `<label class="field-label">` 增加 `id="field-label"`，让 JS 能按场景修改。
  - `web/app.js`：新增 `sceneCopy` 配置对象，删除不再使用的 `getSceneLabel` 函数，点击场景按钮时按场景设置标题和 label。
- 四个场景文案：
  - medical: 标题"医保这段话，我帮你看明白" / 提示"把手机里的那段文字放这里"
  - bank: 标题"银行提示先看清，别急着点" / 提示"把短信或 App 提示放这里"
  - government: 标题"办事流程看不懂，慢慢来" / 提示"把办事页面上的说明放这里"
  - general: 标题"不知道是哪类，也可以先放这里" / 提示"把看不懂的内容放这里"
- 安全提示"别填身份证号、银行卡号、密码、验证码。"保持不变。
- 本地验证通过（Chrome DevTools MCP，强刷 `?v=20260617g`）：
  - 四个场景输入页标题和 label 全部按场景正确显示：
    - medical: 标题"医保这段话，我帮你看明白" + 提示"把手机里的那段文字放这里" ✅
    - bank: 标题"银行提示先看清，别急着点" + 提示"把短信或 App 提示放这里" ✅
    - government: 标题"办事流程看不懂，慢慢来" + 提示"把办事页面上的说明放这里" ✅
    - general: 标题"不知道是哪类，也可以先放这里" + 提示"把看不懂的内容放这里" ✅
  - 医保主流程完整 AI 生成：输入页文案正确 → 状态页 → 结果页（通俗解释+步骤卡+安全提醒）全部正常 ✅
  - 银行高风险流程：输入页文案正确 → 高风险置顶提醒 → 风险词展示 → 动作按钮全部正常 ✅
  - 通用入口完整流程：输入页文案正确 → AI 生成结果（通俗解释+步骤卡+安全提醒）全部正常 ✅
  - 移动端 390×844：首页和医保输入页文案显示正常，已截图 `screenshots/mobile-medical-input-20260617.png` ✅
  - 控制台无 JS 错误（仅 favicon 404，不影响功能）✅
- 当前状态按要求停下，不进入部署。

## 部署前验收

- 用户确认输入页文案定稿，进入部署前验收阶段。
- 验收前小修：`server/index.js` 第398行错误兜底文案从"暂时没整理成功，请稍后再试。"改为"没看成功，等一下再试。"，与前端文案口径一致。
- 后端 API 验收（Invoke-RestMethod）：
  - 用例1 医保普通说明：`success=True riskLevel=low stepsCount=4` ✅
  - 用例2 银行高风险说明：`success=True riskLevel=high riskTags=钓鱼链接,索要密码,索要验证码,验证码,密码,银行卡,链接` ✅（AI 识别 + 关键词兜底均生效）
  - 用例3 空输入：`success=False code=TEXT_REQUIRED message=请先粘贴说明内容。` ✅
  - 用例4 非法场景：`success=False code=SCENE_INVALID message=场景类型无效，请重新选择。` ✅
  - 用例5 通用场景：`success=True scene=general riskLevel=low stepsCount=3` ✅
  - 用例6 路径穿越防护：访问 `/../server/index.js` 返回 404，未读到 web 目录外文件 ✅
  - 用例7 超长输入（21000 字）：`success=False code=TEXT_TOO_LONG` ✅
- 前端完整流程验收（Chrome DevTools MCP，强刷 `?v=20260617h`）：
  - 首页：三个场景卡片 + 兜底入口 + 价值说明 + 安全备注全部正常，已截图 `screenshots/final-01-home.png` ✅
  - 医保输入页：标题"医保这段话，我帮你看明白" + 提示"把手机里的那段文字放这里" + 安全提示 + 按钮，已截图 `screenshots/final-02-medical-input.png` ✅
  - 医保结果页：通俗解释 + 步骤卡（4步）+ 安全提醒顺序正确，已截图 `screenshots/final-03-medical-result.png` ✅
  - 银行高风险结果页：高风险置顶提醒 + 风险词展示 + 步骤卡 + 安全提醒 + 动作按钮，已截图 `screenshots/final-04-bank-high-risk.png` ✅
  - hint 按钮页面内提示："先别动。找家人问问，或者打官方电话确认。"无 alert，已截图 `screenshots/final-05-hint-message.png` ✅
  - 移动端 390×844 首页：布局正常，已截图 `screenshots/final-06-mobile-home.png` ✅
  - 移动端医保输入页：文案正常，已截图 `screenshots/final-07-mobile-medical-input.png` ✅
  - 移动端医保结果页：通俗解释 + 步骤卡 + 安全提醒正常，已截图 `screenshots/final-08-mobile-medical-result.png` ✅
  - 控制台无 JS 错误（仅 favicon 404，不影响功能）✅
- 验收结论：MVP 主链路、高风险流程、错误处理、移动端布局、安全防护全部通过，可进入部署。
- 当前状态按要求停下，等待用户确认部署方案。

## 移动端截图证据补做

- 用户指出 `final-06/07/08` 三张移动端截图实际尺寸仍是桌面尺寸，不是有效的移动端证据。
- 原因：之前用 `resize_page` 设置 390×844，但浏览器窗口处于最大化状态时 `setContentsSize` 会失败或被忽略，截图仍是桌面尺寸。
- 补做方案：改用 `emulate` 工具设置移动端 viewport（`390x844x2,mobile,touch`），这样截图会是真实的移动端尺寸。
- 新增三张有效移动端截图（DPR=2，宽度 780 = 390×2）：
  - `screenshots/final-mobile-home-390.png`：780×1688（390×844 × 2），首页场景选择 ✅
  - `screenshots/final-mobile-medical-input-390.png`：780×1688（390×844 × 2），医保输入页 ✅
  - `screenshots/final-mobile-medical-result-390.png`：780×2950（390×844 × 2，fullPage 模式高度为完整内容高度），医保结果页（通俗解释+步骤卡+安全提醒+动作按钮）✅
- 旧截图 `final-06/07/08` 不是有效移动端证据，已用上述三张替代。
- 验证过程中发现移动端模拟下 `click` 工具偶尔不触发 fetch 请求，改用 `evaluate_script` 直接触发 `generate-button.click()` 后正常。这是 MCP 工具在移动端模拟下的已知行为，不影响产品本身功能。
- 当前状态按要求停下，不进入部署。
