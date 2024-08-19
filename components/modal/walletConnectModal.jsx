import Image from "next/image";
import React from "react";
import metaicon from "@/public/images/metaicon.png";
import walleticon from "@/public/images/walleticon.png";
import { useWalletConnectClient } from "@/services/walletServices";
import environment from "@/environment";

const WalletConnectModal = ({ handleCancel }) => {
  const { connect, account, connectWithInjected } = useWalletConnectClient();
  const handleWeb3MetaMask = async () => {
    connectWithInjected(environment.DEFAULT_CHAIN);
  };
  const handleWeb3WalletConnect = async () => {
    connect(`eip155:${environment.DEFAULT_CHAIN}`);
  };
  return (
    <div>
      <h1 className="text-[#14B275] font-bungee text-[1.5rem] mt-[.5rem]">
        Connect modal
      </h1>
      <div
        className="flex justify-between items-center rounded-[2.07694rem] border border-solid border-slate-400 px-[2.5rem] py-[1rem]
       mt-[1rem] cursor-pointer hover:bg-[#F7F7F7] hover:border-[#14B275] group"
        onClick={() => {
          handleWeb3MetaMask();
          handleCancel();
        }}
      >
        <Image src={metaicon} />
        <h5 className="text-slate-600 text-[1.125rem] font-Oleo font-[500] group-hover:text-[#14B275]">
          Metamask
        </h5>
      </div>
      <div
        className="flex justify-between items-center rounded-[2.07694rem] border border-solid border-slate-400 px-[2.5rem] py-[1rem] mt-[1.5rem] mb-[1rem] cursor-pointer hover:bg-[#F7F7F7] hover:border-[#14B275] group"
        onClick={() => {
          handleWeb3WalletConnect();
          handleCancel();
        }}
      >
        <Image src={walleticon} />
        <h5 className="text-slate-600 text-[1.125rem] font-Oleo font-[500] group-hover:text-[#14B275]">
          Wallet Connect
        </h5>
      </div>
    </div>
  );
};

export default WalletConnectModal;
