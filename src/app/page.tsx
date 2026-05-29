import Link from 'next/link'
import PackageCard from '@/components/PackageCard'
import PublicHeader from '@/components/PublicHeader'
import { getCurrentUser } from '@/lib/auth'
import { getPublicPackages } from '@/lib/packages'

const HERO_IMAGE =
  'https://image.qwenlm.ai/public_source/25a0de79-44c4-4054-870d-7f8d9bdbb851/1cee3b5d5-c3ba-4ea1-acab-e9ef0c93ca4a.png'

const FEATURES = [
  {
    icon: '',
    title: 'Pesan dengan Mudah',
    desc: 'Pilih paket catering favorit Anda dan selesaikan pemesanan hanya dalam beberapa klik.'
  },
  {
    icon: '',
    title: 'Pantau Status',
    desc: 'Lacak status pemesanan Anda secara real-time dari dapur hingga sampai ke lokasi.'
  },
  {
    icon: '',
    title: 'Kelola Agenda',
    desc: 'Atur jadwal catering untuk setiap acara bisnis Anda tanpa repot.'
  },
  {
    icon: '💬',
    title: 'Dukungan 24/7',
    desc: 'Tim support kami siap membantu kapan saja melalui WhatsApp atau live chat.'
  },
  {
    icon: '🎯',
    title: 'Paket Custom',
    desc: 'Sesuaikan menu dan porsi sesuai kebutuhan acara perusahaan Anda.'
  },
  {
    icon: '',
    title: 'Laporan Lengkap',
    desc: 'Dapatkan laporan detail konsumsi dan biaya untuk setiap acara.'
  }
]

const TESTIMONIALS = [
  {
    name: 'Rina Susanti',
    role: 'Office Manager, PT Maju Bersama',
    text: 'Layanan catering sangat profesional. Menu selalu bervariasi dan rasa tidak pernah mengecewakan. Sangat cocok untuk meeting harian kantor kami.',
    avatar: 'RS'
  },
  {
    name: 'Budi Hartono',
    role: 'Event Coordinator, IndoCorp',
    text: 'Sistem pemesanan yang mudah dan pengiriman selalu tepat waktu. Tim catering sangat responsif terhadap permintaan kami.',
    avatar: 'BH'
  },
  {
    name: 'Siti Nurhaliza',
    role: 'HR Manager, Global Tech',
    text: 'Kami sudah menggunakan layanan ini selama 6 bulan dan hasilnya sangat memuaskan. Karyawan kami juga senang dengan pilihan menunya.',
    avatar: 'SN'
  }
]

