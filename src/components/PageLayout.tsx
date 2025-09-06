// src/components/PageLayout.tsx
import { Shield } from "lucide-react";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        {children}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Tamil Nadu Police • Advanced Crime Analytics Platform
          </p>
        </div>
      </div>
    </div>
  );
}