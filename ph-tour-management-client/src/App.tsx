import { Outlet } from "react-router";
import CommonLayout from "./components/layouts/CommonLayout";

const App = () => {
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
};

export default App;
