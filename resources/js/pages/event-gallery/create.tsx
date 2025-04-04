import { FormEventHandler } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Folder } from 'lucide-react';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface CreateGalleryForm {
    [key:string]:any;
    image: File | null;
    caption: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Event Gallery', href: '/event-gallery' },
    { title: 'Add Photo', href: '/event-gallery/create' },
];

export default function CreateGallery() {
    const { props } = usePage();
    const old = (props.old || {}) as Partial<CreateGalleryForm>;
    
    const { data, setData, post, processing, errors, reset } = useForm<CreateGalleryForm>({
        image: null,
        caption: old?.caption || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('event-gallery.store'), {
            onFinish: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Photo" />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>
                <h2 className="text-2xl font-bold">Add Photo</h2>
                <Card className='w-200 mx-auto'>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
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
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Upload Photo
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}