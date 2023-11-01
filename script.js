var wordChoices = [
    'hangman',
    'untitled',
    'captain',
    'anonymous',
    'save',
    'settings',
    'change view',
    'log in',
    'sign up',
    'console',
    'assets',
    'shortcuts',
    'comments',
    'delete',
    'collections',
    'fork',
    'share',
    'export',
    'embed'
  ];
  
  var result = 0;
  var wordStorage = '';
  var guesses = '';
  var missStorage = '';
  var word = document.querySelector('#word');
  var guess = document.querySelector('#guess');
  var misses = document.querySelector('#misses');
  var man = document.querySelectorAll('.man-0');
  
  function generateWordStorage() {
    wordStorage = wordChoices[Math.floor(Math.random() * wordChoices.length)];
  }
  
  function generateGuessWord() {
    var guessWord = '';
    var isFinish = true;
  
    for (var i = 0; i < wordStorage.length; i++) {
      if (wordStorage[i] != ' ') {
        if (guesses.toUpperCase().indexOf(wordStorage[i].toUpperCase()) >= 0) {
          guessWord += wordStorage[i].toUpperCase() + '&nbsp;';
        } else {
          guessWord += '_&nbsp;';
          isFinish = false;
        }
      } else {
        guessWord += '&nbsp;&nbsp;';
      }
    }
  
    word.innerHTML = 'WORD: ' + guessWord;
  
    if (isFinish) {
      result = 1;
    }
  }
  
  function generateMisses() {
    var missedLetters = '';
  
    for (var i = 0; i < man.length; i++) {
      man[i].style.display = 'none';
    }
  
    for (var i = 0; i < missStorage.length; i++) {
      document.querySelector('.man-' + (i + 1)).style.display = 'block';
      missedLetters += missStorage[i] + ', ';
    }
  
    missedLetters = missedLetters.substring(0, missedLetters.length - 2);
    misses.innerHTML = 'MISSES: ' + missedLetters;
  
    if (missStorage.length >= 6) {
      result = 2;
    }
  }
  
  function initializeGame() {
    result = 0;
    wordStorage = '';
    guesses = '';
    missStorage = '';
  
    word.innerText = '';
    guess.value = '';
    misses.innerText = '';
  
    generateWordStorage();
    generateGuessWord();
    generateMisses();
  
    guess.disabled = false;
  }
  
  initializeGame();
  
  guess.addEventListener('keypress', function(evt) {
    if (evt.keyCode === 13) {
      if (result === 0) {
        var getTime = setInterval(function() {
          if (wordStorage.toUpperCase().indexOf(guess.value.toUpperCase()) >= 0) {
            guesses += guess.value.toUpperCase();
          } else {
            if (missStorage.toUpperCase().indexOf(guess.value.toUpperCase()) < 0) {
              missStorage += guess.value.toUpperCase();
            }
          }
  
          guess.value = '';
  
          generateGuessWord();
          generateMisses();
  
          clearInterval(getTime);
  
          var getTime2 = setInterval(function() {
            if (result === 1) {
              guess.disabled = true;
  
              if (confirm('You won! You have ' + missStorage.length + ' miss(es). ' + 'Do you like to try again?')) {
                initializeGame();
              }
            } else if (result === 2) {
              guess.disabled = true;
  
              if (confirm('You lose! The answer is "' + wordStorage + '". Better luck next time. Do you like to try again?')) {
                initializeGame();
              }
            }
  
            clearInterval(getTime2);
          });
        }, 100);
      }
    }
  });
  function createKeyboard() {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
  
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
    alphabet.forEach(letter => {
      const button = document.createElement('button');
      button.textContent = letter.toUpperCase();
      button.addEventListener('click', function() {
        if (result === 0) {
          if (wordStorage.toUpperCase().includes(letter.toUpperCase())) {
            guesses += letter.toUpperCase();
          } else {
            if (!missStorage.toUpperCase().includes(letter.toUpperCase())) {
              missStorage += letter.toUpperCase();
            }
          }
          generateGuessWord();
          generateMisses();
          checkResult();
        }
      });
      keyboard.appendChild(button);
    });
  
    document.body.appendChild(keyboard);
  }
  
  createKeyboard();
  
  function updateLeaderboard(name, score) {
    const leaders = JSON.parse(localStorage.getItem('hangmanLeaders')) || [];
    leaders.push({ name, score });
    leaders.sort((a, b) => a.score - b.score);
    localStorage.setItem('hangmanLeaders', JSON.stringify(leaders));
  }
  
  function displayLeaderboard() {
    const leaders = JSON.parse(localStorage.getItem('hangmanLeaders')) || [];
    const leaderboard = document.createElement('div');
    leaderboard.classList.add('leaderboard');
  
    const title = document.createElement('h2');
    title.textContent = 'Leaderboard';
    leaderboard.appendChild(title);
  
    leaders.forEach((leader, index) => {
      const leaderElement = document.createElement('div');
      leaderElement.textContent = `${index + 1}. ${leader.name} - ${leader.score}`;
      leaderboard.appendChild(leaderElement);
    });
  
    document.body.appendChild(leaderboard);
  }
  
  function checkResult() {
    if (result === 1 || result === 2) {
      guess.disabled = true;
  
      const message =
        result === 1
          ? `You won! You have ${missStorage.length} miss(es). Do you like to try again?`
          : `You lose! The answer is "${wordStorage}". Better luck next time. Do you like to try again?`;
  
      if (result === 1) {
        const name = prompt('You won! Enter your name for the leaderboard:');
        updateLeaderboard(name, missStorage.length);
      }
  
      if (confirm(message)) {
        initializeGame();
        displayLeaderboard();
      }
    }
  }
  