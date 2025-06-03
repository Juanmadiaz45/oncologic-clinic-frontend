import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import authService from '@/services/auth/authService';
import { LoginRequest } from '@/types';
import { ROUTES, MESSAGES } from '@/constants';
import { AxiosError } from 'axios';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  if (authService.isAuthenticated()) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.login(formData);
      window.location.href = ROUTES.DASHBOARD;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || MESSAGES.ERROR.LOGIN);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      {/* Contenedor principal responsive */}
      <div className="w-full max-w-md mx-auto">
        {/* Tarjeta de login con mejor espaciado */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Logo y título */}
          <div className="px-6 py-6 text-center">
            <img
              src="../../../oncologic-logo-without-background.png"
              alt="Clínica OncoLogic Logo"
              className="mx-auto h-20 w-auto"
            />
            <h3 className="mt-4 text-2xl font-semibold text-blue-600">
              ¡Bienvenido!
            </h3>
          </div>

          {/* Formulario con mejor espaciado */}
          <form className="px-6 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Campos del formulario */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                  placeholder="Ingrese su nombre de usuario"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                    placeholder="Ingrese su contraseña"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Botón de submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.username.trim() ||
                  !formData.password.trim()
                }
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </div>

            {/* Enlace olvidé contraseña */}
            <div className="text-center pt-2">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors duration-200"
                onClick={() => alert('Funcionalidad próximamente disponible')}
              >
                ¿Olvidó su contraseña?
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 text-center text-xs text-gray-500">
            <p>© 2025 Clínica OncoLogic. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
