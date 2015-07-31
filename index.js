module.exports = function(str){
    var res = [];
    if (arguments.length == 0 ||
        typeof str !== 'string' ||
        str == '') return res;

    var sQuoted = false;
    var dQuoted = false;
    var backSlash = false;
    var buffer = '';
    for (var i=0, len=str.length; i<len; i++) {
        var c = str[i];
        var cc = str[i+1];
        if (c == "'") {
            if (sQuoted) {
                sQuoted = false;
            } else if (backSlash) {
                buffer += c;
                backSlash = false;
            } else if (dQuoted) {
                buffer += c;
            } else {
                sQuoted = true;
            }
            continue;
        }

        if (c == '"') {
            if (sQuoted) {
                buffer += c;
            } else if (backSlash) {
                buffer += c;
                backSlash = false;
            } else if (dQuoted) {
                dQuoted = false;
            } else {
                dQuoted = true;
            }
            continue;
        }

        if (c == '\\') {
            if (sQuoted) {
                buffer += c;
            } else if (backSlash) {
                buffer += c;
                backSlash = false;
            } else if (!dQuoted) {
                backSlash = true;
            } else if (~['"', '`', '$', '\\'].indexOf(cc)) {
                backSlash = true;
            } else {
                buffer += c;
                backSlash = true;
            }
            continue;
        }

        if (~['\b', '\f', '\n', '\r', '\t', ' '].indexOf(c)) {
            if (sQuoted) {
                buffer += c;
            } else if (backSlash) {
                buffer += c;
                backSlash = false;
            } else if (dQuoted) {
                buffer += c;
            } else {
                if (buffer.length) res.push(buffer);
                buffer = '';
            }
            continue;
        }

        if (sQuoted) {
            buffer += c;
        } else if (backSlash) {
            buffer += c;
            backSlash = false;
        } else if (dQuoted) {
            buffer += c;
        } else {
            buffer += c;
        }
    }
    if (buffer.length) res.push(buffer);
    return res;
}


if (require.main === module) {
    console.dir(process.argv);
};