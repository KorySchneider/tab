window.onload = () => {
  loadConfig();

  setColors();

  document.querySelector('#input').focus();

  document.querySelector('body').addEventListener('click', () => {
    document.querySelector('#input').focus();
  });
};

function evaluateInput() {
  let input = document.querySelector('#input').value.trim();
  document.querySelector('#input').value = '';
  vm.clearMessage();

  // Input is empty
  if (input === '') return;

  // Save one-line history
  vm.lastEnteredCommand = input;

  // Format input
  let args = input.split(';');
  let command = args[0].toLowerCase();
  for (let i=0; i < args.length; i++) {
    args[i] = args[i].trim();
  }

  // Check if valid command or alias
  const commandList = Object.keys(vm.commands);
  const aliasList = Object.keys(vm.aliases);
  let validCommand = false;
  for (let i=0; i < commandList.length; i++) {
    if (command === commandList[i]) {
      validCommand = true;
      args.shift(); // remove command from args
      break;
    } else if (command === aliasList[i]) {
      validCommand = true;
      command = vm.aliases[command];
      args.shift();
      break;
    }
  }

  // Check if URL
  let isURL = false;
  if (vm.isURL(args[0])) {
    isURL = true;
    command = args.shift();
  }

  // Check if valid link
  let validLink = false;
  if (!isURL && !validCommand) {
    const linkList = Object.keys(vm.config.links);
    for (let i=0; i < linkList.length; i++) {
      if (command === linkList[i]) {
        validLink = true;
        args.shift();
        break;
      }
    }
  }

  // Check for newtab flag
  if (args[args.length - 1] === 'n') {
    vm.newTab = true;
    args.pop(); // remove newtab flag
  }

  // Execute
  if (isURL) {
    vm.redirect(vm.buildURL(command));
    return false;
  }
  if (validCommand) {
    vm.commands[command](args);
  } else if (!validLink) {
    vm.commands[vm.config['defaultCommand']](args);
  }
  if (validLink) {
    vm.redirect(vm.config.links[command]);
  }
  return false;
},

// Opens a URL either in current or new tab
function redirect(url) {
  if (vm.newTab || vm.config.alwaysNewTab)
    window.open(url, '_blank').focus();
  else
    window.location.href = url;

  vm.newTab = false;
  return false;
},

function loadConfig() {
  // Proceed if storage supported
  if (Storage) {
    // Create config object if it doesn't exist
    if (localStorage.getItem('taabSettings') === null) {
      localStorage.setItem('taabSettings', JSON.stringify(vm.config));
    // Otherwise load saved config from localStorage
    } else {
      vm.config = JSON.parse(localStorage.getItem('taabSettings'));
    }
  }
},

function setColors() {
  document.querySelector('body').style.backgroundColor = vm.config.bgColor;
  document.querySelector('body').style.color = vm.config.textColor;
},

function saveConfig() {
  localStorage.setItem('taabSettings', JSON.stringify(vm.config));
},

function displayMessage(msg, timeMs) {
  let msgDiv = document.querySelector('#message');

  // Clear existing timer/message
  if (vm.messageTimer) {
    msgDiv.innerHTML = '';
    clearTimeout(vm.messageTimer);
  }

  // Display message
  msgDiv.innerHTML = msg;

  // Set timer
  vm.messageTimer = setTimeout(() => {
    msgDiv.innerHTML = '';
  }, timeMs);
},

function clearMessage() { document.querySelector('#message').innerHTML = ''; },

// Adds protocol if not present, encodes search string
function buildURL(url, search='', query='') {
  let dest = (/(http(s)?:\/\/.)/.test(url))
    ? url
    : 'http://' + url;
  return dest + search + encodeURIComponent(query);
},

function updateClock() {
  let d = new Date();
  let h = d.getHours();
  let hours = (h > 12 ? h - 12 : h).toString();
  let minutes = ('0' + d.getMinutes()).slice(-2);
  this.clockText = `${hours}:${minutes}`;
  setTimeout(this.updateClock, 1000);
},

function handleKeyDown(e) {
  let keycode = e.which || e.keyCode;

  // Enter key
  if (keycode === 13) {
    vm.evaluateInput();
  }

  // Up arrow
  // Replace input text with last entered command
  else if (keycode === 38) {
    if (vm.lastEnteredCommand !== '') {
      let input = document.querySelector('#input');
      input.focus();
      input.value = vm.lastEnteredCommand;
      // Put cursor at end of text
      setTimeout(() => {
        input.setSelectionRange(input.value.length, input.value.length);
      }, 2);
    }
  }
},

function fetchGist(gistID) {
  let xhr = new XMLHttpRequest();
  let url = `https://api.github.com/gists/${gistID}`;
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let files = JSON.parse(xhr.responseText).files;
      if (files.length > 1) {
        vm.displayMessage('Error: Multiple files found in gist. Please use a gist with only one file.', 5000);
        return;
      }
      let gistText = files[Object.keys(files)[0]].content;
      vm.config.gistID = gistID;
      vm.updateConfig(gistText);
    }
  }
  xhr.open('GET', url, true);
  xhr.send(null);
},

function updateConfig(configString) {
  let config;
  try {
    config = JSON.parse(configString);
  } catch (err) {
    vm.displayMessage('Error parsing config, see console for details', 5000);
    console.log(err);
    return;
  }

  for (let setting in config) {
    vm.config[setting] = config[setting];
  }

  vm.saveConfig();
  vm.setColors();
  vm.displayMessage('Config imported', 5000);
},

function isURL(url) {
  if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url)) {
    if (!url.includes(' ')) {
      return true;
    }
  }
  return false;
},
