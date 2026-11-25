export interface ApiErrorField {
  field: string
  message: string
}

export interface ApiSuccessResponse<T> {
  success: true
  message?: string
  data: T
}

export interface ApiMessageResponse {
  success: true
  message: string
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: ApiErrorField[]
}
