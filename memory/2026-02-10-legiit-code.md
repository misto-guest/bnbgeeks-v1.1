# 2026-02-10: Legiit Purchase Automation Code

## Code Provided to User

User requested the Puppeteer code for ordering gigs on Legiit.com for integration into another project.

## Files Created

### 1. Complete Documentation
**File:** `/Users/northsea/clawd-dmitry/legiit-automation/PURCHASE-CODE.md`

Contains:
- Full source code for both versions
- Usage examples
- Environment variables
- Integration tips
- Customization options

## Two Versions Available

### Version 1: Class-Based (legiit-purchaser.js)
- **File:** `/Users/northsea/clawd-dmitry/legiit-automation/src/legiit-purchaser.js`
- **Type:** Full-featured class with error handling
- **Export:** CommonJS (module.exports)
- **Best for:** Complex integrations, extensive error handling

### Version 2: Function-Based (legiit-automation.js)
- **File:** `/Users/northsea/clawd-dmitry/legiit-automation/src/legiit-automation.js`
- **Type:** ES6 module with single exported function
- **Export:** ES6 (export function)
- **Best for:** Simple integrations, modern Node.js projects

## Core Functionality

Both versions automate:
1. ✅ Login to Legiit.com
2. ✅ Navigate to gig page
3. ✅ Select package (Standard/Basic/Premium)
4. ✅ Fill business details (domain, name, address)
5. ✅ Complete purchase with Wallet balance
6. ✅ Extract order ID
7. ✅ Take screenshots for verification

## Key Features

- **Robust selector handling** - Multiple fallback selectors per field
- **Error recovery** - Text-based search when selectors fail
- **Screenshot capture** - Visual confirmation at key steps
- **Order extraction** - Retrieves order ID from confirmation
- **Wallet payment** - Optimized for Wallet balance
- **Human-like delays** - Avoids detection

## Usage

### Class Version
```javascript
const LegiitPurchaser = require('./legiit-purchaser');

const purchaser = new LegiitPurchaser({
  email: 'your-email@example.com',
  password: 'your-password',
  headless: false
});

const result = await purchaser.purchase({
  domain: 'example.com',
  businessName: 'My Business',
  address: '123 Main St'
});
```

### Function Version
```javascript
import { purchaseCitation } from './legiit-automation.js';

const result = await purchaseCitation({
  domain: 'example.com',
  businessName: 'My Business',
  address: '123 Main St'
});
```

## Environment Variables
```bash
LEGIIT_EMAIL=your-email@example.com
LEGIIT_PASSWORD=your-password
HEADLESS=false  # Optional
SLOW_MO=50      # Optional
```

## Dependencies
```bash
npm install puppeteer
```

## Integration Options
- API endpoint (Express/Fastify)
- Batch processing
- Queue systems (Bull/BullMQ)
- Docker deployment

## User Context
- User built this code in the past
- Wants to integrate into different project
- Code was extracted from existing automation in workspace
