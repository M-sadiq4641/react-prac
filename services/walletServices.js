import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Web3Modal } from "@web3modal/standalone";
import { apiGetChainNamespace } from "caip-api";
import UniversalProvider from "@walletconnect/universal-provider";

import Web3 from "web3";
//   import { DEFAULT_LOGGER } from "../constants";
import { utils } from "ethers";
import environment from "@/environment";
//   import { AccountBalances, ChainNamespaces, getAllChainNamespaces } from "../helpers";
//   import { PairingTypes, SessionTypes } from "@walletconnect/types";

export const DEFAULT_MAIN_CHAINS = [
  // mainnets
  "eip155:1",
  "eip155:10",
  "eip155:100",
  "eip155:137",
  "eip155:42161",
  "eip155:42220",
];

export const DEFAULT_TEST_CHAINS = [
  // testnets
  "eip155:42",
  "eip155:69",
  "eip155:80001",
  "eip155:421611",
  "eip155:44787",
];

export const DEFAULT_CHAINS = [...DEFAULT_MAIN_CHAINS, ...DEFAULT_TEST_CHAINS];

export const ClientContext = createContext();

/**
 * Provider
 */
export const getAllChainNamespaces = () => {
  const namespaces = [];
  DEFAULT_CHAINS.forEach((chainId) => {
    const [namespace] = chainId.split(":");
    if (!namespaces.includes(namespace)) {
      namespaces.push(namespace);
    }
  });
  return namespaces;
};

