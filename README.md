
PARSE-TERMINFO
==============

Library for parsing compiled terminfo files.

Usage
-----

To obtain terminfo descriptions use the [`parse()` function](#parseopts)
like this:
```js
// get the description for the current terminal
var terminfo = require('parse-terminfo').parse();

// get the description for xterm
var terminfo = require('parse-terminfo').parse({ term: 'xterm' });

// get the description for the current terminal while starting to search
// in a specified directory
var terminfo = require('parse-terminfo').parse({
    directories: '/my/custom/terminfo'
});

// get the description for xterm while starting to search in multiple
// specified directory
var terminfo = require('parse-terminfo').parse({
    term: 'xterm',
    directories: [ '/my/custom/terminfo', '/my/other/terminfo' ]
});
```

To lookup data from the terminfo you use the names from
[VARIABLES](#variables-object). E.g.:
```js
var terminfo  = require('parse-terminfo').parse(),
    VARIABLES = require('parse-terminfo').VARIABLES;

// boolean: to lookup if "output to last column wraps cursor to next line"
var am_flag = terminfo.booleans.has(VARIABLES.AUTO_RIGHT_MARGIN);

// numbers: to lookup "maximum number of colors on screen"
var number_colors;
if ( terminfo.numbers.has(VARIABLES.MAX_COLORS) )
    number_colors = terminfo.numbers[VARIABLES.MAX_COLORS];

// strings: to lookup the keycode for the delete character
var string_dch1;
if ( terminfo.strings.has(VARIABLES.DELETE_CHARACTER) )
    string_dch1 = terminfo.strings[VARIABLES.DELETE_CHARACTER];
```

Variable names are uppercase forms of the variable names from the `terminfo(5)`
man page.

See also the example file [`example/dump-info.js`](example/dump-info.js) for an
example that prints the terminfo description for the current terminal similar
the `infocmp` program.

API
---

This library exports two symbols:

### `parse([opts])`

 * `opts`: `<Object>` optional config object
    * `term`: `<String>` name of a terminal to lookup terminfo for. If missing
      the environment variable `TERM` is used.
    * `directories`: `<Array> | <String>` extra directories to search for
      terminfo files. If it is a string it is interpreted as the path to the
      root of a terminfo database directory hierarchy. If it is an array each
      array entry is searched in order. Directories given here have the highest
      search precedence.

Search for and parse the compiled terminfo file for a terminal. Returns the
terminfo as a nested object if found and everything went OK. The return object
have the fields:

 * `description`: `<String>` first line of the terminal description.
 * `term`: `<Array>` a list of the terminal name and any aliases.
 * `path`: `<String>` path to the terminfo file.
 * `capabilities`: `<Object>` object with three sub-objects: `booleans`,
   `numbers`, and `strings`. Each object maps capnames (see
   [`VARIABLES`](#variables-object)) to values. Boolean values are all `true`.

The directory search order almost matches the order described in the man page
`terminfo(5)`.

 1. Any directories specified in `opts.directories`, in the given order.
 2. The directory specified in the enviroment variable `TERMINFO` if it exists.
 3. The user directory `$HOME/.terminfo` if it exists.
 4. Any directories specified in the enviroment variable `TERMINFO_DIRS` if
    it exists, in the given order. Empty paths (` === ''`) are replaced by
    `/etc/terminfo`.
 5. Otherwise the directories `/etc/terminfo`, `/lib/terminfo`, and
    `/usr/share/terminfo` are searched in order.

The first directory where a terminfo file matching the terminal name is used,
if parsing that file fails the search doesn't continue.

The function throws an error in the following cases:

 * The platform is windows, (on TODO list). (`package.json` should prevent
   windows use.)
 * No terminal specified (`opts.term`), and `TERM` is empty or doesn't exist.
 * If no search locations exists. Cannot be read counts as not existing.
 * The terminal have no terminfo file.
 * If the magic number in the terminfo file is invalid.

### `VARIABLES <Object>`

An object of all terminfo variable names. Maps from uppercase long names to
capnames.

Todo
----

 * Return capabilities for the windows console if `process.platform ===
   'win32'`. (`package.json` should prevent windows use.)
 * Parse extended terminfo format. Current behavior is to silently ignore
   extra capabilities.

Resources
---------

 * [term(5) -- Format of compiled term file](http://linux.die.net/man/5/term)
 * [terminfo(5) -- Terminal capability data base](http://linux.die.net/man/5/terminfo)
 * [The Termcap Manual](https://www.gnu.org/software/termutils/manual/termcap-1.3/html_chapter/termcap_toc.html)
