## Commands

Here are all the commands and what they do.

Arguments in [brackets] are optional. Vertical pipes (`|`) mean 'or'.

 - [Builtin](#builtin)
   - [set](#set)
   - [link](#link)
   - [config](#config)
   - [help](#help)
   - [newtab flag](#new-tab-flag)
 - [Websites](#websites)
   - [Google](#google)
   - [DuckDuckGo](#duckduckgo)
   - [Reddit](#reddit)
   - [Hacker News](#hacker-news)
   - [GitHub](#github)
   - [GitHub Gist](#github-gist)
   - [YouTube](#youtube)
   - [Netflix](#netflix)
   - [Amazon](#amazon)
   - [Wikipedia](#wikipedia)
   - [Dictionary](#dictionary)
   - [Thesaurus](#thesaurus)
   - [Wolfram Alpha](#wolfram-alpha)
   - [Internet Movie Database](#internet-movie-database)
   - [Google Maps](#google-maps)
   - [Google Drive](#google-drive)
   - [Google Keep](#google-keep)
   - [Trello](#trello)
   - [Google Images](#google-images)
   - [Google Calendar](#google-calendar)
   - [Node Package Manager](#node-package-manager)
   - [Python Package Index](#python-package-index)
   - [Stack Overflow](#stack-overflow)
   - [MDN web docs](#mdn-web-docs)
   
## Builtin

#### set
`set ;setting [;value]`

This is how you change your settings. Settings are saved locally, but can be synced using Gist (see [config](#config) command).

 - **setting** - One of: `defaultCommand`, `bgColor`, `textColor`, `caretColor`, `fontSize`, `clock`, `clockSize`, `newtab`. If no value is given, the current value will be displayed.
 - **value** - A hex color value for `bgColor` and `textColor`; a hex color value or `auto` for `caretColor`; a command shortcut (e.g. `y`) for `defaultCommand`; a CSS font size (e.g. `1em` or `42px`) for `fontSize` and `clockSize`; one of `on`, `off`, `12` or `24` for `clock`.
 - `set;defaults` will restore default values for all options.

For example: `set;bgColor;#282828` | `set;defaultCommand;dg` | `set;clock;off`

---

#### link
`link ;shortcut ;url [;search]`

This is how you can create custom shortcuts. They are stored in your config. A
link has three parts:

 - `shortcut` - A command shortcut, e.g. `y` for YouTube. Cannot be the same as
   a builtin command.
 - `url` - A website URL, where you want to go when entering the above shortcut.
 - `search` - A piece of a URL that gets appended to the base `url`, e.g.
 `/search?q=`.

To see all your links: `link ;show`.  
To delete a link: `link ;shortcut ;delete`.

As an example, here's how you could create a link for Google, and how it would
function (note Google is already a builtin, `g`):  
`link ;goog ;https://google.com ;/search?q=`

Now with our `goog` shortcut, we can enter `goog;binary` to search for "binary",
which simply redirects us to `https://www.google.com/search?q=binary`.

---

#### config
`config [;fetch [;gist]] | ;export | ;import`

This is how you can manage your settings across devices.

 - `fetch [;gist]` - `gist` can be a URL or simply the 32-character gist ID.
 This will only work if the gist has one file in it, and the contents of that file is valid.
 The ID will be saved after the first fetch so in the future, you can simply run
 `config;fetch` to update.
 
 - `open` - Opens the saved gist ID. `config;fetch;<gist>` must be run first to get the ID.

 - `export` - Will display your config and highlight it for easy copying.
 
 - `import ;<config>` - Direct import, paste in a config to import it.
 Less useful than `fetch`, but works if you don't use Gist.

**To set up a config with Github Gist:**

 - `config;export` and copy the output with Ctrl+C / Cmd+C.

 - `gist;new`, paste the copied text, create public or private gist.

 - Copy the link of the newly created Gist, then import it:
 `config;fetch;<gist link>`. The gist ID is now part of your config, so simply
 running `config;fetch` without the link will fetch the same gist.

 - Edit your config via `config;open` and then `config;fetch` for easy syncing.

---

#### help
`help` - Opens this page.

---

#### new tab flag
Add `;n` to the end of any command to open the result in a new tab.

---

## Websites

#### Google
`g [;query]`

 - **query** - Search Google for `query`.

---

#### DuckDuckGo
`dg [;query]`

 - **query** - Search DuckDuckGo for `query`.

---

#### Reddit
`r [;subreddit] [;sort] [;range]`

 - **subreddit** - Go to a subreddit.
 - **sort** - One of: `hot`, `new`, `rising`, `controversial`, `top`, `gilded`,
 `wiki`, `promoted`.
  - **range** - One of: `day`, `week`, `month`, `year`, `all`.

For example: `r;linux;top;week` goes to `reddit.com/r/linux/top?t=week`

---

#### Hacker News
`hn [;section]`

 - **section** - One of: `new`, `comments`, `show`, `ask`, `jobs`, `submit`.

---

#### GitHub
`gh [;github path]`

 - **github path** - Anything that normally comes after `github.com`.

For example: `gh;koryschneider/mintab` or `gh;new`

---

#### GitHub Gist
`gist [;username]`

 - **username** - View gists for GitHub user `username`.

---

#### YouTube
`y [;query | subs | s]`

 - **query** - Search YouTube for `query`.
 - **subs** / **s** - Go to your subscriptions feed.

---

#### Gmail
`gm [;query]`

 - **query** - Search your mail for `query`.

---

#### Netflix
`n [;query]`

 - **query** - Search Netflix for `query`.

---

#### Amazon
`a [;query]`

 - **query** - Search Amazon for `query`.

---

#### Wikipedia
`w [;query]`

 - **query** - Search Wikipedia for `query`.

---

#### Dictionary
`dict [;query]`

 - **query** - Search dictionary.com for `query`.

---

#### Thesaurus
`thes [;query]`

 - **query** - Search thesaurus.com for `query`.

---

#### Wolfram Alpha
`wa [;query]`

 - **query** - Search Wolfram Alpha for `query`.

---

#### Internet Movie Database
`imdb [;query]`

 - **query** - Search Internet Movie Database for `query`.

---

#### Google Maps
`map [;query]`

 - **query** - Search Google Maps for `query`.

---

#### Google Drive
`gd [;query]`

 - **query** - Search Google Drive for `query`.

---

#### Google Keep
`k [;query]`

 - **query** - Search Google Keep for `query`.

---

#### Trello
`tr [;query]`

 - **query** - Search Trello for `query`.

---

#### Google Images
`img [;query]`

 - **query** - Search Google Images for `query`.

---

#### Google Calendar
`cal` - Go to Google Calendar

---

#### Node Package Manager
`npm [;query]`

 - **query** - Search NPM for `query`.
 
---

#### Python Package Index
`pypi [;query]`

 - **query** - Search PyPi for `query`.
 
---

#### Stack Overflow
`so [;query]`

 - **query** - Search Stack Overflow for `query`.

---

#### MDN web docs
`mdn [;query]`

 - **query** - Search MDN web docs for `query`.
