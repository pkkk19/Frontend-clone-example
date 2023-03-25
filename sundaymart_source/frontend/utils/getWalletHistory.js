import moment from "moment";

export function getWallet(wallet) {
  const groups = wallet.reduce((groups, item) => {
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
      wallets: groups[date],
    };
  });
  return groupArrays;
}
