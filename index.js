const postcss = require('postcss');
const parser = require('postcss-selector-parser');
const createRule = (selector) => {
    return postcss.rule({
        selector: selector
    }).append(postcss.decl({
        prop: 'display',
        value: 'none'
    }));
};
const hasSelect = (nodes) =>
    nodes.filter( (node) =>
        node.type === 'tag' && node.value === 'select' ).length > 0
;

const hasInput = (nodes) =>
    nodes.filter( (node) =>
        node.type === 'tag' && node.value === 'input' ).length > 0
;

const appendExpand = (nodes) => {
    nodes.append( parser.pseudo({ value: '::--ms-expand' }) );
};
const appendCheck = (nodes) => {
    nodes.append( parser.pseudo({ value: '::--ms-check' }) );
};

const replacePseudo = (selectors, nodes) => {
    selectors.append( appendExpand(nodes.clone()) );
    selectors.append( appendCheck(nodes.clone()));
    nodes.remove();
};

const getSelectors = (selector) => {
    return parser( (selectors) => {
        return selectors.map( (nodes) => {
            if (hasSelect(nodes)) {
                appendExpand(nodes);
                return;
            }
            if (hasInput(nodes)) {
                appendCheck(nodes);
                return;
            }
            replacePseudo(selectors, nodes);
            return;
        });
    }).process(selector).result;
};

const appendRule = (root, decl) => {
    const selector = decl.parent.selector;
    const newSelector = getSelectors(selector);

    root.insertAfter(decl.parent, createRule(newSelector));
    // root.insertAfter(decl, createRule(decl.parent.selector, "check"))
};

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
