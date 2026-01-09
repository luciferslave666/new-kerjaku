import Link from "next/link"
import { cookies } from "next/headers"
import { logoutUser } from "../actions/auth"
import { User, Briefcase } from "lucide-react" // Import Icon

export default async function Navbar() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session_kerjaku")
  const isLoggedIn = !!sessionCookie
  
  let dashboardLink = "/login"
  let profileLink = "/login"
  let role = ""

  // Logika Menentukan Link Berdasarkan Role
  if (isLoggedIn && sessionCookie) {
      const session = JSON.parse(sessionCookie.value)
      role = session.role
      
      if (session.role === "UMKM") {
          dashboardLink = "/dashboard/umkm"
          profileLink = "/dashboard/umkm/profil"
      } else {
          dashboardLink = "/dashboard/pelamar"
          profileLink = "/dashboard/pelamar/profil"
      }
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Kiri */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
              <Briefcase className="w-8 h-8" />
              <span>Kerja<span className="text-gray-800">Ku</span></span>
            </Link>
          </div>

          {/* Menu Kanan */}
          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link 
                    href={dashboardLink}
                    className="text-gray-600 hover:text-blue-600 font-medium transition text-sm"
                >
                    Dashboard
                </Link>

                {/* Link Profil Baru */}
                <Link 
                    href={profileLink}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition text-sm"
                >
                    <User className="w-4 h-4" />
                    <span>Profil {role === "UMKM" ? "Usaha" : "Saya"}</span>
                </Link>
                
                {/* Tombol Logout */}
                <form action={logoutUser}>
                    <button className="text-red-500 hover:text-red-700 text-sm font-medium transition border border-red-200 px-3 py-1.5 rounded hover:bg-red-50">
                        Keluar
                    </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium text-sm">
                  Masuk
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm">
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}