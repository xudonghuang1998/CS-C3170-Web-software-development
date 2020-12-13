let message = '';

const getHello = () => {
  return message;
}

const setHello = (newMessage) => {
  if (!newMessage) {
    return;
  } else if (newMessage.length > 1 && newMessage.length < 10) {
    message = newMessage;
  } else {
    return;
  }
}

export { getHello, setHello };