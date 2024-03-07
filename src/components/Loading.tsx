import styles from "@/styles/loading.module.scss";
import { PuffLoader } from "react-spinners";


function Loading() {
  return (
    <div className={styles.loading}>
            <PuffLoader color="#36d7b7" size={100}/>
    </div>
  );
}

export default Loading;
