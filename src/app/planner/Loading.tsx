import styles from "@/styles/loading.module.scss";
import { SyncLoader } from "react-spinners";


function Loading() {
  return (
    <div className={styles.loading}>
            <SyncLoader />
    </div>
  );
}

export default Loading;
