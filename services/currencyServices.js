import { APIPath, CommonUtility } from "utility";
import { BaseService } from "./baseService";

class CMC {
  priceConvertion = (data) => {
    const url = `${APIPath.priceConversion}?${CommonUtility.objectToParams(
      data
    )}`;
    return BaseService.get(url);
  };
}

const CMCService = new CMC();
Object.freeze(CMCService);
export { CMCService };
