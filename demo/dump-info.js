
var terminfo = require('../index'),
    info     = terminfo.parse();

var linelength = 60;

console.log('#\tReconstructed from file: \''+info.path+'\'');
console.log([ info.term.join('|'), info.description ].join(' ') + ',');

var outputbuffer = '';

// booleans
Object.keys(info.capabilities.booleans).sort().forEach(function (el) {
    if ( (outputbuffer.length + el.length + 1) >= linelength ) {
        console.log('\t' + outputbuffer.substr(0, outputbuffer.length-1));
        outputbuffer = '';
    }
    outputbuffer = outputbuffer.concat(el+', ');
});
if ( outputbuffer.trim().length > 0 ) {
    console.log('\t' + outputbuffer.substr(0, outputbuffer.length-1));
    outputbuffer = '';
}

// numbers
Object.keys(info.capabilities.numbers).sort().forEach(function (el) {
    var tmp = el+'#'+info.capabilities.numbers[el].toString()+', ';
    if ( (outputbuffer.length + tmp.length) >= linelength ) {
        console.log('\t' + outputbuffer.substr(0, outputbuffer.length-1));
        outputbuffer = '';
    }
    outputbuffer = outputbuffer.concat(tmp);
});
if ( outputbuffer.trim().length > 0 ) {
    console.log('\t' + outputbuffer.substr(0, outputbuffer.length-1));
    outputbuffer = '';
}

// strings
Object.keys(info.capabilities.strings).sort().forEach(function (el) {
    var tmp = el+'='+info.capabilities.strings[el].toString()+', ';
    // replace control characters
    [
        [ /\x00/g, '^@' ],  [ /\x01/g, '^A' ], [ /\x02/g, '^B' ], [ /\x03/g, '^C' ],
        [ /\x04/g, '^D' ],  [ /\x05/g, '^E' ], [ /\x06/g, '^F' ], [ /\x07/g, '^G' ],
        [ /\x08/g, '^H' ],  [ /\x09/g, '^I' ], [ /\x0a/g, '^J' ], [ /\x0b/g, '^K' ],
        [ /\x0c/g, '^L' ],  [ /\x0d/g, '^M' ], [ /\x0e/g, '^N' ], [ /\x0f/g, '^O' ],
        [ /\x10/g, '^P' ],  [ /\x11/g, '^Q' ], [ /\x12/g, '^R' ], [ /\x13/g, '^S' ],
        [ /\x14/g, '^T' ],  [ /\x15/g, '^U' ], [ /\x16/g, '^V' ], [ /\x17/g, '^W' ],
        [ /\x18/g, '^X' ],  [ /\x19/g, '^Y' ], [ /\x1a/g, '^Z' ], [ /\x1b/g, '\\E' ],
        [ /\x1c/g, '^\\' ], [ /\x1d/g, '^]' ], [ /\x1e/g, '^^' ], [ /\x1f/g, '^_' ],
        [ /\x7f/g, '^?' ],
    ].forEach(function (ar) {
        tmp = tmp.replace(ar[0], ar[1]);
    })
    // output
    if ( (outputbuffer.length + tmp.length) >= linelength ) {
        console.log('\t' + outputbuffer.substr(0, outputbuffer.length-1));
        outputbuffer = '';
    }
    outputbuffer = outputbuffer.concat(tmp);
});
if ( outputbuffer.trim().length > 0 ) {
    console.log('\t' + outputbuffer.substr(0, outputbuffer.length-1));
    outputbuffer = '';
}
