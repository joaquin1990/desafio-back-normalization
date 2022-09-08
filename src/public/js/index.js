const socket = io();

// ----------------PRODUCTS------------------

let productosForm = document.getElementById("productForm1");
const handleSubmit = (evt, form, route) => {
  evt.preventDefault();
  let formData = new FormData(form);
  let obj = {};
  formData.forEach((value, key) => (obj[key] = value));
  fetch(route, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => console.log(json), socket.emit("addNewProduct", obj));
};
productosForm.addEventListener("submit", (e) =>
  handleSubmit(e, e.target, "/items")
);

socket.on("updateProductList", (data) => {
  let log = document.getElementById("productList");
  let messages = "";
  data.forEach((message) => {
    messages =
      messages +
      `
        <tr>
            <td>${message.title}</td>
            <td>${message.price}</td>
            <td> <img src="${message.thumbnail}" alt="El enlace no esta disponible" width="60"></td>
        </tr>`;
  });
  log.innerHTML = messages;
  document.getElementById("productForm1").reset();
});

// -------------CHAT-------------
let username;
const chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Identificate",
  text: "Ingresa el usuario con el que te identificaras en el chat",
  input: "text",
  inputValidator: (value) => {
    return !value && "Necesitas identificarte para poder continuar!";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  username = result.value;
});

// Listener
chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: username, message: chatBox.value });
      chatBox.value = "";
    }
    document.getElementById("Enter").click();
  }
});

chatBox.addEventListener("submit", (evt) => {
  if (chatBox.value.trim().length > 0) {
    socket.emit("message", { user: username, message: chatBox.value });
    chatBox.value = "";
  }
});

// To show the chat messages
socket.on("log", (data) => {
  let message = document.getElementById("message");
  let messages = "";
  data.forEach((msg) => {
    messages =
      messages +
      ` <span class="date">(${msg.date})</span> <span class="user"> --- ${msg.user} dice:  </span>  ${msg.message}</br>`;
  });
  message.innerHTML = messages;
});
