<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use SoftDeletes , HasFactory;
    protected $fillable = [
        'name',
        'email',
        'description',
        'logo_path',
        'is_active',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($tenant) {
            $tenant->users()->delete();
        });
    }
}
