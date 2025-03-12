<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventUpdateRequest;
use Inertia\Inertia;
use App\Models\Event;
use Illuminate\Support\Str;
use App\Enums\EventTypeEnum;
use Illuminate\Http\Request;
use App\Enums\EventStatusEnum;
use App\Http\Requests\EventStoreRequest;

class EventController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::all();
    
        return Inertia::render('events/index' , ['events' => $events]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('events/create' , [
            'eventStatues' => EventStatusEnum::cases(),
            'eventTypes' => EventTypeEnum::cases()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EventStoreRequest $request)
    {
        $event = Event::create([
            ...$request->validated() , 
            'tenant_id' => $request->validated('tenant_id') ??  auth()->user()->tenant_id
        ]);

        return redirect()->route('events.index')->with('success', "{$event->name} - Event created successfully.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        return Inertia::render('events/show' , ['event' => $event]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        return Inertia::render('events/edit' , [
            'event' => $event,
            'eventStatues' => EventStatusEnum::cases(),
            'eventTypes' => EventTypeEnum::cases()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EventUpdateRequest $request, Event $event)
    {
        $event->update([
            ...$request->validated() , 
            'tenant_id' => $request->validated('tenant_id') ??  auth()->user()->tenant_id
        ]);

        return redirect()->route('events.index')->with('success', "{$event->name} - Event updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->route('events.index')->with('success', "{$event->name} - Event deleted successfully.");
    }
}
