"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[A-Za-z\s]+$/, "First name must contain only letters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[A-Za-z\s]+$/, "Last name must contain only letters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  address: z.string().min(1, "Address is required"),
  role: z.enum(["customer", "service_provider"]),

  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: "customer" },
  });

  const role = watch("role");

  const onSubmit = async (values: FormValues) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/sign-in");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center mt-20 p-4 sm:p-8">
      <div className="w-full max-w-lg rounded-lg bg-gray-900 p-6 sm:p-10 shadow-md">
        <h1 className="mb-6 text-center text-2xl sm:text-3xl font-bold text-orange-500">
          Create an Account
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-800 bg-opacity-50 p-4 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              First Name
            </label>
            <input
              {...register("firstName")}
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Last Name
            </label>
            <input
              {...register("lastName")}
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm">{errors.lastName.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Phone
            </label>
            <input
              {...register("phone")}
              type="tel"
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Address
            </label>
            <input
              {...register("address")}
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
            {errors.address && (
              <p className="text-red-400 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Role
            </label>
            <Select
              value={role}
              onValueChange={(value) =>
                setValue("role", value as "customer" | "service_provider")
              }
            >
              <SelectTrigger className="mt-1 w-full rounded-md bg-gray-800 p-3 text-white">
                <span>
                  {role === "customer" ? "Customer" : "Service Provider"}
                </span>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border border-gray-600 rounded-md mt-1">
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="service_provider">
                  Service Provider
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "service_provider" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Experience (in years)
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
                />
                {errors.description && (
                  <p className="text-red-400 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-orange-600 p-3 text-white"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
