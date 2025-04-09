<?php

namespace App\Http\Controllers;

use App\Models\EventGallery;
use Inertia\Inertia;
use App\Models\Event;

class HomePageController extends Controller
{
    public function __invoke()
    {
        $events = Event::all();

        return Inertia::render('homepage' , ['events' => ['data' => $events]]);
    }
}
