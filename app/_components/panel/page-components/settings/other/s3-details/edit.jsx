import React, { useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/app/_components/ui/sheet"
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

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    bucketName: z.string().min(1, { message: 'Bucket name is required' }),
    bucketRegion: z.string().min(1, { message: 'Bucket region is required' }),
    accessKey: z.string().min(1, { message: 'Access key is required' }),
    secretKey: z.string().min(1, { message: 'Secret key is required' }),
    uploadPath: z.string().min(1, { message: 'Upload path is required' }),
    backupPath: z.string().min(1, { message: 'Backup path is required' }),
    isActive: z.boolean().optional(),
});

const EditS3Details = ({ s3Details }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bucketName: s3Details?.bucketName || '',
            bucketRegion: s3Details?.bucketRegion || '',
            accessKey: s3Details?.accessKey || '',
            secretKey: s3Details?.secretKey || '',
            uploadPath: s3Details?.uploadPath || '/',
            backupPath: s3Details?.backupPath || '/backups',
            isActive: s3Details?.isActive || false
        }
    });
    // S3 details update function
    const { mutate: updateS3Details, isPending: isUpdateS3DetailsPending, isSuccess: isUpdateS3DetailsSuccess, error: updateS3DetailsError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/settings/s3`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['s3Details'],
            })
        },
    })
    // Update default values on change in s3 details
    useEffect(() => {
        if (s3Details) {
            Object.entries(s3Details).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [s3Details, form])
    return (
        <Sheet>
            <SheetTrigger className='w-full' asChild><Button variant='outline' className='w-full' size='sm'>{s3Details ? 'Edit S3 details' : 'Setup S3 service'}</Button></SheetTrigger>
            <SheetContent className='w-full h-screen overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>{s3Details ? 'Edit S3 details' : 'Setup S3 service'}</SheetTitle>
                    <SheetDescription>
                        S3 service will be used for storing files such as images, docs, etc. <span className='text-foreground font-medium'>It is highly recommended to setup the S3 for an better workflow.</span>
                    </SheetDescription>
                    <Message variant={updateS3DetailsError?.message ? 'destructive' : 'default'} message={updateS3DetailsError?.message || isUpdateS3DetailsSuccess && `S3 details have been ${s3Details ? 'updated' : 'set upped'} successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateS3Details)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="bucketName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bucket name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="website-s3-bucket" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bucketRegion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bucket region</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ap-south-1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accessKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Access key</FormLabel>
                                        <FormControl>
                                            <Input placeholder="AKIASP77BI7.........." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="secretKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Secret key</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+6kqU8W9Eg/iy......." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="uploadPath"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload path</FormLabel>
                                        <FormControl>
                                            <Input placeholder="public/website_name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription>This path will be used to upload files in S3. </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="backupPath"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Backup path</FormLabel>
                                        <FormControl>
                                            <Input placeholder="backups/website_name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription>This path will be used to upload database backups in S3. </FormDescription>
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
                                                Activate S3
                                            </FormLabel>
                                            <FormDescription>
                                                Activating this will allow system to upload files, images, docs, etc.
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
                            <Button type="submit" className='w-full' disabled={isUpdateS3DetailsPending}>
                                {isUpdateS3DetailsPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : s3Details ? 'Update details' : 'Setup S3 service'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default EditS3Details