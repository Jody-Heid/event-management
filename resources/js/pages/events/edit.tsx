import { useState, FormEventHandler } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Folder, Check, X, Tag as TagIcon, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
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
import { Event } from '@/types/event';
import { Tag } from '@/types/tag';


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
    tags: string[];
}

const breadcrumbs = (eventTitle: string): BreadcrumbItem[] => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Events', href: '/events' },
    { title: `Edit: ${eventTitle}`, href: '#' },
];

export default function EditEvent({ event, countries, cities, tags }: { event: Event; countries: any[]; cities: any[]; tags: Tag[] }) {
    const { props } = usePage();
    const old = (props.old || {}) as Partial<EditEventForm>;
    
    const { data, setData, post, processing, errors } = useForm<EditEventForm>({
        title: old?.title || event.title,
        description: old?.description || event.description,
        start_date: old?.start_date ? new Date(old.start_date) : new Date(event.start_date),
        end_date: old?.end_date ? new Date(old.end_date) : new Date(event.end_date),
        new_image: null,
        current_image: event.image,
        address: old?.address || event.address,
        num_tickets: old?.num_tickets || event.num_tickets,
        country_id: old?.country_id || event.country_id,
        city_id: old?.city_id || event.city_id,
        tags: old?.tags || (event.tags ? event.tags.map((tag: Tag) => tag.name) : []),
        _method: 'PUT',
    });

    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const TAGS_PER_PAGE = 5;

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

    const addTag = (tagName: string) => {
        if (!data.tags.includes(tagName)) {
            setData('tags', [...data.tags, tagName]);
        }
        setIsTagsOpen(false);
    };

    const removeTag = (tagToRemove: string) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    const getAvailableTags = () => {
        const filteredTags = tags.filter(tag => !data.tags.includes(tag.name));
        if (searchQuery) {
            return filteredTags
                .filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, TAGS_PER_PAGE);
        }
        return filteredTags.slice(0, TAGS_PER_PAGE);
    };

    const handleCreateTag = () => {
        const formattedTag = searchQuery
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim();

        if (formattedTag && !data.tags.includes(formattedTag)) {
            addTag(formattedTag);
            setSearchQuery('');
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
        formData.append('tags', JSON.stringify(data.tags));
        
        if (data.new_image) {
            formData.append('new_image', data.new_image);
        }

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

                                {/* Event Tags */}
                                <div className="grid gap-2">
                                    <Label>Event Tags <span className="text-red-500">*</span></Label>
                                    <Popover open={isTagsOpen} onOpenChange={setIsTagsOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={isTagsOpen}
                                                className="justify-between"
                                            >
                                                Select tags...
                                                <TagIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput 
                                                    placeholder="Search or create new tag..." 
                                                    value={searchQuery}
                                                    onValueChange={setSearchQuery}
                                                />
                                                <CommandEmpty className="py-2">
                                                    {searchQuery && (
                                                        <button
                                                            onClick={handleCreateTag}
                                                            className="flex items-center gap-2 px-2 py-1.5 text-sm w-full hover:bg-primary/10 text-primary rounded-sm"
                                                        >
                                                            <PlusCircle className="h-4 w-4" />
                                                            <span>Create tag "{searchQuery}"</span>
                                                        </button>
                                                    )}
                                                    {!searchQuery && <p className="px-2 text-sm">No tags found.</p>}
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {getAvailableTags().map((tag: Tag) => (
                                                        <CommandItem
                                                            key={tag.id}
                                                            onSelect={() => addTag(tag.name)}
                                                            className="cursor-pointer"
                                                        >
                                                            <TagIcon className="mr-2 h-4 w-4" />
                                                            {tag.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                                <div className="border px-3 py-2">
                                                    <p className="text-sm text-gray-500">
                                                        {tags.length - data.tags.length} tags available • Type to search or create new
                                                    </p>
                                                </div>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    {data.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 rounded-md bg-gray-50">
                                            {data.tags.map((tag) => (
                                                <div
                                                    key={tag}
                                                    className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                                                >
                                                    <TagIcon className="h-3 w-3" />
                                                    <span className="text-xs">{tag}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="text-primary hover:text-primary/80 focus:outline-none cursor-pointer"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <InputError message={errors.tags} />
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