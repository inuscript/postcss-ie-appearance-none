const postcss = require('postcss');

const plugin = require('./');

function sanitizeCss(cssString) {
    return cssString.replace(/(\s)/g, '');
}

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            expect(sanitizeCss(result.css)).toEqual(sanitizeCss(output));
            expect(result.warnings().length).toBe(0);
        });
}

it('append ms-expand', () => {
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
it('append ms-check', () => {
    const input = `
    input.myCheckbox{
        appearance: none;
    }
    `;

    const expect = `
    input.myCheckbox{
        appearance: none;
    }
    select.mySelect::--ms-check{
        display: none;
    }
    `;
    return run(input, expect);
});
