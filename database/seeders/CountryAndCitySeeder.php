<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\City;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class CountryAndCitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $jsonData = Storage::disk('private')->get('country_and_cities.json');
        
        $countriesData = json_decode($jsonData, true);
        
        if (!$countriesData) {
            $this->command->error('Failed to parse JSON file or file is empty.');
            return;
        }
        
        foreach ($countriesData as $countryName => $cities) {

            $country = Country::firstOrCreate(['name' => $countryName]);
            
            $this->command->info("Created/found country: {$countryName}");
            
            $cityCount = 0;
            foreach ($cities as $cityName) {
                City::firstOrCreate([
                    'name' => $cityName,
                    'country_id' => $country->id
                ]);
                $cityCount++;
            }
            
            $this->command->info("Added {$cityCount} cities to {$countryName}");
        }
        
        $this->command->info('Country and city seeding completed successfully!');
    }
}