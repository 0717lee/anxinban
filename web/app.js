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
const defaultRisk = document.getElementById('default-risk');
const stepCard = document.getElementById('step-card');
const stepPosition = document.getElementById('step-position');
const prevStep = document.getElementById('prev-step');
const nextStep = document.getElementById('next-step');
const hintButtons = document.querySelectorAll('.btn-hint');
const hintMessage = document.getElementById('hint-message');

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
    selectedScene = button.dataset.scene;
    const copy = sceneCopy[selectedScene];
    sceneTitle.textContent = copy.title;
    fieldLabel.textContent = copy.label;
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

  if (!instructionText.value.trim()) {
    inputError.textContent = '请先把看不懂的字粘过来。';
    inputError.classList.remove('hidden');
    return;
  }

  statusTitle.textContent = '正在帮你看';
  statusMessage.textContent = '稍等一下，马上就好。';
  statusBack.classList.add('hidden');
  showPanel(statusStep);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene: selectedScene, text: instructionText.value.trim() })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result?.error?.message || '没看成功，等一下再试。');
    }

    const data = result.data;
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

    defaultRisk.textContent = data.safety.defaultReminder;

    if (data.riskLevel === 'high') {
      priorityRisk.textContent = data.safety.priorityReminder;
      priorityRisk.classList.remove('hidden');
      defaultRisk.textContent = `${data.safety.defaultReminder} 风险词：${data.riskTags.join('、')}`;
    } else {
      priorityRisk.classList.add('hidden');
      priorityRisk.textContent = '';
    }

    showPanel(resultStep);
  } catch (error) {
    statusTitle.textContent = '没看成功';
    statusMessage.textContent = error.message;
    statusBack.classList.remove('hidden');
  }
});
