"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "../../ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../ui/popover";
import { Check, PlusCircle } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { Badge } from "../../ui/badge";
import { Switch } from "../../ui/switch"
import ImageInput from "../../ui/image-input";

const formSchema = z.object({
    username: z.string({ required_error: 'Must be 2 or more characters long' }).min(2, { message: "Must be 2 or more characters long" }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is not valid' }),
    role: z.enum(["student", "teacher"], { required_error: 'Role is required' }),
    subjects: z.string({ required_error: 'At least one subject is required' }).array().min(1, { message: 'At least one subject is required' }),
    block: z.boolean().optional(),
    image: z.unknown().refine(value => (value || Array.isArray(value) || value.length > 0), { message: 'At least one image is required' }),
    images: z.any().array().min(1, { message: 'At least one image is required' }),
});
const subjects = [
    {
        label: 'Math',
        value: 'math'
    },
    {
        label: 'Physics',
        value: 'physics'
    },
    {
        label: 'C++',
        value: 'c++'
    },
    {
        label: 'PHP',
        value: 'php'
    },
]
const DemoForm = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: 'ww',
            email: 'mohitkumawat310@gk.com',
            role: 'student',
            subjects: ['math'] || [],
            block: true,
            image: '/logo-dark.png',
            images: ['/logo-dark.png', '/logo-light.png']
        }
    });
    function onSubmit(data) {
        console.log(data);
    }
    return (
        <div className="mx-4 bg-muted rounded-md p-5">
            <h1 className="mb-5 text-2xl font-semibold">Add User</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name='image'
                        render={({ field }) => (
                            <FormItem className="bg-background flex flex-col xs:flex-row gap-x-5 gap-y-3 items-start justify-between rounded-lg border p-4 space-y-0">
                                <div className="flex flex-col gap-1">
                                    <FormLabel className="text-base">
                                        Profile image
                                    </FormLabel>
                                    <FormDescription>
                                        This image will be used for your avatar across the website.
                                    </FormDescription>
                                    <FormMessage />
                                </div>
                                <FormControl>
                                    <ImageInput field={field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="mohitkumawat310" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="mohitkumawat310@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a verified email to display" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subjects"
                        render={({ field }) => (
                            <FormItem className='relative'>
                                <FormLabel>Select subjects</FormLabel>
                                <Popover className='w-full'>
                                    <FormControl>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="block w-full justify-start cursor-pointer hover:bg-background">
                                                <div className="flex items-center justify-between gap-3 w-full">
                                                    <div className="flex gap-2 items-center">
                                                        <PlusCircle className="mr-2 h-4 w-4" /> Subjects
                                                    </div>
                                                    {field.value?.length > 0 ? (
                                                        <div className="flex items-center">
                                                            <Badge
                                                                variant="secondary"
                                                                className="rounded-sm px-1 font-normal lg:hidden"
                                                            >
                                                                {field.value.length} Selected
                                                            </Badge>
                                                            <div className="hidden space-x-1 lg:flex">
                                                                {field.value.length > 3 ? (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="rounded-sm px-1 font-normal"
                                                                    >
                                                                        {field.value.length} selected
                                                                    </Badge>
                                                                ) : (
                                                                    subjects.filter((subject) => field.value.includes(subject.value))
                                                                        .map((subject) => (
                                                                            <Badge
                                                                                variant="secondary"
                                                                                key={subject.value}
                                                                                className="rounded-sm px-1 font-normal"
                                                                            >
                                                                                {subject.label}
                                                                            </Badge>
                                                                        ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) :
                                                        <p className="text-sm text-muted-foreground font-normal">No subjects selected.</p>
                                                    }
                                                </div>
                                            </Button>
                                        </PopoverTrigger>
                                    </FormControl>
                                    <PopoverContent className="w-full p-0" align="start">
                                        <Command className='w-full'>
                                            <CommandInput placeholder='Search subjects...' />
                                            <CommandList>
                                                <CommandEmpty>No results found.</CommandEmpty>
                                                <CommandGroup>
                                                    {subjects.map((subject) => {
                                                        const isSelected = field.value?.includes(subject.value) || false;
                                                        return (
                                                            <CommandItem
                                                                key={subject.value}
                                                                onSelect={() => {
                                                                    if (isSelected) {
                                                                        field.onChange(field.value.filter((value) => value != subject.value));
                                                                    } else {
                                                                        field.onChange(field.value ? [...field.value, subject.value] : [subject.value]);
                                                                    }
                                                                }}
                                                            >
                                                                <div
                                                                    className={cn(
                                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-muted-foreground",
                                                                        isSelected
                                                                            ? "bg-foreground text-primary-foreground"
                                                                            : "opacity-50 [&_svg]:invisible"
                                                                    )}
                                                                >
                                                                    <Check className={cn("h-4 w-4")} aria-hidden="true" />
                                                                </div>
                                                                <span>{subject.label}</span>
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                                {field.value?.length > 0 && (
                                                    <>
                                                        <CommandSeparator />
                                                        <CommandGroup>
                                                            <CommandItem
                                                                onSelect={() => field.onChange([])}
                                                                className="justify-center text-center"
                                                            >
                                                                Remove all
                                                            </CommandItem>
                                                        </CommandGroup>
                                                    </>
                                                )}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='block'
                        render={({ field }) => (
                            <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Product sale on
                                    </FormLabel>
                                    <FormDescription>
                                        Puts your product on sale. which includes auto price reduce.
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
                        name='images'
                        render={({ field }) => (
                            <FormItem className="bg-background gap-y-3 items-start justify-between rounded-lg border p-4 space-y-3">
                                <div className="flex flex-col gap-1">
                                    <FormLabel className="text-base">
                                        Gallery images
                                    </FormLabel>
                                    <FormDescription>
                                        Preferred image ration is 4:3.
                                    </FormDescription>
                                    <FormMessage />
                                </div>
                                <FormControl>
                                    <ImageInput control={form.control} sortable={true} field={field} multiple={true} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='w-full'>Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default DemoForm