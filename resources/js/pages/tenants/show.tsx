import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, Users, CalendarDays, Mail, FileText, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Tenant {
    id: number;
    name: string;
    email: string;
    description: string | null;
    is_active: boolean;
    logo_path: string | null;
    users_count: number;
    events_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    tenant: Tenant;
}

const breadcrumbs = (tenantName:string): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Tenants',
        href: '/tenants',
    },
    {
        title: tenantName,
        href: '#',
    },
];

export default function Show({ tenant }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(tenant.name)}>
            <Head title={`${tenant.name} - Details`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('tenants.index')}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h2 className="text-2xl font-bold">{tenant.name} Details</h2>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tenant.users_count || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tenant.events_count || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Created At</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                {new Date(tenant.created_at).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {tenant.is_active ? (
                                <Badge className="bg-green-500">Active</Badge>
                            ) : (
                                <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={`/storage/${tenant.logo_path}`}
                                    alt="Tenant Logo"
                                    className="h-20 w-20 rounded-full border"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold">{tenant.name}</h3>
                                    <div className="flex items-center text-muted-foreground">
                                        <Mail className="h-4 w-4 mr-2" />
                                        {tenant.email}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {tenant.description || "No description provided."}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{new Date(tenant.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Tenant account created</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{new Date(tenant.updated_at).toLocaleDateString()}</TableCell>
                                        <TableCell>Updated</TableCell>
                                        <TableCell>Last modification</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
