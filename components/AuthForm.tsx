"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"


const authFormShecma = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),  //no need in signin
    email: z.string().email(),
    password: z.string().min(3)
  })
}

const AuthForm = ({ type }: { type: FormType }) => {

  const formSchema = authFormShecma(type)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // signing up
      // this will generate a token sent to the server side
      if (type === "sign-up") {

        const { name, email, password } = values

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password

        })

        if (!result?.success) {
          toast.error(result?.message)
          return
        }
        // or else success
        toast.success("Account Created Successfully! 🎉 Please Sign In to your Account.")
        router.push("/sign-in")
      } else {

        const { email, password } = values

        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        // to get the id token
        const idToken = await userCredential.user.getIdToken()

        if (!idToken) {
          toast.error(`Sign In Failed!`)
          return
        }

        // then make it to be signed in
        await signIn({
          email, idToken
        })


        toast.success("Signed In Successfully! 🎉")
        router.push("/")
      }

    } catch (error) {
      console.log(error)
      toast.error(`There was an error : ${error}`)
    }
  }

  const isSignIn = type === "sign-in"

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src={"/logo.svg"} alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">TactIQ</h2>
        </div>


        <h3>Your AI Coach for Job-Winning Interviews</h3>


        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full  mt-4 form">


            {!isSignIn && (
              <FormField
                control={form.control}
                name={"name"}
                label="Name"
                placeholder=" Enter Your Name"
              />
            )}
            <FormField
              control={form.control}
              name={"email"}
              label="Email"
              placeholder="Enter Your Email"
              type="email"
            />
            <FormField
              control={form.control}
              name={"password"}
              label="Password"
              placeholder="Enter Your Password"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>


          </form>
        </Form>


        <p className="text-center">
          {isSignIn ? "No Account yet?" : "Have an account already?"}
          <Link href={!isSignIn ? "/sign-in" : "/sign-up"} className="font-bold text-user-primary ml-1">
            {!isSignIn ? "Sign In" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm