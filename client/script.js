import bot from "./assets_codex/assets/bot.svg"
import user from "./assets_codex/assets/user.svg"

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container")

let loadInterval;


// "..." beim laden bevoer er antwortet
function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if(element.textContent === "....") {
      element.textContent ="";
    }
  }, 300);
}

// damit es so aussieht, als würde der bot gerade tippen
function typeText(element, text) {
  let index= 0;
  
  let interval = setInterval(() => {
    if(index< text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval)
    }
  }, 20);
}

// generate unique random id
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString  = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi? bot: user}"
            alt="${isAi? 'bot': 'user'}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}>
        </div>
      </div>
    </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // Users chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // Bot chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // Fetch data from server
  try {
    const response = await fetch("http://localhost:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.get("prompt"),
      }),
    });

    if (response.ok) {
      // Get the actual response from the backend
      const responseData = await response.json();

      const parsedData = responseData.bot.trim();
      console.log(parsedData);
      typeText(messageDiv, parsedData);
    } else {
      const errorMessage = await response.json();
      messageDiv.innerHTML = "Something went wrong: " + errorMessage;
    }
  } catch (error) {
    console.error(error);
    messageDiv.innerHTML = "Something went wrong: " + error.message;
  } 
};

  form.addEventListener("submit", handleSubmit)
  form.addEventListener("keyup", (e)=> {
    if(e.keyCode === 13) {
      handleSubmit(e)
    }
  })