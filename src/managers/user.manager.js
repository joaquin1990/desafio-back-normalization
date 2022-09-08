import * as fs from "fs";
import __dirname from "../utils.js";

class UserManager {
  constructor() {
    this.path = __dirname + "/files/users.json";
  }

  getAllUsers = async () => {
    try {
      if (fs.existsSync(this.path)) {
        let fileData = await fs.promises.readFile(this.path, "utf-8");
        let users = JSON.parse(fileData);
        return users;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  //It validates a user before added
  addUsers = async (user) => {
    let userList = await this.getAllUsers();
    let userAdded = await userList.includes(() => user);
    if (!userAdded) await this.addUser(user);
  };

  //just add a user
  addUser = async (user) => {
    try {
      let users = await this.getAllUsers();
      if (users.length === 0) {
        user.id = 1;
        users.push(user);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(users, null, "\t")
        );
        return user.id;
      } else {
        users.forEach((storedUsers) => {
          if (user.user === storedUsers.user) {
            user.id = storedUsers.id;
          } else user.id = users[users.length - 1].id + 1;
        });
        users.push(user),
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(users, null, "\t")
          );
        return user.id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  deleteAllUsers = async () => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify([], null, "\t"));
    } catch (error) {
      console.log(error);
    }
  };

  updateUser = async (id, newData) => {
    let usersArray = await this.getAllUsers();
    for (const item of usersArray) {
      if (item.id === id) {
        item.price = newData;
      }
    }
    console.log(`id: ${id}, newData: ${newData}`);
    console.log(usersArray);
    await fs.promises.writeFile(path, JSON.stringify(usersArray, null, "\t"));
  };

  save = async (message) => {
    try {
      let date1 = new Date();
      let messageList = await this.getAllUsers();
      message.date = date1.toLocaleString();
      messageList.push(message);
      console.log(message);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(messageList, null, "\t")
      );
    } catch (error) {
      console.log("Hay un error: " + error);
    }
  };
}

export default UserManager;
