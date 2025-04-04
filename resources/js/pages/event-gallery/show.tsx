import { Head, Link } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  MessageSquare, 
  Heart, 
  Tag, 
  User, 
  Building, 
  Globe, 
  Share2, 
  ThumbsUp, 
  Ticket 
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Mock data for relationships that don't have real data yet
const mockAttendees = [
  { id: 1, name: 'Emma Johnson', avatar: null, rsvp_status: 'attending', created_at: '2025-03-15T10:30:00Z' },
  { id: 2, name: 'James Wilson', avatar: null, rsvp_status: 'attending', created_at: '2025-03-15T11:45:00Z' },
  { id: 3, name: 'Sophia Martinez', avatar: null, rsvp_status: 'attending', created_at: '2025-03-16T09:15:00Z' },
  { id: 4, name: 'Noah Taylor', avatar: null, rsvp_status: 'maybe', created_at: '2025-03-16T14:20:00Z' },
  { id: 5, name: 'Olivia Brown', avatar: null, rsvp_status: 'attending', created_at: '2025-03-17T13:10:00Z' },
];

const mockComments = [
  { id: 1, user: { id: 1, name: 'Emma Johnson', avatar: null }, content: 'Looking forward to this event! Will there be parking available nearby?', created_at: '2025-03-18T09:30:00Z', likes_count: 3 },
  { id: 2, user: { id: 3, name: 'Sophia Martinez', avatar: null }, content: 'I attended last year and it was amazing. Highly recommend!', created_at: '2025-03-18T14:20:00Z', likes_count: 5 },
  { id: 3, user: { id: 6, name: 'Liam Anderson', avatar: null }, content: 'Can I bring a guest with me?', created_at: '2025-03-19T11:15:00Z', likes_count: 1 },
];

const mockTags = [
  { id: 1, name: 'Charity' },
  { id: 2, name: 'Food' },
  { id: 3, name: 'Community' },
  { id: 4, name: 'Fundraiser' },
];

// Mock creator for the event
const mockCreator = {
  id: 1,
  name: 'John Doe',
  avatar: null,
  email: 'john.doe@example.com',
  role: 'Event Organizer',
  created_at: '2024-02-01T10:00:00Z'
};

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

interface Country {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  image: string | null;
  address: string;
  num_tickets: number;
  user_id: number;
  country_id: number;
  city_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
  country?: Country;
  city?: City;
  comments_count?: number;
  likes_count?: number;
  attendings_count?: number;
  tags_count?: number;
}

interface Props {
  event: Event;
}

const breadcrumbs = (eventTitle: string): BreadcrumbItem[] => [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Events',
    href: '/events',
  },
  {
    title: eventTitle,
    href: '#',
  },
];

export default function Show({ event }: Props) {
  // If the event doesn't have some data, use mock data
  const user = event.user || mockCreator;
  
  // Calculate ticket statistics
  const ticketsTaken = Math.min(event.attendings_count || mockAttendees.length, event.num_tickets);
  const ticketsPercentage = Math.round((ticketsTaken / event.num_tickets) * 100);
  const ticketsRemaining = event.num_tickets - ticketsTaken;

  return (
    <AppLayout breadcrumbs={breadcrumbs(event.title)}>
      <Head title={`${event.title} - Event Details`} />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Header with event title and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={route('events.index')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold">{event.title}</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Link href={route('events.edit', event.id)}>
              <Button>
                RSVP
              </Button>
            </Link>
          </div>
        </div>

        {/* Event image and basic info */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
              <img 
                src={event.image ? `/storage/${event.image}` : "/api/placeholder/800/400"} 
                alt={event.title} 
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">About This Event</h3>
                <p>{event.description}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Date & Time</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-sm text-muted-foreground">{event.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.city?.name || 'City'}, {event.country?.name || 'Country'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Ticket className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Tickets</h4>
                    <div className="w-full mt-2">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{ticketsTaken} taken</span>
                        <span>{ticketsRemaining} remaining</span>
                      </div>
                      <Progress value={ticketsPercentage} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar ? `/storage/${user.avatar}` : undefined} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Event Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockTags.map(tag => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs for Attendees, Comments, etc. */}
        <Tabs defaultValue="attendees" className="w-full mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="attendees">
              <Users className="h-4 w-4 mr-2" />
              Attendees ({mockAttendees.length})
            </TabsTrigger>
            <TabsTrigger value="comments">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments ({mockComments.length})
            </TabsTrigger>
            <TabsTrigger value="details">
              <Calendar className="h-4 w-4 mr-2" />
              Event Schedule
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendees" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Who's Attending</CardTitle>
                <CardDescription>
                  {ticketsTaken} people are attending this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Attendee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAttendees.map((attendee) => (
                        <TableRow key={attendee.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={attendee.avatar ? `/storage/${attendee.avatar}` : undefined} alt={attendee.name} />
                                <AvatarFallback>{attendee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>{attendee.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={attendee.rsvp_status === 'attending' ? 'default' : 'outline'}>
                              {attendee.rsvp_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(attendee.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comments" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Comments & Questions</CardTitle>
                <CardDescription>
                  Join the conversation about this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar ? `/storage/${comment.user.avatar}` : undefined} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{comment.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {comment.likes_count}
                        </Button>
                      </div>
                      <p className="text-sm mt-2">{comment.content}</p>
                    </div>
                  ))}

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Add a comment</h4>
                    <textarea 
                      className="w-full p-3 border rounded-md" 
                      rows={3} 
                      placeholder="Write your comment or question here..."
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <Button>
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Event Schedule</CardTitle>
                <CardDescription>
                  Detailed schedule for {event.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-8 border-l">
                  {/* Schedule items with timeline */}
                  <div className="relative mb-8">
                    <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="mb-1 text-lg font-semibold">Event Registration</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(new Date(event.start_date).getTime() + 30*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <p className="text-sm">Check in and receive your event materials and name badge.</p>
                  </div>
                  
                  <div className="relative mb-8">
                    <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="mb-1 text-lg font-semibold">Opening Remarks</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(new Date(event.start_date).getTime() + 30*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(new Date(event.start_date).getTime() + 60*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <p className="text-sm">Welcome address and introduction to the event's purpose and goals.</p>
                  </div>
                  
                  <div className="relative mb-8">
                    <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="mb-1 text-lg font-semibold">Main Event</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(new Date(event.start_date).getTime() + 60*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(new Date(event.start_date).getTime() + 180*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <p className="text-sm">Distribution of food and fundraising activities for community support.</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="mb-1 text-lg font-semibold">Closing & Networking</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(new Date(event.start_date).getTime() + 180*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <p className="text-sm">Thank you messages, final networking opportunity, and collection of feedback.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}