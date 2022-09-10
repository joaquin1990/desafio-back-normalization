const socket = io();

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
  console.log("data joaco +++++++++++++++++: ");
  console.log(data);
  data.forEach((msg) => {
    console.log("msg");
    console.log(msg);
    messages =
      messages +
      ` <span class="date">(${msg.fecha})</span> <span class="user"> --- ${msg.user[0].alias} dice:  </span>  ${msg.message}</br>`;
  });
  message.innerHTML = messages;
});
