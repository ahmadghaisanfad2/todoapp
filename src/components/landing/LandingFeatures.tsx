import { CheckCircle2, Tags, Filter, Clock, Moon, Smartphone, Zap, LayoutList, Search } from 'lucide-react'

const features = [
  {
    icon: CheckCircle2,
    title: 'Catat tugas dengan cepat',
    description: 'Langsung tulis apa yang ada di kepala. Judul, prioritas, jatuh tempo — semua dalam satu langkah.',
    color: 'blue',
  },
  {
    icon: Tags,
    title: 'Kelompokan dengan kategori',
    description: 'Buat kategori dengan warna sendiri. Kerja, pribadi, projekt — atur sesuka hati.',
    color: 'violet',
  },
  {
    icon: Clock,
    title: 'Jatuh tempo yang jujur',
    description: 'Atur tanggal dan jam. Tugas yang lewat jatuh tempo langsung muncul di atas.',
    color: 'amber',
  },
  {
    icon: Filter,
    title: 'Saring sesuai kebutuhan',
    description: 'Aktif atau selesai. Prioritas tinggi atau rendah. Berdasarkan kategori. Urutkan sesuai situasi.',
    color: 'emerald',
  },
  {
    icon: Moon,
    title: 'Mode gelap dan terang',
    description: 'Pilih sesuai kenyamanan mata. Bisa juga ikut setelan perangkat Anda.',
    color: 'purple',
  },
  {
    icon: Smartphone,
    title: 'Pasang di layar utama',
    description: 'Tambahkan ke home screen. Berfungsi tanpa internet. Terasa seperti aplikasi asli.',
    color: 'cyan',
  },
  {
    icon: LayoutList,
    title: 'Prioritas yang masuk akal',
    description: 'Tinggi, sedang, rendah. Tugas tersusun otomatis sehingga Anda tahu apa yang harus dikerjakan duluan.',
    color: 'red',
  },
  {
    icon: Search,
    title: 'Cari tanpa ribet',
    description: 'Ketik judul tugas dan langsung ketemu. Tidak perlu scroll terus hanya untuk mengingat sesuatu.',
    color: 'orange',
  },
  {
    icon: Zap,
    title: 'Tanpa lag, tanpa cloud',
    description: 'Semua tersimpan di browser Anda. Tidak perlu akun, tidak perlu tunggu server.',
    color: 'yellow',
  },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
}

export function LandingFeatures() {
  return (
    <section id="fitur" className="relative py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Fitur</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Sederhana. Tapi cukup lengkap.
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Cukup untuk tetap teratur, tidak berlebihan sampai malah jadi beban sendiri.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border/60 bg-card p-5 transition-all duration-150 hover:border-border hover:shadow-sm"
            >
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${colorMap[feature.color]} mb-3`}>
                <feature.icon className="h-4 w-4" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{feature.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}