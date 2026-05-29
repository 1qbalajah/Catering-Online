'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { logoutAction } from '@/actions/auth'
import type { AppUser } from '@/types'

type PublicHeaderProps = {
  user: AppUser | null
}

export default function PublicHeader({ user }: PublicHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const profileHref = user?.role === 'user' ? '/profile' : '/dashboard'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .modern-header {
          position: fixed;
          top: 12px;
          left: 16px;
          right: 16px;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 4px 20px rgba(245, 166, 35, 0.1), 0 1px 2px rgba(245, 166, 35, 0.06);
          border-radius: 18px;
        }
        .modern-header.scrolled {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 1px 20px rgba(245, 166, 35, 0.1);
        }
        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f5a623 0%, #f7b733 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 2px 10px rgba(245, 166, 35, 0.25);
          transition: transform 0.3s ease;
        }
        .brand-link:hover .brand-icon {
          transform: scale(1.05) rotate(-3deg);
        }
        .brand-text {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a2e;
          letter-spacing: -0.5px;
        }
        .brand-text span {
          color: #f5a623;
        }
        .right-section {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .nav-link {
          position: relative;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: #1a1a2e;
          background: rgba(0, 0, 0, 0.04);
        }
        .nav-link.active {
          color: #1a1a2e;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.05);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 20px;
          height: 2px;
          background: #f5a623;
          border-radius: 2px;
          transition: transform 0.25s ease;
        }
        .nav-link:hover::after,
        .nav-link.active::after {
          transform: translateX(-50%) scaleX(1);
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 8px;
          padding-left: 16px;
          position: relative;
        }
        .user-section::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 24px;
          background: rgba(0, 0, 0, 0.08);
        }
        .avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5a623, #f7b733);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(245, 166, 35, 0.2);
        }
        .avatar-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.35);
        }
        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a2e;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 10px;
          transition: background 0.25s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          user-select: none;
          background: none;
          border: none;
        }
        .user-name:hover {
          background: rgba(0, 0, 0, 0.04);
        }
        .dropdown-chevron {
          display: inline-block;
          width: 16px;
          height: 16px;
          transition: transform 0.25s ease;
        }
        .dropdown-chevron.open {
          transform: rotate(180deg);
        }
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(245, 166, 35, 0.12);
          padding: 10px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px) scale(0.96);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 20;
        }
        .profile-dropdown.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        .dropdown-header {
          padding: 14px 12px 12px;
          margin-bottom: 6px;
          border-bottom: 1px solid #f0f0f0;
        }
        .dropdown-header .dh-name {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a2e;
        }
        .dropdown-header .dh-email {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 2px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: #4b5563;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
          font-family: inherit;
        }
        .dropdown-item:hover {
          background: #f8f9fc;
          color: #1a1a2e;
        }
        .mobile-menu-item.danger {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          border-radius: 12px;
          padding: 12px 14px;
          transition: all 0.25s ease;
        }
        .mobile-menu-item.danger:hover {
          background: rgba(239, 68, 68, 0.14);
          border-color: rgba(239, 68, 68, 0.25);
          transform: translateY(-1px);
        }
        .mobile-menu-item.danger .mobile-icon-svg {
          width: 18px;
          height: 18px;
          object-fit: contain;
          opacity: 0.9;
        }
        .dropdown-item-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
          color: #9ca3af;
        }
        .login-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 22px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          background: transparent;
          border: none;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.25s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .login-btn:hover {
          color: #1a1a2e;
          background: rgba(0, 0, 0, 0.04);
        }
        .signup-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 22px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #f5a623 0%, #f7b733 100%);
          border: none;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.25s ease;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 2px 10px rgba(245, 166, 35, 0.3);
        }
        .signup-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(245, 166, 35, 0.4);
        }
        .mobile-toggle {
          display: none;
          width: 44px;
          height: 44px;
          border: none;
          background: rgba(0,0,0,0.04);
          border-radius: 12px;
          cursor: pointer;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        .mobile-toggle span {
          display: block;
          width: 20px;
          height: 2px;
          background: #1a1a2e;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .mobile-toggle.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .mobile-toggle.open span:nth-child(2) {
          opacity: 0;
        }
        .mobile-toggle.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          font-size: 16px;
          font-weight: 500;
          color: #4b5563;
          text-decoration: none;
          border-radius: 14px;
          transition: all 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          font-family: inherit;
          gap: 10px;
        }
        .mobile-icon-svg {
          width: 18px;
          height: 18px;
          object-fit: contain;
        }
        .mobile-menu-item:hover,
        .mobile-menu-item.active {
          background: #f8f9fc;
          color: #1a1a2e;
        }
        .mobile-menu-item.danger {
          color: #ef4444;
        }
        .mobile-menu-item.danger:hover {
          background: #fef2f2;
        }
        .mobile-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          color: #9ca3af;
          flex-shrink: 0;
          transition: color 0.2s ease;
        }
        .mobile-menu-item:hover .mobile-icon,
        .mobile-menu-item.active .mobile-icon {
          color: #6b7280;
        }
        .mobile-menu-item.danger .mobile-icon {
          color: #fca5a5;
        }
        .mobile-menu-item.danger:hover .mobile-icon {
          color: #ef4444;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          z-index: 999;
          padding: 24px;
          overflow-y: auto;
        }
        .mobile-menu.open {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mobile-menu a {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          font-size: 16px;
          font-weight: 500;
          color: #4b5563;
          text-decoration: none;
          border-radius: 14px;
          transition: all 0.2s ease;
        }
        .mobile-menu a:hover,
        .mobile-menu a.active {
          background: #f8f9fc;
          color: #1a1a2e;
        }
        .mobile-menu .mobile-divider {
          height: 1px;
          background: #f0f0f0;
          margin: 12px 0;
        }
        @media (max-width: 900px) {
          .nav-link {
            display: none;
          }
          .user-section {
            display: none;
          }
          .mobile-toggle {
            display: flex;
          }
          .header-inner {
            padding: 0 20px;
          }
          .brand-text {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .header-inner {
            padding: 0 12px;
          }
        }
        @media (min-width: 901px) {
          .user-name-desktop {
            display: inline !important;
          }
        }
      `}</style>

      <header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
        <div className='header-inner'>
          {/* Brand */}
          <Link className='brand-link' href='/'>
            <div className='brand-icon'>🍽️</div>
            <span className='brand-text'>
              JAJANIN<span>.</span>
            </span>
          </Link>

          {/* Right Section - Nav + User */}
          <div className='right-section'>
            {/* Navigation Links */}
            <Link className='nav-link' href='/'>
              Beranda
            </Link>
            <Link className='nav-link' href='/paket'>
              Menu
            </Link>
            {user ? (
              <Link className='nav-link' href='/profile/orders'>
                Pemesanan
              </Link>
            ) : (
              <Link className='nav-link' href='/tentang'>
                Tentang
              </Link>
            )}

            {/* User Section */}
            {user ? (
              <div className='user-section' ref={dropdownRef}>
                <button
                  className='user-name'
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup='true'
                  type='button'
                >
                  <div className='avatar-btn'>
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className='user-name-desktop'>{user.name}</span>
                  <svg
                    className={`dropdown-chevron ${dropdownOpen ? 'open' : ''}`}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='6 9 12 15 18 9' />
                  </svg>
                </button>

                <div
                  className={`profile-dropdown ${dropdownOpen ? 'open' : ''}`}
                >
                  <div className='dropdown-header'>
                    <div className='dh-name'>{user.name}</div>
                    <div className='dh-email'>{user.email}</div>
                  </div>

                  <Link
                    href={profileHref}
                    className='mobile-menu-item'
                    onClick={() => setMobileOpen(false)}
                  >
                    <img
                      src='https://cdn.jsdelivr.net/npm/remixicon@4.9.1/icons/User%20%26%20Faces/user-line.svg'
                      alt='Profile'
                      className='mobile-icon-svg'
                    />
                    {user.role === 'user' ? 'Profile' : 'Dashboard'}
                  </Link>

                  <Link className='mobile-menu-item' href='/profile/orders'>
                    <img
                      src='https://cdn.jsdelivr.net/npm/remixicon@4.9.1/icons/Finance/shopping-basket-line.svg'
                      alt='Pemesanan'
                      className='mobile-icon-svg'
                    />
                    Pemesanan Saya
                  </Link>

                  <div
                    style={{
                      height: 1,
                      background: '#f0f0f0',
                      margin: '4px 10px'
                    }}
                  />

                  <form action={logoutAction} style={{ padding: '4px 10px' }}>
                    <button className='mobile-menu-item danger' type='submit'>
                      <img
                        src='https://cdn.jsdelivr.net/npm/remixicon@4.9.1/icons/System/logout-box-line.svg'
                        alt='Keluar'
                        className='mobile-icon-svg'
                      />
                      Keluar
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className='user-section' style={{ gap: 4 }}>
                <Link className='login-btn' href='/login'>
                  Masuk
                </Link>
                <Link className='signup-btn' href='/register'>
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              className={`mobile-toggle ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label='Toggle menu'
              type='button'
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className='mobile-menu open'>
            <Link
              href='/'
              className='active'
              onClick={() => setMobileOpen(false)}
            >
              <span>🏠</span> Beranda
            </Link>
            <Link href='/paket' onClick={() => setMobileOpen(false)}>
              <span>🍱</span> Paket
            </Link>
            <Link href='/menu' onClick={() => setMobileOpen(false)}>
              <span>📋</span> Menu
            </Link>
            {!user && (
              <Link href='/tentang' onClick={() => setMobileOpen(false)}>
                <span>ℹ️</span> Tentang
              </Link>
            )}
            {user && (
              <>
                <div className='mobile-divider' />

                <Link
                  href={profileHref}
                  className='mobile-menu-item'
                  onClick={() => setMobileOpen(false)}
                >
                  <span className='mobile-icon'>
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                      <circle cx='12' cy='7' r='4' />
                    </svg>
                  </span>
                  {user.role === 'user' ? 'Profile' : 'Dashboard'}
                </Link>

                <Link
                  href='/profile/orders'
                  className='mobile-menu-item'
                  onClick={() => setMobileOpen(false)}
                >
                  <span className='mobile-icon'>
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
                      <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
                      <line x1='12' y1='22.08' x2='12' y2='12' />
                    </svg>
                  </span>
                  Pemesanan Saya
                </Link>

                <div className='mobile-divider' />

                <form action={logoutAction}>
                  <button
                    className='mobile-menu-item danger'
                    type='submit'
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '16px 20px',
                      fontSize: 16,
                      background: 'none',
                      border: 'none',
                      borderRadius: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      color: '#ef4444'
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className='mobile-icon'>
                      <svg
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                        <polyline points='16 17 21 12 16 7' />
                        <line x1='21' y1='12' x2='9' y2='12' />
                      </svg>
                    </span>
                    Keluar
                  </button>
                </form>
              </>
            )}
            {!user && (
              <>
                <div className='mobile-divider' />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    padding: '8px 0'
                  }}
                >
                  <Link
                    className='login-btn'
                    href='/login'
                    style={{
                      justifyContent: 'center',
                      border: '1px solid #e5e7eb',
                      color: '#6b7280'
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    className='signup-btn'
                    href='/register'
                    style={{ justifyContent: 'center' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Spacer to prevent content hiding behind fixed header */}
      <div style={{ height: 72 }} />
    </>
  )
}
