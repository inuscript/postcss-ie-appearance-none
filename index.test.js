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

it.only('append ms-expand2', () => {
    const input = `
    select.mySelect, .fooItem.bazItem .beeItem{
        appearance: none;
    }
    `;

    const expect = `
    select.mySelect, .fooItem.bazItem .beeItem{
        appearance: none;
    }
    select.mySelect::--ms-expand,
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
    select.mySelect::--ms-check{
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
    .mySomeFormItem::--ms-expand{
        display: none;
    }
    .mySomeFormItem::--ms-check{
        display: none;
    }
    `;
    return run(input, expect);
});
