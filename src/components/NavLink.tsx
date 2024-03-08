"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/sidenav.module.scss";

const links = [
  { name: "회원정보", href: "/mypage/myinfo" },
  { name: "나의 여행코스", href: "/mypage/myplan" },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`${styles.linkbox} ${
            pathname === link.href ? styles.activeLink : ""
          }`}
        >
          <p className={styles.linkname}>{link.name}</p>
        </Link>
      ))}
    </>
  );
}