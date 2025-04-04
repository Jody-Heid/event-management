import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Image, Plus, Eye, MoreVertical, Pencil, Trash } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { toast } from 'sonner';
import { EventGallery } from '@/types/eventGallery';

interface IndexProps {
  galleries: {
    data: EventGallery[];
    links: any;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Gallery',
    href: '/event-gallery',
  },
];

export default function Index({ galleries }: IndexProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState<any | null>(null);

  const handleDeleteClick = (gallery: any) => {
    setGalleryToDelete(gallery);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (galleryToDelete) {
      router.delete(route('event-gallery.destroy', galleryToDelete.id), {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setGalleryToDelete(null);
        },
        onError: () => {
          toast.error('Failed to delete gallery item', {
            description: 'Please try again or contact support if the problem persists.',
          });
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gallery" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold"> Gallery</h2>
          <Link href={route('event-gallery.create')}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Photo
            </Button>
          </Link>
        </div>

        {galleries?.data && galleries.data.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Image</TableHead>
                  <TableHead className="w-[40%]">Caption</TableHead>
                  <TableHead className="w-[14%]">Upload Date</TableHead>
                  <TableHead className="w-[6%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {galleries.data.map((gallery) => (
                  <TableRow key={gallery.id}>
                    <TableCell>
                      <img 
                        src={gallery.image} 
                        alt={gallery.caption} 
                        className="h-16 w-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="line-clamp-2 text-sm">
                        {gallery.caption || "No caption provided."}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(gallery.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={route("event-gallery.show", gallery.id)}>
                              <Eye className="h-4 w-4 mr-2" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={route("event-gallery.edit", gallery.id)}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(gallery)}
                          >
                            <Trash className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
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
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No photos found</h3>
            <p className="text-muted-foreground">
              Get started by uploading a new photo.
            </p>
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={!galleryToDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}