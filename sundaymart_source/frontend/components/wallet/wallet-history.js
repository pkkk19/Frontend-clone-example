import React, { useEffect, useState } from "react";
import { UserApi } from "../../api/main/user";
import { getPrice } from "../../utils/getPrice";
import { getWallet } from "../../utils/getWalletHistory";
import DiscordLoader from "../loader/discord-loader";
import RiveResult from "../loader/rive-result";

const WalletHistory = () => {
  const [walletList, setWalletList] = useState(null);
  useEffect(() => {
    UserApi.getWallet()
      .then((res) => {
        setWalletList(getWallet(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="wallet-history">
      {walletList ? (
        walletList?.map((wallet) => (
          <div key={wallet.id} className="wallet-blog">
            <div className="date">{wallet.date}</div>
            {wallet?.wallets?.map((item) => (
              <div key={item.id} className="wallet-item">
                <div className="left">
                  <div className="expense-name">{item?.author?.firstname}</div>
                  <div className="card-number">{item?.status}</div>
                </div>
                <div className="right">
                  <div
                    className={
                      item.type === "topup" ? "amount" : "amount outcome"
                    }
                  >
                    {`${item.type === "topup" ? "+" : "-"} ${getPrice(
                      item.price
                    )}`}
                  </div>
                  <div className="time">{item?.created_at.slice(10, 16)}</div>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <DiscordLoader />
      )}
      {walletList?.length === 0 && <RiveResult />}
    </div>
  );
};

export default WalletHistory;
