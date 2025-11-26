const ITEMS = [
  {emoji:'🍌', type:'organic'},
  {emoji:'🍎', type:'organic'},
  {emoji:'🥕', type:'organic'},
  {emoji:'📦', type:'recyclable'},
  {emoji:'🥤', type:'recyclable'},
  {emoji:'🧴', type:'recyclable'},
  {emoji:'🍬', type:'trash'},
  {emoji:'🧻', type:'trash'},
  {emoji:'🚬', type:'trash'}
];

let score = 0;
let lives = 5;

const itemsContainer = document.getElementById('itemsContainer');
const bins = document.querySelectorAll('.bin');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }

function renderItems(){
  itemsContainer.innerHTML = '';
  shuffle(ITEMS).forEach((item, index)=>{
    const div = document.createElement('div');
    div.className = 'item';
    div.textContent = item.emoji;
    div.setAttribute('draggable','true');
    div.dataset.type = item.type;
    div.dataset.index = index;
    itemsContainer.appendChild(div);
  });
  addDragEvents();
}

function addDragEvents(){
  const itemEls = document.querySelectorAll('.item');
  itemEls.forEach(item=>{
    item.addEventListener('dragstart', e=>{
      e.dataTransfer.setData('text/plain', item.dataset.index);
    });
  });

  bins.forEach(bin=>{
    bin.addEventListener('dragover', e=>{ e.preventDefault(); bin.classList.add('over'); });
    bin.addEventListener('dragleave', e=>{ bin.classList.remove('over'); });
    bin.addEventListener('drop', e=>{
      e.preventDefault(); bin.classList.remove('over');
      const idx = e.dataTransfer.getData('text/plain');
      const item = ITEMS[idx];
      checkAnswer(item.type, e.currentTarget.dataset.type, idx);
    });

    bin.addEventListener('click', ()=>{
      const focused = document.querySelector('.item.focused');
      if(focused) checkAnswer(focused.dataset.type, bin.dataset.type, focused.dataset.index);
    });
  });
}

function checkAnswer(itemType, binType, idx){
  const itemEl = document.querySelector(`.item[data-index='${idx}']`);
  if(itemEl.dataset.done) return;
  if(itemType === binType){
    score++;
    messageEl.textContent = 'جيد إجابة صحيحة 🎉';
    itemEl.style.opacity = '0.5';
  } else{
    lives--;
    messageEl.textContent = 'خاطئ حاول مرة أخرى ❌';
  }
  itemEl.dataset.done = 'true';
  updateUI();
  if(lives===0) setTimeout(()=>alert('انتهت المحاولات! النقاط: '+score),200);
}

function updateUI(){
  scoreEl.textContent = score;
  livesEl.textContent = lives;
}

resetBtn.addEventListener('click', ()=>{
  score=0; lives=5; messageEl.textContent=''; renderItems(); updateUI();
});

renderItems();
updateUI();
