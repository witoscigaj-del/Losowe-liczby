const numbers = [
  '4827',
  '1359',
  '7604',
  '2918',
  '8431',
  '5176',
  '9042',
  '2685',
  '7310',
  '4563'
];

let shuffledNumbers = [];
let index = 0;
let good = 0;
let answer = '';
let userAge = 0;

const startBtn = document.getElementById('startBtn');
const ageInput = document.getElementById('ageInput');

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');

const number = document.getElementById('number');
const rememberBtn = document.getElementById('rememberBtn');
const game = document.getElementById('game');
const keypad = document.getElementById('keypad');
const answerBox = document.getElementById('answer');
const result = document.getElementById('result');
const feedback = document.getElementById('feedback');

function shuffle(array){
  return [...array].sort(() => Math.random() - 0.5);
}

startBtn.onclick = () => {

  const age = parseInt(ageInput.value);

  if(!age){
    alert("Podaj wiek");
    return;
  }

  userAge = age;

  shuffledNumbers = shuffle(numbers);

  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  show();
};

function show(){

  feedback.textContent = '';

  if(index >= shuffledNumbers.length){

    finishGame();
    return;
  }

  answer = '';
  answerBox.textContent = '';

  number.textContent = shuffledNumbers[index];

  rememberBtn.classList.remove('hidden');
  game.classList.add('hidden');
}

function createKeypad(){

  keypad.innerHTML = '';

  shuffle([
    '0','1','2','3','4',
    '5','6','7','8','9'
  ]).forEach(n => {

    const btn = document.createElement('button');

    btn.textContent = n;

    btn.onclick = () => press(n);

    keypad.appendChild(btn);
  });
}

function press(n){

  if(answer.length >= 4) return;

  answer += n;

  answerBox.textContent = answer;

  if(answer.length === 4){

    checkAnswer();
  }
}

function checkAnswer(){

  if(answer === shuffledNumbers[index]){

    good++;

    feedback.textContent = 'DOBRA ODPOWIEDŹ';
    feedback.className = 'feedback correct';

  } else {

    feedback.textContent =
      `ZŁA ODPOWIEDŹ (${shuffledNumbers[index]})`;

    feedback.className = 'feedback wrong';
  }

  index++;

  setTimeout(show, 1200);
}

rememberBtn.onclick = () => {

  number.textContent = '????';

  rememberBtn.classList.add('hidden');

  game.classList.remove('hidden');

  createKeypad();
};

function finishGame(){

  number.innerHTML = 'KONIEC';

  rememberBtn.classList.add('hidden');
  game.classList.add('hidden');

  const percent =
    Math.round((good / shuffledNumbers.length) * 100);

  result.innerHTML = `
    Wynik: ${good}/${shuffledNumbers.length}
    <br>
    Skuteczność: ${percent}%
  `;

  saveResult(percent);
}

function saveResult(percent){

  const results =
    JSON.parse(localStorage.getItem('memoryResults')) || [];

  results.push({
    age: userAge,
    good: good,
    percent: percent,
    date: new Date().toLocaleString()
  });

  localStorage.setItem(
    'memoryResults',
    JSON.stringify(results)
  );
}

/* =========================
   PANEL ADMINA
========================= */

const adminPassword =
  document.getElementById('adminPassword');

const adminLoginBtn =
  document.getElementById('adminLoginBtn');

const adminPanel =
  document.getElementById('adminPanel');

const adminTable =
  document.getElementById('adminTable');

const ageStats =
  document.getElementById('ageStats');

adminLoginBtn.onclick = () => {

  if(adminPassword.value !== 'admin123'){
    alert('Błędne hasło');
    return;
  }

  adminPanel.classList.remove('hidden');

  loadAdminData();
};

function loadAdminData(){

  const results =
    JSON.parse(localStorage.getItem('memoryResults')) || [];

  adminTable.innerHTML = '';

  results.forEach(r => {

    adminTable.innerHTML += `
      <tr>
        <td>${r.age}</td>
        <td>${r.good}</td>
        <td>${r.percent}%</td>
      </tr>
    `;
  });

  generateAgeStats(results);
}

function generateAgeStats(results){

  let groups = {
    "0-12": [],
    "13-18": [],
    "19-30": [],
    "31-50": [],
    "51+": []
  };

  results.forEach(r => {

    if(r.age <= 12){
      groups["0-12"].push(r.percent);
    }
    else if(r.age <= 18){
      groups["13-18"].push(r.percent);
    }
    else if(r.age <= 30){
      groups["19-30"].push(r.percent);
    }
    else if(r.age <= 50){
      groups["31-50"].push(r.percent);
    }
    else{
      groups["51+"].push(r.percent);
    }
  });

  ageStats.innerHTML = '';

  for(let group in groups){

    let arr = groups[group];

    let avg = 0;

    if(arr.length > 0){

      avg =
        Math.round(
          arr.reduce((a,b)=>a+b,0) / arr.length
        );
    }

    ageStats.innerHTML += `
      <p>
        <strong>${group}</strong>:
        średnia skuteczność ${avg}%
      </p>
    `;
  }
}
