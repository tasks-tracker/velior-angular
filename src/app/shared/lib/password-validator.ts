import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Кастомный валидатор пароля
 * Проверяет наличие:
 * - минимум одной строчной буквы (a-z)
 * - минимум одной заглавной буквы (A-Z)
 * - минимум одной цифры (0-9)
 * - минимум одного специального символа (@$!%*?&)
 *
 * Соответствует требованиям: Password must contain at least one lowercase letter,
 * one uppercase letter, one digit, and one special character (@$!%*?&)
 */
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Если значение пустое, не проверяем (required валидатор обработает)
    if (!control.value || control.value === '') {
      return null;
    }

    const value = String(control.value).trim();
    const errors: ValidationErrors = {};

    // Проверка на строчную букву (a-z)
    if (!/[a-z]/.test(value)) {
      errors['passwordLowercase'] = {
        message: 'Password must contain at least one lowercase letter',
      };
    }

    // Проверка на заглавную букву (A-Z)
    if (!/[A-Z]/.test(value)) {
      errors['passwordUppercase'] = {
        message: 'Password must contain at least one uppercase letter',
      };
    }

    // Проверка на цифру (0-9)
    if (!/[0-9]/.test(value)) {
      errors['passwordDigit'] = {
        message: 'Password must contain at least one digit',
      };
    }

    // Проверка на специальный символ (@$!%*?&)
    if (!/[@$!%*?&]/.test(value)) {
      errors['passwordSpecial'] = {
        message: 'Password must contain at least one special character (@$!%*?&)',
      };
    }

    // Возвращаем ошибки только если они есть
    return Object.keys(errors).length > 0 ? errors : null;
  };
}
