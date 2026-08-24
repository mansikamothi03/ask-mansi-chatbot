/**
 * Ask Mansi — Embeddable Portfolio Chatbot Widget
 * Drop this script into your GitHub Pages HTML to add a floating chat bubble.
 *
 * Usage:
 *   <script src="https://your-vercel-app.vercel.app/chat-widget.js"
 *           data-api="https://your-vercel-app.vercel.app/api/chat"></script>
 */
(function () {
  "use strict";

  const API_URL =
    document.currentScript?.getAttribute("data-api") ||
    "https://ask-mansi.vercel.app/api/chat";

  // ── Styles ──────────────────────────────────────────────────────────────────
  const css = `
    #ask-mansi-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6c63ff 0%, #48c6ef 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(108,99,255,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99998;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #ask-mansi-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(108,99,255,0.55);
    }
    #ask-mansi-btn svg { width: 28px; height: 28px; fill: #fff; }

    #ask-mansi-window {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 360px;
      max-height: 520px;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    #ask-mansi-window.hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px);
    }

    #ask-mansi-header {
      background: linear-gradient(135deg, #6c63ff 0%, #48c6ef 100%);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #fff;
    }
    #ask-mansi-header .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    #ask-mansi-header .info { flex: 1; }
    #ask-mansi-header .name { font-weight: 700; font-size: 15px; }
    #ask-mansi-header .status { font-size: 12px; opacity: 0.85; margin-top: 2px; }
    #ask-mansi-close {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      padding: 4px;
      opacity: 0.8;
      transition: opacity 0.15s;
    }
    #ask-mansi-close:hover { opacity: 1; }

    #ask-mansi-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f8f9fc;
    }
    .am-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      word-break: break-word;
    }
    .am-msg.bot {
      background: #fff;
      color: #1a1a2e;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      align-self: flex-start;
    }
    .am-msg.user {
      background: linear-gradient(135deg, #6c63ff 0%, #48c6ef 100%);
      color: #fff;
      border-bottom-right-radius: 4px;
      align-self: flex-end;
    }
    .am-typing {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 12px 14px;
    }
    .am-typing span {
      width: 7px; height: 7px;
      background: #6c63ff;
      border-radius: 50%;
      animation: am-bounce 1.2s infinite;
    }
    .am-typing span:nth-child(2) { animation-delay: 0.2s; }
    .am-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes am-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
      40% { transform: translateY(-6px); opacity: 1; }
    }

    #ask-mansi-suggestions {
      padding: 0 16px 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      background: #f8f9fc;
    }
    .am-suggestion {
      background: #fff;
      border: 1.5px solid #e0deff;
      color: #6c63ff;
      border-radius: 20px;
      padding: 5px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .am-suggestion:hover {
      background: #6c63ff;
      color: #fff;
    }

    #ask-mansi-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-top: 1px solid #ececec;
      background: #fff;
    }
    #ask-mansi-input {
      flex: 1;
      border: 1.5px solid #e0deff;
      border-radius: 24px;
      padding: 9px 16px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.15s;
      font-family: inherit;
      resize: none;
    }
    #ask-mansi-input:focus { border-color: #6c63ff; }
    #ask-mansi-send {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6c63ff 0%, #48c6ef 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.15s;
    }
    #ask-mansi-send:hover { opacity: 0.88; }
    #ask-mansi-send svg { width: 18px; height: 18px; fill: #fff; }

    @media (max-width: 420px) {
      #ask-mansi-window { width: calc(100vw - 24px); right: 12px; bottom: 90px; }
      #ask-mansi-btn { right: 16px; bottom: 16px; }
    }
  `;

  // ── Inject styles ────────────────────────────────────────────────────────────
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Build DOM ────────────────────────────────────────────────────────────────
  const btn = document.createElement("button");
  btn.id = "ask-mansi-btn";
  btn.setAttribute("aria-label", "Chat with Ask Mansi");
  btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
  </svg>`;

  const win = document.createElement("div");
  win.id = "ask-mansi-window";
  win.classList.add("hidden");
  win.innerHTML = `
    <div id="ask-mansi-header">
      <div class="avatar">👩‍💼</div>
      <div class="info">
        <div class="name">Ask Mansi</div>
        <div class="status">AI assistant · Usually replies instantly</div>
      </div>
      <button id="ask-mansi-close" aria-label="Close chat">✕</button>
    </div>
    <div id="ask-mansi-messages"></div>
    <div id="ask-mansi-suggestions"></div>
    <div id="ask-mansi-input-row">
      <input id="ask-mansi-input" type="text" placeholder="Ask about Mansi's experience…" autocomplete="off" maxlength="300" />
      <button id="ask-mansi-send" aria-label="Send">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(win);

  // ── State ────────────────────────────────────────────────────────────────────
  const messages = []; // { role: "user"|"assistant", content: string }
  let isLoading = false;

  const SUGGESTIONS = [
    "What roles is Mansi looking for?",
    "Tell me about her A/B testing experience",
    "What tools does she know?",
    "Is she open to relocation?",
    "How can I contact Mansi?",
  ];

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const msgContainer = () => document.getElementById("ask-mansi-messages");
  const suggestionsEl = () => document.getElementById("ask-mansi-suggestions");
  const inputEl = () => document.getElementById("ask-mansi-input");

  function scrollToBottom() {
    const el = msgContainer();
    el.scrollTop = el.scrollHeight;
  }

  function addMessage(role, content) {
    const div = document.createElement("div");
    div.className = `am-msg ${role === "user" ? "user" : "bot"}`;
    div.textContent = content;
    msgContainer().appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "am-msg bot am-typing";
    div.id = "am-typing-indicator";
    div.innerHTML = "<span></span><span></span><span></span>";
    msgContainer().appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById("am-typing-indicator");
    if (el) el.remove();
  }

  function renderSuggestions(show) {
    const el = suggestionsEl();
    el.innerHTML = "";
    if (!show) return;
    SUGGESTIONS.forEach((s) => {
      const chip = document.createElement("button");
      chip.className = "am-suggestion";
      chip.textContent = s;
      chip.addEventListener("click", () => {
        sendMessage(s);
        el.innerHTML = ""; // hide after first use
      });
      el.appendChild(chip);
    });
  }

  // ── Send message ─────────────────────────────────────────────────────────────
  async function sendMessage(text) {
    text = text.trim();
    if (!text || isLoading) return;

    isLoading = true;
    inputEl().value = "";
    inputEl().disabled = true;

    messages.push({ role: "user", content: text });
    addMessage("user", text);
    renderSuggestions(false);
    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const data = await res.json();
      hideTyping();

      if (data.reply) {
        messages.push({ role: "assistant", content: data.reply });
        addMessage("bot", data.reply);
      } else {
        addMessage("bot", data.error || "Something went wrong. Please try again.");
      }
    } catch {
      hideTyping();
      addMessage("bot", "Network error — please check your connection and try again.");
    } finally {
      isLoading = false;
      inputEl().disabled = false;
      inputEl().focus();
    }
  }

  // ── Open / close ─────────────────────────────────────────────────────────────
  function openChat() {
    win.classList.remove("hidden");
    btn.style.display = "none";

    // Show welcome message on first open
    if (messages.length === 0) {
      addMessage(
        "bot",
        "Hi! 👋 I'm an AI assistant for Mansi's portfolio. Ask me anything about her experience, skills, or how to get in touch!"
      );
      renderSuggestions(true);
    }

    inputEl().focus();
  }

  function closeChat() {
    win.classList.add("hidden");
    btn.style.display = "flex";
  }

  // ── Event listeners ──────────────────────────────────────────────────────────
  btn.addEventListener("click", openChat);
  document.getElementById("ask-mansi-close").addEventListener("click", closeChat);

  document.getElementById("ask-mansi-send").addEventListener("click", () => {
    sendMessage(inputEl().value);
  });

  inputEl().addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl().value);
    }
  });
})();