"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Web3 from "web3";

import WalletConnectProvider from "@walletconnect/web3-provider";
// import { ContractUtility } from "../../../../utility/contract-utility";

// import { ContractUtility } from "utility/contract-utility";

export const initialState = {
  web3: null,
  chainId: null,
  account: null,
  web3LoadingErrorMessage: "",
  web3Loading: false,
  ErrorMessage: "",
  web3ConnectingError: "",
};

export const loadBlockchain = createAsyncThunk(
  "loadwalletcoonnect",
  async (_, thunkAPI) => {
    try {
      console.log("Web3.givenProvider.chainId", Web3.givenProvider.chainId);
      if (Web3.givenProvider) {
        await Web3.givenProvider.enable();
        const web3 = new Web3(Web3.givenProvider);
        let account = await web3.eth.getAccounts();
        account = account[0];
        let chainId = await web3.eth.getChainId();

        return {
          web3,
          account,
          chainId,
        };
      } else {
        console.log("error connecting to metamask");
        return {
          web3LoadingErrorMessage: "error connecting to metamask",
        };
      }
    } catch (err) {
      console.log(err, "errorss1122");
      //  when user reject the request then error code and message returned from metamask
      let connectErrorMsg;
      console.log(err);
      if (err && err.code) {
        connectErrorMsg = "User Rejected The Request";
      } else {
        connectErrorMsg =
          "Metamask Error Please Download Metamask We are redirecting you to metamask website";
      }
      return {
        web3ConnectingError: connectErrorMsg,
      };
    }
  }
);

// Connect with Wallet of users choice
export const loadWalletConnect = createAsyncThunk(
  "LoadWalletConnect",
  async (_, thunkAPI) => {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          56: "https://bsc-dataseed.binance.org/",
        },
        chainId: 56,
      });
      console.log("Provider", provider);
      if (provider) {
        await provider.enable();
        const web3 = new Web3(provider);
        let account = await web3.eth.getAccounts();
        account = account[0];
        let chainId = await web3.eth.getChainId();
        return {
          web3,
          account,
          chainId,
        };
      } else {
        return {
          web3LoadingErrorMessage:
            "Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!",
        };
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const switchNetwork = async (web3, protocol) => {
  // const network = ContractUtility.getNetwork(
  //   ContractUtility.getChainId(protocol)
  // );
  // try {
  //   await web3.currentProvider.request({
  //     method: "wallet_switchEthereumChain",
  //     params: [{ chainId: ContractUtility.getChainId(protocol) }],
  //   });
  // } catch (error) {
  //   if (error.code == 4902) {
  //     await window.ethereum.request({
  //       method: "wallet_addEthereumChain",
  //       params: [
  //         {
  //           chainId: ContractUtility.getChainId(protocol),
  //           chainName: ContractUtility.getNetworkText(network),
  //           nativeCurrency: {
  //             name: network,
  //             symbol: ContractUtility.getSymbol(network),
  //             decimals: 18,
  //           },
  //           blockExplorerUrls: [ContractUtility.getNetworkExplorer(network)],
  //           rpcUrls: [ContractUtility.getNetworkRpc(network)],
  //         },
  //       ],
  //     });
  //   }
  console.log("error", error);
  // }
};

const web3ConnectSlice = createSlice({
  name: "Web3Connect",
  initialState,
  reducers: {
    updateAccount: (state, { payload }) => {
      state.account = payload?.account;
    },
  },
  extraReducers: {
    [loadWalletConnect.fulfilled.toString()]: (state, { payload }) => {
      console.log("payloadpayload", payload);
      state.web3 = payload?.web3;
      state.account = payload?.account;
      state.web3Loading = false;
      state.chainId = payload?.chainId;
      state.web3LoadingErrorMessage = payload?.web3LoadingErrorMessage;
      state.web3ConnectingError = payload?.web3ConnectingError;
    },
    [loadBlockchain.fulfilled.toString()]: (state, { payload }) => {
      state.web3 = payload?.web3;
      state.account = payload?.account;
      state.web3Loading = false;
      state.web3LoadingErrorMessage = payload?.web3LoadingErrorMessage;
      state.chainId = payload?.chainId;
      state.web3ConnectingError = payload?.web3ConnectingError;
    },
  },
});

export const web3Reducer = web3ConnectSlice.reducer;
export const { updateAccount } = web3ConnectSlice.actions;
