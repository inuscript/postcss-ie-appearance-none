const postcss = require('postcss');

module.exports = postcss.plugin('postcss-ie-appearance-none', function (opts) {
    opts = opts || {};

    // Work with options here

    return function (root, result) {

        // Transform CSS AST here
        root.walkDecls('appearance', decl => {
            if (decl.value !== 'none') { // skip
                return;
            }
            const selector = decl.parent.selector;
            const node = postcss.rule({
                selector: `${selector}::--ms-expand`
            });
            node.append(postcss.decl({
                prop: 'display',
                value: 'none'
            }));

            const rule = root.insertAfter(decl.parent, node);
        });

    };
});
