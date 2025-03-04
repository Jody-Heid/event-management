<?php

namespace App\Models;

use App\Enums\EventStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
        'short_description',
        'start_time',
        'end_time',
        'location',
        'image_url',
        'status',
        'is_featured',
        'ticket_limit',
        'ticket_limit_per_user',
        'cancellation_reason',
        'created_by'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_featured' => 'boolean',
        'ticket_limit' => 'integer',
        'ticket_limit_per_user' => 'integer',
        'status' => EventStatusEnum::class
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
