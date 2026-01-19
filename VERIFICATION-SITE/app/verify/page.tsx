"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [status, setStatus] = useState<
    "loading" | "verified" | "already_verified" | "blacklisted" | "error"
  >("loading");

  useEffect(() => {
    if (!code) {
      setStatus("error");
      return;
    }

    const verifyUser = async () => {
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
          process.env.NEXT_PUBLIC_BOT_API_URL + "/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: tokenData.token }),
          }
        );

        const verifyData = await verifyRes.json();

        // ✅ FIX IS HERE
        if (
          verifyData.success &&
          ["verified", "already_verified"].includes(verifyData.status)
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
    };

    verifyUser();
  }, [code]);

  // ---------- UI ----------
  if (status === "loading") {
    return <p className="text-center mt-20">Verifying…</p>;
  }

  if (status === "verified") {
    return <Success message="✅ Verification successful!" />;
  }

  if (status === "already_verified") {
    return <Success message="✅ You are already verified." />;
  }

  if (status === "blacklisted") {
    return (
      <Error message="🚫 You are banned due to involvement in blacklisted servers." />
    );
  }

  return <Error message="❌ Verification failed. Please try again." />;
}

// ---------- Components ----------
function Success({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}

function Error({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold text-red-500">{message}</h1>
    </div>
  );
}
