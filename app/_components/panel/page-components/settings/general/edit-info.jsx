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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/app/_components/ui/textarea';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    inquiryMail: z.string().optional(),
    inquiryPhone: z.string().optional(),
    inquiryPhone2: z.string().optional(),
    whatsappPhone: z.string().optional(),
    address: z.string().optional(),
    footerPara: z.string().optional(),
});
const InfoSettingsEdit = ({ open, setOpen, settings }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            inquiryMail: settings.general.info?.inquiryMail || '',
            inquiryPhone: settings.general.info?.inquiryPhone || '',
            inquiryPhone2: settings.general.info?.inquiryPhone2 || '',
            whatsappPhone: settings.general.info?.whatsappPhone || '',
            address: settings.general.info?.address || '',
            footerPara: settings.general.info?.footerPara || '',
        }
    });
    // Settings update function
    const { mutate: updateSettings, isPending: isUpdateSettingsPending, isSuccess: isUpdateSettingsSuccess, error: updateSettingsError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/settings/general/info`, formData)
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
                inquiryMail: settings.general.info?.inquiryMail || '',
                inquiryPhone: settings.general.info?.inquiryPhone || '',
                inquiryPhone2: settings.general.info?.inquiryPhone2 || '',
                whatsappPhone: settings.general.info?.whatsappPhone || '',
                address: settings.general.info?.address || '',
                footerPara: settings.general.info?.footerPara || '',
            }
            Object.entries(updateValues).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [settings, form])
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className='overflow-auto'>
                <SheetHeader>
                    <SheetTitle>Contact info</SheetTitle>
                    <SheetDescription>
                        Contact information help user to contact you.
                    </SheetDescription>
                    <Message variant={updateSettingsError?.message ? 'destructive' : 'default'} message={updateSettingsError?.message || isUpdateSettingsSuccess && `Settings has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateSettings)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="inquiryMail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Inquiry mail</FormLabel>
                                        <FormControl>
                                            <Input type='email' placeholder="example@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="inquiryPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone number (Primary)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+91-01234567890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="inquiryPhone2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone number (secondary)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+91-9876543210" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="whatsappPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Whatsapp phone number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="910123456789" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Textarea rows={3} placeholder="write here...." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="footerPara"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Footer paragraph</FormLabel>
                                        <FormControl>
                                            <Textarea rows={7} placeholder="write here...." {...field} />
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

export default InfoSettingsEdit