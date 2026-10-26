"use client";
import Image from "next/image";
import { useState } from "react";
import {
  getMemberPortraitSrc,
  type MemberPortraitRecord,
} from "./member-portraits";
import styles from "./quiz.module.css";

export function MemberPortrait({
  photo,
  index,
}: {
  photo: MemberPortraitRecord;
  index: number;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <small aria-hidden="true">
        0{index}
        <span>✦</span>
      </small>
    );
  return (
    <div className={styles.memberPortrait}>
      <Image
        src={getMemberPortraitSrc(photo)}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 600px) 64px, 80px"
        loading="lazy"
        style={{ objectPosition: photo.objectPosition }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
