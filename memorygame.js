//variable declarations
let card = document.getElementsByClassName('card');
let cardsList = [...card]
let openedCards = [];
let matchedCard = document.getElementsByClassName('match');
const deck = document.getElementById('card-deck');

let moves = 0;
let counter = document.querySelector('.moves');

const stars = document.querySelectorAll('.fa-star');
let starsList = document.querySelectorAll('.stars li');

let modal = document.getElementById('popup1')
let closeModal = document.querySelector('.close');

let time = document.querySelector('.clock');
let timeCount = 0;
let clockInterval;

const restartButton = document.getElementsByClassName('restart');


//@description shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

//@description shuffles the deck and resets all conditions
function startGame() {
  cardsList = shuffle(cardsList);
  resetCards();
  resetMoves();
  resetStars();
  resetTimer();
}

//@description resets all card conditions
function resetCards() {
  for (let i = 0; i < cardsList.length; i++) {
    deck.innerHTML = '';
    [].forEach.call(cardsList, function(item) {
      deck.appendChild(item);
    });
    cardsList[i].classList.remove('show', 'open', 'match', 'disabled');
  }
}

//@description resets move counter
function resetMoves() {
  moves = 0;
  counter.innerHTML = moves;
}

//@description resets stars
function resetStars() {
  for (let i= 0; i < stars.length; i++) {
    stars[i].style.visibility = 'visible';
  }
}

//@description resets the clock
function resetTimer() {
	time.innerHTML = '00:00';
	timeCount = 0;
	clearInterval(clockInterval);
}

//@description toggles the card conditions
let displayCard = function () {
  this.classList.toggle('open');
  this.classList.toggle('show');
  this.classList.toggle('disabled');
};

/*@description adds opened cards to a list; function is called based on
whether cards match or unmatch*/
function cardOpen() {
  openedCards.push(this);
  let len = openedCards.length;

  if(len === 2) {
    moveCounter();
    if(openedCards[0].type === openedCards[1].type) {
      matched();
    } else {
      unmatched();
    }
  }
};

/*@description when the cards match up, the match event is trigged;
they then become disabled and remain on display*/
function matched() {
  openedCards[0].classList.add('match', 'disabled');
  openedCards[1].classList.add('match', 'disabled');
  openedCards[0].classList.remove('show', 'open', 'no-event');
  openedCards[1].classList.remove('show', 'open', 'no-event');
  openedCards = [];
}

/*@description when the cards umatch, the unmatch event is triggered; they
open card list is then reset*/
function unmatched() {
  openedCards[0].classList.add('unmatched');
  openedCards[1].classList.add('unmatched');
  disable();

  setTimeout(function() {
    openedCards[0].classList.remove('show', 'open', 'no-event', 'unmatched');
    openedCards[1].classList.remove('show', 'open', 'no-event', 'unmatched');
    enable();
    openedCards = [];
  },1100);
}

//@description disables cards temporarily
function disable() {
  Array.prototype.filter.call(cardsList, function(card) {
    card.classList.add('disabled');
  });
   document.body.style.cursor = 'pointer';
}

//@description enables cards; keeps matched cards disabled
function enable() {
  Array.prototype.filter.call(cardsList, function(card) {
    card.classList.remove('disabled');

    for(let i = 0; i < matchedCard.length; i++) {
      matchedCard[i].classList.add('disabled');
    }
  });
}

/* @description counts player's moves, starts timer at first click, and
sets rating restrictions*/
function moveCounter() {
  moves++;
  counter.innerHTML = moves;

  if (timeCount === 0) {
    timer();
    timeCount++;
  }

  if (moves > 15 && moves < 25) {
    for(i = 0; i < 3; i++) {
      if(i > 1) {
        stars[i].style.visibility = 'collapse';
      }
    }
  } else if (moves > 25) {
    for (i = 0; i < 3; i++) {
      if (i > 0) {
        stars[i].style.visibility = 'collapse';
      }
    }
  }
}

// @description configures the clock
function timer() {
  let minutes = 0;
  let seconds = 0;
  clockInterval = setInterval(function () {
    seconds = parseInt(seconds, 10) + 1;
    minutes = parseInt(minutes, 10);
    if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
    }

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    time.innerHTML = minutes + ':' + seconds;
  }, 1000);
}

/* @description ends the game when all cards match; triggers modal that
displays the user's moves, time, and star rating*/
function endGame() {
  if (matchedCard.length == 16) {
    clearInterval(clockInterval);
    finalTime = time.innerHTML;

    modal.classList.add('show');

    let finalRating = document.querySelector('.stars').innerHTML;

    document.getElementById('finalMoves').innerHTML = moves;
    document.getElementById('finalRating').innerHTML = finalRating;
    document.getElementById('finalTime').innerHTML = finalTime;

    exitModal();
  };
}

// @description closes the modal if the close icon is clicked
function exitModal() {
  closeModal.addEventListener('click', function(e) {
    modal.classList.remove('show');
  });
}

// @desciption resets the game
function playAgain() {
  modal.classList.remove('show');
  startGame();
}

// adds event listeners to each card
for (let i = 0; i < cardsList.length; i++) {
  card = cardsList[i];
  card.addEventListener('click', displayCard);
  card.addEventListener('click', cardOpen);
  card.addEventListener('click', endGame);
};

//adds event listener to restart button
Array.from(restartButton).forEach(el => {
  el.addEventListener('click', function () {
    startGame()
  })
});

// inspiration derived from https://github.com/sandraisrael/Memory-Game-fend/blob/master/js/app.js
