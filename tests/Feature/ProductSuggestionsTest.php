<?php

use App\Enums\ProductStatus;
use App\Jobs\SyncProductEmbedding;
use App\Models\Product;
use App\Services\ProductRecommendationService;
use Laravel\Ai\Embeddings;

it('returns product suggestions as json with mocked recommender', function () {
    $mock = Mockery::mock(ProductRecommendationService::class);
    $mock->shouldReceive('forProductPage')
        ->once()
        ->andReturn([
            [
                'id' => 999,
                'title' => 'Mocked Product',
                'slug' => 'mocked-product',
                'image_url' => null,
                'reason' => 'Similar items',
                'score' => 12.5,
            ],
        ]);

    app()->instance(ProductRecommendationService::class, $mock);

    $product = Product::factory()->create([
        'status' => ProductStatus::ACTIVE,
    ]);

    $this->getJson("/details/{$product->id}/suggestions")
        ->assertOk()
        ->assertJsonPath('suggestions.0.id', 999)
        ->assertJsonPath('suggestions.0.title', 'Mocked Product');
});

it('returns empty suggestions for non-active products without calling recommender', function () {
    $mock = Mockery::mock(ProductRecommendationService::class);
    $mock->shouldNotReceive('forProductPage');

    app()->instance(ProductRecommendationService::class, $mock);

    $product = Product::factory()->create([
        'status' => ProductStatus::DRAFT,
    ]);

    $this->getJson("/details/{$product->id}/suggestions")
        ->assertOk()
        ->assertJson(['suggestions' => []]);
});

it('skips sync product embedding job when vector column is unavailable', function () {
    Embeddings::fake([[Embeddings::fakeEmbedding(1536)]]);

    $product = Product::factory()->create();

    (new SyncProductEmbedding($product->id))->handle();

    Embeddings::assertNothingGenerated();
});
