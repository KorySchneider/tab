'use strict'
window.onload = function() {
  clock();
  loadOptions();
  document.getElementById('clock').addEventListener('click', displayHelpMenu);

  // Broke user options with update (new format for options), this should fix it
  if (JSON.parse(localStorage.getItem('options-version')) == null) {
    localStorage.removeItem('userOptions');
    loadOptions();
    localStorage.setItem('options-version', 1);
  }
}
var SETTINGS = JSON.parse(localStorage.getItem('userOptions'));

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

function clearInput() {
  var input = document.getElementById('input-box');
  input.value = '';
  input.select();
}

function checkInputLength() {
  var input = document.getElementById('input-box');
  if (input.value.length > 30) {
    input.size = input.value.length + 1;
  } else {
    input.size = 30;
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

function queryFix(command, query) {
  var c = command.command;
  // Replace spaces with plus signs for the following commands
  query = (c === 'w')
    ? query.trim().replace(/ /g, '+')
    : query.trim();
  // Don't encode queries for the following commands
  query = (c === 't' || c === 'r' || c === 'w')
    ? query
    : encodeURIComponent(query);
  return query;
}

function interpret() {
  var inputBox = document.getElementById('input-box');
  inputBox.select();
  var input = inputBox.value.trim();
  if (input === '') {
    lowerWrapper();
    return;
  }

  if (input === 'help' || input === '?') {
    displayHelpMenu();
    return;
  } else if (input === 'options' || input === 'settings') {
    displayOptionsMenu();
    return;
  } else if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(input)) {
    // input is a URL
    redirect(input, false);
    return false;
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
    switch(inputArr.length) {
      case 1:
        redirect(command.url, newtab);
        return false;
        break;
      case 2:
        query = queryFix(command, inputArr[1]);
        if (inputArr[1] === 'n') {
          redirect(command.url, newtab);
          return false;
        } else {
          redirect(command.url + command.search + query, newtab);
          return false;
        }
        break;
      default:
        query = queryFix(command, inputArr[1]);
        redirect(command.url + command.search + query, newtab);
        return false;
    }
    // TODO pass query through queryFix
    redirect(command.url + command.search + query, newtab);
    return false;
  } else {
    command = SETTINGS.defaultCommand;
    query = queryFix(command, inputArr[0]);
    redirect(command.url + command.search + query, newtab);
    return false;
  }
}

function redirect(url, newtab) {
  url = (!url.startsWith('http'))
    ? 'http://' + url
    : url;
  if (newtab || SETTINGS.alwaysNewTab) {
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
    return false;
  } else {

    // Get default command
    var radios = document.getElementById('defaultCommandForm');
    var defaultCommand = null;
    for (var i=0; i < radios.length; i++) {
      if (radios[i].checked) {
        defaultCommand = getFullCommand(radios[i].value);
        break;
      }
    }
    if (defaultCommand !== null) {
      SETTINGS.defaultCommand = defaultCommand;
    }

    // Tab open style
    SETTINGS.alwaysNewTab = document.getElementById('openStyleCheckbox').checked;

    // Write changes
    localStorage.setItem('userOptions', JSON.stringify(SETTINGS));

    return true;
  }
}

function loadOptions() {
  if (typeof(Storage) !== 'undefined') {
    if (localStorage.getItem('userOptions') !== null) {
      SETTINGS = JSON.parse(localStorage.getItem('userOptions'));
    } else {
      var defaultSettings = {
        defaultCommand: {
          command: 'g',
          url: 'https://www.google.com',
          search: '/search?q='
        },
        alwaysNewTab: false,
      };
      localStorage.setItem('userOptions', JSON.stringify(defaultSettings));
      SETTINGS = JSON.parse(localStorage.getItem('userOptions'));
    }
  }
}

// Displayed content
function clearMessage() {
  var div = document.getElementById('message');
  div.innerHTML = '';
  div.style.display = 'none';
}

function displayMessage(message, timeMs) {
  var div = document.getElementById('message');
  div.style.display = ''; // Show div
  div.innerHTML = message;
  if (timeMs !== 0) {
    setTimeout(clearMessage, timeMs);
  }
}

function clearContent() {
  document.getElementById('content').innerHTML = '';
}

function displayContent(content) {
  clearInput();
  clearContent();
  raiseWrapper();
  document.getElementById('content').innerHTML = content;
  window.scrollBy(0, 1000);
}

function raiseWrapper() {
  document.getElementById('wrapper').style.top = "10%";
}

function lowerWrapper() {
  document.getElementById('wrapper').style.top = "30%";
}

function displayOptionsMenu() {
  var html = "\
    <br/> \
    <table border='0'> \
    <tr> \
       <td align='left'><strong>Default Command</strong><br>executes if no command was specified</td> \
    </tr> \
    <tr> \
       <td align='left'> \
          <form id='defaultCommandForm'> \
             <input type='radio' name='defaultCommandRadio' id='t'    value='t'>   <label for='t'>Go to website</label><br> \
             <input type='radio' name='defaultCommandRadio' id='g'    value='g'>   <label for='g'>Search Google</label><br> \
             <input type='radio' name='defaultCommandRadio' id='dg'   value='dg'>  <label for='dg'>Search DuckDuckGo</label><br> \
             <input type='radio' name='defaultCommandRadio' id='w'    value='w'>   <label for='w'>Search Wikipedia</label><br> \
             <input type='radio' name='defaultCommandRadio' id='y'    value='y'>   <label for='y'>Search YouTube</label><br> \
             <input type='radio' name='defaultCommandRadio' id='a'    value='a'>   <label for='a'>Search Amazon</label><br> \
             <input type='radio' name='defaultCommandRadio' id='imdb' value='imdb'><label for='imdb'>Search Internet Movie Database</label><br> \
             <input type='radio' name='defaultCommandRadio' id='n'    value='n'>   <label for='n'>Search Netflix</label><br> \
             <input type='radio' name='defaultCommandRadio' id='img'  value='img'> <label for='img'>Search Google Images</label><br> \
             <input type='radio' name='defaultCommandRadio' id='k'    value='k'>   <label for='k'>Search Google Keep</label><br> \
             <input type='radio' name='defaultCommandRadio' id='i'    value='i'>   <label for='i'>Search Google Inbox<br> \
             <input type='radio' name='defaultCommandRadio' id='wa'   value='wa'>  <label for='wa'>Search Wolfram Alpha</label><br> \
             <input type='radio' name='defaultCommandRadio' id='r'    value='r'>   <label for='r'>Go to subreddit</label> \
          </form> \
       </td> \
    </tr> \
    <tr> \
       <th align='left'>Open Style</th> \
    </tr> \
    <tr> \
       <td align='left'> \
    <input type='checkbox' id='openStyleCheckbox' value='newTab'><label for='openStyleCheckbox'>Always open in new tab</label><br/> \
       </td> \
    </tr> \
    <tr> \
      <th align='left'>Found a bug? Want to request a feature?</th> \
    </tr> \
    <tr> \
      <td align='left'> \
        <button type='button' id='submitIssueBtn' class='menuBtn'>Submit an Issue</button> \
      </td> \
    </tr> \
    <tr> \
      <td> \
        <button type='button' id='saveOptionsBtn' class='menuBtn'>Save</button> \
       </td> \
    </tr> \
    <tr> \
      <td align='right'> \
        <button type='button' id='resetOptionsBtn' class='resetBtn'><small>Reset Options</small></button> \
        <button type='button' id='resetOptionsTipBtn' class='resetBtn'><small>(?)</small></button> \
      </td> \
    </tr> \
    </table>";

  displayContent(html);

  document.getElementById('submitIssueBtn').onclick = function() {
    redirect('https://github.com/KorySchneider/tab-a-startpage/issues/new', true);
  };

  document.getElementById('saveOptionsBtn').onclick = function() {
    if (saveOptions()) {
      lowerWrapper();
      clearContent();
      displayMessage('settings saved', 2000);
    } else {
      alert('Error: No localStorage support\nYour settings were not saved\n(sorry)')
      lowerWrapper();
      clearContent();
    }
  };

  document.getElementById('resetOptionsBtn').onclick = function() {
    localStorage.removeItem('userOptions');
    loadOptions();
    lowerWrapper();
    clearContent();
    displayMessage('settings reset', 2000);
  }
  document.getElementById('resetOptionsTipBtn').onclick = function() {
    alert("This button will restore the default settings.\n (might be useful if I broke something in the last update)");
  }

  // Display saved options
  var radios = document.getElementById('defaultCommandForm');
  for (var i=0; i < radios.length; i++) {
    if (SETTINGS.defaultCommand.command === radios[i].value) {
      radios[i].checked = true;
      break;
    }
  }
  document.getElementById('openStyleCheckbox').checked = SETTINGS.alwaysNewTab;
}

function displayHelpMenu() {
  var html = " \
    <div id='helpText'> \
      <br> \
      <p>Below is a list of commands, most of which act as shortcuts to sites or the search engine of those sites. To go to a site, simply enter its command (e.g. 'g' for Google), or type a semicolon followed by a query to search the site.</p> \
      <p><small>syntax:</small><br>command;query[;n]</p> \
    </div> \
    <table id='helpTable'> \
      <tr> \
        <th align='right'>Command</th> \
        <th align='left'>Site/Function</th> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>options</td> \
        <td align='left'>Show options menu</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>help</td> \
        <td align='left'>Show this menu</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>r (;&ltsubreddit&gt)</td> \
        <td align='left'>Reddit</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>g (;&ltquery&gt)</td> \
        <td align='left'>Google</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>dg (;&ltquery&gt)</td> \
        <td align='left'>DuckDuckGo</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>y (;&ltquery&gt)</td> \
        <td align='left'>YouTube</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>a (;&ltquery&gt)</td> \
        <td align='left'>Amazon</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>w (;&ltquery&gt)</td> \
        <td align='left'>Wikipedia</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>imdb (;&ltquery&gt)</td> \
        <td align='left'>Internet Movie Database</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>n (;&ltquery&gt)</td> \
        <td align='left'>Netflix</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>i (;&ltquery&gt)</td> \
        <td align='left'>Google Inbox</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>img (;&ltquery&gt)</td> \
        <td align='left'>Google Images</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>k (;&ltquery&gt)</td> \
        <td align='left'>Google Keep</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>wa (;&ltquery&gt)</td> \
        <td align='left'>Wolfram Alpha</td> \
      </tr> \
      <tr> \
        <td class='menuCommandText' align='right'>t;&lturl&gt</td> \
        <td align='left'>Open url in current tab</td> \
      </tr> \
      <tr> \
      <td class='menuCommandText' align='right'>&ltanything&gt&#59n</td> \
        <td align='left'>Open in a new tab</td> \
      </tr> \
      <tr> \
        <td> \
          <br> \
        </td> \
      </tr> \
      <tr> \
        <td colspan='2'> \
          <button type='button' id='closeHelpBtn' class='menuBtn'>Close</button> \
        </td> \
      </tr> \
    </table>"

  displayContent(html);

  document.getElementById('closeHelpBtn').onclick = function() {
    clearContent();
    clearInput();
    lowerWrapper();
  }
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
