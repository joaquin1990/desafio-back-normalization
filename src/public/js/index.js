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
  title: "Registrate",
  html: `<input type="text" id="id" class="swal2-input" placeholder="Gmail">
    <input type="text" id="firts_name" class="swal2-input" placeholder="Nombre">
    <input type="text" id="last_name" class="swal2-input" placeholder="Apellido">
    <input type="number" id="age" class="swal2-input" placeholder="Edad">
    <input type="text" id="alias" class="swal2-input" placeholder="Alias">
    <input type="text" id="avatar" class="swal2-input" placeholder="Avatar(URL)">`,
  inputValidator: (value) => {
    return !value && "You need to identify before going on!";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
  preConfirm: () => {
    const id = document.getElementById("id").value;
    const firts_name = document.getElementById("firts_name").value;
    const last_name = document.getElementById("last_name").value;
    const age = document.getElementById("age").value;
    const alias = document.getElementById("alias").value;
    const avatar = document.getElementById("avatar").value;
    if (!id || !firts_name || !last_name || !age || !alias || !avatar) {
      Swal.showValidationMessage(`Rellena todos los campos para continuar >:c`);
    }
  },
}).then((result) => {
  username = [
    {
      id: document.getElementById("id").value,
      nombre: document.getElementById("firts_name").value,
      apellido: document.getElementById("last_name").value,
      edad: document.getElementById("age").value,
      alias: document.getElementById("alias").value,
      avatar: document.getElementById("avatar").value,
    },
  ];
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
    socket.emit("message", { author: username, text: chatBox.value });
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
