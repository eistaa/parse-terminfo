
PARSE-TERMINFO
==============

Library for parsing compiled terminfo files.

API
---

This library exports two symbols:

### `parse([opts])`

 * `opts`: `<Object>` optional config object
    * `term`: `<String>` name of a terminal to lookup terminfo for. If missing
      the environment variable `TERM` is used.
    * `dirs`: `<Array> | <String>` extra directories to search for terminfo
      files. If it is a string it is interpreted as the path to the root of a
      terminfo database directory hierarchy. If it is an array each array entry
      is searched in order. Directories given here have the highest search
      precedence.

Search for and parse the terminfo file for a terminal. Returns the terminfo as
a `Object` if found and everything went OK. The return `Object` have the fields:

 * `description`: `<String>` first line of terminal description.
 * `term`: `<String>` a `|`-separated list of the terminal name and it's aliases.
 * `path`: `<String>` path to the terminfo file.
 * `capabilities`: `<Object>` object with the parsed capabilities. The values
   from [`VARIABLES`](VARIABLES).

Throws errors if:

 * The platform is windows, (on TODO list).
 * No terminal specified (`opts.term`), and `TERM` is empty or doesn't exist.
 * If no search locations exists. Cannot be read counts as not existing.
 * The terminal have no terminfo file.
 * If the magic number in the terminfo file is invalid.

### `VARIABLES`

An `Object` of all terminfo variable names. Maps from long names to capnames.

Todo
-----

 * Return capabilities for the windows console if `process.platform ===
   'win32'`.
 * Parse extended terminfo format. Current behavior is to silently ignore
   extra capabilities.

Resources
---------

 * [term(5) -- Format of compiled term file](http://linux.die.net/man/5/term)
 * [terminfo(5) -- Terminal capability data base](http://linux.die.net/man/5/terminfo)
 * [The Termcap Manual](https://www.gnu.org/software/termutils/manual/termcap-1.3/html_chapter/termcap_toc.html)
