"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Status =
  | "loading"
  | "verified"
  | "already_verified"
  | "blacklisted"
  | "error";

export default function VerifyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyClient />
    </Suspense>
  );
}

function VerifyClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!code) {
      setStatus("error");
      return;
    }

    async function verifyUser() {
      try {
        // 1️⃣ Exchange OAuth code → JWT
        const tokenRes = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const tokenData = await tokenRes.json();
        if (!tokenData.token) {
          setStatus("error");
          return;
        }

        // 2️⃣ Call bot verification API
        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_BOT_API_URL}/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: tokenData.token }),
          }
        );

        const verifyData = await verifyRes.json();

        if (
          verifyData.success &&
          (verifyData.status === "verified" ||
            verifyData.status === "already_verified")
        ) {
          setStatus(verifyData.status);
        } else if (verifyData.status === "blacklisted") {
          setStatus("blacklisted");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }

    verifyUser();
  }, [code]);

  if (status === "loading") return <Loading />;
  if (status === "verified")
    return <Success message="✅ Verification successful!" />;
  if (status === "already_verified")
    return <Success message="✅ You are already verified." />;
  if (status === "blacklisted")
    return (
      <Error message="🚫 You are banned due to involvement in blacklisted servers." />
    );

  return <Error message="❌ Verification failed. Please try again." />;
}

/* ---------- Components ---------- */

function Loading() {
  return <p className="text-center mt-20">Verifying…</p>;
}

function Success(props: { message: string }) {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold">{props.message}</h1>
    </div>
  );
}

function Error(props: { message: string }) {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold text-red-500">
        {props.message}
      </h1>
    </div>
  );
}
