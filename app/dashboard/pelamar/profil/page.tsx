import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { updateProfilePelamar } from "@/app/actions/profile"
import Link from "next/link"

export default async function EditProfilPelamar() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session_kerjaku")
  if (!sessionCookie) redirect("/login")
  const session = JSON.parse(sessionCookie.value)

  const pelamar = await prisma.pelamar.findUnique({
    where: { userId: session.userId }
  })

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link href="/dashboard/pelamar" className="text-blue-600 mb-4 block">&larr; Kembali</Link>
      <h1 className="text-2xl font-bold mb-6">Edit Profil Saya</h1>

      <form action={updateProfilePelamar} className="bg-white p-6 rounded-xl shadow space-y-4">
        
        {/* Foto Profil Preview */}
        <div className="flex items-center gap-4">
            {pelamar?.foto_profil ? (
                <img src={pelamar.foto_profil} alt="Profil" className="w-20 h-20 rounded-full object-cover border" />
            ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">No Foto</div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700">Ganti Foto Profil</label>
                <input name="foto" type="file" accept="image/*" className="text-sm text-gray-500 mt-1" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input name="nama_lengkap" defaultValue={pelamar?.nama_lengkap} type="text" required className="w-full p-2 border rounded" />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Nomor HP / WhatsApp</label>
            <input name="no_hp" defaultValue={pelamar?.no_hp || ""} type="text" placeholder="0812..." className="w-full p-2 border rounded" />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Pendidikan Terakhir</label>
            <select name="pendidikan" defaultValue={pelamar?.pendidikan_akhir || ""} className="w-full p-2 border rounded">
                <option value="">-- Pilih --</option>
                <option value="SMA/SMK">SMA/SMK</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Keahlian (Skill)</label>
            <textarea name="skill" defaultValue={pelamar?.skill || ""} rows={3} placeholder="Contoh: Bisa bawa motor, Bisa Microsoft Office..." className="w-full p-2 border rounded"></textarea>
        </div>

        <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV (PDF/Gambar)</label>
            {pelamar?.cv_file && <p className="text-xs text-green-600 mb-2">✅ CV sudah ada. Upload lagi jika ingin mengganti.</p>}
            <input name="cv" type="file" accept=".pdf,.jpg,.png" className="w-full p-2 border rounded bg-gray-50" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Simpan Perubahan
        </button>

      </form>
    </div>
  )
}