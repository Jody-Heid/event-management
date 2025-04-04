<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventStoreRequest;
use App\Http\Requests\EventUpdateRequest;
use App\Models\City;
use App\Models\Country;
use App\Models\Event;
use App\Traits\ImageUploadTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EventController extends Controller
{
    use ImageUploadTrait;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::all();

        return Inertia::render('events/index', ['events' => ['data' => $events]]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $countries = Country::all();
        $cities = City::all();

        return Inertia::render('events/create', [
            'countries' => $countries,
            'cities' => $cities,
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
                    800,
                    null,
                    true,
                    85
                );
            }

            Event::create([
                ...$request->validated(),
                'user_id' => auth()->user()->id,
                'image' => $imagePath,
                'slug' => Str::slug($request->validated('title')),
            ]);
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

        return Inertia::render('events/edit', [
            'event' => $event,
            'countries' => $countries,
            'cities' => $cities,
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
                    true,
                    85
                );

            }

            $event->update($data);
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
