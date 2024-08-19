export class CommonUtility {
  static addressConvertor = (address) => {
    if ((address || "").length < 10) {
      return address || "";
    }
    return `${address.slice(0, 4)}...${address.slice(address.length - 4)}`;
  };
  static contract(web3, abi, address) {
    return new web3.eth.Contract(abi, address);
  }
  static isEthereumAddress(address) {
    if (typeof address !== "string") {
      return false;
    }
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
    }
    return true;
  }
}
