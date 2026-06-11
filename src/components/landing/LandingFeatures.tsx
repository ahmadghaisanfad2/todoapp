import { CheckCircle2, Tags, Filter, Clock, Moon, Smartphone, Zap, LayoutList, Search } from 'lucide-react'

const features = [
  {
    icon: CheckCircle2,
    title: 'Catat tugas dengan cepat',
    description: 'Langsung tulis apa yang ada di kepala. Judul, prioritas, jatuh tempo — semua dalam satu langkah.',
    color: 'emerald',
  },
  {
    icon: Tags,
    title: 'Kelompokan dengan kategori',
    description: 'Buat kategori dengan warna sendiri. Kerja, pribadi, projekt — atur sesuka hati',
    color: 'teal',
  },
  {
    icon: Clock,
    title: 'Jatuh tempo yang jujur',
    description: 'Atur tanggal dan jam. Tugas yang lewat jatuh tempo langsung muncul di atas.',
    color: 'green',
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
    color: 'teal',
  },
  {
    icon: Smartphone,
    title: 'Pasang di layar utama',
    description: 'Tambahkan ke home screen. Berfungsi tanpa internet. Terasa seperti aplikasi asli.',
    color: 'green',
  },
  {
    icon: LayoutList,
    title: 'Prioritas yang masuk akal',
    description: 'Tinggi, sedang, rendah. Tugas tersusun otomatis sehingga Anda tahu apa yang harus dikerjakan duluan.',
    color: 'emerald',
  },
  {
    icon: Search,
    title: 'Cari tanpa ribet',
    description: 'Ketik judul tugas dan langsung ketemu. Tidak perlu scroll terus hanya untuk mengingat sesuatu.',
    color: 'teal',
  },
  {
    icon: Zap,
    title: 'Tanpa lag, tanpa cloud',
    description: 'Semua tersimpan di browser Anda. Tidak perlu akun, tidak perlu tunggu server.',
    color: 'green',
  },
]

const colorMap: Record<string, string> = {
  emerald: 'bg-primary/10 text-primary',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export function LandingFeatures() {
  return (
    <section id="fitur" className="relative py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="text-[11px] font-semibold font-mono uppercase tracking-widest text-primary mb-3">Fitur</p>
          <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-foreground">
            Sederhana. Tapi cukup lengkap.
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Cukup untuk tetap teratur, tidak berlebihan sampai malah jadi beban sendiri.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="scroll-reveal-item rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-border hover:shadow-md hover:shadow-primary/5"
              style={{ animationDelay: `${i * 0.05}s` }}
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
