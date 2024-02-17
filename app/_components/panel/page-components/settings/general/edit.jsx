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
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import ImageInput from '@/app/_components/ui/image-input';
import { currencySymbols } from '@/app/_conf/constants/constant';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import { Input } from "@/app/_components/ui/input";

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    lightLogo: z.unknown().refine(value => (value || Array.isArray(value) || value.length > 0), { message: 'Light logo is required' }),
    darkLogo: z.unknown().refine(value => (value || Array.isArray(value) || value.length > 0), { message: 'Dark logo is required' }),
    emailLogo: z.unknown().refine(value => (value || Array.isArray(value) || value.length > 0), { message: 'Email logo is required' }),
    faviconLogo: z.unknown().refine(value => (value || Array.isArray(value) || value.length > 0), { message: 'Favicon logo is required' }),
    name: z.string().min(1, { message: 'Website name is required' }),
    companyName: z.string().min(1, { message: 'Company name is required' }),
    currencySymbol: z.enum(currencySymbols.map((currencySymbol) => currencySymbol.value), { required_error: 'Currency symbol is required' }),
});
const EditGeneralSetting = ({ settings }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lightLogo: settings.general.lightLogo || '',
            darkLogo: settings.general.darkLogo || '',
            emailLogo: settings.general.emailLogo || '',
            faviconLogo: settings.general.FaviconLogo || '',
            name: settings.general.name || '',
            companyName: settings.general.companyName || '',
            currencySymbol: settings.general.currencySymbol,
        }
    });
    // Settings update function
    const { mutate: updateSettings, isPending: isUpdateSettingsPending, isSuccess: isUpdateSettingsSuccess, error: updateSettingsError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const bodyFormData = new FormData()
                for (var key in formData) {
                    bodyFormData.append(key, formData[key]);
                }
                const { data } = await axios.put(`/api/panel/settings/general`, bodyFormData)
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
        if (settings.general) {
            const updateFields = {
                lightLogo: settings.general.lightLogo || '',
                darkLogo: settings.general.darkLogo || '',
                emailLogo: settings.general.emailLogo || '',
                faviconLogo: settings.general.faviconLogo || '',
                name: settings.general.name || '',
                companyName: settings.general.companyName || '',
                currencySymbol: settings.general.currencySymbol,
            }
            Object.entries(updateFields).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [settings, form])
    return (
        <Card className='lg:col-span-2 h-fit'>
            <CardHeader>
                <CardTitle size='lg'>General settings</CardTitle>
                <CardDescription>These are the basic but very important settings of the website which are used on multiple places across the website.</CardDescription>
                <Message className='mb-4' variant={updateSettingsError?.message ? 'destructive' : 'default'} message={updateSettingsError?.message || isUpdateSettingsSuccess && `General settings has been updated successfully.`} />
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateSettings)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name='lightLogo'
                            render={({ field }) => (
                                <FormItem className="bg-background flex flex-col xs:flex-row gap-x-5 gap-y-3 items-start justify-between rounded-lg border p-4 space-y-0">
                                    <div className="flex flex-col gap-1">
                                        <FormLabel className="text-base">
                                            Light logo
                                        </FormLabel>
                                        <FormDescription>
                                            Light logo is used in light mode of website.
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
                            name='darkLogo'
                            render={({ field }) => (
                                <FormItem className="bg-background flex flex-col xs:flex-row gap-x-5 gap-y-3 items-start justify-between rounded-lg border p-4 space-y-0">
                                    <div className="flex flex-col gap-1">
                                        <FormLabel className="text-base">
                                            Dark logo
                                        </FormLabel>
                                        <FormDescription>
                                            Dark logo is used in dark mode of website.
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
                            name='emailLogo'
                            render={({ field }) => (
                                <FormItem className="bg-background flex flex-col xs:flex-row gap-x-5 gap-y-3 items-start justify-between rounded-lg border p-4 space-y-0">
                                    <div className="flex flex-col gap-1">
                                        <FormLabel className="text-base">
                                            Email logo (In JPEG/JPG Format)
                                        </FormLabel>
                                        <FormDescription>
                                            Email logo is used in emails sent from the website.
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
                            name='faviconLogo'
                            render={({ field }) => (
                                <FormItem className="bg-background flex flex-col xs:flex-row gap-x-5 gap-y-3 items-start justify-between rounded-lg border p-4 space-y-0">
                                    <div className="flex flex-col gap-1">
                                        <FormLabel className="text-base">
                                            Favicon logo
                                        </FormLabel>
                                        <FormDescription>
                                            Favicon logo is used as favicon for the website.
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
                                    <FormLabel>Website name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="TNIT Services" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="TNIT Services pvt. ltd." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currencySymbol"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a currency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {currencySymbols.map((currencySymbol, index) => (
                                                <SelectItem key={index} value={currencySymbol.value}>{currencySymbol.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full' disabled={isUpdateSettingsPending}>
                            {isUpdateSettingsPending ?
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

export default EditGeneralSetting