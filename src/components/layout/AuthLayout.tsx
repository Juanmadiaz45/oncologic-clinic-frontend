import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = '¡Bienvenido!',
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="px-6 py-6 text-center">
            <img
              src="../../../oncologic-logo-without-background.png"
              alt="Clínica OncoLogic Logo"
              className="mx-auto h-20 w-auto"
            />
            <h3 className="mt-4 text-2xl font-semibold text-blue-600">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          <div className="px-6">{children}</div>

          {/* Footer */}
          <div className="px-6 py-4 text-center text-xs text-gray-500">
            <p>© 2025 Clínica OncoLogic. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
