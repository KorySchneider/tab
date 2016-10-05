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
    displayOptionsMenu();
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

// Options
function saveOptions() {
  if (typeof(Storage) == "undefined") {
    alert("Browser does not support local storage: your settings won't be saved (sorry)");
  } else {
    // Get default command
    var radios = document.getElementById('defaultCommandForm');
    var defaultCommand = null;
    for (var i=0; i < radios.length; i++) {
      if (radios[i].checked) {
        defaultCommand = radios[i].value;
        break;
      }
    }
    defaultCommand = getFullCommand(defaultCommand);
    if (defaultCommand !== null) {
      SETTINGS.defaultCommand = defaultCommand;
    }

    // Tab open style
    SETTINGS.alwaysNewTab = document.getElementById('openStyleCheckbox');

    // Background color
    var color = document.getElementById('bgColorInput').value;
    if (!color.startsWith('#')) {
      color = '#' + color;
    }
    if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)) { // check if valid hex value
      SETTINGS.color = color;
      setColor(color);
      localStorage.setItem('userOptions', JSON.stringify(SETTINGS));
    } else {
      alert('not a valid hex value\n(valid example: #A1C0C0)');
    }
  }
  var inputBox = document.getElementById('input-box');
  inputBox.value = "";
  inputBox.select();
}

function loadOptions() {
  if (typeof(Storage) !== 'undefined') {
    if (localStorage.getItem('userOptions') !== null) {
      SETTINGS = JSON.parse(localStorage.getItem('userOptions'));
      setColor(SETTINGS.color);
    } else {
      var defaultSettings = {
        defaultCommand: {
          command: 'g',
          url: 'https://www.google.com',
          search: '/search?q='
        },
        alwaysNewtab: false,
        color: "#A1C0C0"
      };
      localStorage.setItem('userOptions', JSON.stringify(defaultSettings));
      SETTINGS = JSON.parse(localStorage.getItem('userOptions'));
    }
  }
}

function setColor(color) {
  document.body.style.backgroundColor = color;
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

function displayOptionsMenu() {
  var html = "\
    <br/><br/> \
    <table border='1'> \
    <tr> \
       <td align='left'><strong>Default Command</strong><br>executes if no command was specified</td> \
    </tr> \
    <tr> \
       <td align='left'> \
          <form id='defaultCommandForm'> \
             <input type='radio' name='defaultCommandRadio' value='t'>Go to website<br/> \
             <input type='radio' name='defaultCommandRadio' value='g'>Google search<br/> \
             <input type='radio' name='defaultCommandRadio' value='w'>Wikipedia search<br/> \
             <input type='radio' name='defaultCommandRadio' value='y'>YouTube search <br/> \
             <input type='radio' name='defaultCommandRadio' value='a'>Amazon search<br/> \
             <input type='radio' name='defaultCommandRadio' value='imdb'>IMDB search<br/> \
             <input type='radio' name='defaultCommandRadio' value='img'>Google Images search<br/> \
             <input type='radio' name='defaultCommandRadio' value='wa'>Wolfram Alpha search<br/> \
             <input type='radio' name='defaultCommandRadio' value='r'>Go to subreddit \
          </form> \
       </td> \
    </tr> \
    <tr> \
       <th align='left'>Open Style</th> \
    </tr> \
    <tr> \
       <td align='left'> \
          <input type='checkbox' id='openStyleCheckbox' value='newTab'>Always open in new tab<br/> \
       </td> \
    </tr> \
    <tr> \
       <th align='left'>Background Color</th> \
    </tr> \
    <tr> \
       <td align='left'> \
          Color: <input type='text' id='bgColorInput' placeholder='#A1C0C0' size='7' spellcheck='false'> \
          <a href='http://www.colorpicker.com/' target='_blank'><small>Color Picker</small></a> \
       </td> \
    </tr> \
    <tr> \
       <td> \
          <button type='button' id='saveOptionsBtn'>Done</button> \
       </td> \
    </tr> \
    </table>";

  var wrapper = document.getElementById('wrapper');
  wrapper.style.top = "10%";

  displayContent(html);
  document.getElementById('saveOptionsBtn').onclick = function() {
    wrapper.style.top = "35%";
    saveOptions();
    clearContent();
    displayMessage('settings saved', 2000);
  };

  // Display saved options
  var radios = document.getElementById('defaultCommandForm');
  for (var i=0; i < radios.length; i++) {
    if (SETTINGS.defaultCommand.command === radios[i].value) {
      radios[i].checked = true;
      break;
    }
  }
  document.getElementById('openStyleCheckbox').checked = SETTINGS.alwaysNewTab;
  document.getElementById('bgColorInput').value = SETTINGS.color;
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
