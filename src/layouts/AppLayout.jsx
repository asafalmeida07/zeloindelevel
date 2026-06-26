import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  return (
    <div>
      <Navbar />
      <div className={`container ${styles.shell}`}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
