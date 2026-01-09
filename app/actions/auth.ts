'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function registerUser(formData: FormData) {
  // 1. Ambil data dari form
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string // "PELAMAR" atau "UMKM"
  
  // Data spesifik
  const nama_lengkap = formData.get("nama_lengkap") as string
  const nama_usaha = formData.get("nama_usaha") as string
  const pemilik = formData.get("pemilik") as string
  const alamat = formData.get("alamat") as string

  // 2. Validasi sederhana
  if (!email || !password || !role) {
    return { error: "Semua data wajib diisi!" }
  }

  // 3. Cek apakah email sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: "Email sudah terdaftar!" }
  }

  // 4. Hash Password (biar aman)
  const hashedPassword = await bcrypt.hash(password, 10)

  // 5. Simpan ke Database (Transaksi: User + Profile)
  try {
    await prisma.$transaction(async (tx) => {
      // A. Buat User Login
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role === "PELAMAR" ? "PELAMAR" : "UMKM"
        }
      })

      // B. Buat Profil sesuai Role
      if (role === "PELAMAR") {
        await tx.pelamar.create({
          data: {
            userId: newUser.id,
            nama_lengkap: nama_lengkap || "Tanpa Nama"
          }
        })
      } else if (role === "UMKM") {
        await tx.umkm.create({
          data: {
            userId: newUser.id,
            nama_usaha: nama_usaha || "UMKM Baru",
            pemilik: pemilik || "Owner",
            alamat: alamat || "-"
          }
        })
      }
    })
  } catch (error) {
    console.error("Register Error:", error)
    return { error: "Gagal mendaftar, coba lagi." }
  }

  // 6. Jika sukses, arahkan ke login
  redirect("/login")
}

export async function checkCredentialsAndSendOTP(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
  
    if (!email || !password) return { error: "Email dan password wajib diisi!" }
  
    const user = await prisma.user.findUnique({ where: { email } })
  
    // 1. Validasi Password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { error: "Email atau password salah!" }
    }
  
    // 2. Generate OTP (6 Digit Angka Random)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 3. Set Expired 5 Menit dari sekarang
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) 
  
    // 4. Simpan ke Database
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        otp_code: otpCode,
        otp_expires_at: expiresAt
      }
    })
  
    // 5. SIMULASI KIRIM EMAIL (Cek Terminal VS Code Anda!)
    console.log("========================================")
    console.log(`🔐 KODE OTP UNTUK ${user.email}: ${otpCode}`)
    console.log("========================================")
  
    // Kembalikan status sukses ke Frontend
    return { success: true, email: user.email }
  }
  
  // --- TAHAP 2: Verifikasi OTP & Login ---
  export async function verifyOtpAndLogin(email: string, otpInput: string) {
      const user = await prisma.user.findUnique({ where: { email } })
  
      if (!user) return { error: "User tidak ditemukan" }
  
      // 1. Cek Apakah OTP Cocok
      if (user.otp_code !== otpInput) {
          return { error: "Kode OTP Salah!" }
      }
  
      // 2. Cek Apakah OTP Kadaluarsa
      if (!user.otp_expires_at || new Date() > user.otp_expires_at) {
          return { error: "Kode OTP sudah kadaluarsa. Silakan login ulang." }
      }
  
      // 3. Login Sukses -> Bersihkan OTP di DB
      await prisma.user.update({
          where: { id: user.id },
          data: { otp_code: null, otp_expires_at: null }
      })
  
      // 4. Buat Session Cookie (Sama seperti sebelumnya)
      const sessionData = JSON.stringify({ userId: user.id, role: user.role })
      const cookieStore = await cookies() 
      cookieStore.set("session_kerjaku", sessionData, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 
      })
  
      // 5. Redirect Sesuai Role
      if (user.role === "PELAMAR") redirect("/dashboard/pelamar")
      else if (user.role === "UMKM") redirect("/dashboard/umkm")
      else redirect("/")
  }

  export async function logoutUser() {
    const cookieStore = await cookies()
    
    // Hapus cookie sesi
    cookieStore.delete("session_kerjaku")
    
    // Redirect ke halaman login
    redirect("/login")
  }