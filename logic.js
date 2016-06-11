window.onload = function() {
   updateTime();
};

var comLinks = { 
   'g':'https://www.google.com/search?q=',
   'yt':'https://www.youtube.com/results?search_query=',
   'y':'https://www.youtube.com/results?search_query=',
   'a':'http://www.amazon.com/s?url=search-alias%3Daps&field-keywords=',
   'w':'https://www.wikipedia.org/w/index.php?title=Special:Search&search=',
   'wa':'http://www.wolframalpha.com/input/?i=',
   't':'',
}

function interpret() {
   var input = document.getElementById('commandInput').value;
   if (input == '') { return; }
   if (input.trim() === 'help') {
      displayHelp();
      return;
   } else if (input.trim() === 'options') {
      displayOptions();
      return;
   }
   if (input.split(';').length == 3 && input.split(';')[2] == 'n') {
      nt = true;
   } else {
      nt = false;
   }
   comQry = input.split(';');
   command = comQry[0].trim();
   query = comQry[1].trim();
   if (comLinks.hasOwnProperty(command)) {
      goToSite(comLinks[command] + query, nt);
      return false;
   } else {
      displayText('command not recognized');
      return false;
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
      document.getElementById('commandInput').select();
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

function saveOptions() {
   if (typeof(Storage) !== "undefined") {
      //do things
   }
}

function loadOptions() {
   if (typeof(Storage) !== "undefined") {
      //do things
   }
}

function displayOptions() {
   var optionsHTML =
      `
      <br /><br /><br />
      <table border='1'>
      <tr>
         <td align='left'><strong>Default Command</strong> (command that executes if no command was specified)</td>
      </tr>
      <tr>
         <td align='left'>
            <form id='defaultCommandForm' action=''>
               <input type='radio' name='defaultCommand' value='t'>Go to website<br/>
               <input type='radio' name='defaultCommand' value='g'>Google search<br/>
               <input type='radio' name='defaultCommand' value='w'>Wikipedia search<br/>
               <input type='radio' name='defaultCommand' value='y'>YouTube search <br/>
               <input type='radio' name='defaultCommand' value='a'>Amazon search<br/>
               <input type='radio' name='defaultCommand' value='wa'>Wolfram Alpha search<br/>
               <input type='radio' name='defaultCommand' value='r'>Go to subreddit
            </form>
         </td>
      </tr>
      <tr>
         <th align='left'>Open Style</th>
      </tr>
      <tr>
         <td align='left'>
            <input type='checkbox' name='openStyleCheckbox' value='newTab'>Always open in new tab<br/>
         </td>
      </tr>
      <tr>
         <th align='left'>Background Color</th>
      </tr>
      <tr>
         <td align='left'>
            Color: <input type='text' id='backgroundColorInput' placeholder='#A1C0C0'>
         </td>
      </tr>
      <tr>
         <td>
            <button type='button' id='saveOptionsBtn'>Save</button>
         </td>
      </tr>
      </table>
      `
   document.getElementById('text_div').innerHTML = optionsHTML;
   document.getElementById('saveOptionsBtn').onclick = saveOptions;
}

function displayHelp() {
   var helpHTML =
      `<br /><br /><br />
      <p class='subtext' align='center'>syntax: command;query[;n]</p>
      <table border='1'>
      <tr>
         <th>Command</th>
         <th>Description</th>
      </tr>
     <tr>
       <td>r;&ltsubreddit&gt</td>
       <td>go to subreddit</td>
     </tr>
     <tr>
        <td>r;</td>
        <td>go to reddit.com</td>
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
   document.getElementById('time_div').innerHTML = "<p class='timetext'>"+h+':'+m+'</p>';
   var t = setTimeout(updateTime, 5000);
}
