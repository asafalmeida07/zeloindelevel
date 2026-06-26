import styles from "./Avatar.module.css";
import { firstName } from "../../utils/format.js";

export default function Avatar({ name = "", photoURL, color = "#6E56F8", size = 40, ring }) {
  const initials = (name || "?").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  const style = { width: size, height: size, fontSize: size * 0.4, boxShadow: ring ? `0 0 0 2px ${color}` : "none" };
  return photoURL ? (
    <img className={styles.av} src={photoURL} alt={firstName(name)} style={style} />
  ) : (
    <span className={styles.av} style={{ ...style, background: color, color: "#fff" }} aria-label={name}>{initials || "?"}</span>
  );
}
