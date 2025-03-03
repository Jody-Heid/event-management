import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle, Folder } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Switch } from "@/components/ui/switch";

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface EditTenantForm {
    tenantName: string;
    tenantDescription: string;
    tenantEmail: string;
    tenantLogoPath: File | null;
    is_active: boolean;
}

interface Props {
    tenant: {
        id: string;
        name: string;
        description: string;
        email: string;
        logo_path: string;
        is_active: boolean;
    }
}

const breadcrumbs: BreadcrumbItem[] = [
{
title: 'Dashboard',
href: '/dashboard',
},
{
title: 'Tenants',
href: '/tenants',
},
{
title: 'Edit',
href: '/tenants/edit',
},
];

export default function EditTenant({ tenant }: Props) {
    const { data, setData, processing, errors } = useForm<EditTenantForm>({
        tenantName: tenant.name,
        tenantDescription: tenant.description,
        tenantEmail: tenant.email,
        tenantLogoPath: null,
        is_active: tenant.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(route('tenants.update', tenant.id), {
            _method: 'put',
            tenantName: data.tenantName,
            tenantDescription: data.tenantDescription,
            tenantEmail: data.tenantEmail,
            tenantLogoPath: data.tenantLogoPath,
            is_active: data.is_active,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Tenant" />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>
                <h2 className="text-2xl font-bold">Edit Tenant</h2>
                <Card className='w-200 mx-auto'>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="tenantLogoPath">Upload Logo</Label>
                                    {data.tenantLogoPath instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(data.tenantLogoPath)}
                                            alt="New logo preview"
                                            className="mb-2 h-30 w-30 rounded-full"
                                        />
                                    ) : tenant.logo_path ? (
                                        <img
                                            src={`/storage/${tenant.logo_path}`}
                                            alt="Current logo"
                                            className="mb-2 h-30 w-30 rounded-full"
                                        />
                                    ) : null}

                                    <div className="relative">
                                        <Input
                                            id="tenantLogoPath"
                                            type="file"
                                            accept="image/*"
                                            className="pl-10"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    setData('tenantLogoPath', file);
                                                }
                                            }}
                                        />
                                        <Folder className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    </div>
                                    <InputError message={errors.tenantLogoPath} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tenantName">Company Name</Label>
                                    <Input
                                        id="tenantName"
                                        required
                                        value={data.tenantName}
                                        onChange={(e) => setData('tenantName', e.target.value)}
                                        placeholder="Tenant Name"
                                    />
                                    <InputError message={errors.tenantName} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tenantDescription">Company Description</Label>
                                    <Input
                                        id="tenantDescription"
                                        required
                                        value={data.tenantDescription}
                                        onChange={(e) => setData('tenantDescription', e.target.value)}
                                        placeholder="Description"
                                    />
                                    <InputError message={errors.tenantDescription} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tenantEmail">Company Email</Label>
                                    <Input
                                        id="tenantEmail"
                                        type="email"
                                        required
                                        value={data.tenantEmail}
                                        onChange={(e) => setData('tenantEmail', e.target.value)}
                                        placeholder="company@example.com"
                                    />
                                    <InputError message={errors.tenantEmail} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">
                                        Active Status
                                    </Label>
                                </div>

                                <Button type="submit" className="mt-4 w-50 cursor-pointer" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Update Tenant
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
