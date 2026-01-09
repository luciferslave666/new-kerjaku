'use client'

import { createLowongan } from "@/app/actions/job"
import Link from "next/link"
import { useState } from "react"

export default function BuatLowonganPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    await createLowongan(formData) // Panggil Server Action
    // Redirect ditangani di server action
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Pasang Lowongan Baru</h1>
            <Link href="/dashboard/umkm" className="text-sm text-blue-600 hover:underline">
                &larr; Kembali ke Dashboard
            </Link>
        </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Judul Pekerjaan</label>
          <input name="judul" type="text" placeholder="Contoh: Penjaga Toko Shift Pagi" required 
            className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipe Pekerjaan</label>
          <select name="tipe" className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black">
            <option value="Part-time">Part-time</option>
            <option value="Harian">Harian / Lepas</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Gaji / Upah (Rp)</label>
            <input name="gaji" type="number" placeholder="100000" required 
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi Pekerjaan</label>
          <textarea name="deskripsi" rows={4} placeholder="Jelaskan syarat dan tugas..." required 
            className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black" />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 transition"
        >
          {isLoading ? "Menyimpan..." : "Terbitkan Lowongan"}
        </button>
      </form>
    </div>
  )
}