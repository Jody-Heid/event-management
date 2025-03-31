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
        'title',
        'slug',
        'description',
        'start_date',
        'end_date',
        'image',
        'address',
        'num_tickets',
        'user_id',
        'country_id',
        'city_id'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'num_tickets' => 'integer'
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(related: Comment::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany( Comment::class);
    }

    public function attendings(): HasMany
    {
        return $this->hasMany( Attending::class);
    }

    public function tags(): HasMany
    {
        return $this->hasMany( Tag::class);
    }
}
