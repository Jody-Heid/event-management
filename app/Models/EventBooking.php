<?php

namespace App\Models;

use App\Enums\EventBookingStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EventBooking extends Model
{
    use SoftDeletes , HasFactory;

    protected $fillable = [
        'event_id',
        'user_id',
        'ticket_quantity',
        'booking_status',
    ];

    protected $cast = [
        'booking_status' => EventBookingStatus::class,
        'ticket_quantity' => 'integer'
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
