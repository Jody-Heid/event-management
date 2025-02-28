<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tenant;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

    
        Tenant::create([
            'name' => env('MAIN_COMPANY_NAME'),
            'email' => env('MAIN_COMPANY_EMAIL'),
            'description' => env('MAIN_COMPANY_DESCRIPTION'),
            'logo_path' => env('MAIN_COMPANY_LOGO_PATH')
        ]);
    }
}
