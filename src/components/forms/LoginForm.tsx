// src/components/forms/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { LoginRequest } from '@/types';
import { ROUTES } from '@/constants';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAdmin, isDoctor } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(formData);

    if (success) {
      // Navigate based on role after successful login
      if (isAdmin || isDoctor) {
        navigate(ROUTES.DASHBOARD);
      } else {
        navigate(ROUTES.HOME);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = formData.username.trim() && formData.password.trim();

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && <Alert type="error" message={error} onClose={clearError} />}

      <div className="space-y-4">
        <Input
          name="username"
          type="text"
          label="Nombre de usuario"
          placeholder="Ingrese su nombre de usuario"
          autoComplete="username"
          value={formData.username}
          onChange={handleInputChange}
          disabled={isLoading}
          required
        />

        <Input
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={isLoading}
          required
          rightElement={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          }
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!isFormValid}
          isLoading={isLoading}
        >
          Iniciar sesión
        </Button>
      </div>

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
  );
};

export default LoginForm;
