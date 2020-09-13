let animator;
let currPos = 1;
const kanji = document.getElementById('kanji');
let kanjiSvg;

function loadConfig() {
  if (localStorage.getItem('darkMode') == 1) {
    document.documentElement.dataset.theme = 'dark';
  }
}
loadConfig();

function toggleDarkMode() {
  if (localStorage.getItem('darkMode') == 1) {
    localStorage.setItem('darkMode', 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem('darkMode', 1);
    document.documentElement.dataset.theme = 'dark';
  }
}

function prev() {
  animator.stop().finish();
  currPos -= 1;
  if (currPos < 1) { currPos = 1 };
  var i = 1;
  while(true) {
    var path = kanjiSvg.getElementById('kvg:' + kanjiId + '-s' + i);
    if (path) {
      if (i < currPos) {
        path.setAttribute('stroke', 'black');
      } else if (i == currPos) {
        path.setAttribute('stroke', 'red');
      } else {
        path.setAttribute('stroke', 'none');
      }
    } else {
      break;
    }
    i += 1;
  }
}
function stop() {
  animator.stop().finish();
  currPos = 0;
  var i = 1;
  while(true) {
    var path = kanjiSvg.getElementById('kvg:' + kanjiId + '-s' + i);
    if (path) {
      path.setAttribute('stroke', 'black');
    } else {
      break;
    }
    i += 1;
  }
  document.getElementById('stop').classList.add('d-none');
  document.getElementById('play').classList.remove('d-none');
}
function play() {
  animator.reset().play();
  var i = 1;
  while(true) {
    var path = kanjiSvg.getElementById('kvg:' + kanjiId + '-s' + i);
    if (path) {
      path.setAttribute('stroke', 'black');
    } else {
      break;
    }
    i += 1;
  }
  document.getElementById('stop').classList.remove('d-none');
  document.getElementById('play').classList.add('d-none');
}
function next() {
  animator.stop().finish();
  var kakusu = getKakusu();
  if (currPos < kakusu) {
    currPos += 1;
  }
  var i = 1;
  while(true) {
    var path = kanjiSvg.getElementById('kvg:' + kanjiId + '-s' + i);
    if (path) {
      if (i < currPos) {
        path.setAttribute('stroke', 'black');
      } else if (i == currPos) {
        path.setAttribute('stroke', 'red');
      } else {
        path.setAttribute('stroke', 'none');
      }
    } else {
      break;
    }
    i += 1;
  }
}
function getKakusu() {
  var kakusu = 1;
  while(true) {
    var path = kanjiSvg.getElementById('kvg:' + kanjiId + '-s' + kakusu);
    if (path) {
      kakusu += 1;
    } else {
      break;
    }
  }
  return kakusu - 1;
}
function addHitujun() {
  var hitujun = document.getElementById('hitujun');
  var kakusu = getKakusu();
  for (var i=1; i<=kakusu; i++) {
    var svg = kanjiSvg.cloneNode(true);
    svg.setAttribute('width', 64);
    svg.setAttribute('height', 64);
    svg.removeAttribute('id');
    for (var j=i+1; j<=kakusu; j++) {
      // cloneNode した要素は Safari だけ getElementById が動かない
      var id = 'kvg:' + kanjiId + '-s' + j;
      var path = svg.querySelector('[id="' + id + '"]');
      path.setAttribute('stroke', 'lightgray');
      path.removeAttribute('id');
    }
    hitujun.appendChild(svg);
  }
}
function addAnimation() {
  function kanjiAnimation() {
    var kakusu = getKakusu();
    animator = new Vivus('kanji', { type: 'oneByOne', duration: kakusu * 50 }, function() {
      setTimeout(kanjiAnimation, 2000);
    });
  }
  kanjiAnimation();
  document.getElementById('kanji').addEventListener('click', function() {
    if (kanji.dataset.active == 'false') {
      animator.play();
      kanji.dataset.active = 'true';
    } else {
      animator.stop();
      kanji.dataset.active = 'false';
    }
  });
}

function init(object) {
  kanjiSvg = kanji.contentDocument.getElementsByTagName('svg')[0];
  addHitujun();
  addAnimation();
}

