const form = document.getElementById("chatForm");
const questionInput = document.getElementById("question");
const messages = document.getElementById("messages");

function addMessage(text, sender) {
  const message = document.createElement("div");

  message.classList.add("message", sender);
  message.textContent = text;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (question === "") {
    return;
  }

  addMessage(question, "user");

  addMessage(
    "The website is working. The real AI backend has not been connected yet.",
    "bot"
  );

  questionInput.value = "";
});
