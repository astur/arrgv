module.exports = function(str){
    var res = [];
    if (arguments.length === 0 ||
        typeof str !== 'string' ||
        str === '') {
        return res;
    }

    var sQuoted = false;
    var dQuoted = false;
    var backSlash = false;
    var buffer = '';
    for (var i=0, len=str.length; i<len; i++) {
        if (sQuoted && str[i] === "'") {
            sQuoted = false;
            continue;
        }
        if (!sQuoted && !dQuoted && !backSlash) {
            switch (str[i]) {
            case "'":
                sQuoted = true;
                continue;
            case '"':
                dQuoted = true;
                continue;
            case '\\':
                backSlash = true;
                continue;
            case '\b':
            case '\f':
            case '\n':
            case '\r':
            case '\t':
            case ' ':
                if (buffer.length) {
                    res.push(buffer);
                }
                buffer = '';
                continue;
            }
        }
        if (!sQuoted && dQuoted && !backSlash && str[i] === '"') {
            dQuoted = false;
            continue;
        }
        if (!sQuoted && dQuoted && !backSlash && str[i] === '\\') {
            backSlash = true;
            if (['"', '`', '$', '\\'].indexOf(str[i+1]) !== -1) {
                continue;
            }
        }
        if (backSlash) {
            backSlash = false;
        }
        buffer += str[i];
    }
    if (buffer.length) {
        res.push(buffer);
    }
    if (dQuoted) {
        throw new SyntaxError('unexpected end of string while looking for matching double quote');
    }
    if (sQuoted) {
        throw new SyntaxError('unexpected end of string while looking for matching single quote');
    }
    if (backSlash) {
        throw new SyntaxError('unexpected end of string right after slash');
    }
    return res;
};

if (require.main === module) {
    console.dir(process.argv);
}