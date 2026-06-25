"use client";

import { Check } from "lucide-react";

export default function BankConnectionPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Close Button */}
        <button className="absolute top-6 right-6 text-gray-600 hover:text-black">
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center pt-8 px-6">
          <div className="text-2xl font-bold tracking-wide">NORTHSTAR</div>

          {/* Illustration */}
          <div className="mt-8">
            <img
              src="/bank-connect.svg"
              alt="Bank Connect"
              className="w-52 h-auto"
            />
          </div>

          {/* Title */}
          <h1 className="mt-8 text-center text-3xl font-semibold text-gray-900 leading-tight">
            This application uses
            <span className="font-bold"> Northstar Secure Connect</span>
            <br />
            to link your bank
          </h1>
        </div>

        {/* Features */}
        <div className="px-8 mt-10 space-y-8">
          <div className="flex gap-4">
            <Check className="h-5 w-5 mt-1 text-black" />
            <div>
              <h3 className="font-semibold text-lg">Secure</h3>
              <p className="text-gray-500 text-sm mt-1">
                Transfer of your bank data is encrypted end-to-end.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Check className="h-5 w-5 mt-1 text-black" />
            <div>
              <h3 className="font-semibold text-lg">Private</h3>
              <p className="text-gray-500 text-sm mt-1">
                This application will never be able to access your credentials.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Check className="h-5 w-5 mt-1 text-black" />
            <div>
              <h3 className="font-semibold text-lg">Protected</h3>
              <p className="text-gray-500 text-sm mt-1">
                Your banking information is verified using secure
                industry-standard encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 mt-16 pb-8">
          <p className="text-center text-xs text-gray-500 mb-6">
            By selecting "Continue", you agree to the Northstar Privacy Policy.
          </p>

          <button className="w-full bg-black text-white py-4 rounded-lg text-xl font-medium hover:bg-gray-900 transition">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
