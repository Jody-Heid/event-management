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

interface EditGalleryForm {
    [key:string]:any;
    new_image: File | null;
    current_image: string;
    caption: string;
    _method?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Event Gallery', href: '/event-gallery' },
    { title: 'Edit Photo', href: '#' },
];

export default function EditGallery({ gallery }: { gallery: { data: any } }) {
    const { props } = usePage();
    const old = (props.old || {}) as Partial<EditGalleryForm>;
    
    const { data, setData, post, processing, errors } = useForm<EditGalleryForm>({
        new_image: null,
        current_image: gallery.data.image,
        caption: old?.caption || gallery.data.caption,
        _method: 'PUT',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('new_image', e.target.files[0]);
        } else {
            setData('new_image', null);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('caption', data.caption);
        formData.append('_method', 'PUT');
        
        if (data.new_image) {
            formData.append('image', data.new_image);
        }

        post(route('event-gallery.update', gallery.data.id), {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Photo" />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>
                <h2 className="text-2xl font-bold">Edit Photo</h2>
                <Card className='w-200 mx-auto'>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                {/* Image Upload and Preview */}
                                <div className="grid gap-2">
                                    <Label htmlFor="new_image">Photo</Label>
                                    <div className="flex flex-col gap-4">
                                        {/* Preview Section */}
                                        <div className="flex flex-col gap-2">
                                            <Label>Preview</Label>
                                            <div className="flex items-center gap-4">
                                                {data.new_image ? (
                                                    <>
                                                        <div className="relative h-48 w-48 rounded-md overflow-hidden border">
                                                            <img 
                                                                src={URL.createObjectURL(data.new_image)} 
                                                                alt="New photo preview" 
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            New photo selected
                                                        </span>
                                                    </>
                                                ) : data.current_image ? (
                                                    <>
                                                        <div className="relative h-48 w-48 rounded-md overflow-hidden border">
                                                            <img 
                                                                src={`/storage/${data.current_image}`} 
                                                                alt="Current photo" 
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            Current photo
                                                        </span>
                                                    </>
                                                ) : (
                                                    <div className="h-48 w-48 rounded-md border flex items-center justify-center bg-gray-100">
                                                        <span className="text-sm text-gray-500">No photo</span>
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
                                            Upload a new photo to replace the current one (optional)
                                        </p>
                                        <InputError message={errors.new_image} />
                                    </div>
                                </div>

                                {/* Caption */}
                                <div className="grid gap-2">
                                    <Label htmlFor="caption">Caption</Label>
                                    <Input
                                        id="caption"
                                        value={data.caption}
                                        onChange={(e) => setData('caption', e.target.value)}
                                        placeholder="Add a caption to your photo..."
                                    />
                                    <InputError message={errors.caption} />
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Update Photo
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}