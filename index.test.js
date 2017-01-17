const postcss = require('postcss');

const plugin = require('./');

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            expect(sanitizeCss(result.css)).toEqual(sanitizeCss(output));
            expect(result.warnings().length).toBe(0);
        });
}

function sanitizeCss(cssString) {
    return cssString.replace(/(\s)/g, '');
}

it('does something', () => {
    const input = `
    select.mySelect{
        appearance: none;
    }
    `;

    const expect = `
    select.mySelect{
        appearance: none;
    }
    select.mySelect::--ms-expand{
        display: none;
    }
    `;
    return run(input, expect);
});
