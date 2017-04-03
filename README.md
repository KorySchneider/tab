# tab: a startpage
_a startpage, new tab page, homepage_

Tab lives [here](https://koryschneider.github.io/tab-a-startpage). Please [read below](#usage) if you haven't used it before.

### Contents

 - [Usage](#usage)

   - [Intro](#intro)

   - [Examples](#examples)

   - [Menus](#menus)

   - [Custom Commands](#custom-commands)

 - [Chrome Extension](#chrome-extension)

 - [Bugs & Suggestions](#bugs-&-extensions)


## Usage

### Intro
The purpose of this site is to use short, simple commands to access and search websites quickly.

The syntax is as follows: `command;query[;n]`

Commands are shortcuts for sites (e.g. `y` for YouTube). You can search sites by separating the command and your query with a semicolon. If you wanted to search YouTube for cats, you would enter: `y;cats`. If you simply enter a command and no query, it will take you to that site. <sup>(Note that leading/trailing spaces get stripped, so entering `y; cats` will do the same thing.)</sup>

You can also enter a URL by itself to go to it.

For a full list of commands and what they do, refer to the command list in the help menu. <sup>(see [menus](#menus) section below)</sup>

### Examples
Here some sample inputs and what they do:

 - `y;cats` searches YouTube for 'cats'.

 - `r;askreddit` takes you to the AskReddit subreddit.

 - `github.com` goes to github.com

 - `n;pulp fiction` searches Netflix for 'pulp fiction'.

 - `a;popsicles;n` searches Amazon for popsicles in a new tab.


Some commands behave slightly differently. For example, the `r` command will take you to a subreddit rather than searching Reddit (e.g. `r;askreddit`). With this particular command you can also do things like `r;askreddit/top?t=month` to quickly get where you want to be. The `t` command takes a URL instead of a query, e.g. `t;gmail.com`.

If you do not enter a command, the input will be taken as a query and the default command will be executed. The default default command is Google, but this can be changed in the options menu. <sup>(again, see [menus](#menus) section below).</sup>

### Menus
There are two menus you can access: help and options.

 - To get to the _help_ menu, enter `help` or `?`. <sup>(you can also click on the clock)</sup>

 - To get to the _options_ menu, enter `options` or `settings`.

### Custom Commands
You can add your own custom commands in the options menu.
Custom commands are specified using [JSON](https://en.wikipedia.org/wiki/Json).
Note that built-in commands have precedence over custom commands;
check the help menu  to make sure any shortcuts (`command`s) you choose are not already taken.

The format is as follows (using YouTube as an example):

    {
      "command": "y",
      "url": "https://www.youtube.com",
      "search": "/results?search_query="
    }

Using the quick-add form in the options menu will save you some typing.

__Explanation of each item__:

 - `command` - This is what you type into the input box.

 - `url` - The base site; this is where you will be redirected to if you enter `command` by itself.

 - `search` - When you add a query to your command (e.g. `y;cats`), `search` will be appended to `url`, and then your query will be appended to *that* to form the full search URL, like this: `https://youtube.com/results?search_query=cats`.

To figure out what `search` should be for your custom command, go to the website you want to add and do a search (for anything), then look at and dissect the URL you are taken to.

If the website you wish to add a command for does not have a search engine, you may leave the `search` value blank (but do not remove it entirely).

## Chrome extension
Replaces the new tab page with tab startpage. [Highly recommended - get it here!](https://chrome.google.com/webstore/detail/tab-a-startpage/gedoejjmdjalipopahiffdghibcodjcj)

## Bugs & Suggestions
If something is not working right or you have an idea to make this startpage better, please let me know by [opening an issue](https://github.com/koryschneider/tab-a-startpage/issues) or emailing [tab.startpage@gmail.com](mailto:tab.startpage@gmail.com). Thanks!
