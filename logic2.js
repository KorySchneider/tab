'use strict'

window.onload = function() {
  clock();
  loadOptions();
}

var SETTINGS = JSON.parse(localStorage.getItem('userOptions'));

var commands = [
  { command: 'g', url: 'https://www.google.com', search: '/search?q=' },
  { command: 'r', url: 'https://www.reddit.com', search: '/r/' },
  { command: 'y', url: 'https://www.youtube.com', search: '/results?search_query=' },
  { command: 'a', url: 'https://smile.amazon.com', search: '/s/?field-keywords=' },
  { command: 'w', url: 'https://www.wikipedia.org', search: '/w/index.php?title=Special:Search&search=' },
  { command: 'wa', url: 'https://www.wolframalpha.com', search: '/input/?i=' },
  { command: 'imdb', url: 'https://www.imdb.com', search: '/find?s=all&q=' },
  { command: 'img', url: 'https://www.google.com', search: '/search?tbm=isch&q=' },
  { command: 't', url: '', search: '' }
];

// Input
function verifyKey(e) {
  var keycode;
  if (window.event) {
    keycode = window.event.keyCode;
  } else if (e) {
    keycode = e.which;
  }
  if (keycode == 13) { // Enter/return key
    clearContent();
    interpret();
  }
  checkInputLength();
}

function checkInputLength() {
  var input = document.getElementById('input-box');
  if (input.value.length >= (input.size - 1)) {
     input.size = input.value.length + 1;
  }
}

function getFullCommand(c) {
  for (var i=0; i < commands.length; i++) {
    if (c === commands[i].command) {
      return commands[i];
    }
  }
  return null;
}

function interpret() {
  var inputBox = document.getElementById('input-box');
  inputBox.select();
  var input = inputBox.value.trim();
  if (input === '') { return; }

  if (input === 'help' || input === '?') {
    displayHelp(); // TODO implement help
    return;
  } else if (input === 'options') {
    displayOptions(); // TODO implement options
    return;
  }

  var inputArr = input.split(';');
  var newtab = (inputArr[inputArr.length-1] === 'n');
  var command; var query;

  var validCommand = false;
  command = getFullCommand(inputArr[0]);
  if (command !== null) {
    validCommand = true;
  }

  if (validCommand) {
    query = (command.command === 'w' || command.command === 'wa') // wikipedia & wolframalpha fix
      ? inputArr[1].trim().replace(/ /g, '+')
      : inputArr[1].trim();
    switch(inputArr.length) {
      case 1:
        redirect(command.url, newtab);
        return false;
        break;
      case 2:
        if (inputArr[1] === 'n') {
          redirect(command.url, newtab);
          return false;
        } else {
          redirect(command.url + command.search + query, newtab);
          return false;
        }
        break;
      default:
        redirect(command.url + command.search + query, newtab);
        return false;
    }
    redirect(command.url + command.search + query, newtab);
    return false;
  } else { // TODO check query: wikipedia & wolframalpha fix
    command = SETTINGS.defaultCommand;
    query = inputArr[0].trim();
    redirect(command.url + command.search + query, newtab);
    return false;
  }
}

function redirect(url, newtab) {
  url = (!url.startsWith('http'))
    ? 'https://' + url
    : url;
  if (newtab) {
    var win = window.open(url);
    win.focus();
    return false;
  } else {
    window.location.href = url;
    return false;
  }
}

// Displayed content
function clearContent() {
  document.getElementById('content').innerHTML = '';
}

function displayContent(content) {
  clearContent();
  var div = document.getElementById('content');
  div.innerHTML = content;
}

// Clock
function clock() {
  var date = new Date();
  var h = date.getHours();
  h = (h > 12) ? (checkTime(h -= 12)) : checkTime(h); // 12hr clock
  var m = checkTime(date.getMinutes());
  document.getElementById('clock').innerHTML = h + ':' + m;
  setTimeout(clock, 1000);
}
function checkTime(n) {
  n = (n < 10) ? (n = '0' + n) : n;
  return n;
}
