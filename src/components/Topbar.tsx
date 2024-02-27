"use client";

import React from "react";
import styles from "@/styles/topbar.module.scss";
import Link from "next/link";

function Topbar() {
  return (
    <div className={styles.topbar}>
      <div>
        <Link href="/">
          <div>TOUI</div>
        </Link>
      </div>

      <div>
        <Link href="/login">
          <div>LOGIN</div>
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
