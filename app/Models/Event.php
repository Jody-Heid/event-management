<?php

namespace App\Models;

use App\Enums\EventStatusEnum;
use App\Enums\EventTypesEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'ticket_price' => 'decimal',
        'ticket_limit' => 'integer',
        'ticket_limit_per_user' => 'integer',
        'status' => EventStatusEnum::class,
        'event_type' => EventTypesEnum::class
    ];

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
