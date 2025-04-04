import { useState, FormEventHandler } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Folder, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateEventForm {
    [key:string]:any;
    title: string;
    description: string;
    start_date: Date | undefined;
    end_date: Date | undefined;
    image: File | null;
    address: string;
    num_tickets: number;
    country_id: number;
    city_id: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Events', href: '/events' },
    { title: 'Create Event', href: '/events/create' },
];

export default function CreateEvent({ countries, cities }: { countries: any[]; cities: any[] }) {
    // Get old input values from the page props
    const { props } = usePage();
    const old = (props.old || {}) as Partial<CreateEventForm>;
    const { data, setData, post, processing, errors, reset } = useForm<CreateEventForm>({
        title: old?.title || '',
        description: old?.description || '',
        start_date: old?.start_date ? new Date(old.start_date) : undefined,
        end_date: old?.end_date ? new Date(old.end_date) : undefined,
        image: null,
        address: old?.address || '',
        num_tickets: old?.num_tickets || 0,
        country_id: old?.country_id || (countries.length > 0 ? countries[0].id : 0),
        city_id: old?.city_id || (cities.length > 0 ? cities[0].id : 0),
    });

    const handleDateChange = (key: 'start_date' | 'end_date', date: Date | undefined) => {
        setData(key, date);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('events.store'), {
            onFinish: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Event" />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>
                <h2 className="text-2xl font-bold">Create Event</h2>
                <Card className='w-200 mx-auto'>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                {/* Title */}
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="title"
                                        required
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Event Title"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                {/* Description */}
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Event Description <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="description"
                                        required
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Description"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {/* Start Date */}
                                <div className="grid gap-2">
                                    <Label>Start Date <span className="text-red-500">*</span></Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline">
                                                {data.start_date ? format(data.start_date, "PPP") : "Pick a start date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="start">
                                            <Calendar 
                                                mode="single" 
                                                selected={data.start_date} 
                                                onSelect={(date) => handleDateChange('start_date', date)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors.start_date} />
                                </div>

                                {/* End Date */}
                                <div className="grid gap-2">
                                    <Label>End Date <span className="text-red-500">*</span></Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline">
                                                {data.end_date ? format(data.end_date, "PPP") : "Pick an end date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="start">
                                            <Calendar 
                                                mode="single" 
                                                selected={data.end_date} 
                                                onSelect={(date) => handleDateChange('end_date', date)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors.end_date} />
                                </div>

                                {/* Image Upload */}
                                <div className="grid gap-2">
                                    <Label htmlFor="image">Upload Image <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            required
                                            className="pl-10"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setData('image', e.target.files[0]);
                                                }
                                            }}
                                        />
                                        <Folder className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    </div>
                                    <InputError message={errors.image} />
                                </div>

                                {/* Address */}
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="address"
                                        required
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Event Address"
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                {/* Number of Tickets */}
                                <div className="grid gap-2">
                                    <Label htmlFor="num_tickets">Number of Tickets <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="num_tickets"
                                        type="number"
                                        required
                                        value={data.num_tickets}
                                        onChange={(e) => setData('num_tickets', Number(e.target.value))}
                                        placeholder="Number of Tickets"
                                    />
                                    <InputError message={errors.num_tickets} />
                                </div>

                                {/* Country Select - shadcn */}
                                <div className="grid gap-2">
                                    <Label htmlFor="country_id">Country <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.country_id.toString()}
                                        onValueChange={(value) => setData('country_id', Number(value))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country.id} value={country.id.toString()}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.country_id} />
                                </div>

                                {/* City Select - shadcn */}
                                <div className="grid gap-2">
                                    <Label htmlFor="city_id">City <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.city_id.toString()}
                                        onValueChange={(value) => setData('city_id', Number(value))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem key={city.id} value={city.id.toString()}>
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.city_id} />
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Create Event
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}