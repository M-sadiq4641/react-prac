import { Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 40, color: "black" }} spin />
);
const Loading = ({ content }) => {
  return (
    <div className="cover-spin">
      <Space size="middle">
        <Spin size="large" indicator={antIcon} />
        <div className="text-xl">{content}...</div>
      </Space>
    </div>
  );
};

export default Loading;
