import React from 'react'
import { Button } from '@/app/_components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useForm } from 'react-hook-form';
import { Loader2, KeyRound } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    'oldPassword': z.string().min(1, { message: 'Old password is required' }).min(8, { message: 'Old password should have at least 8 characters' }),
    'newPassword': z.string().min(1, { message: 'New password is required' }).min(8, { message: 'New password should have at least 8 characters' }),
}).superRefine(({ cpassword, password }, ctx) => {
    if (cpassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Password and confirm password should match",
            path: ['cpassword']
        });
    }
});

const ChangeUserPassword = ({ user }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'oldPassword': '',
            'newPassword': ''
        }
    });

    // User details update function
    const { mutate: updateUser, isPending: isUpdateUserPending, isSuccess: isUpdateUserSuccess, error: updateUserError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.patch(`/api/panel/users/${user._id}`, { name: 'resetPassword', newPassword: formData.password })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        }
    })
    return (
        <Card className='shadow-none'>
            <CardHeader>
                <KeyRound className='w-10 h-10 text-violet-500 border p-1.5 rounded-md mb-2' />
                <CardTitle size='lg'>Change account password</CardTitle>
                <CardDescription>Chnage your account password using your old password.</CardDescription>
                <Message className='mb-4' variant={updateUserError?.message ? 'destructive' : 'default'} message={updateUserError?.message || isUpdateUserSuccess && `User password has been updated successfully.`} />
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateUser)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Old password</FormLabel>
                                    <FormControl>
                                        <Input type='oldPassword' placeholder="·········" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input type='newPassword' placeholder="·········" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant="outline" type="submit" className='w-full' disabled={isUpdateUserPending}>
                            {isUpdateUserPending ?
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                : 'Reset password'
                            }
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ChangeUserPassword