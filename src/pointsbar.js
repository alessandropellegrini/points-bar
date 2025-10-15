/**
 * Functions for creating and saving svg points bar.
 */
const fs = require("fs");
const path = require("path");

// returns svg string
function templateSVG(currentPoints, maxPoints, options = {}) {
    const type = options.type || 'default';
    const label = options.label || 'Points';
    const styleOptions = options.style || {};
    let svg = '';

    const percentage = Math.min(Math.floor((currentPoints / maxPoints) * 100), 100);

    // throw error if percentage not number
    if (isNaN(percentage)) {
	console.log('Points is ' + currentPoints + ' and max is ' + maxPoints)
        throw new TypeError("Can not calculate percentage from inputs");
    }

    // load template for bar type
    if (type == 'badge') {
        const template = require('./template-badge');
        svg = template(currentPoints, maxPoints, percentage, label, styleOptions);
    }
    else {
        const template = require('./template-default');
        svg = template(currentPoints, maxPoints, percentage, label, styleOptions);
    }
    return svg;
}

// write svg file
function writeSVGFile(filePath, svg) {

    // throw error if filePath not string
    if (typeof filePath !== 'string') {
        throw new TypeError("File path not a string");
    }

    const fileParts = path.parse(filePath);
    // console.log(fileParts);

    // warn if no ext on path
    if (!fileParts.ext) {
        console.log(`::warning::No ext in filename: ${filePath}`);
    }

    try {
        // check dir of path exists
        if ((fileParts.dir) && !fs.existsSync(fileParts.dir)){
            console.log(`Dir '${fileParts.dir}' not found. Creating it...`);
            fs.mkdirSync(fileParts.dir, { recursive: true });
        }
    } catch(error) {
        console.log(`Error creating directory '${fileParts.dir}'.`);
        error.message = `Error creating directory '${fileParts.dir}'.\n\n` + error.message;
        throw error;
    }

    // fs.writeFile(filepath, svg, function (err) {
    //     if (err) return console.log(err);
    //     console.log(`SVG bar > ${filepath}`);
    // });

    try {
        // write svg file
        fs.writeFileSync(filePath, svg);
        console.log(`Write file: SVG bar > ${filePath}`);

    } catch(error) {
        console.log(`Error writing SVG file '${filePath}'.`);
        error.message = `Error writing SVG file '${filePath}'.\n\n` + error.message;
        throw error;
    }
}

module.exports = { templateSVG, writeSVGFile }
