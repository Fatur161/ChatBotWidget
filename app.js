const sendChatBtn = document.querySelector("#send-btn");
const chatInput = document.querySelector(".chat-input textarea");
const chatBox = document.querySelector(".chatbox");
const chatToggler = document.querySelector(".chatbot-toggler");
const closeChat = document.querySelector("header span");

let userMessage;
const API_KEY = "KEY";

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outcoming"
      ? `<p></p>`
      : ` <span class="material-symbols-outlined">Face</span>
  <p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const responseFromBot = (incomingChatLi) => {
  const API = "https://api.openai.com/v1/chat/completions";
  const messageEl = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  fetch(API, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageEl.textContent = data.choices[0].message.content;
    })
    .catch((err) => {
      messageEl.textContent = "Something went wrong.";
    })
    .finally(() => {
      chatBox.scrollTo(0, chatBox.scrollHeight);
    });
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatBox.append(createChatLi(userMessage, "outcoming"));
  chatBox.scrollTo(0, chatBox.scrollHeight);
  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatBox.append(incomingChatLi);
    responseFromBot(incomingChatLi);
  }, 600);
  chatInput.value = "";
};

chatToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});
closeChat.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
});

sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleChat();
    event.preventDefault();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 27 && document.body.classList.contains("show-chatbot"))
    document.body.classList.remove("show-chatbot");
});
