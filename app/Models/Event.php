<?php

namespace App\Models;

use Illuminate\Support\Str;
use App\Enums\EventTypeEnum;
use App\Enums\EventStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use SoftDeletes , HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'slug',
        'description',
        'start_time',
        'end_time',
        'location',
        'status',
        'event_type',
        'ticket_price',
        'ticket_limit',
        'ticket_limit_per_user',
        'cancellation_reason',
        'created_by'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'ticket_price' => 'float',
        'ticket_limit' => 'integer',
        'ticket_limit_per_user' => 'integer',
        'status' => EventStatusEnum::class,
        'event_type' => EventTypeEnum::class
    ];

    protected static function booted()
    {
        static::creating(function ($event){
            $event->created_by = auth()->user()->id;

            if (!$event->slug) {
                $event->slug = Str::slug($event->name);
            }
        });

        static::updating(function($event){
            if ($event->isDirty('name')) {
                $event->slug = Str::slug($event->name);
            }
        });
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function eventGalleries(): HasMany
    {
        return $this->hasMany(EventGallery::class);
    }

    public function eventBookings(): HasMany
    {
        return $this->hasMany(EventBooking::class);
    }
}
