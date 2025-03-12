<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Event;
use App\Enums\EventAttendeeStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EventAttendee>
 */
class EventAttendeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'user_id' => User::factory(),
            'attendance_status' , fake()->randomElement(EventAttendeeStatus::cases()),
            'check_in_time' => fake()->optional()->dateTime()
        ];
    }
}
