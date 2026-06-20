# 安心办

安心办是一个面向老人本人使用的 AI 数字生活助手 Demo。它帮助老人把医保、银行、政务 App 里看不懂的公开说明文本，转换成更容易理解的通俗解释、步骤卡和安全结论。

项目为 TRAE AI 创造力大赛作品，当前版本重点展示一条主流程：

选择场景 -> 粘贴说明 -> AI 生成解释 -> 查看安全结论 -> 查看步骤卡

线上体验：<https://anxinban.onrender.com/>

## 这个 Demo 解决什么问题

很多老人不是不会用手机，而是被 App 里的说明文字、弹窗提示、业务术语和风险信息卡住了。安心办不替老人办理业务，也不接入真实医保、银行、政务系统；它只做一件事：把公开说明讲清楚，并在有风险时提醒先停下来确认。

## 核心功能

- **场景选择**：支持医保、银行、政务，以及“不知道选哪个”的通用入口。
- **通俗解释**：把复杂说明改写成老人更容易理解的话。
- **步骤卡**：把操作拆成一屏一步，降低阅读和操作压力。
- **安全结论卡**：结果页顶部先给出“可以继续办 / 先看清楚 / 先别点”的判断。
- **高风险提醒**：遇到验证码、密码、银行卡、转账、链接等内容时，置顶提醒先找家人或官方渠道确认。

## 技术方案

项目保持轻量，方便比赛演示和快速部署。

- 前端：原生 HTML / CSS / JavaScript
- 后端：Node.js 原生 `http` 服务
- AI 调用：兼容 OpenAI Chat Completions 格式，当前支持阿里云百炼兼容模式
- 部署：Render Web Service

后端统一返回：

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

失败时：

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "TEXT_TOO_SHORT",
    "message": "这段内容太短，建议补充完整说明。"
  }
}
```

## 本地运行

需要 Node.js 18 或更高版本，因为项目使用 Node 内置 `fetch`。

安装依赖：

```bash
npm install
```

创建本地环境变量文件：

```bash
cp .env.example .env
```

在 `.env` 中填写：

```env
DASHSCOPE_API_KEY=你的百炼 API Key
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen-plus
PORT=3000
```

启动服务：

```bash
npm start
```

打开：

```text
http://localhost:3000
```

## 环境变量

| 变量名 | 必填 | 说明 |
| --- | --- | --- |
| `DASHSCOPE_API_KEY` | 是 | 阿里云百炼 API Key。后端会优先读取 `OPENAI_API_KEY`，也兼容 `DASHSCOPE_API_KEY`。 |
| `OPENAI_BASE_URL` | 是 | AI 服务地址。百炼兼容模式为 `https://dashscope.aliyuncs.com/compatible-mode/v1`。 |
| `OPENAI_MODEL` | 是 | 模型名，例如 `qwen-plus`。 |
| `PORT` | 否 | 本地或部署平台端口，默认 `3000`。 |

不要把 `.env` 提交到仓库。仓库只保留 `.env.example` 作为模板。

## API 说明

### `POST /api/generate`

请求体：

```json
{
  "scene": "medical",
  "text": "这里粘贴公开说明文本"
}
```

`scene` 可选值：

- `medical`：医保
- `bank`：银行
- `government`：政务
- `general`：通用

输入校验：

- 空文本返回 `TEXT_REQUIRED`
- 去掉前后空白后少于 10 个字符返回 `TEXT_TOO_SHORT`
- 非法场景返回 `SCENE_INVALID`
- 超长文本返回 `TEXT_TOO_LONG`

## 安全边界

安心办只解释公开说明，不办理真实业务。

当前版本明确不做：

- 不做登录注册
- 不保存历史记录
- 不接入真实医保、银行、政务接口
- 不收集身份证号、银行卡号、密码、验证码、支付信息等敏感信息
- 不跳转到真实支付、转账、登录或业务办理页面

如果输入内容涉及验证码、密码、银行卡、转账、链接、陌生电话等风险词，系统会提高风险等级，并提示先找家人或官方渠道确认。

## 部署到 Render

Render 配置建议：

| 配置项 | 值 |
| --- | --- |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Environment | 添加 `DASHSCOPE_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_MODEL` |

Render 免费版可能会在一段时间无访问后休眠，首次唤醒可能需要等待几十秒。

## 项目结构

```text
.
├── server/
│   └── index.js          # Node 后端和 AI 调用
├── web/
│   ├── index.html        # 单页界面
│   ├── app.js            # 前端交互逻辑
│   └── styles.css        # 页面样式
├── docs/
│   ├── PRD.md            # 产品需求文档
│   ├── UI.md             # UI 设计说明
│   ├── TECH.md           # 技术方案
│   ├── PLAN.md           # MVP 开发计划
│   ├── SCORECARD.md      # 评分维度对照
│   ├── AI-VALIDATION.md  # AI 接入验证说明
│   ├── SUBMIT.md         # 提交材料清单
│   └── POST.md           # 作品帖文案
├── .env.example          # 环境变量模板
├── package.json          # 启动脚本
└── README.md
```

## 验证命令

检查前后端语法：

```bash
node --check server/index.js
node --check web/app.js
```

启动后可验证短文本错误：

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"scene":"medical","text":"123456789"}'
```

预期返回 `TEXT_TOO_SHORT`。
