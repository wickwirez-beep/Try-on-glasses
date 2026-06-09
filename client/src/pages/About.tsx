import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { Link } from "wouter";

const APP_VERSION = "1.2.0";
const BUILD_NUMBER = 12;

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navigation */}
      <nav className="border-b border-blue-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              The Look
            </h1>
          </div>
          <Button variant="outline" size="sm" asChild className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">About The Look</h2>
          <p className="text-lg text-blue-700">
            Your premium virtual glasses try-on experience
          </p>
        </div>

        {/* About Section */}
        <Card className="p-8 mb-8 border-blue-200 bg-white shadow-lg">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">What is The Look?</h3>
          <p className="text-blue-800 text-lg leading-relaxed mb-4">
            The Look is a cutting-edge virtual glasses try-on application that uses advanced face detection technology to help you discover your perfect eyewear style. Upload your photo, browse our extensive collection of premium frames, and see exactly how they look on you in real-time.
          </p>
          <p className="text-blue-800 text-lg leading-relaxed">
            Whether you're looking for a classic aviator, trendy cat-eye, or sophisticated round frames, The Look makes it easy to explore styles, colors, and designs without leaving your home.
          </p>
        </Card>

        {/* Creator Section */}
        <Card className="p-8 mb-8 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Created by Harlan Cowan</h3>
              <p className="text-blue-800 text-lg mb-3">
                Crafted with passion and precision to deliver the ultimate virtual try-on experience.
              </p>
              <p className="text-blue-700">
                The Look combines cutting-edge AI technology with elegant design to make finding your perfect glasses fun, easy, and accurate.
              </p>
            </div>
          </div>
        </Card>

        {/* Version & Build Info */}
        <Card className="p-8 mb-8 border-blue-200 bg-white shadow-lg">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Version Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-blue-600 pl-6">
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-1">Version</p>
              <p className="text-4xl font-bold text-blue-900">{APP_VERSION}</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-6">
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-1">Build Number</p>
              <p className="text-4xl font-bold text-blue-900">{BUILD_NUMBER}</p>
            </div>
          </div>
          <p className="text-blue-700 text-sm mt-6 pt-6 border-t border-blue-200">
            Each update brings new features, improvements, and refinements. Build numbers increment with every release to track our continuous development.
          </p>
        </Card>

        {/* Features Section */}
        <Card className="p-8 mb-8 border-blue-200 bg-white shadow-lg">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Advanced Face Detection</h4>
                <p className="text-blue-700 text-sm">AI-powered facial recognition for accurate glasses positioning</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Extensive Frame Library</h4>
                <p className="text-blue-700 text-sm">Hundreds of premium styles in multiple colors and designs</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Real-Time Preview</h4>
                <p className="text-blue-700 text-sm">Instantly see how frames look from different angles</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Save & Share</h4>
                <p className="text-blue-700 text-sm">Download results and share your favorite looks</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Smart Filtering</h4>
                <p className="text-blue-700 text-sm">Filter by style, color, and lens tint to find your perfect match</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Favorites System</h4>
                <p className="text-blue-700 text-sm">Save your favorite frames for easy access later</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Technology Section */}
        <Card className="p-8 mb-8 border-blue-200 bg-white shadow-lg">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Technology Stack</h3>
          <p className="text-blue-800 mb-4">
            The Look is built with modern, cutting-edge technologies to ensure the best performance and user experience:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-1">Frontend</p>
              <p className="text-blue-700 text-sm">React 19, TypeScript, Tailwind CSS</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-1">Backend</p>
              <p className="text-blue-700 text-sm">Express, tRPC, Node.js</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-1">AI/ML</p>
              <p className="text-blue-700 text-sm">MediaPipe Face Landmarker</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-1">Database</p>
              <p className="text-blue-700 text-sm">MySQL with Drizzle ORM</p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg">
            <Link href="/try-on">Try The Look Now</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-200 bg-white/50 backdrop-blur-sm mt-20">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-blue-700 text-sm mb-2">
            © 2026 The Look. All rights reserved.
          </p>
          <p className="text-blue-600 text-xs">
            Created by Harlan Cowan | Version {APP_VERSION} | Build {BUILD_NUMBER}
          </p>
        </div>
      </footer>
    </div>
  );
}
