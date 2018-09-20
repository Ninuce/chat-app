const batch = 171; // change to your own batch id
const commentForm = document.getElementById("comment-form");
const allMessages = document.getElementById("list");
const url = `https://wagon-chat.herokuapp.com/${batch}/messages`;


function refresher() {
  allMessages.innerHTML = "";
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      data.messages.forEach((message) => {
        const author = message.author;
        const msg = message.content;
        const time = message.created_at;
        allMessages.insertAdjacentHTML("afterbegin",
          `<li>
          <span class="time">${time.substring(11, 16)}</span>
          <span class="author">${author}:</span>
          ${msg}
          </li>`);
      });
    });
}

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.getElementById("your-message").value;
  const name = document.getElementById("your-name").value;
  const body = { author: name, content: message };

  fetch(url, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      refresher();
    });
});

let lastTime = new Date();
let currentTimeDF;

function checkNew() {
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      const currentTime = data.messages[data.messages.length - 1].created_at;
      currentTimeDF = new Date(currentTime);
      console.log(currentTime);
    });
  if (lastTime < currentTimeDF ) {
    refresher();
    lastTime = currentTimeDF;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  refresher();
  setInterval(checkNew, 4000);
});
