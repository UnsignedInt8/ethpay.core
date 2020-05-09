# ETHPay.Core

ETHPay core lib for ETHPay React/Vue/Angular

## Quick Start

Sending Stablecoins

```javascript
import { Payment } from 'ethpay';

const txHash = await Payment.send({ to: '0x123456...', value: 100, currency: 'dai' });
```