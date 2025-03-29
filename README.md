# Sub Cleaner

<div align="center">
  <img src="https://raw.githubusercontent.com/amygware/sub-cleaner/main/static/og-image.png" alt="Sub Cleaner Logo" width="600" />
  <p><strong>Clean up your Reddit feed by easily unsubscribing from multiple subreddits at once.</strong></p>
</div>

## 🚀 Features

- **Bulk Unsubscribe**: Select and unsubscribe from multiple subreddits with a single click
- **Secure Authentication**: Uses Reddit's OAuth2 flow - we never see or store your credentials
- **User-Friendly Interface**: Clean, intuitive design makes managing your subscriptions easy
- **Privacy-Focused**: No data storage, all processing happens in your browser
- **Open Source**: Full transparency with MIT-licensed code

## 🔧 Tech Stack

- **Frontend**: SvelteKit, TailwindCSS, Lucide Icons
- **Authentication**: Reddit OAuth2 API
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics (privacy-friendly)

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- A Reddit account
- A Reddit API application (for development)

## 🛠️ Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/amygware/sub-cleaner.git
cd sub-cleaner
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory based on the `.env.example` file:

```
VITE_REDDIT_CLIENT_ID=your_reddit_client_id
VITE_REDIRECT_URI=http://localhost:5173/callback
```

To get your Reddit Client ID:
- Go to [Reddit's app preferences](https://www.reddit.com/prefs/apps)
- Create a new app (script)
- Set the redirect URI to `http://localhost:5173/callback` for local development

4. **Start the development server**

```bash
npm run dev
# or
pnpm dev
```

5. **Build for production**

```bash
npm run build
# or
pnpm build
```

## 🔒 Privacy & Security

Sub Cleaner is designed with privacy in mind:

- We use Reddit's official OAuth2 flow for authentication
- Your Reddit credentials are never seen or stored by our servers
- We only request the minimum permissions needed (`mysubreddits` and `subscribe`)
- All processing happens in your browser
- No user data is stored on our servers

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

Made with ❤️ by [Amygware](https://amygware.com)

---

<div align="center">
  <p>Not affiliated with Reddit Inc.</p>
</div>
