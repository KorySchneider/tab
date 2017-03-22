'use strict'
window.onload = function() {
  clock();
  loadSettings();
  $('#clock').click(openHelpMenu);
}

var SETTINGS = JSON.parse(localStorage.getItem('userSettings'));

//
// Input
//
function keyDown(e) {
  var keycode;
  if (window.event) {
    keycode = window.event.keyCode;
  } else if (e) {
    keycode = e.which;
  }

  if (keycode == 13) { // Enter key
    clearMenu();
    lowerPageWrapper();
    interpret();
  }

  // Expand input box if text exceeds size
  var minLength = 30;
  var input = $('#input-box');
  var size= (input.val().length > minLength)
    ? input.val().length + 1
    : minLength;
  input.prop('size', size)
}

function interpret() {
  var inputBox = $('#input-box');
  inputBox.select();
  var input = inputBox.val();

  // Input is empty string
  if (input === '') {
    lowerPageWrapper();
    return;
  }
  
  // Input is a URL
  if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(input)) {
    redirect(input, false);
    return false;
  }

  // Menus
  if (['help', '?'].includes(input)) {
    openHelpMenu()
    return;
  } else if (['settings', 'options'].includes(input)) {
    openSettingsMenu();
    return;
  }

  // Input is some command
  var command;
  var query;
  var inputArray = input.split(';');
  var newtab = (inputArray[inputArray.length - 1] === 'n');

  var validCommand = false;
  command = getFullCommand(inputArray[0]);
  if (command !== null) {
    validCommand = true;
  }

  if (validCommand) {
    switch(inputArray.length) {
      case 1:
        query = formatQuery(command, inputArray[0]);
        redirect(command.url, false);
        return false; break;
      case 2:
        query = formatQuery(command, inputArray[1]);
        if (inputArray[1].trim() === 'n') {
          redirect(command.url, newtab);
          return false;
        } else {
          redirect(command.url + command.search + query, newtab);
          return false;
        }
        break;
      case 3:
        query = formatQuery(command, inputArray[1]);
        redirect(command.url + command.search + query, newtab);
        return false; break;
    }
  } else {
    command = SETTINGS.defaultCommand;
    query = formatQuery(command, inputArray[0]);
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

function formatQuery(command, query) {
  var c = command.command;
  query = query.trim();
  // Don't encode queries for these commands
  query = (['r', 'w'].includes(c))
    ? query
    : encodeURIComponent(query);
  // Replace spaces with plus signs
  query = (c === 'w')
    ? query.replace(/ /g, '+')
    : query;
  return query;
}

function clearInput() {
  $('#input-box').val('').select();
}

//
// Settings
//
function saveSettings() {
  if (!typeof(Storage)) {
    alert('Browser does not support local storage:\nYour settings won\'t be saved (sorry)');
    return false;
  }

  // Default command
  var defaultCommand = $('input[name=defaultCommandRadio]:checked', '#defaultCommandForm').val();
  SETTINGS.defaultCommand = getFullCommand(defaultCommand);

  // Open style
  SETTINGS.alwaysNewTab = $('#openStyleCheckbox').prop('checked');

  // Write changes
  localStorage.setItem('userSettings', JSON.stringify(SETTINGS));

  return true;
}

function loadSettings() {
  if (typeof(Storage)) {
    if (localStorage.getItem('userSettings') == null) {
      var defaultSettings = {
        defaultCommand: getFullCommand('g'),
        alwaysNewTab: false
      };
      localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
      SETTINGS = JSON.parse(localStorage.getItem('userSettings'));
    } else {
      SETTINGS = JSON.parse(localStorage.getItem('userSettings'));
    }
  }
}

//
// Menus
//
function clearMenu() {
  $('#menu').html('');
}

function raisePageWrapper() {
  $('#wrapper').css('top', '10%');
}
function lowerPageWrapper() {
  $('#wrapper').css('top', '30%');
}

function displayMenu(html) {
  clearMenu();
  clearInput();
  raisePageWrapper();
  $('#menu').html(html);
}

function openSettingsMenu() {
  // TODO css rather than inline for td & th align
  var html = "\
  <div id='settingsMenu'> \
    <br> \
    <table id='settingsTable'> \
    <tr> \
      <td align='left'><strong>Default Command</strong><br>executes if no command was specified</td> \
    </tr> \
    <tr> \
      <td align='left'> \
        <form id='defaultCommandForm'>";

  // Generate options from command list
  for (var i=0; i < COMMANDS.length; i++) {
    var c = COMMANDS[i].command;
    var text = COMMANDS[i]['options-text'];
    html += "\n<input type='radio' name='defaultCommandRadio' id='"+c+"' value='"+c+"'><label for='"+c+"'>" + text + "</label><br>\n";
  }

  html += "\
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
      <th align='left'>Found a bug? Have a request?</th> \
    </tr> \
    <tr> \
      <td align='left'> \
        <button type='button' id='submitIssueBtn' class='menuBtn'>Submit an Issue</button> \
        <small>or email <a href='mailto:tab.startpage@gmail.com'>tab.startpage@gmail.com</a></small> \
      </td> \
    </tr> \
    <tr> \
      <td> \
        <button type='button' id='saveSettingsBtn' class='menuBtn'>Done</button> \
       </td> \
    </tr> \
    <tr> \
      <td align='right'> \
        <button type='button' id='restoreDefaultSettingsBtn'><small>Restore Defaults</small></button> \
      </td> \
    </tr> \
    </table> \
  </div>";

  displayMenu(html);

  // Display saved settings
  var radios = document.getElementById('defaultCommandForm');
  for (var i=0; i < radios.length; i++) {
    if (SETTINGS.defaultCommand.command === radios[i].value) {
      radios[i].checked = true;
      break;
    }
  }
  $('#openStyleCheckbox').prop('checked', SETTINGS.alwaysNewTab);

  // Save on change
  $('#defaultCommandForm').change(saveSettings);
  $('#openStyleCheckbox').change(saveSettings);

  // Button click handlers
  $('#submitIssueBtn').click(function() {
    redirect('https://github.com/KorySchneider/tab-a-startpage/issues/new', true);
  });

  $('#restoreDefaultSettingsBtn').click(function() {
    localStorage.removeItem('userSettings');
    loadSettings();
    openSettingsMenu();
    displayMessage('settings reset', 1500);
  });

  $('#saveSettingsBtn').click(function() {
    lowerPageWrapper();
    clearMenu();
    clearInput();
    displayMessage('settings saved', 2000);
  });
}

function openHelpMenu() {
  var html = "\
  <div id='helpMenu'> \
    <div id='helpText'> \
      <br> \
      <p>Below is a list of commands, most of which act as shortcuts to sites or the search engine for those sites. To go to a site, simply enter its command (e.g. <strong>y</strong> for YouTube), or type a semicolon followed by a query to search the site (like this: <strong>y;cat videos</strong>). Input a URL by itself to go to it.</p> \
      <p><small>syntax:</small><br>command;query[;n]</p> \
    </div> \
    <table id='helpTable'> \
      <tr> \
        <th align='right'>Command</th> \
        <th align='left'>Site/Function</th> \
      </tr> \
      <tr> \
        <td class='helpMenuCommandText' align='right'>options</td> \
        <td align='left'>Show options menu</td> \
      </tr> \
      <tr> \
        <td class='helpMenuCommandText' align='right'>help</td> \
        <td align='left'>Show this menu</td> \
      </tr>";

  // Generate table from command list
  for (var i=0; i < COMMANDS.length; i++) {
    var command = COMMANDS[i]['help-command'];
    var desc = COMMANDS[i]['help-desc'];
    html += "\n<tr>\n<td class='helpMenuCommandText' align='right'>"+command+"</td>";
    html += "\n<td align='left'>"+desc+"</td>\n</tr>"
  }

  html += "\
      <tr> \
        <td class='helpMenuCommandText' align='right'>&ltcommand&gt&#59n</td> \
        <td align='left'>Open in a new tab</td> \
      </tr> \
      <tr> \
        <td> \
          <br> \
        </td> \
      </tr> \
      <tr> \
        <td colspan='2' align='center'> \
          <button type='button' id='closeHelpBtn' class='menuBtn'>Close</button> \
        </td> \
      </tr> \
      <tr colspan='2' align='center'> \
        <th colspan='2' align='center'>Found a bug? Have a request?</th> \
      </tr> \
      <tr colspan='2'> \
        <td colspan='2' align='center'> \
          <button type='button' id='submitIssueBtn' class='menuBtn'>Submit an Issue</button> \
          <br> \
          <small>or email <a href='mailto:tab.startpage@gmail.com'>tab.startpage@gmail.com</a></small> \
        </td> \
      </tr> \
    </table>";

  displayMenu(html);

  // Button click handlers
  $('#submitIssueBtn').click(function() {
    redirect('https://github.com/KorySchneider/tab-a-startpage/issues/new', true);
  });

  $('#closeHelpBtn').click(function() {
    clearMenu();
    clearInput();
    lowerPageWrapper();
  });
}

//
// Misc helper functions
//
function getFullCommand(c) { // Takes a command shortcut, returns full command object
  for (var i=0; i < COMMANDS.length; i++) {
    if (c === COMMANDS[i].command) {
      return COMMANDS[i];
    }
  }
  return null;
}

function displayMessage(message, timeMs) {
  $('#message').show().text(message);

  if (timeMs > 0) {
    setTimeout(function() {
      $('#message').html('').prop('display', 'none');
    }, timeMs);
  }
}

//
// Clock
//
function clock() {
  var formatTime = function(n) {
    n = (n < 10) ? (n = '0' + n) : n;
    return n;
  };
  var date = new Date();
  var h = date.getHours();
  h = (h > 12) ? (formatTime(h -= 12)) : formatTime(h); // 12hr clock
  var m = formatTime(date.getMinutes());
  document.getElementById('clock').innerHTML = h + ':' + m;
  setTimeout(clock, 1000);
}
