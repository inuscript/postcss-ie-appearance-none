const postcss = require('postcss');
const perfectionist = require('perfectionist');

const plugin = require('./');

function sanitizeCss(cssString) {
    return perfectionist.process(cssString);
}

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            return Promise.all([
                result,
                sanitizeCss(result.css),
                sanitizeCss(output)
            ]);
        })
        .then( ([result, inputCss, outputCss]) => {
            expect(inputCss.css).toEqual(outputCss.css);
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

it('append ms-expand2', () => {
    const input = `
    select.mySelect,
    input .myInput,
    .fooItem.bazItem .beeItem{
        appearance: none;
    }
    `;

    const expect = `
    select.mySelect,
    input .myInput,
    .fooItem.bazItem .beeItem{
        appearance: none;
    }

    select.mySelect::--ms-expand,
    input .myInput::--ms-check,
    .fooItem.bazItem .beeItem::--ms-expand,
    .fooItem.bazItem .beeItem::--ms-check {
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
    input.myCheckbox::--ms-check{
        display: none;
    }
    `;
    return run(input, expect);
});
it('append both', () => {
    const input = `
    .mySomeFormItem{
        appearance: none;
    }
    `;

    const expect = `
    .mySomeFormItem{
        appearance: none;
    }
    .mySomeFormItem::--ms-expand, .mySomeFormItem::--ms-check{
        display: none;
    }
    `;
    return run(input, expect);
});
