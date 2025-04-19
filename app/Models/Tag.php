<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'slug',
    ];

    public function events()
    {
        return $this->belongsToMany(Event::class);
    }
}
