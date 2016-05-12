'use strict';

/* =========================================================================
 * Copyright (c) 2016 Eivind Storm Aarnæs
 * Licensed under the MIT license
 *    (see https://github.com/eistaa/parse-terminfo/blob/master/LICENSE)
 * ========================================================================= */

function parse(opts) {
    var term;

    if ( process.platform === 'win32' )
        throw new Error('no terminfo for windows...');

    // get term
    if ( opts && opts.term ) {
        term = String(opts.term);
    } else {
        if ( process.env.TERM && process.env.TERM !== '' ) {
            term = process.env.TERM;
        } else {
            throw new Error('No terminal specified (`opts.term`) and TERM is undefined');
        }
    }

    var bufferdata = require('./lib/openTerminfoBuffer.js')(term, opts);
    var capabilities = require('./lib/parseTerminfo.js')(term, bufferdata.buffer);
    capabilities.path = bufferdata.path;

    return capabilities;
}

module.exports = {
    parse: parse,
    VARIABLES: require('./lib/variables.js').ALL
}
