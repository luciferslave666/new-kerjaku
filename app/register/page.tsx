'use client'

import { useState } from "react"
import { registerUser } from "@/app/actions/auth"
import Link from "next/link"

export default function RegisterPage() {
  const [role, setRole] = useState("PELAMAR") // Default tab: Pelamar
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(event.currentTarget)
    // Panggil Server Action yang kita buat di langkah 2
    const result = await registerUser(formData) 
    
    if (result?.error) {
        alert(result.error)
        setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Daftar Akun Baru</h1>

        {/* Tab Pilihan Role */}
        <div className="flex bg-gray-200 p-1 rounded-lg mb-6">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              role === "PELAMAR" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setRole("PELAMAR")}
          >
            Pencari Kerja
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              role === "UMKM" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setRole("UMKM")}
          >
            Mitra UMKM
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="role" value={role} />

          {/* Form Umum */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
          </div>

          {/* Form Khusus Pelamar */}
          {role === "PELAMAR" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input name="nama_lengkap" type="text" required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
            </div>
          )}

          {/* Form Khusus UMKM */}
          {role === "UMKM" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Usaha (Toko/Warung)</label>
                <input name="nama_usaha" type="text" required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Pemilik</label>
                <input name="pemilik" type="text" required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                <textarea name="alamat" required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun? <Link href="/login" className="text-blue-600 hover:underline">Masuk disini</Link>
        </p>
      </div>
    </div>
  )
}