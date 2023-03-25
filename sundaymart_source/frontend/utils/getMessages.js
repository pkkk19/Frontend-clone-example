import moment from "moment";

export function getMessages(chat) {
  const { messages, currentChat } = chat;
  if (!currentChat) return [];
  const groups = messages
    .filter((item) => item.chat_id === currentChat.id)
    .reduce((groups, item) => {
      const date = moment(new Date(item.created_at)).format("DD-MM-YYYY");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      messages: groups[date],
    };
  });
  return groupArrays;
}
