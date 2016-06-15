window.onload = function() {
   loadOptions();
   updateTime();
};

var USER_OPTIONS = JSON.parse(localStorage.getItem('userOptions'));
var comLinks = { 
   'r':'https://www.reddit.com/r/',
   'g':'https://www.google.com/search?q=',
   'yt':'https://www.youtube.com/results?search_query=',
   'y':'https://www.youtube.com/results?search_query=',
   'a':'http://www.amazon.com/s?url=search-alias%3Daps&field-keywords=',
   'w':'https://www.wikipedia.org/w/index.php?title=Special:Search&search=',
   'wa':'http://www.wolframalpha.com/input/?i=',
   't':'',
}

function interpret() {
   inputElem = document.getElementById('commandInput');
   inputElem.select();
   var input = inputElem.value;
   if (input == '') { return; }
   
   // Check for available commands
   if (input.trim() === 'help') {
      displayHelp();
      return;
   } else if (input.trim() === 'options') {
      displayOptions();
      return;
   }

   // Parse input
   var inputArray = input.split(';');
   var nt;
   if (inputArray[inputArray.length-1] === 'n' || USER_OPTIONS.alwaysNewTab) {
      nt = true;
   } else {
      nt = false;
   }
   switch(inputArray.length) {
      case 1:
         command = USER_OPTIONS.defaultCommand;
         query = inputArray[0].trim();
         break;
      case 2:
         if (nt) {
            command = USER_OPTIONS.defaultCommand;
            query = inputArray[0];
            break;
         } else {
            command = inputArray[0].trim();
            query = inputArray[1].trim();
            break;
         }
      case 3:
         command = inputArray[0].trim();
         query = inputArray[1].trim();
         // Assume inputArray[2] is new tab flag
         break;
      default:
         displayText('unable to interpret');
   }
   if (command === 'w') { // Wikipedia fix
      query = query.replace(/ /g,'+'); // replace all spaces with +'s
   } else {
      query = encodeURIComponent(query);
   }
   if (comLinks.hasOwnProperty(command)) {
      goToSite(comLinks[command] + query, nt);
      return false;
   } else {
      displayText('command not recognized');
      return;
   }
}

function verifyKey(e) {
   var keycode;
   if (window.event) {
      keycode = window.event.keyCode;
   } else if (e) {
      keycode = e.which;
   }
   if (keycode == 13) {
      clearText();
      interpret();
   }
   updateInputLength();
}

function updateInputLength() {
   var entry_len = document.getElementById('commandInput').value.length;
   document.getElementById('commandInput').size = entry_len + 2;
}

function goToSite(url, nt) {
   if (!url.startsWith('http')) {
      url = 'https://'+url;
   }
   if (nt) {
      var win = window.open(url);
      win.focus();
      return false;
   } else {
      window.location.replace(url);
      return false;
   }
}

function displayText(string) {
   var div = document.getElementById('text_div');
   clearText();
   div.innerHTML += '<p align=center>'+string+'</p>';
}

function clearText() {
   document.getElementById('text_div').innerHTML = '';
}

function applyBgColor(c) {
   document.body.style.backgroundColor = c;
   document.getElementById('commandInput').style.backgroundColor = c;
}

function saveOptions() {
   if (typeof(Storage) !== "undefined") {
      // Default command
      var defaultCommandRadios = document.getElementById('defaultCommandForm');
      var defaultCommand = null;
      for (var i=0; i < defaultCommandRadios.length; i++) {
         if (defaultCommandRadios[i].checked) {
            defaultCommand = defaultCommandRadios[i].value;
            break;
         }
      }
      if (defaultCommand !== null) {
         USER_OPTIONS.defaultCommand = defaultCommand;
      }

      // Tab open style
      var alwaysNewTab = document.getElementById('alwaysNewTabCheckbox').checked;
      USER_OPTIONS.alwaysNewTab = alwaysNewTab;

      // Background color
      var bgColor = document.getElementById('bgColorInput').value;
            // check if valid hex value
      if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(bgColor)) {
         USER_OPTIONS.bgColor = bgColor;
         applyBgColor(bgColor);

         // Store prefs
         localStorage.setItem('userOptions', JSON.stringify(USER_OPTIONS));
         document.getElementById('optionsSubText').innerHTML = 'settings saved';
      } else {
         document.getElementById('optionsSubText').innerHTML = 'not a valid color';
      }

   } else {
      alert("Browser does not support local storage: your settings won't be saved (sorry)");
   }
}

