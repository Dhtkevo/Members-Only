const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function createMessage(title, text, user_id) {
  await pool.query(
    "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)",
    [title, text, user_id]
  );
}

async function deleteMessage(id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
}

async function createUser(
  firstName,
  lastName,
  username,
  password,
  status = false
) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, username, password, membership_status) VALUES ($1, $2, $3, $4, $5)",
    [firstName, lastName, username, password, status]
  );
}

async function getUser(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows;
}

async function giveUserMembership(username) {
  await pool.query(
    "UPDATE users SET membership_status = true WHERE username = $1",
    [username]
  );
}

module.exports = {
  getAllMessages,
  createMessage,
  deleteMessage,
  createUser,
  getUser,
  giveUserMembership,
};
