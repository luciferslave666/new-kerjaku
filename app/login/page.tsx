'use client'

import { useState } from "react"
import { checkCredentialsAndSendOTP, verifyOtpAndLogin } from "@/app/actions/auth" // Import fungsi baru
import Link from "next/link"

export default function LoginPage() {
  const [step, setStep] = useState(1) // 1 = Input Password, 2 = Input OTP
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Handler Tahap 1: Submit Email & Password
  async function handleStep1(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    
    const formData = new FormData(event.currentTarget)
    const result = await checkCredentialsAndSendOTP(formData) // Panggil Server
    
    if (result?.error) {
        setErrorMsg(result.error)
        setIsLoading(false)
    } else if (result?.success) {
        // Jika sukses, simpan email & pindah ke Step 2
        setEmail(result.email as string)
        setStep(2)
        setIsLoading(false)
    }
  }

  // Handler Tahap 2: Submit OTP
  async function handleStep2(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    const formData = new FormData(event.currentTarget)
    const otp = formData.get("otp") as string
    
    // Panggil Server untuk Verifikasi Final
    const result = await verifyOtpAndLogin(email, otp)
    
    if (result?.error) {
        setErrorMsg(result.error)
        setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
            {step === 1 ? "Masuk Aplikasi" : "Verifikasi OTP"}
        </h1>
        
        {step === 2 && (
            <p className="text-center text-sm text-green-600 mb-6 bg-green-50 p-2 rounded">
                Kode OTP telah dikirim ke terminal server untuk email <b>{email}</b>
            </p>
        )}

        {/* STEP 1: Form Email & Password */}
        {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="email" type="email" required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input name="password" type="password" required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
            </div>
            
            {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
            >
                {isLoading ? "Memeriksa..." : "Lanjut"}
            </button>
            </form>
        )}

        {/* STEP 2: Form OTP */}
        {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Masukkan 6 Digit Kode OTP</label>
                <input 
                    name="otp" 
                    type="text" 
                    maxLength={6}
                    placeholder="123456"
                    className="w-full mt-1 p-3 text-center text-2xl tracking-widest border border-gray-300 rounded-md text-black font-mono" 
                    required 
                />
            </div>

            {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:bg-green-300"
            >
                {isLoading ? "Verifikasi..." : "Masuk Sekarang"}
            </button>
            
            <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-gray-500 text-sm hover:underline mt-2"
            >
                Kembali / Salah Email
            </button>
            </form>
        )}

        {step === 1 && (
            <p className="text-center text-sm text-gray-600 mt-4">
            Belum punya akun? <Link href="/register" className="text-blue-600 hover:underline">Daftar dulu</Link>
            </p>
        )}
      </div>
    </div>
  )
}