function loadOptions() {
   if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem('userOptions') !== null) { // Load options
         var userOptions = localStorage.getItem('userOptions');
         userOptions = JSON.parse(userOptions);
         USER_OPTIONS = userOptions;
         applyBgColor(USER_OPTIONS.bgColor);
         return userOptions;
      } else { // Create defaults
         var options = {
            "defaultCommand": "g",
            "alwaysNewTab": false,
            "bgColor": "#A1C0C0"
         };
         localStorage.setItem('userOptions', JSON.stringify(options));
      }
   }
}

function displayOptions() {
   var optionsHTML =
      `
      <br/><br/><br/>
      <table border='1'>
      <tr>
         <td align='left'><strong>Default Command</strong> (command that executes if no command was specified)</td>
      </tr>
      <tr>
         <td align='left'>
            <form id='defaultCommandForm'>
               <input type='radio' name='defaultCommandRadio' value='t'>Go to website<br/>
               <input type='radio' name='defaultCommandRadio' value='g'>Google search<br/>
               <input type='radio' name='defaultCommandRadio' value='w'>Wikipedia search<br/>
               <input type='radio' name='defaultCommandRadio' value='y'>YouTube search <br/>
               <input type='radio' name='defaultCommandRadio' value='a'>Amazon search<br/>
               <input type='radio' name='defaultCommandRadio' value='wa'>Wolfram Alpha search<br/>
               <input type='radio' name='defaultCommandRadio' value='r'>Go to subreddit
            </form>
         </td>
      </tr>
      <tr>
         <th align='left'>Open Style</th>
      </tr>
      <tr>
         <td align='left'>
            <input type='checkbox' id='alwaysNewTabCheckbox' value='newTab'>Always open in new tab<br/>
         </td>
      </tr>
      <tr>
         <th align='left'>Background Color</th>
      </tr>
      <tr>
         <td align='left'>
            Color: <input type='text' id='bgColorInput' placeholder='#A1C0C0' size='7' spellcheck='false'>
            <a href='http://www.colorpicker.com/' target='_blank'><small>Color Picker</small></a>
         </td>
      </tr>
      <tr>
         <td>
            <button type='button' id='saveOptionsBtn'>Save</button>
         </td>
      </tr>
      </table>
      <p id='optionsSubText' class='subtext' align='center'></p>
      `
   document.getElementById('text_div').innerHTML = optionsHTML;
   document.getElementById('saveOptionsBtn').onclick = saveOptions;

   // Show saved options
   var defaultCommandRadios = document.getElementById('defaultCommandForm');
   for (var i=0; i < defaultCommandRadios.length; i++) {
      if (USER_OPTIONS.defaultCommand === defaultCommandRadios[i].value) {
         defaultCommandRadios[i].checked = true;
      }
   }
   document.getElementById('alwaysNewTabCheckbox').checked = USER_OPTIONS.alwaysNewTab;
   document.getElementById('bgColorInput').value = USER_OPTIONS.bgColor;
}

function displayHelp() {
   var helpHTML =
      `<br /><br />
      <p class='subtext' align='center'>syntax: command;query[;n]</p>
      <table border='1'>
         <tr>
            <th>Command</th>
            <th>Description</th>
         </tr>
         <tr>
            <td>options</td>
            <td>show options menu</td>
        </tr>
         <tr>
            <td>r;&ltsubreddit&gt</td>
            <td>go to subreddit</td>
         </tr>
         <tr>
            <td>g;&ltquery&gt</td>
            <td>google search</td>
         </tr>
         <tr>
            <td>yt/y;&ltquery&gt</td>
            <td>youtube search</td>
         </tr>
         <tr>
            <td>a;&ltquery&gt</td>
            <td>amazon search</td>
         </tr>
         <tr>
            <td>w;&ltquery&gt</td>
            <td>wikipedia search</td>
         </tr>
         <tr>
            <td>wa;&ltquery&gt</td>
            <td>wolfram alpha search</td>
         </tr>
         <tr>
            <td>t;&lturl&gt</td>
            <td>open url in current tab</td>
         </tr>
         <tr>
            <td>&ltcommand&gt&#59;n</td>
            <td>open action in new tab</td>
         </tr>
         <tr>
            <td>help</td>
            <td>show this text</td>
         </tr>
      </table>`
   document.getElementById('text_div').innerHTML = helpHTML;
}

function checkTime(i) {
   if (i < 10) { i = '0' + i };
   if (i == 0) { i = '12' };
   return i;
}
function updateTime() {
   var d = new Date();
   var h = d.getHours(); if (h > 12) { h -= 12; }; h = checkTime(h);
   var m = checkTime(d.getMinutes());
   document.getElementById('time_div').innerHTML = "<p id='timeText'>"+h+':'+m+'</p>';
   var t = setTimeout(updateTime, 5000);
}
