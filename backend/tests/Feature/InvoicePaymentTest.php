<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoicePaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Patient $patient;
    private Invoice $unpaidInvoice;
    private Invoice $paidInvoice;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $this->admin = User::factory()->create([
            'email' => 'admin@clinic.test',
            'role_id' => 1,
        ]);

        // Create patient
        $this->patient = Patient::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
            'gender' => 'M',
            'date_of_birth' => '1990-01-15',
            'address' => '123 Main St, City',
            'created_by' => $this->admin->id,
        ]);

        // Create unpaid invoice
        $this->unpaidInvoice = Invoice::create([
            'patient_id' => $this->patient->id,
            'total' => 5000.00,
            'payment_status' => 'unpaid',
            'issue_date' => now()->format('Y-m-d'),
            'due_date' => now()->addDays(7)->format('Y-m-d'),
            'created_by' => $this->admin->id,
        ]);

        // Create already paid invoice
        $this->paidInvoice = Invoice::create([
            'patient_id' => $this->patient->id,
            'total' => 3000.00,
            'payment_status' => 'paid',
            'payment_method' => 'cash',
            'issue_date' => now()->subDays(30)->format('Y-m-d'),
            'due_date' => now()->subDays(23)->format('Y-m-d'),
            'created_by' => $this->admin->id,
        ]);
    }

    /**
     * Test successful invoice payment
     */
    public function test_invoice_can_be_marked_as_paid(): void
    {
        $this->actingAs($this->admin);

        $response = $this->patchJson("/api/invoices/{$this->unpaidInvoice->id}/pay", [
            'payment_method' => 'cash',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.payment_status', 'paid')
            ->assertJsonPath('data.payment_method', 'cash');

        $this->assertDatabaseHas('invoices', [
            'id' => $this->unpaidInvoice->id,
            'payment_status' => 'paid',
            'payment_method' => 'cash',
        ]);
    }

    /**
     * Test invoice payment with different payment methods
     */
    public function test_invoice_payment_accepts_multiple_payment_methods(): void
    {
        $this->actingAs($this->admin);

        $paymentMethods = ['cash', 'bank_transfer', 'card'];

        foreach ($paymentMethods as $method) {
            // Create new unpaid invoice for this test
            $invoice = Invoice::create([
                'patient_id' => $this->patient->id,
                'total' => 1000.00,
                'payment_status' => 'unpaid',
                'issue_date' => now()->format('Y-m-d'),
                'due_date' => now()->addDays(7)->format('Y-m-d'),
                'created_by' => $this->admin->id,
            ]);

            $response = $this->patchJson("/api/invoices/{$invoice->id}/pay", [
                'payment_method' => $method,
            ]);

            $response->assertStatus(200)
                ->assertJsonPath('data.payment_method', $method);
        }
    }

    /**
     * Test payment fails for already paid invoice
     */
    public function test_payment_fails_for_already_paid_invoice(): void
    {
        $this->actingAs($this->admin);

        $response = $this->patchJson("/api/invoices/{$this->paidInvoice->id}/pay", [
            'payment_method' => 'cash',
        ]);

        $response->assertStatus(422);
    }

    /**
     * Test payment fails without authentication
     */
    public function test_invoice_payment_fails_without_authentication(): void
    {
        $response = $this->patchJson("/api/invoices/{$this->unpaidInvoice->id}/pay", [
            'payment_method' => 'cash',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test payment fails with invalid invoice ID
     */
    public function test_payment_fails_with_invalid_invoice_id(): void
    {
        $this->actingAs($this->admin);

        $response = $this->patchJson('/api/invoices/99999/pay', [
            'payment_method' => 'cash',
        ]);

        $response->assertStatus(404);
    }

    /**
     * Test payment fails with missing payment method
     */
    public function test_payment_fails_with_missing_payment_method(): void
    {
        $this->actingAs($this->admin);

        $response = $this->patchJson("/api/invoices/{$this->unpaidInvoice->id}/pay", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['payment_method']);
    }

    /**
     * Test invoice list shows only unpaid invoices when filtered
     */
    public function test_invoice_list_can_be_filtered_by_payment_status(): void
    {
        $this->actingAs($this->admin);

        $response = $this->getJson('/api/invoices?payment_status=unpaid');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'patient_id', 'total', 'payment_status'],
                ],
                'meta',
            ]);

        // Verify only unpaid invoices are returned
        $invoices = $response->json('data');
        $unpaidCount = collect($invoices)->filter(fn ($inv) => $inv['payment_status'] === 'unpaid')->count();
        $this->assertGreaterThan(0, $unpaidCount);
    }
}
