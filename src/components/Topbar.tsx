"use client";

import React from "react";
import styles from "@/styles/topbar.module.scss";
import Link from "next/link";

function Topbar() {
  return (
    <div className={styles.topbar}>
      <div>
        <Link href="/">
          <button>TOUI</button>
        </Link>
      </div>

      <div>
        <Link href="/login">
          <button>LOGIN</button>
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
