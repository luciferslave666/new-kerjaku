'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { saveFile } from "./uploadHelper"

// --- UPDATE PELAMAR ---
export async function updateProfilePelamar(formData: FormData) {
  const cookieStore = await cookies()
  const session = cookieStore.get("session_kerjaku")
  if (!session) redirect("/login")
  const userSession = JSON.parse(session.value)

  // Ambil data teks
  const nama_lengkap = formData.get("nama_lengkap") as string
  const no_hp = formData.get("no_hp") as string
  const pendidikan = formData.get("pendidikan") as string
  const skill = formData.get("skill") as string
  
  // Ambil file
  const fotoFile = formData.get("foto") as File
  const cvFile = formData.get("cv") as File

  // Proses Upload
  const fotoUrl = await saveFile(fotoFile)
  const cvUrl = await saveFile(cvFile)

  // Siapkan object data untuk update
  const dataUpdate: any = {
    nama_lengkap,
    no_hp,
    pendidikan_akhir: pendidikan,
    skill
  }

  // Cuma update URL kalau user upload file baru
  if (fotoUrl) dataUpdate.foto_profil = fotoUrl
  if (cvUrl) dataUpdate.cv_file = cvUrl

  await prisma.pelamar.update({
    where: { userId: userSession.userId },
    data: dataUpdate
  })

  revalidatePath("/dashboard/pelamar/profil")
  redirect("/dashboard/pelamar")
}

// --- UPDATE UMKM ---
export async function updateProfileUMKM(formData: FormData) {
  const cookieStore = await cookies()
  const session = cookieStore.get("session_kerjaku")
  if (!session) redirect("/login")
  const userSession = JSON.parse(session.value)

  const nama_usaha = formData.get("nama_usaha") as string
  const pemilik = formData.get("pemilik") as string
  const alamat = formData.get("alamat") as string
  const deskripsi = formData.get("deskripsi") as string
  
  const logoFile = formData.get("logo") as File
  const logoUrl = await saveFile(logoFile)

  const dataUpdate: any = {
    nama_usaha,
    pemilik,
    alamat,
    deskripsi
  }

  if (logoUrl) dataUpdate.logo = logoUrl

  await prisma.umkm.update({
    where: { userId: userSession.userId },
    data: dataUpdate
  })

  revalidatePath("/dashboard/umkm/profil")
  redirect("/dashboard/umkm")
}