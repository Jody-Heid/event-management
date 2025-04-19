<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\City;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\Country;
use Illuminate\Support\Str;
use App\Traits\ImageUploadTrait;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\EventStoreRequest;
use App\Http\Requests\EventUpdateRequest;

class EventController extends Controller
{
    use ImageUploadTrait;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::with('tags')->get();

        return Inertia::render('events/index', ['events' => ['data' => $events]]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $countries = Country::all();
        $cities = City::all();
        $tags = Tag::all();

        return Inertia::render('events/create', [
            'countries' => $countries,
            'cities' => $cities,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EventStoreRequest $request)
    {
        DB::transaction(function () use ($request) {
            if ($request->hasFile('image')) {
                $imagePath = $this->saveImage(
                    $request->file('image'),
                    'events',
                    null,
                    null,
                    false,
                    100
                );
            }

            $event = Event::create([
                ...$request->validated(),
                'user_id' => auth()->user()->id,
                'image' => $imagePath,
                'slug' => Str::slug($request->validated('title')),
            ]);

            $tagIds = [];
            foreach($request->validated('tags') as $tagName)
            {
                $tag = Tag::firstOrCreate(['name' => $tagName], [
                    'name' => $tagName,
                    'slug' => Str::slug($tagName)
                ]);

                $tagIds[] = $tag->id;
            }

            $event->tags()->attach($tagIds);
            
        });

        return redirect()->route('events.index')->with('success', 'Event created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        return Inertia::render('events/show', ['event' => $event]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        $countries = Country::all();
        $cities = City::all();
        $tags = Tag::all();

        return Inertia::render('events/edit', [
            'event' => $event->load('tags'),
            'countries' => $countries,
            'cities' => $cities,
            'tags' => $tags
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EventUpdateRequest $request, Event $event)
    {
        DB::transaction(function () use ($request, $event) {
            $validated = $request->validated();

            $data = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'address' => $validated['address'],
                'num_tickets' => $validated['num_tickets'],
                'country_id' => $validated['country_id'],
                'city_id' => $validated['city_id'],
                'slug' => Str::slug($validated['title']),
            ];

            if ($request->hasFile('new_image')) {
                $data['image'] = $this->replaceImage(
                    $request->file('new_image'),
                    $event->image,
                    'events',
                    null,
                    null,
                    false
                );
            }

            $event->update($data);
            
            if (isset($validated['tags'])) {
                $tagIds = [];
                foreach($validated['tags'] as $tagName) {
                    $tag = Tag::firstOrCreate(['name' => $tagName], [
                        'name' => $tagName,
                        'slug' => Str::slug($tagName)
                    ]);
                    
                    $tagIds[] = $tag->id;
                }
                
                $event->tags()->sync($tagIds);
            }
        });

        return redirect()->route('events.index')->with('success', "{$event->name} - Event updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $this->deleteImage($event->image);

        $event->delete();

        return redirect()->route('events.index')->with('success', "{$event->name} - Event deleted successfully.");
    }
}
