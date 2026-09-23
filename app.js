const form = document.getElementById("chatForm");
const questionInput = document.getElementById("question");
const messages = document.getElementById("messages");

const API_URL = "https://aiha.hotvery262.workers.dev";
const STORAGE_KEY = "ai_chat_history";
const MAX_HISTORY_MESSAGES = 10;

document.getElementById("clearChat").addEventListener("click", () => {
  conversationHistory = [];
  localStorage.removeItem(STORAGE_KEY);
  displayPreviousMessages();
});


let conversationHistory = loadHistory();

function loadHistory() {
  try {
    const savedHistory = localStorage.getItem(STORAGE_KEY);

    if (!savedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(savedHistory);

    if (!Array.isArray(parsedHistory)) {
      return [];
    }

    return parsedHistory;
  } catch (error) {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(conversationHistory)
  );
}

function addMessage(text, sender) {
  const message = document.createElement("div");

  message.classList.add("message", sender);
  message.textContent = text;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

function displayPreviousMessages() {
  messages.innerHTML = "";

  if (conversationHistory.length === 0) {
    addMessage(
      "Hi! I remember this conversation in this browser. Ask me a question.",
      "bot"
    );
    return;
  }

  for (const message of conversationHistory) {
    const sender = message.role === "user" ? "user" : "bot";
    addMessage(message.content, sender);
  }
}

displayPreviousMessages();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (question === "") {
    return;
  }

  const userMessage = {
    role: "user",
    content: question
  };

  conversationHistory.push(userMessage);
  conversationHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES);

  addMessage(question, "user");
  questionInput.value = "";
  saveHistory();

  const loadingMessage = document.createElement("div");
  loadingMessage.classList.add("message", "bot");
  loadingMessage.textContent = "Thinking...";
  messages.appendChild(loadingMessage);
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        history: conversationHistory
      })
    });

    const data = await response.json();

    loadingMessage.remove();

    if (!response.ok) {
      addMessage(
        data.error || "The AI service returned an error.",
        "bot"
      );
      return;
    }

    const assistantMessage = {
      role: "assistant",
      content: data.answer
    };

    conversationHistory.push(assistantMessage);
    conversationHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES);

    addMessage(data.answer, "bot");
    saveHistory();

  } catch (error) {
    console.error(error);

    loadingMessage.remove();

    addMessage(
      "Cannot connect to the AI server. Please try again later.",
      "bot"
    );
  }
});
