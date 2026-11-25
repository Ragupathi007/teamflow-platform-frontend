import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { toApiError, type ApiError } from './api-error'

export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): ApiError {
  const apiError = toApiError(error)

  for (const fieldError of apiError.fieldErrors) {
    if (!fieldError.field) {
      continue
    }

    setError(fieldError.field as Path<T>, {
      type: 'server',
      message: fieldError.message,
    })
  }

  return apiError
}
