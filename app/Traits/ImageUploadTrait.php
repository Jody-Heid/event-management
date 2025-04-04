<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

/**
 * Trait ImageUploadTrait
 *
 * Provides image upload functionality for controllers
 */
trait ImageUploadTrait
{
    /**
     * Save an uploaded image to storage with optional resizing and optimization
     *
     * @param  UploadedFile  $image  The uploaded image file
     * @param  string  $path  The storage path for the image
     * @param  int|null  $width  Target width for resizing (maintains aspect ratio if only width is provided)
     * @param  int|null  $height  Target height for resizing (maintains aspect ratio if only height is provided)
     * @param  bool  $optimize  Whether to optimize the image
     * @param  int  $quality  JPEG quality setting (0-100)
     * @return string|null Path to the saved image or null on failure
     */
    public function saveImage(
        UploadedFile $image,
        string $path = 'uploads',
        ?int $width = null,
        ?int $height = null,
        bool $optimize = true,
        int $quality = 80
    ): ?string {
        try {
            $filename = Str::uuid().'.'.$image->getClientOriginalExtension();
            $fullPath = $path.'/'.$filename;

            if ($optimize || $width || $height) {
                $manager = new ImageManager(new Driver);
                $img = $manager->read($image);

                if ($width || $height) {
                    $img->resize($width, $height);
                }

                $extension = strtolower($image->getClientOriginalExtension());

                info('Extension', [$extension]);

                if (! in_array($extension, ['png', 'gif'])) {
                    $img = $img->toJpeg($quality);
                    $filename = Str::beforeLast($filename, '.').'.jpg';
                    $fullPath = $path.'/'.$filename;
                } else {
                    info('Image Else');
                    if ($extension == 'png') {
                        $img = $img->toPng($quality);
                    } elseif ($extension == 'gif') {
                        $img = $img->toGif();
                    }
                }
                Storage::disk('public')->put($fullPath, $img->toString());
            } else {
                Storage::disk('public')->putFileAs($path, $image, $filename);
            }

            return $fullPath;
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    /**
     * Delete an image from storage
     *
     * @param  string|null  $path  Path to the image to delete
     * @return bool True if deletion was successful, false otherwise
     */
    public function deleteImage(?string $path): bool
    {
        if (! $path) {
            return false;
        }

        try {
            if (Storage::disk('public')->exists($path)) {
                return Storage::disk('public')->delete($path);
            }

            return false;
        } catch (\Throwable $e) {
            report($e);

            return false;
        }
    }

    /**
     * Replace an existing image with a new one
     *
     * @param  UploadedFile  $newImage  The new image file
     * @param  string|null  $oldImagePath  Path to the old image to replace
     * @param  string  $path  Storage path for the new image
     * @param  int|null  $width  Target width for resizing
     * @param  int|null  $height  Target height for resizing
     * @param  bool  $optimize  Whether to optimize the image
     * @param  int  $quality  JPEG quality setting (0-100)
     * @return string|null Path to the new image or null on failure
     */
    public function replaceImage(
        UploadedFile $newImage,
        ?string $oldImagePath,
        string $path = 'uploads',
        ?int $width = null,
        ?int $height = null,
        bool $optimize = true,
        int $quality = 80
    ): ?string {
        $this->deleteImage($oldImagePath);

        return $this->saveImage($newImage, $path, $width, $height, $optimize, $quality);
    }

    /**
     * Get the public URL for an image
     *
     * @param  string|null  $path  Path to the image
     * @return string|null Full URL to the image or null if path is empty
     */
    public function getImageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return Storage::disk('public')->url($path);
    }

    /**
     * Save multiple images at once
     *
     * @param  array  $images  Array of UploadedFile objects
     * @param  string  $path  Storage path for the images
     * @param  int|null  $width  Target width for resizing
     * @param  int|null  $height  Target height for resizing
     * @param  bool  $optimize  Whether to optimize the images
     * @param  int  $quality  JPEG quality setting (0-100)
     * @return array Array of paths to the saved images
     */
    public function saveMultipleImages(
        array $images,
        string $path = 'uploads',
        ?int $width = null,
        ?int $height = null,
        bool $optimize = true,
        int $quality = 80
    ): array {
        $savedPaths = [];

        foreach ($images as $image) {
            if ($image instanceof UploadedFile) {
                $savedPath = $this->saveImage($image, $path, $width, $height, $optimize, $quality);
                if ($savedPath) {
                    $savedPaths[] = $savedPath;
                }
            }
        }

        return $savedPaths;
    }
}
