---
category: Components
type: Data Display
title: Comment
cover: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2218%22%20y%3D%2214%22%20width%3D%22144%22%20height%3D%2282%22%20rx%3D%228%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%221.5%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2234%22%20r%3D%229%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2232%22%20r%3D%223.5%22%20fill%3D%22%231677ff%22%2F%3E%3Crect%20x%3D%2254%22%20y%3D%2227%22%20width%3D%2238%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23bfbfbf%22%2F%3E%3Crect%20x%3D%2298%22%20y%3D%2228%22%20width%3D%2224%22%20height%3D%224%22%20rx%3D%222%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Crect%20x%3D%2254%22%20y%3D%2238%22%20width%3D%2292%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23d9d9d9%22%2F%3E%3Crect%20x%3D%2254%22%20y%3D%2248%22%20width%3D%2270%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Cline%20x1%3D%2254%22%20y1%3D%2261%22%20x2%3D%22146%22%20y2%3D%2261%22%20stroke%3D%22%23e5e7eb%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2276%22%20r%3D%227%22%20fill%3D%22%231677ff%22%2F%3E%3Crect%20x%3D%2275%22%20y%3D%2271%22%20width%3D%2234%22%20height%3D%224.5%22%20rx%3D%222.25%22%20fill%3D%22%23bfbfbf%22%2F%3E%3Crect%20x%3D%2275%22%20y%3D%2280%22%20width%3D%2262%22%20height%3D%224.5%22%20rx%3D%222.25%22%20fill%3D%22%23d9d9d9%22%2F%3E%3C%2Fsvg%3E'
coverDark: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2218%22%20y%3D%2214%22%20width%3D%22144%22%20height%3D%2282%22%20rx%3D%228%22%20fill%3D%22%231f1f1f%22%20stroke%3D%22%23383838%22%20stroke-width%3D%221.5%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2234%22%20r%3D%229%22%20fill%3D%22%2315325b%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2232%22%20r%3D%223.5%22%20fill%3D%22%231668dc%22%2F%3E%3Crect%20x%3D%2254%22%20y%3D%2227%22%20width%3D%2238%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23595959%22%2F%3E%3Crect%20x%3D%2298%22%20y%3D%2228%22%20width%3D%2224%22%20height%3D%224%22%20rx%3D%222%22%20fill%3D%22%23303030%22%2F%3E%3Crect%20x%3D%2254%22%20y%3D%2238%22%20width%3D%2292%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23434343%22%2F%3E%3Crect%20x%3D%2254%22%20y%3D%2248%22%20width%3D%2270%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23303030%22%2F%3E%3Cline%20x1%3D%2254%22%20y1%3D%2261%22%20x2%3D%22146%22%20y2%3D%2261%22%20stroke%3D%22%23383838%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2276%22%20r%3D%227%22%20fill%3D%22%231668dc%22%2F%3E%3Crect%20x%3D%2275%22%20y%3D%2271%22%20width%3D%2234%22%20height%3D%224.5%22%20rx%3D%222.25%22%20fill%3D%22%23595959%22%2F%3E%3Crect%20x%3D%2275%22%20y%3D%2280%22%20width%3D%2262%22%20height%3D%224.5%22%20rx%3D%222.25%22%20fill%3D%22%23434343%22%2F%3E%3C%2Fsvg%3E'
---

A comment displays user feedback and discussion to website content.

## When To Use

Comments can be used to enable discussions on an entity such as a page, blog post, issue or other.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| actions | List of action items rendered below the comment content | Array \| slot | - |
| author | The element to display as the comment author | string\|slot | - |
| avatar | The element to display as the comment avatar - generally an antd `Avatar` or src | string\|slot | - |
| content | The main content of the comment | string\|slot | - |
| datetime | A datetime element containing the time to be displayed | string\|slot | - |
