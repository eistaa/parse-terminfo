'use strict';

function parse(opts) {
    var term;

    if ( process.platform === 'win32' )
        throw new Error('no terminfo for windows...');

    // get term
    if ( opts && opts.term ) {
        term = String(opts.term);
    } else {
        if ( process.env.TERM ) {
            term = process.env.TERM;
        } else {
            throw new Error('No terminal specified (`opts.term`) and TERM is undefined');
        }
    }

    var buf = require('./lib/openTerminfoBuffer.js')(term, opts);
    return require('./lib/parseTerminfo.js')(term, buff);
}

module.exports = {
    parse: parse,
    VARIABLES: require('./lib/variables.js').ALL
}
