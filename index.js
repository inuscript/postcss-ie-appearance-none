const postcss = require('postcss');
const parser = require('postcss-selector-parser')
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

const hasSelect = (selector) => {
    const b = parser( (selector) => {
        console.log(selector.nodes[0].nodes[0])
        return selector
    }).process(selector)
}

const appendRule = (root, decl, prefix) => {
    const selector = decl.parent.selector
    hasSelect(selector)

    root.insertAfter(decl.parent, createRule(decl.parent.selector, "expand"))
    // root.insertAfter(decl, createRule(decl.parent.selector, "check"))
}

module.exports = postcss.plugin('postcss-ie-appearance-none', function () {
    // Work with options here

    return function (root) {

        // Transform CSS AST here
        root.walkDecls('appearance', decl => {
            if (decl.value !== 'none') { // skip
                return;
            }
            appendRule(root, decl);
        });

    };
});
