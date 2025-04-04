<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventGalleryStoreRequest;
use App\Http\Requests\EventGalleryUpdateRequest;
use App\Models\EventGallery;
use App\Traits\ImageUploadTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EventGalleryController extends Controller
{
    use ImageUploadTrait;

    protected $imagePath = 'gallery';

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $galleries = auth()->user()->eventGalleries;

        return Inertia::render('event-gallery/index', ['galleries' => ['data' => $galleries]]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('event-gallery/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EventGalleryStoreRequest $request)
    {

        try {
            $imagePath = null;

            if ($request->hasFile('image')) {
                $imagePath = $this->saveImage(
                    $request->file('image'),
                    'gallery',
                    800,
                    null,
                    true,
                    85
                );

                if (! $imagePath) {
                    return redirect()->back()->with('error', 'Failed to upload image. Please try again.');
                }
            }

            EventGallery::create([
                'caption' => $request->validated('caption'),
                'image' => $imagePath ?? $this->imagePath,
                'user_id' => auth()->user()->id,
            ]
            );

            return redirect()->route('event-gallery.index')->with('success', 'Image uploaded successfully.');
        } catch (\Exception $e) {
            Log::error('Error storing event gallery: '.$e->getMessage());

            return redirect()->back()->with('error', 'An error occurred while uploading the image. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EventGallery $eventGallery)
    {
        return Inertia::render('event-gallery/edit', ['gallery' => ['data' => $eventGallery]]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EventGalleryUpdateRequest $request, EventGallery $eventGallery)
    {
        try {
            DB::transaction(function () use ($request, $eventGallery) {
                $validated = $request->validated();

                $data = [
                    'caption' => $validated['caption'],
                ];

                if ($request->hasFile('new_image')) {
                    $newImagePath = $this->replaceImage(
                        $request->file('new_image'),
                        $eventGallery->image,
                        'gallery',
                        null,
                        true,
                        85
                    );

                    if (! $newImagePath) {
                        throw new \Exception('Failed to replace image');
                    }

                    $data['image'] = $newImagePath;
                }

                $eventGallery->update($data);
            });

            return redirect()->route('event-gallery.index')->with('success', "{$eventGallery->name} - Event Gallery updated successfully.");
        } catch (\Exception $e) {
            Log::error('Error updating event gallery: '.$e->getMessage());

            return redirect()->back()->with('error', 'An error occurred while updating the gallery. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EventGallery $eventGallery)
    {
        try {
            $this->deleteImage($eventGallery->image);
            $eventGallery->delete();

            return redirect()->route('event-gallery.index')->with('success', "{$eventGallery->name} - Event deleted successfully.");
        } catch (\Exception $e) {
            Log::error('Error deleting event gallery: '.$e->getMessage());

            return redirect()->back()->with('error', 'An error occurred while deleting the gallery. Please try again.');
        }
    }
}
