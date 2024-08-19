import { BaseService } from "./baseService";
import { APIPath } from "../utility/constant/apiPath";

class Admin {
  login = (data) => {
    return BaseService.post(APIPath.login, data);
  };
  logout = (data) => {
    return BaseService.post(APIPath.logout);
  };
  auth = () => {
    return BaseService.get(APIPath.auth);
  };
  updatePassword = (data) => {
    return BaseService.put(APIPath.updatePassword, data);
  };
  updateUsername = (data) => {
    return BaseService.put(APIPath.updateUsername, data);
  };
}

const AdminService = new Admin();
Object.freeze(AdminService);
export { AdminService };
