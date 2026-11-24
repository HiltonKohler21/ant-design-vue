---
category: Components
type: Data Display
title: QRCode
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*cJopQrf0ncwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*M4PBTZ_n9OgAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

Used when the link needs to be converted into a QR Code.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value | scanned text | `string \| string[]` | - | `string[]`: 4.3.0 |
| type | render type | `'canvas'` \| `'svg'` | `canvas` |  |
| icon | include image url (only image link are supported) | string | - |  |
| size | QRCode size | number | 160 |  |
| iconSize | include image size | `number \| { width: number; height: number }` | 40 | object: 4.3.0 |
| color | QRCode Color | string | `#000` |  |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | Record<SemanticDOM, string> \| (info: { props: QRCodeProps }) => Record<SemanticDOM, string> | - | 4.3.0 |
| bgColor | QRCode Background Color | string | `transparent` |  |
| marginSize | Quiet zone size (in modules). `0` means no margin | number | `0` | 4.3.0 |
| bordered | Whether has border style | boolean | `true` |  |
| errorLevel | Error Code Level | `'L'` \| `'M'` \| `'Q'` \| `'H'` | `'M'` |  |
| boostLevel | If enabled, the Error Correction Level of the result may be higher than the specified Error Correction Level | boolean | `true` | 4.3.0 |
| rootClassName | Root class name | string | - | 4.3.0 |
| status | QRCode status | `active` \| `expired` \| `loading` \| `scanned` | `active` | scanned: 4.0.9 |
| statusRender | Custom status render, supports function prop or `#statusRender` slot | `(info: { status: 'expired' \| 'loading' \| 'scanned'; locale: Locale['QRCode']; onRefresh?: (e?: MouseEvent) => void }) => VueNode` \| slot | - | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record<SemanticDOM, CSSProperties> \| (info: { props: QRCodeProps }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |

> Supported `SemanticDOM` slots: `root` \| `cover`.

### events

| Events Name | Description | Arguments    | Version |
| ----------- | ----------- | ------------ | ------- |
| refresh     | callback    | `() => void` | -       |

## FAQ

### About QRCode ErrorLevel

The ErrorLevel means that the QR code can be scanned normally after being blocked, and the maximum area that can be blocked is the error correction rate.

Generally, the QR code is divided into 4 error correction levels: Level `L` can correct about `7%` errors, Level `M` can correct about `15%` errors, Level `Q` can correct about `25%` errors, and Level `H` can correct about `30%` errors. When the content encoding of the QR code carries less information, in other words, when the value link is short, set different error correction levels, and the generated image will not change.

> For more information, see the: [https://www.qrcode.com/en/about/error_correction](https://www.qrcode.com/en/about/error_correction.html)
