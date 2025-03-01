import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface CreateTenantForm {
    tenantName: string;
    tenantDescription: string;
    tenantLogoPath: File | null;
    userFullName: string;
    userEmail: string;
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
        tenantLogoPath: '',
        userFullName: '',
        userEmail: '',
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
                                <Input
                                    id="tenantLogoPath"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const file = e.target.files[0];
                                            setData('tenantLogoPath', file);
                                        }
                                    }}
                                />
                                <InputError message={errors.tenantLogoPath} />
                            </div>

                            {/* User Information */}
                            <div className="grid gap-2">
                                <Label htmlFor="userFullName">User Name</Label>
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
