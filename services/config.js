import { APIPath } from "../utility/constant/apiPath";
import { BaseService } from "./baseService";

class AppConfig {
  getConfig = () => {
    const url = `${APIPath.getConfig}`;
    return BaseService.get(url);
  };
}

const AppConfigService = new AppConfig();
Object.freeze(AppConfigService);
export { AppConfigService };
