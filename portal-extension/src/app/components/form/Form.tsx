import React, { ReactNode } from 'react'
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form'

type FormProps = {
  methods: UseFormReturn<FieldValues, object>
  children: ReactNode
  onSubmit: () => unknown
}
export const Form = ({ methods, children, onSubmit }: FormProps) => (
  <FormProvider {...methods}>
    <form onSubmit={onSubmit}> {children}</form>
  </FormProvider>
)
