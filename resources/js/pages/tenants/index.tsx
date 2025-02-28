import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Users, CalendarDays, Eye ,  MoreVertical, Pencil, Trash } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

interface Tenant {
  id: number;
  name: string;
  email: string;
  description: string | null;
  is_active: boolean;
  logo_path: string | null;
  users_count: number;
  events_count: number;
}

interface Permissions {
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface IndexProps {
  tenants: {
    data: Tenant[];
    links: any;
  };
  can: Permissions;
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
];

export default function Index({ tenants, can }: IndexProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tenants" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tenants</h2>
          {can.create && (
            <Link href={route('tenants.create')}>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Tenant
              </Button>
            </Link>
          )}
        </div>

        {tenants.data.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Users</TableHead>
                  <TableHead className="text-center">Events</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.data.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">
                      <div className='flex items-center'>
                        <img src={`/storage/${tenant.logo_path}`} alt="Tenant Logo" className="h-10 w-10 rounded-full border mr-2" />
                        <span>{tenant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tenant.email}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="line-clamp-1 text-sm text-muted-foreground">
                        {tenant.description || "No description provided."}
                      </div>
                    </TableCell>
                    <TableCell>
                      {tenant.is_active ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{tenant.users_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center text-sm">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        <span>{tenant.events_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route("tenants.show", tenant.id)}>
                                <Eye className="h-4 w-4 mr-2" /> View
                                </Link>
                            </DropdownMenuItem>
                            {can.edit && (
                                <DropdownMenuItem asChild>
                                <Link href={route("tenants.edit", tenant.id)}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Link>
                                </DropdownMenuItem>
                            )}
                            {can.delete && (
                                <DropdownMenuItem
                                className="text-red-600"
                                >
                                <Trash className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                            )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No tenants found</h3>
            <p className="text-muted-foreground">
              Get started by creating a new tenant.
            </p>
            {can.create && (
              <Button className="mt-4" asChild>
                <Link href={route('tenants.create')}>
                  <Plus className="mr-2 h-4 w-4" /> Add Tenant
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}