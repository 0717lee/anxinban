const sceneStep = document.getElementById('scene-step');
const inputStep = document.getElementById('input-step');
const resultStep = document.getElementById('result-step');
const statusStep = document.getElementById('status-step');

const sceneTitle = document.getElementById('scene-title');
const fieldLabel = document.getElementById('field-label');
const instructionText = document.getElementById('instruction-text');
const inputError = document.getElementById('input-error');
const generateButton = document.getElementById('generate-button');
const statusTitle = document.getElementById('status-title');
const statusMessage = document.getElementById('status-message');
const statusBack = document.getElementById('status-back');

const explanationTitle = document.getElementById('explanation-title');
const explanationSummary = document.getElementById('explanation-summary');
const explanationTips = document.getElementById('explanation-tips');
const priorityRisk = document.getElementById('priority-risk');
const riskActions = document.getElementById('risk-actions');
const stepCard = document.getElementById('step-card');
const stepPosition = document.getElementById('step-position');
const prevStep = document.getElementById('prev-step');
const nextStep = document.getElementById('next-step');
const hintButtons = document.querySelectorAll('.btn-hint');
const hintMessage = document.getElementById('hint-message');

const verdictBox = document.getElementById('safety-verdict');
const verdictIcon = document.getElementById('verdict-icon');
const verdictTitle = document.getElementById('verdict-title');
const verdictDesc = document.getElementById('verdict-desc');

const verdictConfig = {
  low: {
    cls: 'verdict-low',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-11"/></svg>',
    title: '可以继续办',
    desc: '按下面步骤来就行'
  },
  medium: {
    cls: 'verdict-medium',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v10M12 17v3"/></svg>',
    title: '先看清楚，再继续',
    desc: '有些地方要注意'
  },
  high: {
    cls: 'verdict-high',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>',
    title: '先别点，可能有风险',
    desc: '先找家人或官方渠道确认'
  }
};

function renderVerdict(riskLevel) {
  const config = verdictConfig[riskLevel] || verdictConfig.medium;
  verdictBox.className = `verdict ${config.cls}`;
  verdictIcon.innerHTML = config.svg;
  verdictTitle.textContent = config.title;
  verdictDesc.textContent = config.desc;
  verdictBox.classList.remove('hidden');
}

let selectedScene = '';
let currentSteps = [];
let currentStepIndex = 0;

function showPanel(panel) {
  [sceneStep, inputStep, resultStep, statusStep].forEach((item) => {
    item.classList.remove('active');
    item.classList.add('hidden');
  });
  panel.classList.remove('hidden');
  panel.classList.add('active');
  hintMessage.classList.add('hidden');
}

const sceneCopy = {
  medical: { title: '医保这段话，我帮你看明白', label: '把手机里的那段文字放这里' },
  bank: { title: '银行提示先看清，别急着点', label: '把短信或 App 提示放这里' },
  government: { title: '办事流程看不懂，慢慢来', label: '把办事页面上的说明放这里' },
  general: { title: '不知道是哪类，也可以先放这里', label: '把看不懂的内容放这里' }
};

function renderStep() {
  const step = currentSteps[currentStepIndex];

  stepCard.replaceChildren();

  const titleEl = document.createElement('strong');
  titleEl.textContent = `第 ${step.stepNumber} 步：${step.title}`;

  const contentEl = document.createElement('p');
  contentEl.textContent = step.content;

  stepCard.appendChild(titleEl);
  stepCard.appendChild(contentEl);

  stepPosition.textContent = `第 ${currentStepIndex + 1} / ${currentSteps.length} 步`;
  prevStep.disabled = currentStepIndex === 0;
  nextStep.disabled = currentStepIndex === currentSteps.length - 1;
}

hintButtons.forEach((button) => {
  button.addEventListener('click', () => {
    hintMessage.textContent = '先别动。找家人问问，或者打官方电话确认。';
    hintMessage.classList.remove('hidden');
  });
});

document.querySelectorAll('.scene-card, .fallback-entry').forEach((button) => {
  button.addEventListener('click', () => {
    const nextScene = button.dataset.scene;

    if (selectedScene && selectedScene !== nextScene) {
      instructionText.value = '';
    }

    selectedScene = nextScene;
    const copy = sceneCopy[selectedScene];
    sceneTitle.textContent = copy.title;
    fieldLabel.textContent = copy.label;
    inputError.textContent = '';
    inputError.classList.add('hidden');
    showPanel(inputStep);
  });
});

document.getElementById('back-to-scene').addEventListener('click', () => showPanel(sceneStep));
document.getElementById('back-to-input').addEventListener('click', () => showPanel(inputStep));
statusBack.addEventListener('click', () => showPanel(inputStep));

prevStep.addEventListener('click', () => {
  if (currentStepIndex > 0) {
    currentStepIndex -= 1;
    renderStep();
  }
});

nextStep.addEventListener('click', () => {
  if (currentStepIndex < currentSteps.length - 1) {
    currentStepIndex += 1;
    renderStep();
  }
});

generateButton.addEventListener('click', async () => {
  inputError.classList.add('hidden');

  if (!selectedScene) {
    inputError.textContent = '请先选一个场景。';
    inputError.classList.remove('hidden');
    return;
  }

  const pastedText = instructionText.value.trim();

  if (!pastedText) {
    inputError.textContent = '请先把看不懂的字粘过来。';
    inputError.classList.remove('hidden');
    return;
  }

  if (pastedText.length < 10) {
    inputError.textContent = '这段太短了，多贴几句完整说明。';
    inputError.classList.remove('hidden');
    return;
  }

  generateButton.disabled = true;
  generateButton.textContent = '正在看...';
  statusTitle.textContent = '正在帮你看';
  statusMessage.textContent = '稍等一下，马上就好。';
  statusBack.classList.add('hidden');
  showPanel(statusStep);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene: selectedScene, text: pastedText })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result?.error?.message || '没看成功，等一下再试。');
    }

    const data = result.data;
    renderVerdict(data.riskLevel);
    explanationTitle.textContent = data.plainExplanation.title;
    explanationSummary.textContent = data.plainExplanation.summary;
    explanationTips.innerHTML = '';
    data.plainExplanation.tips.forEach((tip) => {
      const item = document.createElement('li');
      item.textContent = tip;
      explanationTips.appendChild(item);
    });

    currentSteps = data.steps;
    currentStepIndex = 0;
    renderStep();

    if (data.riskLevel === 'high') {
      priorityRisk.textContent = data.safety.priorityReminder;
      priorityRisk.classList.remove('hidden');
      riskActions.classList.remove('hidden');
    } else {
      priorityRisk.classList.add('hidden');
      priorityRisk.textContent = '';
      riskActions.classList.add('hidden');
    }

    showPanel(resultStep);
  } catch (error) {
    statusTitle.textContent = '没看成功';
    statusMessage.textContent = error.message;
    statusBack.classList.remove('hidden');
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = '帮我看一下';
  }
});
