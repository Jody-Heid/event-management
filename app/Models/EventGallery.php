<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventGallery extends Model
{
    use SoftDeletes,HasFactory;

    protected $fillable = [
        'tenant_id', 
        'event_image'
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
