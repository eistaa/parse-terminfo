'use strict';

var v        = require('./variables.js'),
    VARORDER = v.VARORDER;

/*
 * based of on the format description in the term(5) manual page.
 */

function parseTerminfo(buffer, term) {
    var offset = 0,
        result = {
            description:  undefined,
            term:         undefined,
            capabilities: {}
        };

    // check the magic number
    var magic = buffer.readInt16LE(offset);
    if ( magic != 0x011a )
        throw new Error('invalid magic number in buffer for '+term);
    offset += 2;

    // parse section sizes
    var sizes = {
        names:    buffer.readInt16LE(offset),
        booleans: buffer.readInt16LE(offset + 2),
        numbers:  buffer.readInt16LE(offset + 4),
        strings:  buffer.readInt16LE(offset + 6),
        table:    buffer.readInt16LE(offset + 8)
    };
    offset += 10;

    // parse names section
    var names = buffer.toString('ascii', offset, offset + sizes.names - 1).split('|');
    result.term = names[0];
    result.description = names[1];

    // parse booleans
    var boolean;
    for (
        var i = 0, end = Math.min(VARORDER.booleans.length, sizes.booleans);
        i < end;
        i += 1
    ) {
        if ( i >= VARORDER.booleans )
            continue;  // doesn't (yet) support extended terminfo

        boolean = !!(buffer.readInt8LE(offset + i));
        if ( boolean )
            result.capabilities[v[VARORDER[i]]] = true;
    }
    offset += sizes.booleans + (offset + sizes.booleans)%2;  // padded to short boundary

    // parse numbers
    var number;
    for (
        var i = 0, end = Math.min(VARORDER.numbers.length, sizes.numbers);
        i < end;
        i += 1
    ) {
        if ( i >= VARORDER.numbers )
            continue;  // doesn't (yet) support extended terminfo

        number = buffer.readInt16LE(offset + 2*i)
        if ( number !== -1 )
            result.capabilities[v[VARORDER[i]]] = number;
    }
    offset += 2*sizes.numbers;

    // parse strings
    var tableOffset, valueEnd,
        tableStart = offset + 2*sizes.strings;
    for (
        var i = 0, end = Math.min(VARORDER.strings.length, sizes.strings);
        i < end;
        i += 1
    ) {
        if ( i >= VARORDER.strings )
            continue;  // doesn't (yet) support extended terminfo

        tableOffset = buffer.readInt16LE(offset + 2*i);
        if ( tableOffset !== -1 ) {
            valueEnd = tableStart + tableOffset;
            while ( buffer[readvalueEnd++] !== '\0' );  // string values are null terminated
            result.capabilities[v[VARORDER[i]]] = buffer.toString(
                'ascii', tableStart + tableOffset, valueEnd - 1
            );
        }
    }

    return result;
}

module.exports = parseTerminfo;
