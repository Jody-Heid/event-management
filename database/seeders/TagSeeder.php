<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'Music', 'Sports', 'Conference', 'Festival', 'Workshop', 
            'Exhibition', 'Networking', 'Comedy', 'Theater', 'Dance',
            'Food', 'Art', 'Technology', 'Business', 'Education',
            'Health', 'Fitness', 'Outdoor', 'Indoor', 'Family',
            'Children', 'Adult', 'Free', 'Paid', 'Virtual'
        ];
        
        foreach ($tags as $tagName) {
            Tag::create([
                'name' => $tagName,
                'slug' => Str::slug($tagName)
            ]);
        }
    }
}
