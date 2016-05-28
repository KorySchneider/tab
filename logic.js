window.onload = function() {
    updateTime();
};

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
        document.getElementById('input').select();
    }
    updateInputLength();
}

function updateInputLength() {
    var entry_len = document.getElementById('input').value.length;
    last_len = document.getElementById('input').size = entry_len + 2;
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

function displayText(string) {
    var div = document.getElementById('text_div');
    clearText();
    div.innerHTML += '<p align=center>'+string+'</p>';
}

function clearText() {
    document.getElementById('text_div').innerHTML = '';
}

function displayHelp() {
    var helpHTML = 
       `<br /><br /><br />
        <p class='subtext' align=center>syntax: command;query[;n]</p>
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
    		<td>t;&lturl&gt</td>
    		<td>open url in current tab</td>
    	</tr>
    	<tr>
    	    <td>&ltcommand&gt&#59;n</td>
    	    <td>open action in new tab</td>
    	</tr>
    	<tr>
    	   <td>wa;&ltquery&gt</td>
    	   <td>wolfram alpha search</td>
    	</tr>
    	<tr>
    		<td>help</td>
    		<td>show this text</td>
    	</tr>
        </table>`
    document.getElementById('text_div').innerHTML += helpHTML;
}

function interpret() {
    var input = document.getElementById('input').value;
    if (input == '') { return; }
    if (input.trim() == 'help') {
        displayHelp();
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
    switch(command) {
        case 'r':
            if (input.split(';')[1] == '') {
                goToSite('reddit.com');
                return;
            }
            goToSite('reddit.com/r/'+query, nt);
            return false;
        case 't':
            goToSite(query, nt);
            return false;
        case 'yt':
        case 'y':
            goToSite('https://www.youtube.com/results?search_query='+query, nt);
            return false;
        case 'a':
            goToSite('http://www.amazon.com/s?url=search-alias%3Daps&field-keywords='+query, nt);
            return false;
        case 'g':
            goToSite('https://www.google.com/search?q='+query, nt);
            return false;
         case 'wa':
            goToSite('http://www.wolframalpha.com/input/?i='+query, nt);
            return false;
        default:
            displayText('command not recognized');
            return false;
    }
}
