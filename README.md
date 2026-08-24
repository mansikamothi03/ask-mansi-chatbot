# Ask Mansi — Portfolio Chatbot

A floating AI chat widget for [mansikamothi03.github.io](https://mansikamothi03.github.io) that lets recruiters and hiring managers ask questions about Mansi's background, skills, and availability.

**Stack:** OpenAI GPT-4o-mini · Vercel Serverless Functions · Vanilla JS (no dependencies)

---

## Project Structure

```
ask-mansi-chatbot/
├── api/
│   └── chat.js          ← Vercel serverless function (OpenAI backend)
├── public/
│   └── chat-widget.js   ← Self-contained embeddable widget
├── package.json
├── vercel.json
└── README.md
```

---

## Deployment (One-Time Setup)

### Step 1 — Push to GitHub

Create a new GitHub repo (e.g. `ask-mansi-chatbot`) and push this folder:

```bash
cd ask-mansi-chatbot
git init
git add .
git commit -m "Initial commit: Ask Mansi chatbot"
git remote add origin https://github.com/mansikamothi03/ask-mansi-chatbot.git
git push -u origin main
```

### Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import your `ask-mansi-chatbot` repo
4. Under **Environment Variables**, add:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** your OpenAI API key (get one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys))
5. Click **Deploy**

Vercel will give you a URL like `https://ask-mansi-chatbot.vercel.app`.

### Step 3 — Embed in your GitHub Pages portfolio

Open your `mansikamothi03.github.io` repo and add this single line just before `</body>` in your `index.html`:

```html
<script
  src="https://ask-mansi-chatbot.vercel.app/chat-widget.js"
  data-api="https://ask-mansi-chatbot.vercel.app/api/chat"
  defer
></script>
```

> Replace `ask-mansi-chatbot.vercel.app` with your actual Vercel URL.

That's it — commit and push. The chat bubble will appear on your live portfolio within minutes.

---

## How It Works

```
Visitor types a question
        ↓
chat-widget.js (GitHub Pages)
        ↓  POST /api/chat  { messages: [...] }
api/chat.js (Vercel serverless)
        ↓
OpenAI GPT-4o-mini
  (system prompt = Mansi's resume + skills)
        ↓
{ reply: "..." }  →  displayed in chat bubble
```

- Conversation history is capped at the last 10 messages to keep costs low
- Each response is limited to 300 tokens (~200 words)
- Estimated cost: ~$0.001 per conversation (GPT-4o-mini pricing)

---

## Customization

### Update the knowledge base
Edit the `MANSI_SYSTEM_PROMPT` constant in [`api/chat.js`](api/chat.js) to add new projects, certifications, or update your availability.

### Change the color scheme
The widget uses a purple-to-cyan gradient (`#6c63ff → #48c6ef`). To match your portfolio's colors, search for those hex values in [`public/chat-widget.js`](public/chat-widget.js) and replace them.

### Change suggestion chips
Edit the `SUGGESTIONS` array near the top of [`public/chat-widget.js`](public/chat-widget.js):

```js
const SUGGESTIONS = [
  "What roles is Mansi looking for?",
  "Tell me about her A/B testing experience",
  // add your own...
];
```

---

## Local Development

```bash
npm install
npx vercel dev
```

This starts a local server at `http://localhost:3000`. The `/api/chat` endpoint will be available at `http://localhost:3000/api/chat`.

You'll need a `.env.local` file:

```
OPENAI_API_KEY=sk-...
```

---

## Cost Estimate

| Usage | Monthly Cost |
|-------|-------------|
| 100 conversations/month | ~$0.10 |
| 500 conversations/month | ~$0.50 |
| 1,000 conversations/month | ~$1.00 |

GPT-4o-mini is extremely affordable. Even heavy recruiter traffic will cost less than a coffee per month.