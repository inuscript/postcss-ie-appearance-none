# PostCSS Ie Appearance None [![Build Status][ci-img]][ci]

[PostCSS] PostCSS plugin append `-ms-expand` and `-ms-check` alternative `appearance: none`.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/inuscript/postcss-ie-appearance-none.svg
[ci]:      https://travis-ci.org/inuscript/postcss-ie-appearance-none

```css
.foo {
    appearance: none;
}

input.myInput {
    appearance: none;
}

select.mySelect {
    appearance: none;
}
```

```css
.foo {
    appearance: none;
}

.foo::-ms-expand, .foo::-ms-check {
    display: none;
}

input.myInput {
    appearance: none;
}

input.myInput::-ms-check {
    display: none;
}

select.mySelect {
    appearance: none;
}

select.mySelect::-ms-expand {
    display: none;
}

```

## Usage

```js
postcss([ require('postcss-ie-appearance-none') ])
```

See [PostCSS] docs for examples for your environment.
