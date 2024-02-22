import { useState } from 'react'
import { z, ZodType } from "zod";
import { get, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import './App.css'

function App() {
  const schema = z
  .object({
    firstName: z.string().min(2).max(30),
    lastName: z.string().min(2).max(30),
    email: z.string().email(),
    age: z.number().min(18).max(70),
    password: z.string().max(20),
    confirmPassword: z.string().max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
  });

  const warnSchema = z
  .object({
    firstName: z.string().startsWith("a", "first letter better be a"),
    lastName: z.string().startsWith("b"),
    password: z.string().min(8, "please choose stronger password"),
  })




  const { register, handleSubmit, formState: { errors,isSubmitted }, watch,  } = useForm({resolver: zodResolver(schema)});

  let warnings = {};

  if (isSubmitted) {
    try {
      warnSchema.parse(watch())
    } catch (error) {
      error.issues.forEach((error)=>{
        warnings[error.path[0]] = {
          message: error.message
        };
      })
    }
  }
  

  const submitData = (data) => {
    console.log("IT WORKED", data);
  };

  return (
    <div className='app'>
      <form className='form' onSubmit={handleSubmit(submitData)}>
        <label> First Name: </label>
        <input type="text" {...register("firstName")} />
        {errors.firstName && <span className='error'> {errors.firstName.message}</span>}
        {warnings.firstName && <span className='warning'> {warnings.firstName.message}</span>}
        <label> Last Name: </label>
        <input type="text" {...register("lastName")} />
        {errors.lastName && <span className='error'> {errors.lastName.message}</span>}
        {warnings.lastName && <span className='warning'> {warnings.lastName.message}</span>}
        <label> Email: </label>
        <input type="email" {...register("email")} />
        {errors.email && <span className='error'> {errors.email.message}</span>}
        <label> Age </label>
        <input type="number" {...register("age", { valueAsNumber: true })} />
        {errors.age && <span className='error'> {errors.age.message}</span>}
        <label> Password: </label>
        <input type="password" {...register("password")} />
        {errors.password && <span className='error'> {errors.password.message}</span>}
        {warnings.password && <span className='warning'> {warnings.password.message}</span>}
        <label> Confirm Password: </label>
        <input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <span className='error'> {errors.confirmPassword.message}</span>
        )}
        

        <input type="submit" />
      </form>
    </div>
  )
}

export default App;