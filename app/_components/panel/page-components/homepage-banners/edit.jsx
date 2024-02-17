import React, { useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
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
import ImageInput from '@/app/_components/ui/image-input';
import { Textarea } from '@/app/_components/ui/textarea';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    image: z.unknown().refine(value => (value || Array.isArray(value) || value.length > 0), { message: 'Banner image is required' }),
    title: z.string().optional(),
    shortDesc: z.string().optional(),
    btnTitle: z.string().optional(),
    link: z.string().optional(),
    isActive: z.boolean().optional(),
}).superRefine((formValues, ctx) => {
    if (formValues.btnTitle) {
        if (!formValues.link) {
            ctx.addIssue({
                code: "custom",
                message: "A link for button is required with a title.",
                path: ['link']
            });
        }
    }
    if (formValues.link) {
        if (!formValues.btnTitle) {
            ctx.addIssue({
                code: "custom",
                message: "A title for button is required with a link.",
                path: ['btnTitle']
            });
        }
    }
});

const EditHomepageBanner = ({ open, setOpen, homepageBanner, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image: homepageBanner.image,
            title: homepageBanner.title,
            shortDesc: homepageBanner.shortDesc,
            btnTitle: homepageBanner.btnTitle,
            link: homepageBanner.link,
            isActive: homepageBanner.isActive || false,
        }
    });
    // Homepage banner update function
    const { mutate: updateHomepageBanner, isPending: isUpdateHomepageBannerPending, isSuccess: isUpdateHomepageBannerSuccess, error: updateHomepageBannerError, reset: updateHomepageBannerReset } = useMutation({
        mutationFn: async (formData) => {
            try {
                const bodyFormData = new FormData()
                for (var key in formData) {
                    bodyFormData.append(key, formData[key]);
                }
                const { data } = await axios.put(`/api/panel/homepage-banners/${homepageBanner._id}`, bodyFormData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['homepage-banners'],
            })
        },
    })
    // Update default values on change in homepage banner values
    useEffect(() => {
        if (homepageBanner) {
            const updateValues = {
                image: homepageBanner.image,
                title: homepageBanner.title,
                shortDesc: homepageBanner.shortDesc,
                btnTitle: homepageBanner.btnTitle,
                link: homepageBanner.link,
                isActive: homepageBanner.isActive || false,
            }
            Object.entries(updateValues).forEach(([name, value]) => form.setValue(name, value));
            updateHomepageBannerReset()
        }
    }, [homepageBanner, form, updateHomepageBannerReset])
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Update homepage banner</SheetTitle>
                    <SheetDescription>
                        Homepage banners are visible on homepage.
                    </SheetDescription>
                    <Message variant={updateHomepageBannerError?.message ? 'destructive' : 'default'} message={updateHomepageBannerError?.message || isUpdateHomepageBannerSuccess && `Homepage banner has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateHomepageBanner)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name='image'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-col xs:flex-row gap-x-5 gap-y-3 items-start justify-between rounded-lg border p-4 space-y-0">
                                        <div className="flex flex-col gap-1">
                                            <FormLabel className="text-base">
                                                Banner image
                                            </FormLabel>
                                            <FormDescription>
                                                This image will be used as banner image on the website.
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
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cityscape Frenzy: Dive into the Urban Jungle!" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="shortDesc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Write here" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="btnTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Button title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Explore now" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Button link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com" {...field} />
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
                                                Activate
                                            </FormLabel>
                                            <FormDescription>
                                                Activate a banner will show the banner on homepage banners.
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
                            <Button type="submit" className='w-full' disabled={isUpdateHomepageBannerPending}>
                                {isUpdateHomepageBannerPending ?
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

export default EditHomepageBanner