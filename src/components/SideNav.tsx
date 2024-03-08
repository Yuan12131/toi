import NavLinks from '@/components/NavLink'
import styles from "@/styles/sidenav.module.scss"

export default function SideNav() {

  return (
    <div className={styles.sidemenu}>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
    </div>
  );
}