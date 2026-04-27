import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Lock, Mail, Eye, EyeOff, Shield, Users, BarChart3 } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useStore();
  const [email, setEmail] = useState('ahmet.yilmaz@meroddi.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Geçersiz e-posta veya şifre');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-xl text-slate-900">
              M
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Meroddi StaffOS</h1>
              <p className="text-sm text-slate-400">Operasyon Yönetim Platformu</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Otel ve restoran<br />
            operasyonlarınızı<br />
            <span className="text-amber-400">akıllıca yönetin.</span>
          </h2>
          
          <p className="text-slate-400 text-lg mb-12 max-w-md">
            Departmanlar, lokasyonlar, iş takibi, vardiya yönetimi ve daha fazlası — tek bir platformda.
          </p>

          <div className="space-y-4">
            {[
              { icon: <Shield size={20} />, title: 'Rol & Scope Bazlı Yetki', desc: 'Her kullanıcı sadece yetkili olduğu veriyi görür' },
              { icon: <Users size={20} />, title: 'Metadata-Driven Yapı', desc: 'Departmanlar ve formlar kodlanmaz, konfigüre edilir' },
              { icon: <BarChart3 size={20} />, title: 'AI Destekli Analiz', desc: 'Operasyonel verilerinizden akıllı öneriler' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-slate-700/50 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-white font-medium">{feature.title}</p>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-lg text-slate-900">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Meroddi StaffOS</h1>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Hoş Geldiniz</h2>
            <p className="text-gray-500 mt-1">Hesabınıza giriş yaparak devam edin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all"
                  placeholder="ornek@meroddi.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500" defaultChecked />
                <span className="text-sm text-gray-600">Beni hatırla</span>
              </label>
              <button type="button" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                Şifremi unuttum
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-medium">Demo Bilgileri:</p>
            <p className="text-xs text-gray-500">E-posta: <span className="font-mono text-gray-700">ahmet.yilmaz@meroddi.com</span></p>
            <p className="text-xs text-gray-500">Şifre: <span className="font-mono text-gray-700">demo1234</span></p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2025 Meroddi Hotels & Restaurants. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
