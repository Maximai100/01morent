import { useState, useCallback } from "react";

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [field: string]: ValidationRule;
}

export interface ValidationErrors {
  [field: string]: string;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((field: string, value: string): string | null => {
    const rule = rules[field];
    if (!rule) return null;

    if (rule.required && !value.trim()) {
      return "Это поле обязательно для заполнения";
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `Минимальная длина: ${rule.minLength} символов`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `Максимальная длина: ${rule.maxLength} символов`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return "Неверный формат";
    }

    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((formData: Record<string, string>): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const error = validateField(field, formData[field] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const validateAndClearError = useCallback((field: string, value: string) => {
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      clearError(field);
    }
  }, [validateField, clearError]);

  return {
    errors,
    validateForm,
    validateField,
    clearError,
    validateAndClearError,
    hasErrors: Object.keys(errors).length > 0
  };
};

export const validationRules = {
  guestName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/
  },
  apartmentNumber: {
    required: true,
    pattern: /^\d+$/
  },
  checkIn: {
    required: true,
    custom: (value: string) => {
      const datePattern = /^\d{2}\.\d{2}\.\d{4}\s+в\s+\d{2}:\d{2}$/;
      if (!datePattern.test(value)) {
        return "Формат: ДД.ММ.ГГГГ в ЧЧ:ММ";
      }
      return null;
    }
  },
  checkOut: {
    required: true,
    custom: (value: string) => {
      const datePattern = /^\d{2}\.\d{2}\.\d{4}\s+в\s+\d{2}:\d{2}$/;
      if (!datePattern.test(value)) {
        return "Формат: ДД.ММ.ГГГГ в ЧЧ:ММ";
      }
      return null;
    }
  },
  entranceCode: {
    required: true,
    minLength: 1
  },
  electronicLockCode: {
    required: true,
    pattern: /^\d+$/
  },
  wifiPassword: {
    required: true,
    minLength: 3
  }
} as ValidationRules;