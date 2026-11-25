import axios from 'axios'
import type { ApiErrorField } from '@/types/api'

const STATUS_MESSAGES: Record<number, string> = {
  400: 'The request could not be processed. Please check the submitted data.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This action conflicts with existing data.',
  422: 'The submitted data is invalid.',
  429: 'Too many requests. Please try again shortly.',
  500: 'Something went wrong on the server. Please try again.',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseFieldErrors(value: unknown): ApiErrorField[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return []
    }

    const field = typeof item.field === 'string' ? item.field : ''
    const message = typeof item.message === 'string' ? item.message : ''

    return message ? [{ field, message }] : []
  })
}

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: ApiErrorField[]

  constructor(
    message: string,
    status = 0,
    fieldErrors: ApiErrorField[] = [],
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0
    const payload: unknown = error.response?.data
    const body = isRecord(payload) ? payload : null

    const serverMessage =
      body && typeof body.message === 'string' ? body.message.trim() : ''

    const fallbackMessage =
      status === 0
        ? 'Unable to reach the server. Please check your connection and try again.'
        : (STATUS_MESSAGES[status] ??
          'Something went wrong. Please try again.')

    return new ApiError(
      serverMessage || fallbackMessage,
      status,
      parseFieldErrors(body?.errors),
    )
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError('Something went wrong. Please try again.')
}
