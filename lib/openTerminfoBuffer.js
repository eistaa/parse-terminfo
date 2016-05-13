'use strict';

/* =========================================================================
 * Copyright (c) 2016 Eivind Storm Aarnæs
 * Licensed under the MIT license
 *    (see https://github.com/eistaa/parse-terminfo/blob/master/LICENSE)
 * ========================================================================= */

var fs   = require('fs'),
    path = require('path');

var DEFAULT_DB_DIRECTORIES = [
    '/etc/terminfo',
    '/lib/terminfo',
    '/usr/share/terminfo'
]

function pushIfDirExists(directory, array) {
    try {
        if ( fs.statSync(directory).isDirectory() )
            array.push(directory);
    } catch (err) { }
}

function constructDBDirectories(dirs) {
    /*
     * the ordering comes from manpage 'terminfo(5)'
     */

    var directories = [], loc;

    // argument can be array or string
    if ( dirs ) {
        if ( Array.isArray(opts) ) {
            for ( var i = 0; i < dirs.length; i++ )
                pushIfDirExists(path.normalize(dirs[i]), directories);
        } else if ( typeof dirs === 'string' ) {
            pushIfDirExists(path.normalize(dirs), directories);
        }
    }

    // TERMINFO may exist
    if ( process.env.TERMINFO )
        pushIfDirExists(path.normalize(process.env.TERMINFO), directories);

    // there may be a local terminfo directory
    if ( process.env.HOME )
        pushIfDirExists(path.normalize(path.join(process.env.HOME, '.terminfo')), directories);

    // TERMINFO_DIRS can contain a :-separated list of directories
    if ( process.env.TERMINFO_DIRS ) {
        var var_dirs = process.env.TERMINFO_DIRS.split(':');
        for ( var i = 0; i < var_dirs.length; i++ ) {
            if ( var_dirs.strip() !== '' ) {
                pushIfDirExists(var_dirs[i].strip(), directories);
            } else {
                pushIfDirExists('/usr/share/terminfo', directories);
            }
        }
    }

    // default to hardcoded directories
    for ( var i = 0; i < DEFAULT_DB_DIRECTORIES.length; i++ ) {
        pushIfDirExists(DEFAULT_DB_DIRECTORIES[i], directories);
    }

    return directories;
}

function openTerminfoBuffer(term, opts) {
    // determine directories
    var directories = constructDBDirectories(
        (opts && opts.directories) ? opts.directories : undefined
    ), filepath;

    if ( directories.length === 0 )
        throw new Error('no terminfo database directories exist');

    // use first valid directory
    for ( var i = 0; i < directories.length; i++ ) {
        try {
            filepath = path.join(directories[i], term.charAt(0), term);
            if ( fs.statSync(filepath).isFile() ) {
                break;
            }
        } catch (err) {
            filepath = undefined;
        }
    }

    if ( filepath === undefined )
        throw new Error(term+' have no terminfo data');

    // read to buffer
    return {
        path:   filepath,
        buffer: fs.readFileSync(filepath)
    };
}

module.exports = openTerminfoBuffer;
