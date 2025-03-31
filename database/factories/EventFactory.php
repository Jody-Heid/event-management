<?php

namespace Database\Factories;

use App\Enums\EventStatusEnum;
use App\Enums\EventTypeEnum;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'slug' => fake()->slug(),
            'description' => fake()->sentence(),
            'start_time' => fake()->dateTimeBetween('now', '+3 months'),
            'end_time' => fake()->dateTimeBetween('+3 months', '+6 months'),
            'location' => fake()->address(),
            'status' => fake()->randomElement(EventStatusEnum::cases()),
            'event_type' => fake()->randomElement(EventTypeEnum::cases()),
            'ticket_price' => fake()->randomFloat(2, 30, 150),
            'ticket_limit' => fake()->numberBetween(50, 500),
            'ticket_limit_per_user' => fake()->numberBetween(1, 5),
            'cancellation_reason' => fake()->optional()->sentence(),
            'created_by' => User::factory(),
        ];
    }

    public function published(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => EventStatusEnum::PUBLISHED,
        ]);
    }

    public function draft(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => EventStatusEnum::DRAFT,
        ]);
    }
}
