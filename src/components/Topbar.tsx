"use client";

import React from "react";
import styles from "@/styles/topbar.module.scss";
import Link from "next/link";

function Topbar() {
  return (
    <div className={styles.topbar}>
      <div>
        <Link href="/">
        TOUI
        </Link>
      </div>
      <div>
        <Link href="/login">
        LOGIN
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
