const ITEMS = [
  {emoji:'🍌', type:'organic'},   // موزة
  {emoji:'🍎', type:'organic'},   // تفاحة
  {emoji:'🥕', type:'organic'},   // جزرة
  {emoji:'🍾', type:'glass'},     // قارورة زجاج
  {emoji:'🍷', type:'glass'},     // كأس زجاج
  {emoji:'🥛', type:'glass'},     // زجاجة حليب (زجاج)
  {emoji:'🥤', type:'plastic'},   // كوب بلاستيك
  {emoji:'🧴', type:'plastic'},   // زجاجة مستحضرات بلاستيك
  {emoji:'🥡', type:'plastic'},   // علبة بلاستيك
  {emoji:'🍬', type:'trash'},     // غلاف حلوى
  {emoji:'🧻', type:'trash'},     // منديل ورقي
  {emoji:'🚬', type:'trash'}      // رماد سجائر
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
    score
