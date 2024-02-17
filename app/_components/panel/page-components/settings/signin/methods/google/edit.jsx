import React, { useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/app/_components/ui/sheet"
import { Button } from '@/app/_components/ui/button';
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
import Link from 'next/link';
import { Switch } from '@/app/_components/ui/switch'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import Message from '@/app/_components/ui/message';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    name: z.enum(["google"], { required_error: 'Name is required' }),
    clientId: z.string().min(1, { message: 'Client Id is required' }),
    clientSecret: z.string().min(1, { message: 'Client secret is required' }),
    isActive: z.boolean().optional(),
});

const EditGoogleOauth = ({ method }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: 'google',
            clientId: method.credentials.clientId || '',
            clientSecret: method.credentials.clientSecret || '',
            isActive: method.isActive || false
        }
    });
    // Method update function
    const { mutate: updateMethod, isPending: isUpdateMethodPending, isSuccess: isUpdateMethodSuccess, error: updateMethodError } = useMutation({
        mutationFn: async (formData) => {
            const postData = {
                name: formData.name,
                isActive: formData.isActive,
                credentials: {
                    clientId: formData.clientId,
                    clientSecret: formData.clientSecret
                }
            }
            try {
                if (method) {
                    const { data } = await axios.put(`/api/panel/settings/signin-methods/${method._id}`, postData)
                    return data;
                } else {
                    const { data } = await axios.put(`/api/panel/settings/signin-methods`, postData)
                    return data;
                }
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['signinMethods'],
            })
        },
    })
    // Update default values on change in method values
    useEffect(() => {
        if (method) {
            const updateValues = {
                name: 'google',
                clientId: method.credentials.clientId || '',
                clientSecret: method.credentials.clientSecret || '',
                isActive: method.isActive || false
            }
            Object.entries(updateValues).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [method, form])
    return (
        <Sheet className='w-full'>
            <SheetTrigger className='w-full' asChild><Button variant='outline' className='w-full' size='sm'>{method ? 'Edit' : 'Setup Google OAuth'}</Button></SheetTrigger>
            <SheetContent>
                <SheetHeader className='text-left'>
                    <SheetTitle>{method ? 'Edit Google OAuth' : 'Setup Google OAuth'}</SheetTitle>
                    <SheetDescription>
                        Google OAuth allows your users to sign in using Google.
                    </SheetDescription>
                    <Message variant={updateMethodError?.message ? 'destructive' : 'default'} message={updateMethodError?.message || isUpdateMethodSuccess && `Google OAuth has been ${method ? 'updated' : 'set upped'} successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateMethod)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client Id</FormLabel>
                                        <FormControl>
                                            <Input placeholder="3158380-XXXXXXXXXXXX" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="clientSecret"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client secret</FormLabel>
                                        <FormControl>
                                            <Input placeholder="GOCSPX-oCxmYnwXXXXXXXXXXXX" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='isActive'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Activate Google OAuth
                                            </FormLabel>
                                            <FormDescription>
                                                Activating this will show a sign in with google option on sign in page.
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isUpdateMethodPending}>
                                {isUpdateMethodPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : method ? 'Update details' : 'Setup Google OAuth'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
                <SheetDescription asChild className='mt-1'>
                    <p>Check <Link href='https://console.developers.google.com/apis/credentials' target='_blank' className='text-primary font-medium'>Google console</Link> to get Client Id and Client secret for your website.</p>
                </SheetDescription>
            </SheetContent>
        </Sheet>
    )
}

export default EditGoogleOauth