export function ClientContextProvider({ children }) {
  const DEFAULT_PROJECT_ID = "1eccdcef1fec662a8e65ca062f39ed04";
  const DEFAULT_RELAY_URL = "wss://relay.walletconnect.com";

  const [client, setClient] = useState();
  const [pairings, setPairings] = useState([]);
  const [session, setSession] = useState();

  const [ethereumProvider, setEthereumProvider] = useState();
  const [web3Provider, setWeb3Provider] = useState();

  const [isFetchingBalances, setIsFetchingBalances] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasCheckedPersistedSession, setHasCheckedPersistedSession] =
    useState(false);

  const [balances, setBalances] = useState({});
  const [account, setAccounts] = useState();
  const [chainData, setChainData] = useState({});
  const [chain, setChain] = useState("");
  const [web3Modal, setWeb3Modal] = useState();

  const resetApp = () => {
    setPairings([]);
    setSession(undefined);
    setBalances({});
    setAccounts([]);
    setChain("");
  };

  const loadChainData = async () => {
    const namespaces = getAllChainNamespaces();
    const chainData = {};
    await Promise.all(
      namespaces.map(async (namespace) => {
        let chains;
        try {
          chains = await apiGetChainNamespace(namespace);
        } catch (e) {
          // ignore error
        }
        if (typeof chains !== "undefined") {
          chainData[namespace] = chains;
        }
      })
    );
    setChainData(chainData);
  };

  const disconnect = useCallback(async () => {
    try {
      if (typeof ethereumProvider === "undefined") {
        throw new Error("ethereumProvider is not initialized");
      }
      resetApp();
      await ethereumProvider.disconnect();
      // resetApp();
    } catch (error) {
      setAccounts(null);
      console.log("error", error);
    }
  }, [ethereumProvider]);

  const _subscribeToProviderEvents = useCallback(
    async (_client) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }

      _client.on("display_uri", async (uri) => {
        web3Modal?.openModal({ uri });
      });

      // Subscribe to session ping
      _client.on("session_ping", ({ id, topic }) => {
        console.log("EVENT", "session_ping");
        console.log(id, topic);
      });

      // Subscribe to session event
      _client.on("session_event", ({ event, chainId }) => {
        console.log("EVENT", "session_event");
        console.log(event, chainId);
      });

      // Subscribe to session update
      _client.on("session_update", ({ topic, session }) => {
        console.log("EVENT", "session_updated");
        setSession(session);
      });

      // Subscribe to session delete
      _client.on("session_delete", ({ id, topic }) => {
        console.log("EVENT", "session_deleted");
        console.log(id, topic);
        resetApp();
      });
    },
    [web3Modal]
  );

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true);

      const provider = await UniversalProvider.init({
        projectId: DEFAULT_PROJECT_ID,
        logger: "debug",
        relayUrl: DEFAULT_RELAY_URL,
      });

      const web3Modal = new Web3Modal({
        projectId: DEFAULT_PROJECT_ID || "",
        walletConnectVersion: 2,
      });

      setEthereumProvider(provider);
      setClient(provider.client);
      setWeb3Modal(web3Modal);
    } catch (err) {
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const createWeb3Provider = useCallback((ethereumProvider) => {
    const web3Provider = new Web3(ethereumProvider);
    setWeb3Provider(web3Provider);
  }, []);

  const connectWithInjected = async (chainId) => {
    try {
      if (Web3.givenProvider) {
        await Web3.givenProvider.enable();
        const web3 = new Web3(Web3.givenProvider);
        await web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: environment.DEFAULT_HEX_CHAIN }],
        });
        let accounts = await web3.eth.getAccounts();
        accounts = accounts[0];
        let chainId = await web3.eth.getChainId();
        const networkId = await web3.eth.net.getId();
        console.log("networkId", networkId);
        createWeb3Provider(web3);

        setAccounts(accounts);
        setChain(chainId.toString());
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const connect = useCallback(
    async (caipChainId, pairing) => {
      if (!ethereumProvider) {
        throw new ReferenceError("WalletConnect Client is not initialized.");
      }

      const chainId = caipChainId.split(":").pop();

      console.log("Enabling EthereumProvider for chainId: ", chainId);

      // const customRpcs = Object.keys(chainData.eip155).reduce(
      //   (rpcs, chainId) => {
      //     rpcs[chainId] = chainData.eip155[chainId].rpc[0];
      //     return rpcs;
      //   },
      //   {}
      // );

      const session = await ethereumProvider.connect({
        namespaces: {
          eip155: {
            methods: [
              "eth_sendTransaction",
              "eth_signTransaction",
              "eth_sign",
              "personal_sign",
              "eth_signTypedData",
            ],
            chains: [`eip155:${chainId}`],
            events: ["chainChanged", "accountsChanged"],
            rpcMap: {
              1: "https://eth.llamarpc.com",
              5: "https://goerli.blockpi.network/v1/rpc/public",
              10: "https://mainnet.optimism.io",
              42: "https://kovan.poa.network",
              69: "https://kovan.optimism.io",
              100: "https://dai.poa.network",
              137: "https://polygon-rpc.com",
              420: "https://goerli.optimism.io",
              42161: "https://arb1.arbitrum.io/rpc",
              42220: "https://forno.celo.org",
              44787: "https://alfajores-forno.celo-testnet.org",
              80001: "https://rpc-mumbai.matic.today",
              421611: "https://rinkeby.arbitrum.io/rpc",
            },
          },
        },
        pairingTopic: pairing?.topic,
      });
      createWeb3Provider(ethereumProvider);
      const _accounts = await ethereumProvider.enable();
      console.log("_accounts", _accounts);
      setAccounts(_accounts[0]);
      setSession(session);
      setChain(caipChainId);

      web3Modal?.closeModal();
    },
    [ethereumProvider, chainData.eip155, createWeb3Provider, web3Modal]
  );

  const onSessionConnected = useCallback(
    async (_session) => {
      if (!ethereumProvider) {
        throw new ReferenceError("EthereumProvider is not initialized.");
      }
      const allNamespaceAccounts = Object.values(_session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat();
      const allNamespaceChains = Object.keys(_session.namespaces);

      const chainData = allNamespaceAccounts[0].split(":");
      const caipChainId = `${chainData[0]}:${chainData[1]}`;
      setChain(caipChainId);
      setSession(_session);
      setAccounts(allNamespaceAccounts.map((account) => account.split(":")[2]));
      createWeb3Provider(ethereumProvider);
    },
    [ethereumProvider, createWeb3Provider]
  );

  const _checkForPersistedSession = useCallback(
    async (provider) => {
      if (typeof provider === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      const pairings = provider.client.pairing.getAll({ active: true });
      // populates existing pairings to state
      setPairings(pairings);
      if (typeof session !== "undefined") return;
      // populates (the last) existing session to state
      if (ethereumProvider?.session) {
        const _session = ethereumProvider?.session;
        await onSessionConnected(_session);
        return _session;
      }
    },
    [session, ethereumProvider, onSessionConnected]
  );

  useEffect(() => {
    loadChainData();
  }, []);

  useEffect(() => {
    if (!client) {
      createClient();
    }
  }, [client, createClient]);

  useEffect(() => {
    if (ethereumProvider && web3Modal)
      _subscribeToProviderEvents(ethereumProvider);
  }, [_subscribeToProviderEvents, ethereumProvider, web3Modal]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!web3Provider || !account) return;

      try {
        setIsFetchingBalances(true);
        const _balances = await Promise.all(
          account.map(async (account) => {
            const balance = await web3Provider.eth.getBalance(account);
            return {
              account,
              symbol: "ETH",
              balance: utils.formatEther(balance),
              contractAddress: "",
            };
          })
        );

        const balancesByAccount = _balances.reduce((obj, balance) => {
          obj[balance.account] = balance;
          return obj;
        }, {});

        setBalances(balancesByAccount);
      } catch (error) {
        throw new Error(error);
      } finally {
        setIsFetchingBalances(false);
      }
    };

    //   fetchBalances();
  }, [web3Provider, account]);

  useEffect(() => {
    web3Provider &&
      window.ethereum.on("accountsChanged", async (data) => {
        setAccounts(data[0]);
      });

    web3Provider &&
      window.ethereum.on("networkChanged", async (data) => {
        setChain(data);
      });
  }, [web3Provider, account]);

  useEffect(() => {
    const getPersistedSession = async () => {
      if (!ethereumProvider) return;
      await _checkForPersistedSession(ethereumProvider);
      setHasCheckedPersistedSession(true);
    };

    if (ethereumProvider && chainData && !hasCheckedPersistedSession) {
      getPersistedSession();
    }
  }, [
    ethereumProvider,
    chainData,
    _checkForPersistedSession,
    hasCheckedPersistedSession,
  ]);

  const value = useMemo(
    () => ({
      pairings,
      isInitializing,
      balances,
      isFetchingBalances,
      account,
      chain,
      client,
      session,
      disconnect,
      connect,
      connectWithInjected,
      chainData,
      web3Provider,
    }),
    [
      pairings,
      isInitializing,
      balances,
      isFetchingBalances,
      account,
      chain,
      client,
      session,
      disconnect,
      connect,
      chainData,
      web3Provider,
    ]
  );

  return (
    <ClientContext.Provider
      value={{
        ...value,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useWalletConnectClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error(
      "useWalletConnectClient must be used within a ClientContextProvider"
    );
  }
  return context;
}
