const postcss = require('postcss');

const createRule = (selector, prefix) => {
    const node = postcss.rule({
        selector: `${selector}::--ms-${prefix}`
    });
    node.append(postcss.decl({
        prop: 'display',
        value: 'none'
    }));
    return node;

};
module.exports = postcss.plugin('postcss-ie-appearance-none', function () {
    // Work with options here

    return function (root) {

        // Transform CSS AST here
        root.walkDecls('appearance', decl => {
            if (decl.value !== 'none') { // skip
                return;
            }
            const node = createRule(decl.parent.selector, 'expand');
            root.insertAfter(decl.parent, node);
        });

    };
});
