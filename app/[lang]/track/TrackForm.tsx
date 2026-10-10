"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { Dictionary } from "../dictionaries";

const CODE_PATTERN = /^RC-[A-Z2-9]{8}$/;

export default function TrackForm({
  locale,
  track,
}: {
  locale: string;
  track: Dictionary["track"];
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = code.trim().toUpperCase();

    if (!CODE_PATTERN.test(normalized)) {
      setError(track.invalidCode);

      return;
    }

    router.push(`/${locale}/track/${encodeURIComponent(normalized)}`);
  };

  return (
    <form className="track-form" onSubmit={handleSubmit} noValidate>
      <label>
        <span>{track.code}</span>

        <input
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.currentTarget.value);
            setError("");
          }}
          placeholder={track.placeholder}
          autoCapitalize="characters"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
        />
      </label>

      {error && <p className="track-error">{error}</p>}

      <button type="submit" className="track-submit" data-hover-target>
        <span>{track.submit}</span>

        <span aria-hidden="true">&#8599;</span>
      </button>
    </form>
  );
}