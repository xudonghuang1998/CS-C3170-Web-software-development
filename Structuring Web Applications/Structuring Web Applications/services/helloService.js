import { executeQuery } from "../database/database.js";

const getHello = async() => {
  const res = await executeQuery("SELECT message FROM messages ORDER BY id DESC LIMIT 1");
  console.log(res);
  console.log(res.rowCount);
  if (res && res.rowCount > 0) {
    // first result from the first row
    return res.rows[0][0];
  }

  return 'No messages available';
}

const setHello = async(newMessage) => {
  await executeQuery("INSERT INTO messages (message, sender) VALUES ($1, 'API');", newMessage);
}

export { getHello, setHello };
