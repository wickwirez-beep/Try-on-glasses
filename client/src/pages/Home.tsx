import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Glasses, Heart, Download, Zap, Moon, Sun } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navigation */}
      <nav className="border-b border-blue-300 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition">
              <Glasses className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black drop-shadow-sm" style={{
                WebkitTextStroke: '2px white',
                color: 'rgb(37, 99, 235)',
                textShadow: '0 0 0 2px rgba(147, 197, 253, 0.6), 0 0 0 4px rgba(191, 219, 254, 0.4)'
              }}>
                The Look
              </h1>
              <p className="text-xs font-semibold text-blue-600 -mt-1">Virtual Try-On</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </Button>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : isAuthenticated ? (
              <>
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">{user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout} className="border-blue-300 text-blue-600 hover:bg-blue-50 font-medium dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                  Logout
                </Button>
              </>
            ) : (
              <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 rounded-full shadow-md">
              <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-sm font-bold text-blue-700">✨ AI-Powered Virtual Try-On</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-6xl font-black leading-tight drop-shadow-sm">
                Find Your <span style={{
                  WebkitTextStroke: '2.5px white',
                  color: 'rgb(37, 99, 235)',
                  textShadow: '0 0 0 2px rgba(147, 197, 253, 0.6), 0 0 0 4px rgba(191, 219, 254, 0.4)'
                }}>Perfect Look</span>
              </h2>
              <p className="text-xl text-blue-800 font-semibold leading-relaxed">
                Upload your photo and instantly try on hundreds of premium glasses frames. See yourself in different styles, colors, and angles with our advanced face detection technology.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/try-on">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xl font-bold text-lg px-8 transform hover:scale-105 transition">
                  🎯 Get Started Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="border-2 border-blue-400 text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 transform hover:scale-105 transition">
                Learn More
              </Button>
            </div>

            <div className="flex gap-6 pt-4 text-sm font-semibold text-blue-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Real-time Face Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>500+ Frame Styles</span>
              </div>
            </div>
          </div>

          {/* Hero Image with Animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl opacity-15 blur-3xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-16 text-center shadow-2xl transform hover:scale-105 transition duration-300 border-2 border-blue-400">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              <div className="relative space-y-4">
                <Glasses className="w-32 h-32 text-white/90 mx-auto mb-6 drop-shadow-lg" />
                <p className="text-white text-2xl font-black drop-shadow-lg">Try-On Preview</p>
                <p className="text-blue-100 text-sm font-semibold">Upload • Select • Try • Download</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-24 bg-white/40 backdrop-blur-sm rounded-3xl my-12">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-black text-blue-900 mb-4 drop-shadow-sm">Premium Features</h3>
          <p className="text-blue-700 text-xl font-semibold">Everything you need to find your perfect glasses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="p-10 border-2 border-blue-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Glasses className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-2xl font-black text-blue-900 mb-3">Face Detection</h4>
            <p className="text-blue-700 font-semibold leading-relaxed">
              Advanced AI detects your facial features with precision for perfectly positioned glasses.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="p-10 border-2 border-blue-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-2xl font-black text-blue-900 mb-3">Huge Selection</h4>
            <p className="text-blue-700 font-semibold leading-relaxed">
              Browse hundreds of premium frames in different styles, colors, and lens tints.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="p-10 border-2 border-blue-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Download className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-2xl font-black text-blue-900 mb-3">Save & Share</h4>
            <p className="text-blue-700 font-semibold leading-relaxed">
              Download your results and share your favorite looks with friends instantly.
            </p>
          </Card>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-2xl p-8 text-center shadow-md">
            <div className="text-4xl font-black text-blue-600 mb-2">500+</div>
            <p className="text-blue-900 font-bold">Frame Styles</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-2xl p-8 text-center shadow-md">
            <div className="text-4xl font-black text-blue-600 mb-2">360°</div>
            <p className="text-blue-900 font-bold">Rotation View</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-2xl p-8 text-center shadow-md">
            <div className="text-4xl font-black text-blue-600 mb-2">AI</div>
            <p className="text-blue-900 font-bold">Face Detection</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-3xl p-16 text-center shadow-2xl border-2 border-blue-400 transform hover:scale-102 transition">
          <h3 className="text-4xl font-black text-white mb-6 drop-shadow-lg">Ready to Find Your Perfect Look?</h3>
          <p className="text-blue-50 text-xl font-semibold mb-8 max-w-2xl mx-auto">
            Start your virtual try-on experience today and discover your perfect style in seconds.
          </p>
          <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50 font-black text-lg shadow-xl px-12 py-6 transform hover:scale-110 transition">
            <Link href="/try-on">🎯 Try On Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-blue-300 bg-white/60 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
              <Glasses className="w-4 h-4 text-white" />
            </div>
            <p className="text-blue-900 font-black text-lg">The Look</p>
          </div>
          <p className="text-blue-700 font-semibold">
            © 2026 The Look. Find your perfect glasses online.
          </p>
        </div>
      </footer>
    </div>
  );
}
