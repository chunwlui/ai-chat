const form = document.getElementById("chatForm");
const questionInput = document.getElementById("question");
const messages = document.getElementById("messages");

const API_URL = "https://aiha.hotvery262.workers.dev";

function addMessage(text, sender) {
  const message = document.createElement("div");

  message.classList.add("message", sender);
  message.textContent = text;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;

  return message;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (question === "") {
    return;
  }

  addMessage(question, "user");
  questionInput.value = "";

  const loadingMessage = addMessage("Thinking...", "bot");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: question
      })
    });

    const data = await response.json();

    loadingMessage.remove();

    if (!response.ok) {
      addMessage(
        data.error || "Something went wrong. Please try again.",
        "bot"
      );
      return;
    }

    addMessage(data.answer, "bot");

  } catch (error) {
    console.error(error);

    loadingMessage.remove();

    addMessage(
      "Cannot connect to the AI server. Please try again later.",
      "bot"
    );
  }
});
