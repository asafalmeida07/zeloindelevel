import { Outlet } from "react-router-dom";
import GlobalTabs from "../components/GlobalTabs/GlobalTabs.jsx";

export default function RootLayout() {
  return (
    <>
      <div className="global-tabs-desktop-placeholder">
        <GlobalTabs />
      </div>
      <div className="root-layout-content">
        <Outlet />
      </div>
    </>
  );
}
