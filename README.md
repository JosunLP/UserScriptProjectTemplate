# TikTok Quick Block

A UserScript that adds a "Quick Block" button directly to TikTok comments, allowing you to block comment authors with a single click.

## Features

- ⚡ **One-Click Blocking**: Add a quick block button to every comment on TikTok
- 🚫 **Instant Results**: Comments from blocked users are immediately hidden and blurred
- 💾 **Persistent Storage**: Blocked users are saved across browser sessions
- 📱 **Mobile Optimized**: Works on mobile browsers with touch support
- 🎨 **Beautiful Design**: Styled buttons that match TikTok's design language
- 📊 **Statistics**: Track how many users you've blocked and buttons injected
- 🔔 **Notifications**: Get visual feedback when blocking users

## Installation

### Prerequisites

You need a UserScript manager installed in your browser:

**Desktop Browsers:**
- [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge, Opera)
- [Greasemonkey](https://www.greasespot.net/) (Firefox)
- [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

**Mobile Browsers:**
- [Kiwi Browser](https://kiwibrowser.com/) (Android) - Built-in Chrome extension support
- [Firefox Mobile](https://www.mozilla.org/firefox/mobile/) (Android) - Install Greasemonkey or Tampermonkey
- [Microsoft Edge Mobile](https://www.microsoft.com/edge/mobile) - Install Tampermonkey

### Steps

1. Install a UserScript manager (see above)
2. Open the `dist/tiktok-quick-block.user.js` file
3. Your UserScript manager should detect it and prompt you to install
4. Confirm the installation
5. Visit [TikTok](https://www.tiktok.com/)

## Usage

### Blocking Users

1. Navigate to any TikTok video with comments
2. Look for the "⚡ Quick Block" button next to each comment
3. Click the button to instantly block that user
4. The comment will be hidden and blurred
5. A notification will confirm the block

### Managing Blocked Users

Access the UserScript menu (click the Tampermonkey icon in your browser) to:

- **View Blocked Users**: See a list of all blocked users
- **Clear Blocked Users**: Remove all blocks and start fresh
- **Show Statistics**: View stats about blocks and button injections

### Unblocking Users

Currently, you can unblock all users by:
1. Click the UserScript manager icon
2. Select "Clear Blocked Users"
3. Confirm the action
4. Refresh the page

## Development

### Build from Source

```bash
# Install dependencies
npm install

# Development build (with watch mode)
npm run dev

# Development build (single build)
npm run dev:build

# Production build
npm run build:prod

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

### Project Structure

```
tiktok-quick-block/
├── src/
│   ├── index.ts                      # Main entry point
│   ├── modules/
│   │   └── tiktok-quick-block.ts    # Core blocking functionality
│   └── utils/
│       ├── dom.ts                    # DOM manipulation helpers
│       ├── events.ts                 # Event emitter
│       ├── storage.ts                # Persistent storage wrapper
│       └── mobile.ts                 # Mobile browser detection
├── dist/                             # Built userscript
├── header.config.json                # UserScript metadata
├── package.json                      # Project dependencies
├── vite.config.ts                   # Build configuration
└── tsconfig.json                    # TypeScript configuration
```

### How It Works

1. **Initialization**: The script waits for TikTok's page to load
2. **Comment Detection**: Uses MutationObserver to detect comments as they appear
3. **Button Injection**: Injects a styled "Quick Block" button next to each comment
4. **User Blocking**: Stores blocked usernames in browser storage
5. **Comment Hiding**: Applies visual effects to hide blocked users' comments
6. **Continuous Monitoring**: Watches for new comments and processes them automatically

### Technical Details

- Built with **TypeScript** for type safety
- Uses **Vite** for fast builds and optimizations
- Leverages **GM_setValue/GM_getValue** for persistent storage
- Mobile-first responsive design
- Supports both desktop and mobile TikTok layouts

## Browser Support

### Desktop
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

### Mobile
- ✅ Kiwi Browser (Android)
- ✅ Firefox Mobile (Android)
- ✅ Edge Mobile (Android/iOS)
- ✅ Safari Mobile (iOS) - with Userscripts app
- ⚠️ Other mobile browsers may work with appropriate UserScript managers

## Permissions

This UserScript requires the following permissions:

- `GM_setValue` / `GM_getValue`: Store blocked users list
- `GM_deleteValue` / `GM_listValues`: Manage stored data
- `GM_notification`: Show block confirmation notifications
- `GM_registerMenuCommand`: Add menu commands for management

## Privacy

- All data is stored **locally** in your browser
- No external servers or tracking
- No data is sent to third parties
- Blocked users list is stored using browser's UserScript storage

## Troubleshooting

### Buttons not appearing?

- Make sure you're on a TikTok video page with comments
- Refresh the page
- Check that the UserScript is enabled in your UserScript manager
- Open browser console and look for any errors

### Comments still visible after blocking?

- Try refreshing the page
- Clear blocked users and try blocking again
- Check browser console for errors

### Mobile issues?

- Ensure your mobile browser supports UserScripts
- Try Kiwi Browser (Android) for best compatibility
- Make sure Tampermonkey is properly installed and enabled

## Contributing

This project was created from the [UserScript Project Template](https://github.com/JosunLP/UserScriptProjectTemplate).

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Author

Jonas Pfalzgraf <info@josunlp.de>

## Acknowledgments

Built with the [UserScript Project Template](https://github.com/JosunLP/UserScriptProjectTemplate) which provides:
- Modern TypeScript tooling
- Mobile browser support
- Build optimization
- Developer utilities

## Disclaimer

This UserScript is provided as-is. TikTok's structure may change, which could break functionality. The script only works on the TikTok web app, not the mobile app.

---

**Note**: This is an independent project and is not affiliated with, endorsed by, or connected to TikTok or ByteDance.

