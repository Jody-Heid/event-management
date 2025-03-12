<?php

namespace App\Models;

use App\Enums\EventAttendeeStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventAttendee extends Model
{
    use SoftDeletes , HasFactory;

    protected $fillable = [
        'event_id',
        'user_id',
        'attendance_status',
        'check_in_time',
    ];

    protected $casts = [
        'attendance_status' => EventAttendeeStatus::class,
        'check_in_time' => 'datetime'
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
