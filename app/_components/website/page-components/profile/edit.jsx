import React, { useEffect } from 'react'
import { Button } from '@/app/_components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useForm } from 'react-hook-form';
import { Switch } from '@/app/_components/ui/switch'
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import ImageInput from '@/app/_components/ui/image-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import { useSession } from 'next-auth/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import { userRoles } from '@/app/_conf/constants/constant';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is not valid' }),
    phone: z.string().optional(),
    image: z.unknown().refine(value => (value || Array.isArray(value) || value.length > 0), { message: 'User image is required' }),
    isBlock: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    password: z.string().min(1, { message: 'Password is required' }),
    role: z.enum(userRoles.map((role) => role.value), { required_error: 'Role is required' }),
});

const EditUser = ({ user }) => {
    const { data: session, update: updateSession } = useSession();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            image: user.image,
            isBlock: user.isBlock || false,
            isVerified: user.isVerified || false,
            role: user.role
        }
    });
    // User details update function
    const { mutate: updateUser, isPending: isUpdateUserPending, isSuccess: isUpdateUserSuccess, error: updateUserError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const bodyFormData = new FormData()
                for (var key in formData) {
                    bodyFormData.append(key, formData[key]);
                }
                const { data } = await axios.put(`/api/panel/users/${user._id}`, bodyFormData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            })
        },
    })
    // Update default values on change in user details
    useEffect(() => {
        if (user) {
            Object.entries(user).forEach(([name, value]) => form.setValue(name, value));
            updateSession({ name: user.name, email: user.email, image: user.image })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, form])
    return (
        <Card className='lg:col-span-2 h-fit shadow-none'>
            <CardHeader>
                <CardTitle size='lg'>Edit personal details</CardTitle>
                <CardDescription>Edit personal details of your account.</CardDescription>
                <Message className='mb-4' variant={updateUserError?.message ? 'destructive' : 'default'} message={updateUserError?.message || isUpdateUserSuccess && `User details has been updated successfully.`} />
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateUser)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name='image'
                            render={({ field }) => (
                                <FormItem className="bg-background flex flex-col xs:flex-row gap-x-5 gap-y-3 items-start justify-between rounded-lg border p-4 space-y-0">
                                    <div className="flex flex-col gap-1">
                                        <FormLabel className="text-base">
                                            Your image
                                        </FormLabel>
                                        <FormDescription>
                                            This image will be used for user avatar across the website.
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                    <FormControl>
                                        <ImageInput field={field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <Input type='number' placeholder="1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full' disabled={isUpdateUserPending}>
                            {isUpdateUserPending ?
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                : 'Update details'
                            }
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default EditUser