import { FormEventHandler } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Folder } from 'lucide-react';
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

interface EditEventForm {
    [key:string]:any;
    title: string;
    description: string;
    start_date: Date | undefined;
    end_date: Date | undefined;
    new_image: File | null;
    current_image: string;
    address: string;
    num_tickets: number;
    country_id: number;
    city_id: number;
    _method?: string;
}

const breadcrumbs = (eventTitle: string): BreadcrumbItem[] => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Events', href: '/events' },
    { title: `Edit: ${eventTitle}`, href: '#' },
];

export default function EditEvent({ event, countries, cities }: { event: any; countries: any[]; cities: any[] }) {
    const { props } = usePage();
    const old = (props.old || {}) as Partial<EditEventForm>;
    
    const { data, setData, post, processing, errors } = useForm<EditEventForm>({
        title: old?.title || event.title,
        description: old?.description || event.description,
        start_date: old?.start_date ? new Date(old.start_date) : new Date(event.start_date),
        end_date: old?.end_date ? new Date(old.end_date) : new Date(event.end_date),
        new_image: null,
        current_image: event.image, // Path to the stored image
        address: old?.address || event.address,
        num_tickets: old?.num_tickets || event.num_tickets,
        country_id: old?.country_id || event.country_id,
        city_id: old?.city_id || event.city_id,
        _method: 'PUT',
    });

    const handleDateChange = (key: 'start_date' | 'end_date', date: Date | undefined) => {
        setData(key, date);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('new_image', file);
        } else {
            setData('new_image', null);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('start_date', data.start_date?.toISOString() || '');
        formData.append('end_date', data.end_date?.toISOString() || '');
        formData.append('address', data.address);
        formData.append('num_tickets', data.num_tickets.toString());
        formData.append('country_id', data.country_id.toString());
        formData.append('city_id', data.city_id.toString());
        formData.append('_method', 'PUT');
        
        // Only append new_image if it exists
        if (data.new_image) {
            formData.append('new_image', data.new_image);
        }
        console.log(data);
        post(route('events.update', event.id), {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(event.title)}>
            <Head title={`Edit Event: ${event.title}`} />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>
                <h2 className="text-2xl font-bold">Edit Event: {event.title}</h2>
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

                                {/* Image Upload and Preview */}
                                <div className="grid gap-2">
                                    <Label htmlFor="new_image">Event Image</Label>
                                    <div className="flex flex-col gap-4">
                                        {/* Preview Section */}
                                        <div className="flex flex-col gap-2">
                                            <Label>Preview</Label>
                                            <div className="flex items-center gap-4">
                                                {data.new_image ? (
                                                    <>
                                                        <div className="relative h-32 w-32 rounded-md overflow-hidden border">
                                                            <img 
                                                                src={URL.createObjectURL(data.new_image)} 
                                                                alt="New event preview" 
                                                                className="h-full w-full"
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            New image selected
                                                        </span>
                                                    </>
                                                ) : data.current_image ? (
                                                    <>
                                                        <div className="relative h-32 w-32 rounded-md overflow-hidden border">
                                                            <img 
                                                                src={`/storage/${data.current_image}`} 
                                                                alt="Current event" 
                                                                className="h-full w-full"
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            Current image
                                                        </span>
                                                    </>
                                                ) : (
                                                    <div className="h-32 w-32 rounded-md border flex items-center justify-center bg-gray-100">
                                                        <span className="text-sm text-gray-500">No image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Image Upload Input */}
                                        <div className="relative">
                                            <Input
                                                id="new_image"
                                                type="file"
                                                accept="image/*"
                                                className="pl-10"
                                                onChange={handleImageChange}
                                            />
                                            <Folder className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Upload a new image to replace the current one (optional)
                                        </p>
                                        <InputError message={errors.new_image} />
                                    </div>
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

                                {/* Country Select */}
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

                                {/* City Select */}
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
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Update Event
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}