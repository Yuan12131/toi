import Image from "next/image";
import styles from "@/styles/home.module.scss";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.main}>
      <div>
        <div>
          너 P야? <br></br>AI가 짜주는 여행 코스<br></br>
          <Link href={"/planner"}>
          <button>TRY</button>
          </Link>
        </div>
      </div>
      <div>
        <Image src={"/tour.jpg"} alt="tour.jpg" width={500} height={300}/>
      </div>
      <div></div>
    </div>
  );
}
