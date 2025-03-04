<?php

namespace Database\Factories;

use App\Enums\EventStatusEnum;
use App\Models\Event;
use App\Models\Tenant;
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
            'tenant_id' => Tenant::factory(),
            'name' => fake()->sentence(3),
            'slug' => fake()->slug(),
            'description' => fake()->paragraphs(3, true),
            'short_description' => fake()->sentence(),
            'start_time' => fake()->dateTimeBetween('now', '+3 months'),
            'end_time' => fake()->dateTimeBetween('+3 months', '+6 months'),
            'location' => fake()->address(),
            'image_url' => fake()->imageUrl(640, 480, 'event'),
            'status' => fake()->randomElement(EventStatusEnum::cases()),
            'is_featured' => fake()->boolean(20),
            'ticket_limit' => fake()->numberBetween(50, 500),
            'ticket_limit_per_user' => fake()->numberBetween(1, 5),
            'cancellation_reason' => fake()->optional()->sentence(),
            'created_by' => User::factory(),
        ];
    }

    public function featured(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
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
