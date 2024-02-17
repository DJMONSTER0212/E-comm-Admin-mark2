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
import { Switch } from '@/app/_components/ui/switch';
import { useSession } from 'next-auth/react';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    activateWebsite: z.boolean().optional(),
    activateMaintenanceMode: z.boolean().optional(),
});
const EditSadminSetting = ({ settings }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            activateWebsite: settings.sadmin?.activateWebsite || false,
            activateMaintenanceMode: settings.sadmin?.activateMaintenanceMode || false,
        }
    });
    // Settings update function
    const { mutate: updateSettings, isPending: isUpdateSettingsPending, isSuccess: isUpdateSettingsSuccess, error: updateSettingsError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/settings/sadmin`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sadmin-settings'],
            })
        },
    })
    // Update default values on change in settings
    useEffect(() => {
        if (settings.website) {
            const updateFields = {
                activateWebsite: settings.sadmin?.activateWebsite || false,
                activateMaintenanceMode: settings.sadmin?.activateMaintenanceMode || false,
            }
            Object.entries(updateFields).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [settings, form])
    // Authentication 
    if (!session || !session.user.role == 'sadmin') {
        return ('These are super admin only settings.')
    }
    return (
        <Card className='lg:col-span-2 h-fit'>
            <CardHeader>
                <CardTitle size='lg'>Super admin settings</CardTitle>
                <CardDescription>These are super admin exclusive settings and offer strong controll over website.</CardDescription>
                <Message className='mb-4' variant={updateSettingsError?.message ? 'destructive' : 'default'} message={updateSettingsError?.message || isUpdateSettingsSuccess && `Super admin settings has been updated successfully.`} />
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateSettings)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name='activateWebsite'
                            render={({ field }) => (
                                <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Activate website
                                        </FormLabel>
                                        <FormDescription>
                                            Activating website will allow users to view the website content.
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
                        <FormField
                            control={form.control}
                            name='activateMaintenanceMode'
                            render={({ field }) => (
                                <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Activate maintenance mode
                                        </FormLabel>
                                        <FormDescription>
                                            Activating maintenance mode will show a maintainance mode on every route of the website.
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

export default EditSadminSetting