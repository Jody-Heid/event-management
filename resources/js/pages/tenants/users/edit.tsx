import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface EditUserForm {
    name: string;
    email: string;
    password?: string;
}

interface Tenant {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    tenant: Tenant;
    user: User;
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
        title: 'Users',
        href: '#',
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

export default function EditUser({ tenant, user }: Props) {
    const { data, setData, processing, errors } = useForm<EditUserForm>({
        name: user.name,
        email: user.email,
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(route('tenants.users.update', { tenant: tenant.id, user: user.id }), {
            _method: 'put',
            name: data.name,
            email: data.email,
            password: data.password,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${tenant.name}`} />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>
                <div>
                    <h2 className="text-2xl font-bold">Edit User</h2>
                    <p className="text-muted-foreground">Update user details for {tenant.name}</p>
                </div>
                <Card className='w-200 mx-auto'>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="User Name"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="user@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">New Password (Optional)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Leave blank to keep current password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <Button type="submit" className="mt-4 w-50 cursor-pointer" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Update User
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