export default async function HomePage () {
  const [user, packages] = await Promise.all([
    getCurrentUser(),
    getPublicPackages()
  ])

  return (
    <main
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: '#1a1a2e',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .btn-primary {
          background: linear-gradient(135deg, #f5a623 0%, #f7b733 100%);
          color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 600;
          font-size: 15px; border: none; cursor: pointer; transition: all 0.3s ease;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 15px rgba(245,166,35,0.3);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(245,166,35,0.4); }
        .btn-secondary {
          background: transparent; color: #1a1a2e; padding: 14px 32px; border-radius: 8px;
          font-weight: 600; font-size: 15px; border: 2px solid #e0e0e0; cursor: pointer;
          transition: all 0.3s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-secondary:hover { border-color: #f5a623; color: #f5a623; }
        .btn-dark {
          background: #1a1a2e; color: #fff; padding: 14px 32px; border-radius: 8px;
          font-weight: 600; font-size: 15px; border: none; cursor: pointer;
          transition: all 0.3s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-dark:hover { background: #2d2d44; transform: translateY(-2px); }
        .btn-light {
          background: #fff; color: #1a1a2e; padding: 14px 32px; border-radius: 8px;
          font-weight: 600; font-size: 15px; border: 2px solid #f0f0f0; cursor: pointer;
          transition: all 0.3s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-light:hover { border-color: #f5a623; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .btn-white {
          background: #fff; color: #f5a623; padding: 14px 32px; border-radius: 8px;
          font-weight: 600; font-size: 15px; border: none; cursor: pointer;
          transition: all 0.3s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
        .btn-outline-white {
          background: transparent; color: #fff; padding: 14px 32px; border-radius: 8px;
          font-weight: 600; font-size: 15px; border: 2px solid rgba(255,255,255,0.3); cursor: pointer;
          transition: all 0.3s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-outline-white:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
        .section-title { font-size: 32px; font-weight: 800; color: #1a1a2e; margin-bottom: 16px; line-height: 1.2; }
        .section-subtitle { font-size: 16px; color: #6b7280; line-height: 1.7; max-width: 520px; }
        .feature-card {
          background: #fff; border-radius: 16px; padding: 32px 28px;
          border: 1px solid #f0f0f0; transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); border-color: #f5a623; }
        .feature-card .icon { font-size: 40px; margin-bottom: 20px; display: block; }
        .feature-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 10px; color: #1a1a2e; }
        .feature-card p { font-size: 14px; color: #6b7280; line-height: 1.7; }
        .testimonial-card {
          background: #fff; border-radius: 16px; padding: 28px 24px;
          border: 1px solid #f0f0f0; min-width: 340px; flex-shrink: 0;
        }
        .testimonial-card .text { font-size: 14px; color: #6b7280; line-height: 1.8; margin-bottom: 20px; font-style: italic; }
        .testimonial-card .author { display: flex; align-items: center; gap: 12px; }
        .testimonial-card .avatar {
          width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #f5a623, #f7b733);
          display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px;
        }
        .testimonial-card .author-info h4 { font-size: 14px; font-weight: 600; color: #1a1a2e; }
        .testimonial-card .author-info p { font-size: 12px; color: #9ca3af; }
        @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .scroll-track { animation: scrollLeft 30s linear infinite; }
        .scroll-track:hover { animation-play-state: paused; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeInUp 0.6s ease forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .float-anim { animation: float 3s ease-in-out infinite; }
      `}</style>

      <PublicHeader user={user} />

      {/* ===== HERO SECTION ===== */}
      <section
        style={{
          padding: '80px 0 100px',
          background: 'linear-gradient(180deg, #fefefe 0%, #fff 100%)'
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 60,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: '1 1 500px', maxWidth: 560 }}>
            <span
              style={{
                display: 'inline-block',
                background: '#fff3e0',
                color: '#f5a623',
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20
              }}
            >
              🍽️ Corporate Catering Management
            </span>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: '#1a1a2e',
                lineHeight: 1.15,
                marginBottom: 20
              }}
            >
              Catering profesional untuk{' '}
              <span style={{ color: '#f5a623', position: 'relative' }}>
                agenda bisnis
              </span>{' '}
              yang lebih rapi.
            </h1>
            <p
              style={{
                fontSize: 16,
                color: '#6b7280',
                lineHeight: 1.8,
                marginBottom: 36
              }}
            >
              Pilih paket, pantau status pemesanan, dan koordinasikan produksi
              sampai pengiriman dalam satu sistem. Kelola catering perusahaan
              Anda dengan mudah dan efisien.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: 40
              }}
            >
              <Link className='btn-primary' href='/paket'>
                Lihat Paket →
              </Link>
              <a
                className='btn-secondary'
                href='https://wa.me/6281234567890?text=Halo%20saya%20ingin%20bertanya%20tentang%20paket%20catering'
                target='_blank'
                rel='noopener noreferrer'
              >
                💬 Hubungi Kami
              </a>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex' }}>
                  {['#f5a623', '#f7b733', '#e8961e'].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: c,
                        border: '2px solid #fff',
                        marginLeft: i > 0 ? -10 : 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        color: '#fff',
                        fontWeight: 600
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p
                    style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}
                  >
                    500+ Perusahaan
                  </p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>
                    Sudah mempercayai kami
                  </p>
                </div>
              </div>
              <div style={{ width: 1, height: 40, background: '#e5e7eb' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>⭐</span>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}
                >
                  4.9/5
                </span>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>
                  dari 200+ review
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              flex: '1 1 400px',
              display: 'flex',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: '#f5a623',
                  opacity: 0.15
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 40,
                  left: -30,
                  width: 60,
                  height: 60,
                  borderRadius: 15,
                  background: '#1a1a2e',
                  opacity: 0.08
                }}
              />
              <img
                src={HERO_IMAGE}
                alt='Catering Food Illustration'
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 24,
                  position: 'relative',
                  zIndex: 1
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 30,
                  right: 30,
                  background: '#fff',
                  borderRadius: 16,
                  padding: '14px 20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
                className='float-anim'
              >
                <span style={{ fontSize: 24 }}>🍜</span>
                <div>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                    Pengiriman
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#1a1a2e',
                      margin: 0
                    }}
                  >
                    Tepat Waktu 99%
                  </p>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 30,
                  left: -10,
                  background: '#fff',
                  borderRadius: 16,
                  padding: '12px 18px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
                className='float-anim'
              >
                <span style={{ fontSize: 20 }}>✅</span>
                <div>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                    Pesanan
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#10b981',
                      margin: 0
                    }}
                  >
                    Berhasil Dikirim
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span
              style={{
                display: 'inline-block',
                background: '#fff3e0',
                color: '#f5a623',
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16
              }}
            >
              ✨ Fitur Unggulan
            </span>
            <h2 className='section-title' style={{ fontSize: 36 }}>
              Kenapa Memilih Layanan Kami?
            </h2>
            <p className='section-subtitle' style={{ margin: '0 auto' }}>
              Sistem catering online yang dirancang khusus untuk kebutuhan
              perusahaan modern dengan fitur lengkap dan kemudahan penggunaan.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 24
            }}
          >
            {FEATURES.map((f, i) => (
              <div className='feature-card' key={i}>
                <span className='icon'>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PACKAGES ===== */}
      <section style={{ padding: '100px 0', background: '#f8f9fc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 48,
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  background: '#fff3e0',
                  color: '#f5a623',
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 16
                }}
              >
                📦 Pilihan Paket
              </span>
              <h2 className='section-title' style={{ fontSize: 36 }}>
                Paket Terpopuler
              </h2>
              <p className='section-subtitle'>
                Pilih paket catering yang sesuai dengan kebutuhan acara Anda.
              </p>
            </div>
            <Link
              href='/paket'
              className='btn-secondary'
              style={{ flexShrink: 0 }}
            >
              Lihat Semua Paket →
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 24
            }}
          >
            {packages.slice(0, 3).map(paket => (
              <PackageCard
                isLoggedIn={Boolean(user)}
                key={paket.id}
                paket={paket}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span
              style={{
                display: 'inline-block',
                background: '#fff3e0',
                color: '#f5a623',
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16
              }}
            >
              💬 Testimoni
            </span>
            <h2 className='section-title' style={{ fontSize: 36 }}>
              Apa Kata Klien Kami?
            </h2>
            <p className='section-subtitle' style={{ margin: '0 auto' }}>
              Ribuan perusahaan telah mempercayakan kebutuhan catering mereka
              kepada kami.
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 24,
              overflow: 'hidden',
              paddingBottom: 20
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 24,
                animation: 'scrollLeft 25s linear infinite',
                width: 'max-content'
              }}
            >
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div className='testimonial-card' key={i}>
                  <p className='text'>"{t.text}"</p>
                  <div className='author'>
                    <div className='avatar'>{t.avatar}</div>
                    <div className='author-info'>
                      <h4>{t.name}</h4>
                      <p>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ padding: '0 0 80px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              background:
                'linear-gradient(135deg, #f5a623 0%, #e8941a 40%, #d4820f 100%)',
              borderRadius: 28,
              padding: '64px 52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 40,
              flexWrap: 'wrap',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative elements */}
            <div
              style={{
                position: 'absolute',
                top: -60,
                right: -60,
                width: 250,
                height: 250,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -40,
                left: 120,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 40,
                left: 300,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 60,
                right: 200,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 250,
                width: 60,
                height: 60,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.05)',
                transform: 'rotate(45deg)'
              }}
            />

            {/* Food decoration icons */}
            <div
              style={{
                position: 'absolute',
                top: 50,
                left: 60,
                fontSize: 30,
                opacity: 0.15
              }}
            >
              🍜
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 50,
                right: 80,
                fontSize: 28,
                opacity: 0.12
              }}
            >
              🍚
            </div>
            <div
              style={{
                position: 'absolute',
                top: 80,
                right: 350,
                fontSize: 24,
                opacity: 0.1
              }}
            ></div>

            <div style={{ position: 'relative', zIndex: 1, flex: '1 1 400px' }}>
              <p
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 12,
                  letterSpacing: 0.5
                }}
              >
                🎯 Butuh paket custom untuk acara besar?
              </p>
              <h2
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.3,
                  marginBottom: 14
                }}
              >
                Konsultasikan kebutuhan acara dan lanjutkan pemesanan dalam satu
                alur.
              </h2>
              <p
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 16,
                  lineHeight: 1.8,
                  maxWidth: 480
                }}
              >
                Tim kami siap membantu Anda merancang menu dan paket catering
                yang sempurna untuk setiap momen. Mulai dari meeting kecil
                hingga acara perusahaan besar.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                position: 'relative',
                zIndex: 1,
                flexShrink: 0,
                alignItems: 'center'
              }}
            >
              <a
                className='btn-white'
                href='https://wa.me/6281234567890?text=Halo%20saya%20ingin%20konsultasi%20paket%20catering'
                target='_blank'
                rel='noopener noreferrer'
              >
                Hubungi WhatsApp
              </a>
              <Link className='btn-outline-white' href='/paket'>
                Pilih Paket →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          background: '#ffffff',
          padding: '60px 0 30px',
          borderTop: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 40,
              marginBottom: 48
            }}
          >
            {/* Brand */}
            <div style={{ gridColumn: 'span 1' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 16
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #f5a623, #f7b733)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ fontSize: 18 }}>🍽️</span>
                </div>

                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#111827'
                  }}
                >
                  JAJANIN
                </span>
              </div>

              <p
                style={{
                  fontSize: 14,
                  color: '#6b7280',
                  lineHeight: 1.7,
                  marginBottom: 20
                }}
              >
                Solusi catering profesional untuk kebutuhan perusahaan Anda.
                Mudah, cepat, dan terpercaya.
              </p>

              <div style={{ display: 'flex', gap: 12 }}>
                {['𝕏', '📘', '', '💼'].map((icon, i) => (
                  <a
                    key={i}
                    href='#'
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: '#f3f4f6',
                      color: '#111827',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      textDecoration: 'none',
                      transition: 'all 0.3s'
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column */}
            {[
              {
                title: 'Produk',
                items: [
                  { label: 'Semua Paket', href: '/paket' },
                  { label: 'Paket Custom', href: '/paket#custom' },
                  { label: 'Menu Harian', href: '/menu' },
                  { label: 'Promo', href: '/promo' }
                ]
              },
              {
                title: 'Perusahaan',
                items: [
                  { label: 'Tentang Kami', href: '/about' },
                  { label: 'Karir', href: '/karir' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Hubungi Kami', href: '/contact' }
                ]
              },
              {
                title: 'Bantuan',
                items: [
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Kebijakan Privasi', href: '/privacy' },
                  { label: 'Syarat & Ketentuan', href: '/terms' },
                  { label: 'Pusat Bantuan', href: '/help' }
                ]
              }
            ].map(section => (
              <div key={section.title}>
                <h4
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: 20
                  }}
                >
                  {section.title}
                </h4>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {section.items.map(item => (
                    <li key={item.href} style={{ marginBottom: 12 }}>
                      <Link
                        href={item.href}
                        style={{
                          fontSize: 14,
                          color: '#6b7280',
                          textDecoration: 'none',
                          transition: 'color 0.3s'
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div
            style={{
              borderTop: '1px solid rgba(0,0,0,0.06)',
              paddingTop: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: '#6b7280'
              }}
            >
              © 2026 Catering Online. All rights reserved.
            </p>

            <div style={{ display: 'flex', gap: 24 }}>
              <Link
                href='/privacy'
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  textDecoration: 'none'
                }}
              >
                Privacy
              </Link>

              <Link
                href='/terms'
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  textDecoration: 'none'
                }}
              >
                Terms
              </Link>

              <Link
                href='/sitemap'
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  textDecoration: 'none'
                }}
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
