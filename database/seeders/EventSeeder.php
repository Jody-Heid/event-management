<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $tenant = Tenant::firstOrCreate(['email' =>  env('MAIN_COMPANY_EMAIL')],
        [
            'name' => env('MAIN_COMPANY_NAME'),
            'email' => env('MAIN_COMPANY_EMAIL'),
            'description' => env('MAIN_COMPANY_DESCRIPTION'),
            'logo_path' => env('MAIN_COMPANY_LOGO_PATH')
        ]);

        $user = User::firstOrCreate(['email' =>  env('SUPERADMIN_EMAIL')], [
            'name' => env('SUPERADMIN_NAME'),
            'email' => env('SUPERADMIN_EMAIL'),
            'password' => Hash::make(env('SUPERADMIN_PASSWORD')),
            'tenant_id' => $tenant->id,
        ]);

        Event::factory()
            ->count(5)
            ->create([
                'tenant_id' => $tenant->id,
                'created_by' => $user->id,
            ]);

        Event::factory()
            ->featured()
            ->count(5)
            ->create([
                'tenant_id' => $tenant->id,
                'created_by' => $user->id,
            ]);
    }
}
