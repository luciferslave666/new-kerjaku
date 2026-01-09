'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function createLowongan(formData: FormData) {
  // 1. Cek User Login
  const cookieStore = await cookies()
  const session = cookieStore.get("session_kerjaku")
  
  if (!session) redirect("/login")
  
  const userSession = JSON.parse(session.value)

  // 2. Cari Data UMKM berdasarkan User ID yang login
  const umkm = await prisma.umkm.findUnique({
    where: { userId: userSession.userId }
  })

  if (!umkm) {
    return { error: "Data UMKM tidak ditemukan!" }
  }

  // 3. Ambil data dari Form
  const judul = formData.get("judul") as string
  const deskripsi = formData.get("deskripsi") as string
  const gaji = formData.get("gaji") as string
  const tipe = formData.get("tipe") as string // Part-time / Freelance

  // 4. Simpan ke Database
  try {
    await prisma.lowongan.create({
      data: {
        umkmId: umkm.id,
        judul,
        deskripsi,
        gaji: parseInt(gaji), // Ubah string ke number
        tipe_pekerjaan: tipe,
        status: "OPEN"
      }
    })
    
    // Refresh halaman dashboard biar lowongan baru langsung muncul
    revalidatePath("/dashboard/umkm")
    
  } catch (error) {
    console.error("Gagal buat lowongan:", error)
    return { error: "Gagal menyimpan lowongan" }
  }

  // 5. Kembali ke Dashboard
  redirect("/dashboard/umkm")
}