
const menu = document.querySelector('#menu');
const demo = document.querySelector('#demo');
const modeLabel = document.querySelector('#modeLabel');
const demoTitle = document.querySelector('#demoTitle');
const badControls = document.querySelector('#badControls');
const goodControls = document.querySelector('#goodControls');
const countdownEl = document.querySelector('#countdown');
const result = document.querySelector('#result');
const resultKicker = document.querySelector('#resultKicker');
const resultTitle = document.querySelector('#resultTitle');
const resultText = document.querySelector('#resultText');
const explanation = document.querySelector('#explanation');
const explanationList = document.querySelector('#explanationList');
const confirmRead = document.querySelector('#confirmRead');
const goodAcceptBtn = document.querySelector('#goodAcceptBtn');

let currentMode = null;
let timer = null;
let seconds = 10;

document.querySelectorAll('.mode-card').forEach(btn => {
  btn.addEventListener('click', () => startMode(btn.dataset.mode));
});

document.querySelector('#backBtn').addEventListener('click', backToMenu);
document.querySelector('#retryBtn').addEventListener('click', () => startMode(currentMode));
document.querySelector('#rejectOnlyBtn').addEventListener('click', () => finishBad(false));
document.querySelector('#goodRejectBtn').addEventListener('click', () => finishGood(false));
goodAcceptBtn.addEventListener('click', () => finishGood(true));

confirmRead.addEventListener('change', () => {
  goodAcceptBtn.disabled = !confirmRead.checked;
});

function startMode(mode){
  clearInterval(timer);
  currentMode = mode;
  menu.classList.add('hidden');
  demo.classList.remove('hidden');
  result.classList.add('hidden');
  explanation.classList.add('hidden');
  badControls.classList.add('hidden');
  goodControls.classList.add('hidden');

  if(mode === 'bad'){
    modeLabel.textContent = 'BAD EXAMPLE';
    demoTitle.textContent = '悪い例：時間切れで「みなし同意」';
    badControls.classList.remove('hidden');
    seconds = 10;
    countdownEl.textContent = seconds;

    timer = setInterval(() => {
      seconds -= 1;
      countdownEl.textContent = seconds;
      if(seconds <= 0){
        clearInterval(timer);
        finishBad(true);
      }
    }, 1000);
  }else{
    modeLabel.textContent = 'BETTER EXAMPLE';
    demoTitle.textContent = '適切な例：明示的な同意';
    goodControls.classList.remove('hidden');
    confirmRead.checked = false;
    goodAcceptBtn.disabled = true;
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

function finishBad(autoAccepted){
  clearInterval(timer);
  badControls.classList.add('hidden');
  result.classList.remove('hidden');
  explanation.classList.remove('hidden');

  if(autoAccepted){
    resultKicker.textContent = 'AUTO ACCEPTED';
    resultTitle.textContent = '何も押していないのに「同意済み」になりました';
    resultText.textContent =
      'ユーザーは積極的な承諾操作をしていません。それでも時間が経過しただけで「同意した」と扱われるため、意思確認として非常に弱い設計です。';
  }else{
    resultKicker.textContent = 'REJECTED';
    resultTitle.textContent = '時間内に拒否しました';
    resultText.textContent =
      'このUIでは、ユーザーが同意しないために能動的に行動しなければなりません。放置・離席・読み込み中なども「同意」に変換されてしまいます。';
  }

  explanationList.innerHTML = `
    <li>同意するための明示的な操作が存在しない。</li>
    <li>「何もしない」という状態を、運営側に都合のよい意思表示へ変換している。</li>
    <li>ユーザーが規約を読んでいる最中でもカウントダウンが進む。</li>
    <li>離席・画面放置・操作不能と「同意」を区別できない。</li>
    <li>拒否する側だけに時間制限付きの操作負担を課している。</li>
  `;
}

function finishGood(accepted){
  goodControls.classList.add('hidden');
  result.classList.remove('hidden');
  explanation.classList.remove('hidden');

  resultKicker.textContent = accepted ? 'ACCEPTED' : 'DECLINED';
  resultTitle.textContent = accepted ? '明示的に同意しました' : '明示的に同意しませんでした';
  resultText.textContent = accepted
    ? 'ユーザー自身が確認チェックを入れたうえで「同意する」を押しました。時間経過だけでは結果は変化しません。'
    : '「同意しない」を選択しました。ユーザーの意思がそのまま結果に反映されています。';

  explanationList.innerHTML = `
    <li>「同意する」「同意しない」の選択肢が明示されている。</li>
    <li>時間切れによる自動的な意思決定がない。</li>
    <li>同意操作がログとして記録しやすい。</li>
    <li>ユーザーが読むための時間を奪わない。</li>
    <li>同意しない選択にも不必要な不利益や圧力を加えていない。</li>
  `;
}

function backToMenu(){
  clearInterval(timer);
  demo.classList.add('hidden');
  menu.classList.remove('hidden');
  currentMode = null;
  window.scrollTo({top:0,behavior:'smooth'});
}
