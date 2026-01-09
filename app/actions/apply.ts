'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function applyLamaran(lowonganId: number) {
  // 1. Cek User Login
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session_kerjaku")
  if (!sessionCookie) redirect("/login")
  
  const session = JSON.parse(sessionCookie.value)

  // 2. Cek apakah dia benar PELAMAR
  if (session.role !== "PELAMAR") {
    return { error: "Hanya akun Pelamar yang bisa melamar!" }
  }

  // 3. Cari Data Profil Pelamar
  const pelamar = await prisma.pelamar.findUnique({
    where: { userId: session.userId }
  })

  if (!pelamar) return { error: "Profil pelamar tidak ditemukan." }

  // 4. Cek apakah sudah pernah melamar di lowongan ini? (Mencegah spam)
  const existingLamaran = await prisma.lamaran.findFirst({
    where: {
        lowonganId: lowonganId,
        pelamarId: pelamar.id
    }
  })

  if (existingLamaran) {
    return { error: "Anda sudah melamar pekerjaan ini sebelumnya." }
  }

  // 5. Simpan Lamaran (Status default: APPLIED)
  try {
    await prisma.lamaran.create({
      data: {
        lowonganId: lowonganId,
        pelamarId: pelamar.id,
        status: "APPLIED"
      }
    })
    
    // Refresh halaman agar tombol berubah jadi "Sudah Dilamar"
    revalidatePath(`/lowongan/${lowonganId}`)
    return { success: true }
    
  } catch (error) {
    console.error("Gagal melamar:", error)
    return { error: "Terjadi kesalahan sistem." }
  }
}

export async function updateStatusLamaran(lamaranId: number, statusBaru: "ACCEPTED" | "REJECTED") {
    // 1. Cek Login (Keamanan standar)
    const cookieStore = await cookies()
    const session = cookieStore.get("session_kerjaku")
    if (!session) return { error: "Unauthorized" }

    try {
        // 2. Update Status di Database
        await prisma.lamaran.update({
            where: { id: lamaranId },
            data: { status: statusBaru }
        })

        // 3. Refresh halaman agar tampilan berubah otomatis
        revalidatePath("/dashboard/umkm") 
        return { success: true }
        
    } catch (error) {
        console.error("Gagal update status:", error)
        return { error: "Gagal mengubah status" }
    }
}