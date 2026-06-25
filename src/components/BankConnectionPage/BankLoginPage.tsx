"use client";

import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";

export default function BankLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const bank = {
    name: "Chase Bank",
    website: "www.chase.com",
    logo: "/banks/chase.png",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      username,
      password,
    });

    // router.push("/bank-processing");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b">
          <button>
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="font-semibold text-lg">NORTHSTAR</div>

          <button>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Bank Info */}
        <div className="px-6 mt-10 flex items-center gap-4">
          <img
            src={bank.logo}
            alt={bank.name}
            className="h-14 w-14 rounded-full object-cover border"
          />

          <div>
            <h3 className="text-2xl font-semibold">{bank.name}</h3>

            <p className="text-gray-500">{bank.website}</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 mt-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">
            Enter your credentials
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-16 border border-gray-300 px-5 text-xl outline-none focus:border-black"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-16 border border-gray-300 px-5 text-xl outline-none focus:border-black"
            />

            <button
              type="submit"
              className="w-full h-16 bg-black text-white text-2xl font-medium mt-4"
            >
              Continue
            </button>
          </form>

          <button className="w-full mt-8 text-gray-500 text-xl">
            Reset password
          </button>
        </div>
      </div>
    </div>
  );
}
