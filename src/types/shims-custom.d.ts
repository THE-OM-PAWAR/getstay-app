// Minimal shims to satisfy TypeScript where upstream packages lack proper typings
declare module 'framer-motion' {
  import * as React from 'react'
  export type Variants = { [key: string]: any }
  export const motion: any
  export const AnimatePresence: React.ComponentType<any>
}

declare module 'react-hook-form' {
  import * as React from 'react'
  export type FieldValues = Record<string, any>
  export type FieldPath<T> = string
  export type ControllerProps<TFieldValues = FieldValues, TName = FieldPath<TFieldValues>> = any
  export function useForm<TFieldValues = FieldValues>(): any
  export function Controller(props: ControllerProps): any
  export const useController: any
  export const FormProvider: any
  export const useFormContext: any
  export const useFormState: any
}

declare module 'jose' {
  export const SignJWT: any
  export const jwtVerify: any
}
