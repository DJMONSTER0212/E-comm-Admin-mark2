import React, { useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/app/_components/ui/sheet"
import { Button } from '@/app/_components/ui/button'
import axios from "axios";
import Message from '@/app/_components/ui/message';
import { Loader2 } from 'lucide-react';
import { Input } from "@/app/_components/ui/input";
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    x: z.string().optional(),
    peerlist: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    google: z.string().optional(),
});
const SocialSettingsEdit = ({ open, setOpen, settings }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            facebook: settings.general.social?.facebook || '',
            instagram: settings.general.social?.instagram || '',
            x: settings.general.social?.x || '',
            peerlist: settings.general.social?.peerlist || '',
            linkedin: settings.general.social?.linkedin || '',
            youtube: settings.general.social?.youtube || '',
            google: settings.general.social?.google || '',
        }
    });
    // Settings update function
    const { mutate: updateSettings, isPending: isUpdateSettingsPending, isSuccess: isUpdateSettingsSuccess, error: updateSettingsError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/settings/general/social`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['general-settings'],
            });
            queryClient.invalidateQueries({
                queryKey: ['settings-context'],
            })
        },
    })
    // Update default values on change in settings
    useEffect(() => {
        if (settings) {
            const updateValues = {
                facebook: settings.general.social?.facebook || '',
                instagram: settings.general.social?.instagram || '',
                x: settings.general.social?.x || '',
                peerlist: settings.general.social?.peerlist || '',
                linkedin: settings.general.social?.linkedin || '',
                youtube: settings.general.social?.youtube || '',
                google: settings.general.social?.google || '',
            }
            Object.entries(updateValues).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [settings, form])
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className='overflow-auto'>
                <SheetHeader>
                    <SheetTitle>Social media handles</SheetTitle>
                    <SheetDescription>
                        Social media handles help you to connect with your users.
                    </SheetDescription>
                    <Message variant={updateSettingsError?.message ? 'destructive' : 'default'} message={updateSettingsError?.message || isUpdateSettingsSuccess && `Settings has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateSettings)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="facebook"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facebook</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://facebook.com/example" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="instagram"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instagram</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://instagram.com/example" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="x"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>X</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://x.com/example" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="peerlist"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Peerlist</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://peerlist.com/example" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="linkedin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Linkedin</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://linkedin.com/example" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="youtube"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Youtube</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://youtube.com/example" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="google"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Google</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://google.com/example" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isUpdateSettingsPending} className='w-full'>
                                {isUpdateSettingsPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : 'Update details'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default SocialSettingsEdit