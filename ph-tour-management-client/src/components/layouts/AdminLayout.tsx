//

import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="">
      <h1 className="">This is AdminLayout component</h1>
      <Outlet />
    </div>
  );
}
