import { createContext, useContext, useState, useCallback } from "react";
import styles from "./Toast.module.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback((message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => remove(id), 3600);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className={styles.stack}>
        {toasts.map((t) => (
          <div key={t.id} className={[styles.toast, styles[t.type]].join(" ")} onClick={() => remove(t.id)}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
