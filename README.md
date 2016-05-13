
PARSE-TERMINFO
==============

Library for parsing compiled terminfo files.

Usage
-----

To obtain terminfo descriptions use the [`parse()` function](#parse-opts)
like this:
```js
// get the description for the current terminal
var terminfo = require('terminfo').parse();

// get the description for xterm
var terminfo = require('terminfo').parse({ term: 'xterm' });

// get the description for the current terminal while starting to search
// in a specified directory
var terminfo = require('terminfo').parse({
    directories: '/my/custom/terminfo'
});

// get the description for xterm while starting to search in a specified
// directory
var terminfo = require('terminfo').parse({
    term: 'xterm',
    directories: [ '/my/custom/terminfo', '/my/other/terminfo' ]
});
```

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

Throws errors if:

 * The platform is windows, (on TODO list).
 * No terminal specified (`opts.term`), and `TERM` is empty or doesn't exist.
 * If no search locations exists. Cannot be read counts as not existing.
 * The terminal have no terminfo file.
 * If the magic number in the terminfo file is invalid.

### `VARIABLES <Object>`

An object of all terminfo variable names. Maps from uppercase long names to
capnames.

Todo
-----

 * Return capabilities for the windows console if `process.platform ===
   'win32'`. (`package.json` should prevent windows use.)
 * Parse extended terminfo format. Current behavior is to silently ignore
   extra capabilities.

Resources
---------

 * [term(5) -- Format of compiled term file](http://linux.die.net/man/5/term)
 * [terminfo(5) -- Terminal capability data base](http://linux.die.net/man/5/terminfo)
 * [The Termcap Manual](https://www.gnu.org/software/termutils/manual/termcap-1.3/html_chapter/termcap_toc.html)
