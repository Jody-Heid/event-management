<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Event;
use App\Models\Tenant;
use App\Enums\EventTypeEnum;
use App\Enums\EventStatusEnum;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EventControllerTest extends TestCase
{
    use RefreshDatabase;

    protected Tenant $tenant;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::factory()->create();
        $this->user = User::factory()->create(['tenant_id' => $this->tenant->id]);
        $this->actingAs($this->user);
    }

     /** @test */
     public function it_displays_events_in_the_index_view()
     {
        Event::factory()->count(3)->create();

        $response = $this->get(route('events.index'));

        $response->assertOk();

        $this->assertEquals(
            'events/index',
            $response->original->getData()['page']['component']
        );
        
        $this->assertArrayHasKey(
            'events',
            $response->original->getData()['page']['props']
        );
        
        $this->assertCount(
            3,
            $response->original->getData()['page']['props']['events']
        );
     }

     /** @test */
     public function test_create_method_returns_event_types_and_statuses()
    {
        $response = $this->get('/events/create');
        
        $response->assertStatus(200);

        $this->assertEquals(
            'events/create',
            $response->original->getData()['page']['component']
        );
        
        $props = $response->original->getData()['page']['props'];
        
        $this->assertArrayHasKey('eventStatues', $props);
    
        $this->assertArrayHasKey('eventTypes', $props);
        
        $this->assertEquals(
            count(EventStatusEnum::cases()),
            count($props['eventStatues'])
        );
        
        $this->assertEquals(
            count(EventTypeEnum::cases()),
            count($props['eventTypes'])
        );
        
        if (count(EventStatusEnum::cases()) > 0) {
            $this->assertEquals(
                EventStatusEnum::cases()[0]->name,
                $props['eventStatues'][0]->name
            );
        }
        
        if (count(EventTypeEnum::cases()) > 0) {
            $this->assertEquals(
                EventTypeEnum::cases()[0]->name,
                $props['eventTypes'][0]->name
            );
        }
    }

    /** @test */
    public function it_creates_an_event_for_authenticated_user()
    {
        $eventData = Event::factory()->make([
            'tenant_id' => $this->tenant->id
        ])->toArray();

        $response = $this->post(route('events.store'), $eventData);

        $response->assertRedirect(route('events.index'));

        $response->assertSessionHas('success', "{$eventData['name']} - Event created successfully.");

        $this->assertDatabaseHas('events', [
            'name' => $eventData['name'],
            'tenant_id' => $this->tenant->id
        ]);
    }

    /** @test */
    public function it_uses_authenticated_users_tenant_id_when_not_provided()
    {

        $eventData = Event::factory()->make([
            'tenant_id' => null
        ])->toArray();

        $response = $this->post(route('events.store'), $eventData);

        $response->assertRedirect(route('events.index'));

        $this->assertDatabaseHas('events', [
            'name' => $eventData['name'],
            'tenant_id' => $this->tenant->id
        ]);
    }

    /** @test */
    public function it_fails_validation_for_invalid_event_data()
    {
        $invalidEventData = [
            'name' => '',
        ];

        $response = $this->post(route('events.store'), $invalidEventData);

        $response->assertSessionHasErrors();

        $this->assertDatabaseCount('events', 0);
    }

    /** @test */
    public function it_requires_authentication_to_create_event()
    {
        auth()->logout(); 
        
        $eventData = Event::factory()->make()->toArray();

        $response = $this->post(route('events.store'), $eventData);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseCount('events', 0);
    }

}
