# 安心办真实 AI 验证说明

## 1. 环境变量

### 1.1 OpenAI 兼容方式

```bash
OPENAI_API_KEY=你的key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4.1-mini
```

### 1.2 阿里云百炼方式

```bash
DASHSCOPE_API_KEY=你的百炼key
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen-plus
```

说明：当前后端会优先读取 `OPENAI_API_KEY`，同时兼容 `DASHSCOPE_API_KEY`，方便后续接入阿里云百炼。

## 2. 本地启动

```bash
npm start
```

启动后访问：

```text
http://localhost:3000/
```

## 3. 验证用例

### 3.1 普通医保说明

- 输入医保服务说明文本。
- 预期：`success: true`。
- `data` 包含通俗解释、步骤卡、安全提醒、`riskLevel`、`riskTags`。

### 3.2 银行高风险验证码

- 输入包含“验证码”的银行说明。
- 预期：`success: true`。
- `riskLevel` 为 `high`。
- `priorityReminder` 置顶提醒不要直接继续。

### 3.3 AI 返回结构异常

- 模拟 AI 返回非 JSON、空内容或缺字段。
- 预期：`success: false`。
- `error.code` 为 `AI_RESPONSE_INVALID`、`AI_RESPONSE_EMPTY` 或 `AI_REQUEST_FAILED`。

### 3.4 空输入

- 说明文本留空直接提交。
- 预期：`success: false`。
- `error.code` 为 `TEXT_REQUIRED`。

## 4. 验证原则

- 不允许 fallback 假成功。
- 成功必须来自真实 AI 返回。
- 失败必须真实返回错误。
- 没有可用 Key 时，只保留说明，不进入 UI 优化。
