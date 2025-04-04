import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from "@/components/ui/label";

interface CreateUserForm {
    name: string;
    email: string;
}

interface Tenant {
    id: number;
    name: string;
}

interface CreateProps {
    tenant: Tenant;
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
        title: 'Create User',
        href: '#',
    },
];

export default function CreateUser({ tenant }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm<CreateUserForm>({
        name: '',
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('tenants.users.store', tenant.id), {
            onFinish: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create User - ${tenant.name}`} />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>
                <div>
                    <h2 className="text-2xl font-bold">Create User</h2>
                    <p className="text-muted-foreground">Add a new user to {tenant.name}</p>
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

                                <Button type="submit" className="mt-4 w-50 cursor-pointer" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Create User
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
