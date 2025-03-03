import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle , Folder } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface CreateTenantForm {
    tenantName: string;
    tenantDescription: string;
    tenantLogoPath: File | null;
    userFullName: string;
    userEmail: string;
    is_active: boolean;
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
        title: 'Create',
        href: '/tenants/create',
      },
  ];

export default function CreateTenant() {
    const { data, setData, post, processing, errors, reset } = useForm<CreateTenantForm>({
        tenantName: '',
        tenantDescription: '',
        tenantLogoPath: null,
        userFullName: '',
        userEmail: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('tenants.store'), {
            onFinish: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Tenant" />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>
            <h2 className="text-2xl font-bold">Tenant Create</h2>
                <Card className='w-200 mx-auto'>
                    <CardContent >
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            {/* Tenant Information */}
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
                                <Label htmlFor="tenantLogoPath">Upload Logo</Label>
                                <div className="relative">
                                    <Input
                                        id="tenantLogoPath"
                                        type="file"
                                        accept="image/*"
                                        className="pl-10"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const file = e.target.files[0];
                                                setData('tenantLogoPath', file);
                                            }
                                        }}
                                    />
                                    <Folder className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                </div>
                                <InputError message={errors.tenantLogoPath} />
                            </div>

                            {/* User Information */}
                            <div className="grid gap-2">
                                <Label htmlFor="userFullName">User Full Name</Label>
                                <Input
                                    id="userFullName"
                                    required
                                    value={data.userFullName}
                                    onChange={(e) => setData('userFullName', e.target.value)}
                                    placeholder="User Name"
                                />
                                <InputError message={errors.userFullName} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="userEmail">User Email</Label>
                                <Input
                                    id="userEmail"
                                    type="email"
                                    required
                                    value={data.userEmail}
                                    onChange={(e) => setData('userEmail', e.target.value)}
                                    placeholder="user@example.com"
                                />
                                <InputError message={errors.userEmail} />
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
                                <InputError message={errors.is_active} />
                            </div>

                            <Button type="submit" className="mt-4 w-50 cursor-pointer" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create Tenant
                            </Button>
                        </div>
                    </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
