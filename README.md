# tab: a startpage
_a startpage, new tab page, homepage_

Tab lives [here](https://koryschneider.github.io/tab-a-startpage). Please read below if you haven't used it before.

### Contents

 - [Usage](#usage)
   - [Intro](#intro)
   - [Menus](#menus)
   - [Examples](#examples)
 - [Chrome Extension](#chrome-extension)
 - [Bugs & Suggestions](#bugs-&-extensions)


## Usage

#### Intro
The purpose of this site is to use short, simple commands to access and search websites quickly.

The syntax is as follows: `command;query[;n]`

Commands are shortcuts for sites (e.g. `y` for YouTube). If you simply enter a command, it will take you to that site.

<sup>For a full list of commands and what they do, take a look at the help menu (see [menus](#menus) section below).</sup>

You can search sites by separating the command and your query with a semicolon. If you wanted to search YouTube for cat videos, you would enter: `y;cat videos`. (Note that leading/trailing spaces get stripped, so entering `y; cat videos` will do the same thing.)

If you do not enter a command, the input will be taken as a query and the default command will be executed. The default default command is Google, but this can be changed in the options menu. <sup>(again, see [menus](#menus) section below).</sup>

Some commands behave slightly differently. For example, the Reddit command (`r`) will take you to a subreddit rather than searching Reddit (e.g. `r;askreddit`). With this particular command you can also do things like: `r;askreddit/top?t=month` to quickly get where you want to be.

If you want to go to a website that does not have an associated command, you can use the `t` command like so: `t;gmail.com` (opens gmail.com in the current tab).

If you want to open your command in a new tab, you can add `;n` to the end of your command, like this: `img;coffee;n`. In the options menu you can make this the default behavior.

#### Menus
There are two menus you can access: help and options.

 - To get to the _help_ menu, enter `help` or `?`. <sup>(you can also click on the clock)</sup>

 - To get to the _options_ menu, enter `options` or `settings`.

#### Examples
Here some sample inputs and what they do:

 - `y;cat videos` searches YouTube for 'cat videos'.

 - `r;askreddit` takes you to the AskReddit subreddit.

 - `n;fargo` searches Netflix for 'fargo'.

 - `imdb;pulp fiction` searches Internet Movie DataBase for 'pulp fiction'.

 - `t;gmail.com` opens gmail.com in the current tab.

 - `a;popsicles;n` searches Amazon for popsicles in a new tab.

## Chrome extension
Replaces the new tab page with tab startpage. Highly recommended - [get it here!](https://chrome.google.com/webstore/detail/tab-a-startpage/gedoejjmdjalipopahiffdghibcodjcj)

## Bugs & Suggestions
If something is not working right, please let me know by creating an issue
[here](https://github.com/koryschneider/tab-a-startpage/issues). Feel free to
leave suggestions there as well. Thanks!
