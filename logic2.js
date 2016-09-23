'use strict'

window.onload = function() {
  clock();
}

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
  for (var i=0; i < commands.length; i++) {
    if (inputArr[0] === commands[i].command) {
      validCommand = true;
      command = commands[i];
    }
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
  } else {
    // command = defaultCommand // TODO implement
    query = inputArr[0].trim();
    redirect('google.com/search?q=' + query, newtab); // TODO change to default command
    return false;
  }
}

function redirect(url) {
  var url = (!url.startsWith('http'))
    ? 'https://' + url
    : url;
  window.location.href = url;
  return false;
}

function clearContent() {
  document.getElementById('content').innerHTML = '';
}

function displayContent(content) {
  clearContent();
  var div = document.getElementById('content');
  div.innerHTML = content;
}

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
