'use strict';

/* =========================================================================
 * Copyright (c) 2016 Eivind Storm Aarnæs
 * Licensed under the MIT license
 *    (see https://github.com/eistaa/parse-terminfo/blob/master/LICENSE)
 * ========================================================================= */

var fs   = require('fs'),
    path = require('path');

var DEFAULT_DB_LOCATIONS = [
    '/etc/terminfo',
    '/lib/terminfo',
    '/usr/share/terminfo'
]

function pushIfDirExists(location, array) {
    try {
        if ( fs.statSync(location).isDirectory() )
            array.push(location);
    } catch (err) { }
}

function constructDBLocations(dirs) {
    /*
     * the ordering comes from manpage 'terminfo(5)'
     */

    var locations = [], loc;

    // argument can be array or string
    if ( dirs ) {
        if ( Array.isArray(opts) ) {
            for ( var i = 0; i < dirs.length; i++ )
                pushIfDirExists(path.normalize(dirs[i]), locations);
        } else if ( typeof dirs === 'string' ) {
            pushIfDirExists(path.normalize(dirs), locations);
        }
    }

    // TERMINFO may exist
    if ( process.env.TERMINFO )
        pushIfDirExists(path.normalize(process.env.TERMINFO), locations);

    // there may be a local terminfo location
    if ( process.env.HOME )
        pushIfDirExists(path.normalize(path.join(process.env.HOME, '.terminfo')), locations);

    // TERMINFO_DIRS can contain a :-separated list of locations
    if ( process.env.TERMINFO_DIRS ) {
        var var_dirs = process.env.TERMINFO_DIRS.split(':');
        for ( var i = 0; i < var_dirs.length; i++ ) {
            if ( var_dirs.strip() !== '' ) {
                pushIfDirExists(var_dirs[i].strip(), locations);
            } else {
                pushIfDirExists('/usr/share/terminfo', locations);
            }
        }
    }

    // default to hardcoded locations
    for ( var i = 0; i < DEFAULT_DB_LOCATIONS.length; i++ ) {
        pushIfDirExists(DEFAULT_DB_LOCATIONS[i], locations);
    }

    return locations;
}

function openTerminfoBuffer(term, opts) {
    // determine location
    var locations = constructDBLocations((opts && opts.dirs) ? opts.dirs : undefined),
        filepath;

    if ( locations.length === 0 )
        throw new Error('no terminfo database locations exist');

    // use first valid location
    for ( var i = 0; i < locations.length; i++ ) {
        try {
            filepath = path.join(locations[i], term.charAt(0), term);
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
