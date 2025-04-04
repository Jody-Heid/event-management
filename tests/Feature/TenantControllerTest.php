<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TenantControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_tenants()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create(['tenant_id' => $tenant->id]);

        $this->actingAs($user);

        Tenant::factory()->count(5)->create();

        $response = $this->get(route('tenants.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('tenants/index')
            ->has('tenants.data', 6)
        );
    }

    public function test_store_tenant()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $this->actingAs($user);

        Storage::fake('public');

        $logo = UploadedFile::fake()->image('logo.jpg');

        $response = $this->post(route('tenants.store'), [
            'tenantName' => 'Acme Corp',
            'userEmail' => 'admin@acme.com',
            'tenantDescription' => 'A great company',
            'tenantLogoPath' => $logo,
            'is_active' => true,
            'userFullName' => 'John Doe',
        ]);

        $response->assertStatus(302);
        $response->assertRedirect(route('tenants.index'));

        $this->assertDatabaseHas('tenants', [
            'name' => 'Acme Corp',
            'email' => 'admin@acme.com',
            'description' => 'A great company',
            'is_active' => true,
        ]);

        $tenant = Tenant::where('email', 'admin@acme.com')->first();

        Storage::disk('public')->assertExists('logos/'.$logo->hashName());

        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'admin@acme.com',
            'tenant_id' => $tenant->id,
        ]);

    }

    public function test_update_tenant()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create(['tenant_id' => $tenant->id]);

        $this->actingAs($user);

        Storage::fake('public');

        $logo = UploadedFile::fake()->image('new-logo.jpg');

        $response = $this->put(route('tenants.update', $tenant->id), [
            'tenantName' => 'Updated Name',
            'tenantEmail' => 'updated@example.com',
            'tenantDescription' => 'Updated description',
            'tenantLogoPath' => $logo,
            'is_active' => false,
        ]);

        $response->assertStatus(302);
        $response->assertRedirect(route('tenants.index'));

        $this->assertDatabaseHas('tenants', [
            'id' => $tenant->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'description' => 'Updated description',
            'is_active' => false,
        ]);

        Storage::disk('public')->assertExists('logos/'.$logo->hashName());
    }

    public function test_destroy_tenant()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create(['tenant_id' => $tenant->id]);

        $this->actingAs($user);

        $response = $this->delete(route('tenants.destroy', $tenant->id));

        $response->assertStatus(302);
        $response->assertRedirect(route('tenants.index'));

        $this->assertSoftDeleted('tenants', [
            'id' => $tenant->id,
        ]);

        $this->assertSoftDeleted('users', [
            'id' => $user->id,
        ]);
    }
}
